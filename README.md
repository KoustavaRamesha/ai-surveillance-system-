# AI Surveillance Dashboard

This folder contains the React + Vite frontend for the AI Surveillance System. It shows live incident data from the backend, summarizes severity counts, and lists the most recent detections in a simple operator-friendly view.

## What it does

- Polls the backend every 5 seconds for incidents and aggregate stats
- Shows a live status indicator with the last successful refresh time
- Displays incident totals split by severity: `HIGH`, `MEDIUM`, and `LOW`
- Renders a recent incidents table with timestamp, event type, track ID, severity, dwell time, and zone
- Lets you manually refresh the data with a single click

## Tech Stack

- React 19
- Vite
- Axios

## Project Structure

- `src/App.jsx` - dashboard UI and polling logic
- `src/main.jsx` - React entry point
- `src/index.css` - global styles
- `public/` - static assets

## Requirements

- Node.js 18 or newer
- npm
- A running backend that exposes the incidents API

## Setup

From the `dashboard` directory:

```bash
npm install
npm run dev
```

The Vite dev server runs at `http://localhost:5173` by default.

## Backend API

The dashboard expects the backend to serve these endpoints on `http://localhost:8000`:

- `GET /incidents`
- `GET /incidents/stats`

### Expected incidents response

The incidents endpoint should return an array of objects similar to:

```json
[
  {
    "_id": "6650f0c0e1b7f2a1b3c4d5e6",
    "timestamp": "2026-05-17T08:30:00.000Z",
    "event_type": "intrusion",
    "track_id": 12,
    "severity": "HIGH",
    "dwell": 14.2,
    "zone_id": "zone_01"
  }
]
```

The UI will also accept:

- `id` instead of `_id`
- `dwell_seconds` if `dwell` is not present
- a missing `zone_id`, which falls back to `zone_01`

### Expected stats response

The stats endpoint should return an object with this shape:

```json
{
  "total": 12,
  "HIGH": 3,
  "MEDIUM": 5,
  "LOW": 4
}
```

## Configuration

API URLs are currently hardcoded in `src/App.jsx`:

- `http://localhost:8000/incidents`
- `http://localhost:8000/incidents/stats`

If your backend runs elsewhere, update those URLs in `src/App.jsx`.

## UI Behavior

- Data is fetched immediately on page load
- The dashboard refreshes automatically every 5 seconds
- The refresh button triggers an immediate fetch
- Incidents are sorted by whatever order the backend returns

## Development Notes

- The current styling is inline inside `src/App.jsx`
- Severity badges are color-coded for quick scanning
- The table falls back cleanly when no incidents are available

## Troubleshooting

- If the dashboard shows no data, confirm the backend is running on port `8000`
- If you see CORS errors, make sure the backend allows requests from `http://localhost:5173`
- If the severity counts do not match, check the payload returned by `/incidents/stats`
- If timestamps look wrong, verify that the backend returns ISO 8601 timestamps

## Suggested Next Improvements

- Move the hardcoded API base URL into an environment variable
- Add filters for time range, severity, and zone
- Add a chart view for trends over time
- Replace inline styles with a shared component and theme structure

