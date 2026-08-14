## Prerequisites

Install these on the new device before doing anything else:

- **[Node.js](https://nodejs.org/)** 18 or later (includes npm) — check with `node -v` and `npm -v`
- A **Google Cloud service account key file** for Sheets access (only needed if you want automatic upload to Google Sheets — the app always saves a local Excel backup regardless, so this part is optional and can be set up later)

---

## 1. Clone the repository

```bash
git clone https://github.com/alexajimenez24/Behavior-GNN-WebApp.git
cd BehaviorGNNWebApp
```


## 2. Install frontend dependencies

From the repository root:

```bash
npm install
```
---

## 3. Install and configure the backend

```bash
cd server
npm install
```

### 3a. Get a Google service account key (for Google Sheets upload)

### 3b. Create `server/.env`

Create a file at `server/.env` with:

```
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
SPREADSHEET_ID=your_google_sheet_id_here
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on |
| `CLIENT_ORIGIN` | Allowed CORS origin for the frontend |
| `SPREADSHEET_ID` | The target Google Sheet's ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the service account key file. `./service-account-key.json` works if the file sits directly in `server/` and you run the server from inside that folder. |

## 4. Run the app

Open two terminals from the repository root.

**Terminal 1 — backend:**

```bash
cd server
npm run dev      # auto-restarts on file changes
# or: npm start  # plain node, no auto-restart
```

**Terminal 2 — frontend:**

```bash
npm start
```
