import React from "react";

export default function ICPStatusBar({ isAuthenticated, principal }) {
  return (
    <div className="icp-status-bar story-card" style={{ background: "var(--surface-color)", borderRadius: "12px", boxShadow: "0 2px 12px #0066ff22", padding: "0.7rem 2.2rem 0.7rem 1.2rem", fontFamily: "var(--font-family-sans)", alignItems: "center", display: "flex", gap: "2.2rem", justifyContent: "flex-end" }}>
      <div className="icp-status-section">
        <span className="icp-status-label" style={{ color: "var(--accent-blue)", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.04em" }}>Internet Identity:</span>
        <span className={`icp-status-value ${isAuthenticated ? "ok" : "not-ok"}`} style={{ background: isAuthenticated ? "var(--accent-blue)" : "#2a1818", color: isAuthenticated ? "#fff" : "#dc3545", borderRadius: "999px", padding: "0.2rem 0.9rem", fontWeight: 700, fontFamily: "var(--font-family-sans)", fontSize: "1rem", marginLeft: 8, letterSpacing: "0.03em", boxShadow: isAuthenticated ? "0 0 8px #0066ff55" : undefined }}>
          {isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </span>
      </div>
      <div className="icp-status-section">
        <span className="icp-status-label" style={{ color: "var(--accent-blue)", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.04em" }}>Principal:</span>
        <span className="icp-status-value principal-id" style={{ background: "var(--accent-blue)", color: "#fff", borderRadius: "999px", padding: "0.2rem 0.9rem", fontWeight: 700, fontFamily: "var(--font-family-mono, monospace)", fontSize: "1rem", marginLeft: 8, letterSpacing: "0.03em" }}>
          {principal ? principal.slice(0, 8) + "..." + principal.slice(-4) : "-"}
        </span>
      </div>
    </div>
  );
} 