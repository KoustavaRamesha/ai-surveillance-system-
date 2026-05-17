# AI Surveillance Dashboard

This dashboard is the frontend for the AI Surveillance System. It fetches incidents and stats from the backend and displays them in a compact UI.

Key behaviors:
- Polls `http://localhost:8000/incidents` and `http://localhost:8000/incidents/stats` every 5 seconds
- Shows a live indicator and counts for severity levels
- Displays a recent incidents table with time, event type, track ID, severity, dwell and zone

To run the dashboard:

```bash
cd dashboard
npm install
npm run dev
```

By default the dashboard uses `http://localhost:8000` as the API origin. If your backend runs on a different host/port, update the API URLs in `src/App.jsx`.

Notes for development:
- Styling is inline in `src/App.jsx` for simplicity.
- Add a management UI to edit `zone.json` and persist zones in the backend if you want dynamic zone control.

See the repository root README for full project setup and the inference script instructions.
