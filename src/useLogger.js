import { useState, useRef, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getScreenType } from './data';
import { MOBILE_BREAKPOINT } from './responsive';

let eventCounter = 0;
const genId = (prefix) => `${prefix}_${Date.now()}_${++eventCounter}`;

const IDLE_THRESHOLD_MS = 1000; // gaps longer than this (with no pointer, touch, scroll, or keyboard activity) count as idle time

export function useLogger(participant) {
  const [taskTrials, setTaskTrials] = useState([]);
  const [interactionEvents, setInteractionEvents] = useState([]);
  const currentTrialRef = useRef(null);
  const taskStartTimeRef = useRef(null);
  const lastScreenRef = useRef('');
  const exportedRef = useRef(false);

  const sheetsStatusRef = useRef('idle');
  const [sheetsStatus, setSheetsStatus] = useState('idle');
  const [sheetsError, setSheetsError] = useState(null);

  const lastPointerPosRef = useRef({ x: null, y: null });

  const idleMsRef = useRef(0);
  const lastActivityRef = useRef(null);

  const [taskState, setTaskState] = useState({
    viewedMessages: [],
    viewedChats: [],
    sentMessages: [],
    forwardedMessages: [],
    newChatsStarted: [],
    searchesPerformed: [],
  });

  const updateTaskState = useCallback((key, value) => {
    setTaskState(prev => ({
      ...prev,
      [key]: Array.isArray(prev[key]) ? [...prev[key], value] : value,
    }));
  }, []);

  useEffect(() => {
    const recordPosition = (e) => {
      const point = e.touches && e.touches[0] ? e.touches[0] : e;
      if (typeof point.clientX === 'number' && typeof point.clientY === 'number') {
        lastPointerPosRef.current = { x: Math.round(point.clientX), y: Math.round(point.clientY) };
      }
    };

    const recordActivity = (e) => {
      recordPosition(e);
      if (!currentTrialRef.current) return;
      const now = Date.now();
      if (lastActivityRef.current != null) {
        const gap = now - lastActivityRef.current;
        if (gap > IDLE_THRESHOLD_MS) idleMsRef.current += gap;
      }
      lastActivityRef.current = now;
    };

    // Keystrokes don't carry a pointer position, so they update the idle
    // clock directly without touching lastPointerPosRef (recordPosition is
    // skipped here — a keydown doesn't tell us where the cursor is).
    const recordKeyActivity = () => {
      if (!currentTrialRef.current) return;
      const now = Date.now();
      if (lastActivityRef.current != null) {
        const gap = now - lastActivityRef.current;
        if (gap > IDLE_THRESHOLD_MS) idleMsRef.current += gap;
      }
      lastActivityRef.current = now;
    };

    const opts = { passive: true };
    window.addEventListener('pointermove', recordActivity, opts);
    window.addEventListener('pointerdown', recordActivity, opts);
    window.addEventListener('touchmove', recordActivity, opts);
    window.addEventListener('mousemove', recordActivity, opts);
    window.addEventListener('mousedown', recordActivity, opts);
    window.addEventListener('scroll', recordActivity, { passive: true, capture: true });
    window.addEventListener('keydown', recordKeyActivity, opts);

    return () => {
      window.removeEventListener('pointermove', recordActivity, opts);
      window.removeEventListener('pointerdown', recordActivity, opts);
      window.removeEventListener('touchmove', recordActivity, opts);
      window.removeEventListener('mousemove', recordActivity, opts);
      window.removeEventListener('mousedown', recordActivity, opts);
      window.removeEventListener('scroll', recordActivity, true);
      window.removeEventListener('keydown', recordKeyActivity, opts);
    };
  }, []);

  const resetSession = useCallback(() => {
    setTaskTrials([]);
    setInteractionEvents([]);
    setTaskState({
      viewedMessages: [],
      viewedChats: [],
      sentMessages: [],
      forwardedMessages: [],
      newChatsStarted: [],
      searchesPerformed: [],
    });
    currentTrialRef.current = null;
    taskStartTimeRef.current = null;
    lastScreenRef.current = '';
    exportedRef.current = false;
    sheetsStatusRef.current = 'idle';
    setSheetsStatus('idle');
    setSheetsError(null);
    idleMsRef.current = 0;
    lastActivityRef.current = null;
    lastPointerPosRef.current = { x: null, y: null };
  }, []);

  const logEvent = useCallback((params) => {
    if (!currentTrialRef.current) return;
    const screenId = params.screen_id || lastScreenRef.current || '';
    const { x, y } = lastPointerPosRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const event = {
      event_id:        genId('EVT'),
      task_trial_id:   currentTrialRef.current.task_trial_id,
      participant_id:  participant?.participant_id || 'UNKNOWN',
      task_id:         currentTrialRef.current.task_id,
      event_order:     ++eventCounter,
      timestamp:       new Date().toISOString(),
      from_screen_id:  lastScreenRef.current || screenId,
      screen_id:       screenId,
      screen_type:     getScreenType(screenId),
      action_type:     params.action_type  || '',
      target_id:       params.target_id    || '',
      target_label:    params.target_label || '',
      next_screen_id:  params.next_screen_id || '',
      active_popup_id: params.active_popup_id || '',
      click_x:         x != null ? x : '',
      click_y:         y != null ? y : '',
      click_x_pct:     x != null && vw ? Number((x / vw).toFixed(4)) : '',
      click_y_pct:     y != null && vh ? Number((y / vh).toFixed(4)) : '',
      viewport_width:  vw,
      viewport_height: vh,
      device_context:  vw < MOBILE_BREAKPOINT ? 'mobile' : 'desktop',
    };
    if (params.next_screen_id) {
      lastScreenRef.current = params.next_screen_id;
    } else if (screenId) {
      lastScreenRef.current = screenId;
    }
    setInteractionEvents(prev => [...prev, event]);
    return event;
  }, [participant]);

  const startTrial = useCallback((task, taskOrder) => {
    sheetsStatusRef.current = 'idle';
    setSheetsStatus('idle');
    setSheetsError(null);
    exportedRef.current = false;
    lastScreenRef.current = '';

    idleMsRef.current = 0;
    lastActivityRef.current = Date.now();

    const trial = {
      task_trial_id:    genId('TRL'),
      participant_id:   participant?.participant_id || 'UNKNOWN',
      task_id:          task.task_id,
      task_name:        task.task_name,
      task_order:       taskOrder,
      start_time:       new Date().toISOString(),
      end_time:         null,
      duration_seconds: null,
      idle_seconds:     null,
      completed:        false,
      success:          false,
      help_used:        false,
      notes:            '',
    };
    currentTrialRef.current = trial;
    taskStartTimeRef.current = Date.now();

    setTaskState({
      viewedMessages: [],
      viewedChats: [],
      sentMessages: [],
      forwardedMessages: [],
      newChatsStarted: [],
      searchesPerformed: [],
    });

    logEvent({
      screen_id:    'SCR_TASK_BRIEF',
      action_type:  'task_start',
      target_id:    task.task_id,
      target_label: task.task_name,
    });
    return trial;
  }, [participant, logEvent]);

  const endTrial = useCallback((success, helpUsed = false, notes = '') => {
    if (!currentTrialRef.current) return;
    const end = new Date();
    const start = new Date(currentTrialRef.current.start_time);
    const duration = Math.round((end - start) / 1000);

    if (lastActivityRef.current != null) {
      const tailGap = end.getTime() - lastActivityRef.current;
      if (tailGap > IDLE_THRESHOLD_MS) idleMsRef.current += tailGap;
    }
    const idleSeconds = Math.round(idleMsRef.current / 1000);

    const completed = {
      ...currentTrialRef.current,
      end_time:         end.toISOString(),
      duration_seconds: duration,
      idle_seconds:     idleSeconds,
      completed:        true,
      success,
      help_used:        helpUsed,
      notes,
    };

    logEvent({
      screen_id:    'SCR_TASK_COMPLETE',
      action_type:  'task_end',
      target_id:    'TGT_TASK_DONE',
      target_label: success ? 'success' : 'incomplete',
    });
    setTaskTrials(prev => [...prev, completed]);
    currentTrialRef.current = null;
    return completed;
  }, [logEvent]);

  const markHelpUsed = useCallback(() => {
    if (currentTrialRef.current) {
      currentTrialRef.current.help_used = true;
    }
    logEvent({
      action_type:  'help',
      target_id:    'TGT_HELP_BTN',
      target_label: 'help button',
    });
  }, [logEvent]);

  const buildWorkbook = useCallback(() => {
    const wb = XLSX.utils.book_new();

    const participantRow = participant ? [{
      participant_id:         participant.participant_id,
      name:                   participant.name,
      age:                    participant.age,
      age_group:              participant.age_group,
      scc_status:             participant.scc_status,
      scc_score:              participant.scc_score,
      digital_literacy_score: participant.digital_literacy_score,
      smartphone_experience:  participant.smartphone_experience,
      notes:                  participant.notes || '',
    }] : [];
    const wsP = XLSX.utils.json_to_sheet(participantRow);
    XLSX.utils.book_append_sheet(wb, wsP, 'Participants');

    const wsTT = XLSX.utils.json_to_sheet(taskTrials.map(t => ({
      task_trial_id:    t.task_trial_id,
      participant_id:   t.participant_id,
      task_id:          t.task_id,
      task_name:        t.task_name,
      task_order:       t.task_order,
      start_time:       t.start_time,
      end_time:         t.end_time,
      duration_seconds: t.duration_seconds,
      idle_seconds:     t.idle_seconds,
      completed:        t.completed ? 'TRUE' : 'FALSE',
      success:          t.success   ? 'TRUE' : 'FALSE',
      help_used:        t.help_used ? 'TRUE' : 'FALSE',
      notes:            t.notes,
    })));
    XLSX.utils.book_append_sheet(wb, wsTT, 'Task_Trials');

    const wsIE = XLSX.utils.json_to_sheet(interactionEvents.map(e => ({
      event_id:        e.event_id,
      task_trial_id:   e.task_trial_id,
      participant_id:  e.participant_id,
      task_id:         e.task_id,
      event_order:     e.event_order,
      timestamp:       e.timestamp,
      from_screen_id:  e.from_screen_id,
      screen_id:       e.screen_id,
      screen_type:     e.screen_type,
      action_type:     e.action_type,
      target_id:       e.target_id,
      target_label:    e.target_label,
      next_screen_id:  e.next_screen_id,
      active_popup_id: e.active_popup_id,
      click_x:         e.click_x,
      click_y:         e.click_y,
      click_x_pct:     e.click_x_pct,
      click_y_pct:     e.click_y_pct,
      viewport_width:  e.viewport_width,
      viewport_height: e.viewport_height,
      device_context:  e.device_context,
    })));
    XLSX.utils.book_append_sheet(wb, wsIE, 'Interaction_Events');

    return wb;
  }, [participant, taskTrials, interactionEvents]);

  
  const exportToExcel = useCallback(() => {
    const wb = buildWorkbook();
    const filename = `research_${participant?.participant_id || 'unknown'}_${Date.now()}.xlsx`;
    XLSX.writeFile(wb, filename);
    exportedRef.current = true;
    return filename;
  }, [buildWorkbook, participant]);

  const autoExportOnSessionEnd = useCallback(() => {
    if (exportedRef.current) return null;
    return exportToExcel();
  }, [exportToExcel]);

  const sendToGoogleSheets = useCallback(async () => {
    if (sheetsStatusRef.current === 'sending') return { skipped: true };

    sheetsStatusRef.current = 'sending';
    setSheetsStatus('sending');
    setSheetsError(null);

    const payload = {
      participant: participant ? {
        participant_id:         participant.participant_id,
        name:                   participant.name,
        age:                    participant.age,
        age_group:              participant.age_group,
        scc_status:             participant.scc_status,
        scc_score:              participant.scc_score,
        digital_literacy_score: participant.digital_literacy_score,
        smartphone_experience:  participant.smartphone_experience,
        notes:                  participant.notes || '',
      } : null,
      taskTrials: taskTrials.map(t => ({
        task_trial_id:    t.task_trial_id,
        participant_id:   t.participant_id,
        task_id:          t.task_id,
        task_name:        t.task_name,
        task_order:       t.task_order,
        start_time:       t.start_time,
        end_time:         t.end_time,
        duration_seconds: t.duration_seconds,
        idle_seconds:     t.idle_seconds,
        completed:        !!t.completed,
        success:          !!t.success,
        help_used:        !!t.help_used,
        notes:            t.notes,
      })),
      interactionEvents: interactionEvents.map(e => ({
        event_id:        e.event_id,
        task_trial_id:   e.task_trial_id,
        participant_id:  e.participant_id,
        task_id:         e.task_id,
        event_order:     e.event_order,
        timestamp:       e.timestamp,
        from_screen_id:  e.from_screen_id,
        screen_id:       e.screen_id,
        screen_type:     e.screen_type,
        action_type:     e.action_type,
        target_id:       e.target_id,
        target_label:    e.target_label,
        next_screen_id:  e.next_screen_id,
        active_popup_id: e.active_popup_id,
        click_x:         e.click_x,
        click_y:         e.click_y,
        click_x_pct:     e.click_x_pct,
        click_y_pct:     e.click_y_pct,
        viewport_width:  e.viewport_width,
        viewport_height: e.viewport_height,
        device_context:  e.device_context,
      })),
    };

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/session`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unknown server error');

      sheetsStatusRef.current = 'success';
      setSheetsStatus('success');
      return { success: true, ...data };
    } catch (err) {
      sheetsStatusRef.current = 'error';
      setSheetsStatus('error');
      setSheetsError(err.message);
      return { success: false, error: err.message };
    }
  }, [participant, taskTrials, interactionEvents]);

  const autoSendOnSessionEnd = useCallback(() => {
    return sendToGoogleSheets();
  }, [sendToGoogleSheets]);

  return {
    taskTrials,
    interactionEvents,
    taskState,
    logEvent,
    startTrial,
    endTrial,
    markHelpUsed,
    updateTaskState,
    resetSession,
    exportToExcel,
    autoExportOnSessionEnd,
    sendToGoogleSheets,
    autoSendOnSessionEnd,
    sheetsStatus,
    sheetsError,
    currentTrial: currentTrialRef.current,
  };
}