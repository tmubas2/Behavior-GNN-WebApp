const { google } = require('googleapis');

const SHEET_SCHEMAS = {
  Participants: [
    'participant_id', 'age', 'age_group', 'scc_status', 'scc_score',
    'digital_literacy_score', 'smartphone_experience', 'notes', 'session_timestamp',
  ],
  Task_Trials: [
    'task_trial_id', 'participant_id', 'task_id', 'task_name', 'task_order',
    'start_time', 'end_time', 'duration_seconds', 'idle_seconds', 'completed', 'success',
    'help_used', 'notes',
  ],
  Interaction_Events: [
    'event_id', 'task_trial_id', 'participant_id', 'task_id', 'event_order',
    'timestamp', 'from_screen_id', 'screen_id', 'screen_type', 'action_type', 'target_id',
    'target_label', 'next_screen_id', 'active_popup_id',
    'click_x', 'click_y', 'click_x_pct', 'click_y_pct', 'viewport_width', 'viewport_height',
    'device_context',
  ],
};

let sheetsClient = null;

function loadCredentials() {
  const raw = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!raw) return null;

  let jsonString = raw.trim();
  const looksLikeJson = jsonString.startsWith('{');
  if (!looksLikeJson) {
    try {
      jsonString = Buffer.from(jsonString, 'base64').toString('utf8');
    } catch (err) {
      throw new Error('GOOGLE_CREDENTIALS_JSON is set but is neither valid JSON nor valid base64');
    }
  }

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error('GOOGLE_CREDENTIALS_JSON could not be parsed as JSON: ' + err.message);
  }
}

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const credentials = loadCredentials();

  const authOptions = { scopes: ['https://www.googleapis.com/auth/spreadsheets'] };
  if (credentials) {
    authOptions.credentials = credentials;
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    authOptions.keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  } else {
    throw new Error(
      'No Google credentials found. Set GOOGLE_CREDENTIALS_JSON (recommended for hosted deployments) ' +
      'or GOOGLE_APPLICATION_CREDENTIALS (a local key file path) in your environment.'
    );
  }

  const auth = new google.auth.GoogleAuth(authOptions);
  const authClient = await auth.getClient();
  sheetsClient = google.sheets({ version: 'v4', auth: authClient });
  return sheetsClient;
}

async function getSheetId(sheets, spreadsheetId, tabName) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find(s => s.properties.title === tabName);
  return sheet ? sheet.properties.sheetId : null;
}

async function getRowCount(sheets, spreadsheetId, tabName) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A:A`,
    });
    return (res.data.values || []).length;
  } catch {
    return 0;
  }
}

async function ensureSheetExists(sheets, spreadsheetId, tabName, headers) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingTabs = meta.data.sheets.map(s => s.properties.title);

  if (!existingTabs.includes(tabName)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: tabName } } }],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
    return;
  }

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A1:ZZ1`,
  });
  const existingHeaders = (headerRes.data.values && headerRes.data.values[0]) || [];
  const missing = headers.filter(h => !existingHeaders.includes(h));
  if (missing.length > 0) {
    const mergedHeaders = [...existingHeaders, ...missing];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [mergedHeaders] },
    });
  }
}


async function insertBlankRow(sheets, spreadsheetId, tabName) {
  const sheetId = await getSheetId(sheets, spreadsheetId, tabName);
  if (sheetId === null) return;

  const rowCount = await getRowCount(sheets, spreadsheetId, tabName);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        insertDimension: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: rowCount,   
            endIndex: rowCount + 1,
          },
          inheritFromBefore: false,
        },
      }],
    },
  });
}

async function appendRows(sheets, spreadsheetId, tabName, rows) {
  if (!rows || rows.length === 0) return;

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A1:ZZ1`,
  });
  const headers = (headerRes.data.values && headerRes.data.values[0]) || SHEET_SCHEMAS[tabName];

  const values = rows.map(row => headers.map(h => {
    const v = row[h];
    if (v === undefined || v === null) return '';
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    return v;
  }));

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabName}!A1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values },
  });
}

async function writeSessionToSheet({ participant, taskTrials, interactionEvents }) {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not set in environment variables');

  const sheets = await getSheetsClient();

  await ensureSheetExists(sheets, spreadsheetId, 'Participants',       SHEET_SCHEMAS.Participants);
  await ensureSheetExists(sheets, spreadsheetId, 'Task_Trials',        SHEET_SCHEMAS.Task_Trials);
  await ensureSheetExists(sheets, spreadsheetId, 'Interaction_Events', SHEET_SCHEMAS.Interaction_Events);

  const sessionTimestamp = new Date().toISOString();

  await appendRows(sheets, spreadsheetId, 'Participants', [
    { ...participant, session_timestamp: sessionTimestamp },
  ]);
  await appendRows(sheets, spreadsheetId, 'Task_Trials', taskTrials);

  const eventRowCount = await getRowCount(sheets, spreadsheetId, 'Interaction_Events');
  if (eventRowCount > 1) {
    await insertBlankRow(sheets, spreadsheetId, 'Interaction_Events');
  }

  await appendRows(sheets, spreadsheetId, 'Interaction_Events', interactionEvents);

  return {
    participantsWritten:      1,
    taskTrialsWritten:        taskTrials.length,
    interactionEventsWritten: interactionEvents.length,
  };
}

module.exports = { writeSessionToSheet, SHEET_SCHEMAS };