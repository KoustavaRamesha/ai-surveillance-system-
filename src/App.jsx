import { useState, useEffect } from "react"
import axios from "axios"

const SEVERITY_COLORS = {
  HIGH: "#ef4444",
  MEDIUM: "#f97316",
  LOW: "#22c55e"
}

export default function App() {
  const [incidents, setIncidents] = useState([])
  const [stats, setStats] = useState({ total: 0, HIGH: 0, MEDIUM: 0, LOW: 0 })
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = async () => {
    try {
      const [incRes, statRes] = await Promise.all([
        axios.get("http://localhost:8000/incidents"),
        axios.get("http://localhost:8000/incidents/stats")
      ])
      setIncidents(incRes.data)
      setStats(statRes.data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Failed to fetch data:", err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", 
                  color: "#f1f5f9", fontFamily: "sans-serif", padding: "24px" }}>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Surveillance Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", fontSize: "14px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: lastUpdated ? "#10b981" : "#64748b" }} />
          <div>{lastUpdated ? `Live: ${lastUpdated.toLocaleTimeString()}` : "Not updated yet"}</div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Incidents", value: stats.total, color: "#94a3b8" },
          { label: "HIGH", value: stats.HIGH, color: "#ef4444" },
          { label: "MEDIUM", value: stats.MEDIUM, color: "#f97316" },
          { label: "LOW", value: stats.LOW, color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} style={{
            backgroundColor: "#1e293b", borderRadius: "12px",
            padding: "20px", flex: 1, textAlign: "center",
            borderTop: `4px solid ${s.color}`
          }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Incidents Table */}
      <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", 
                      alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Recent Incidents</h2>
          <button onClick={fetchData} style={{
            backgroundColor: "#3b82f6", color: "white", border: "none",
            borderRadius: "8px", padding: "8px 16px", cursor: "pointer"
          }}>
            Refresh
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", 
                         fontSize: "13px", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>Time</th>
              <th style={{ padding: "10px" }}>Event</th>
              <th style={{ padding: "10px" }}>Track ID</th>
              <th style={{ padding: "10px" }}>Severity</th>
              <th style={{ padding: "10px" }}>Dwell (s)</th>
              <th style={{ padding: "10px" }}>Zone</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "20px", textAlign: "center", 
                                         color: "#64748b" }}>
                  No incidents yet. Run the surveillance script to generate data.
                </td>
              </tr>
            ) : (
              incidents.map((inc, i) => (
                <tr key={inc.id ?? inc._id ?? `${inc.track_id}-${inc.timestamp}-${i}` } style={{ borderBottom: "1px solid #1e293b",
                                     fontSize: "14px" }}>
                  <td style={{ padding: "10px", color: "#94a3b8" }}>
                    {new Date(inc.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px", textTransform: "uppercase",
                               fontWeight: "bold" }}>
                    {inc.event_type}
                  </td>
                  <td style={{ padding: "10px" }}>#{inc.track_id}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{
                      backgroundColor: SEVERITY_COLORS[inc.severity] + "22",
                      color: SEVERITY_COLORS[inc.severity],
                      padding: "4px 10px", borderRadius: "20px",
                      fontWeight: "bold", fontSize: "12px"
                    }}>
                      {inc.severity}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    {typeof inc.dwell === "number" ? inc.dwell.toFixed(1) : (inc.dwell_seconds ?? inc.dwell ?? '-')}
                  </td>
                  <td style={{ padding: "10px", color: "#94a3b8" }}>{inc.zone_id || "zone_01"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}