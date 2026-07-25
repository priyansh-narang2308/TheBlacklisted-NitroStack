"use client";

import React, { useState } from "react";
import { useTheme, useWidgetSDK } from "@nitrostack/widgets";

export const dynamic = "force-dynamic";

interface Incident {
  incidentId: string;
  title: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  status: string;
  timestamp: string;
  affectedDepartments: string[];
  affectedSystems: string[];
  trigger: string;
  rootCause: string;
  confidenceScore: number;
}

interface IncidentList {
  incidents: Incident[];
}

const MOCK_INCIDENTS: Incident[] = [];

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#ffffff",
};

export default function ListIncidentsWidget() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();
  const toolOutput = getToolOutput<IncidentList>();

  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInc, setSelectedInc] = useState<string | null>(null);

  const isDark = theme === "dark";
  const bg = "#111111";
  const cardBg = "#1c1c1c";
  const text = "#ffffff";
  const muted = "#888888";
  const border = "#2a2a2a";
  const shadow = "none";
  const backdropFilter = "none";

  const shellStyle: React.CSSProperties = {
    padding: 32,
    textAlign: "center",
    color: text,
    background: bg,
    borderRadius: 8,
    fontFamily: '"Inter", -apple-system, sans-serif',
  };

  if (!isReady)
    return (
      <div
        style={{
          ...shellStyle,
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* Animated radar pulse */}
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid #1e40af",
              animation: "pulse-ring 1.8s ease-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "2px solid #3b82f6",
              animation: "pulse-ring 1.8s ease-out infinite 0.4s",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 20,
              borderRadius: "50%",
              background: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            📡
          </div>
        </div>
        <div style={{ color: "#93c5fd", fontWeight: 600, fontSize: 15, letterSpacing: "0.02em" }}>
          Incident Command Room
        </div>
        <div style={{ color: muted, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#3b82f6",
              animation: "blink 1.2s ease-in-out infinite",
            }}
          />
          Connecting to live monitoring stream...
        </div>
        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        `}</style>
      </div>
    );

  const isMock = !toolOutput;
  const incidents = toolOutput?.incidents ?? MOCK_INCIDENTS;

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSeverity =
      filterSeverity === "all" || inc.severity === filterSeverity;
    const matchesSearch =
      searchQuery === "" ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div
      style={{
        background: bg,
        color: text,
        padding: 24,
        borderRadius: 8,
        fontFamily: '"Inter", -apple-system, sans-serif',
        border: `1px solid ${border}`,
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.5px",
                color: "#ffffff",
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              Incident Command
            </span>
            {isMock && (
              <span
                style={{
                  fontSize: 9,
                  background: "#1c1c1c",
                  color: "#888888",
                  padding: "1px 5px",
                  borderRadius: 4,
                  border: "1px solid #2a2a2a",
                  fontWeight: 400,
                }}
              >
                MOCK
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              marginTop: 4,
              letterSpacing: "0",
            }}
          >
            Active Incidents Feed
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "critical", "high", "medium"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: filterSeverity === sev ? "#ffffff" : cardBg,
                color: filterSeverity === sev ? "#fff" : text,
                border: `1px solid ${filterSeverity === sev ? "#ffffff" : border}`,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: shadow,
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search incidents by ID, title, or category..."
          style={{
            width: "100%",
            background: isDark ? "#0f172a" : "#ffffff",
            border: `1px solid ${border}`,
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 12,
            color: text,
            outline: "none",
          }}
        />
      </div>

      {/* Incidents List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxHeight: 380,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {filteredIncidents.length === 0 ? (
          <div
            style={{
              background: cardBg,
              border: `1px solid ${border}`,
              borderRadius: 8,
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #052e16 0%, #14532d 100%)",
                border: "2px solid #16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                boxShadow: "0 0 24px rgba(22,163,74,0.25)",
              }}
            >
              ✓
            </div>
            <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 16 }}>
              All Systems Operational
            </div>
            <div style={{ color: muted, fontSize: 12, maxWidth: 280, lineHeight: 1.6 }}>
              {searchQuery || filterSeverity !== "all"
                ? "No incidents match your current filters."
                : "No active incidents detected. Protocol-0 is watching over your infrastructure."}
            </div>
            {(searchQuery || filterSeverity !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setFilterSeverity("all"); }}
                style={{
                  marginTop: 4,
                  background: "transparent",
                  border: `1px solid ${border}`,
                  color: muted,
                  borderRadius: 6,
                  padding: "6px 16px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const isSelected = selectedInc === inc.incidentId;
            return (
              <div
                key={inc.incidentId}
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderLeft: `4px solid ${severityColors[inc.severity] || border}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: shadow,
                }}
              >
                {/* Header Row */}
                <div
                  onClick={() =>
                    setSelectedInc(isSelected ? null : inc.incidentId)
                  }
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    background: isDark ? "rgba(15, 23, 42, 0.2)" : "#f8fafc",
                    borderBottom: isSelected ? `1px solid ${border}` : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: severityColors[inc.severity],
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {inc.severity}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {inc.incidentId} : {inc.title}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                        color: muted,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {inc.status.replace("_", " ")}
                    </span>
                    <span style={{ fontSize: 12, color: muted }}>
                      {isSelected ? "▼" : "▶"}
                    </span>
                  </div>
                </div>

                {/* Details Accordion */}
                {isSelected && (
                  <div
                    style={{
                      padding: 16,
                      fontSize: 13,
                      lineHeight: 1.5,
                      background: isDark ? "#0f172a" : "#ffffff",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: muted,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          Scope Analysis
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <b>Category:</b> {inc.category}
                        </div>
                        <div style={{ marginTop: 2 }}>
                          <b>Trigger:</b> {inc.trigger}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: muted,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          Impact Signals
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <b>Departments:</b>{" "}
                          {inc.affectedDepartments.join(", ")}
                        </div>
                        <div style={{ marginTop: 2 }}>
                          <b>Systems:</b> {inc.affectedSystems.join(", ")}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: 10,
                        background: isDark
                          ? "rgba(255,255,255,0.02)"
                          : "#f8fafc",
                        borderRadius: 6,
                        border: `1px solid ${border}`,
                        marginTop: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: muted,
                            textTransform: "uppercase",
                          }}
                        >
                          Root Cause Diagnosis
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: "#10b981",
                          }}
                        >
                          {inc.confidenceScore}% confidence
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: text }}>
                        {inc.rootCause}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
