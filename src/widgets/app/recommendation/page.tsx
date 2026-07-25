"use client";

import React, { useState } from "react";
import { useTheme, useWidgetSDK } from "@nitrostack/widgets";

export const dynamic = "force-dynamic";

interface Recommendation {
  recommendationId: string;
  incidentId: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  mcpServer: string;
  status:
    | "pending"
    | "approved"
    | "executing"
    | "executed"
    | "rejected"
    | "failed";
  evidence?: string;
  confidence?: number;
  businessImpact?: string;
  zero_trust_token?: string;
}

interface RecommendationsData {
  recommendations: Recommendation[];
}

const priorityColor: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#ffffff",
};

const MOCK_RECOMMENDATIONS: RecommendationsData = {
  recommendations: [],
};

export default function RecommendationWidget() {
  const theme = useTheme();
  const { isReady, getToolOutput, callTool } = useWidgetSDK();
  const rawData = getToolOutput<RecommendationsData>();

  // Local state to track execution and update UI immediately
  const [actionStates, setActionStates] = useState<
    Record<string, { loading: boolean; status?: string; error?: string }>
  >({});
  const [activeTab, setActiveTab] = useState<"active" | "resolved">("active");

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
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid #4f46e5",
              animation: "pulse-ring 1.8s ease-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "2px solid #818cf8",
              animation: "pulse-ring 1.8s ease-out infinite 0.4s",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 20,
              borderRadius: "50%",
              background: "#4338ca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
        </div>
        <div style={{ color: "#a5b4fc", fontWeight: 600, fontSize: 15, letterSpacing: "0.02em" }}>
          Decision Board
        </div>
        <div style={{ color: muted, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#818cf8",
              animation: "blink 1.2s ease-in-out infinite",
            }}
          />
          Loading action recommendations...
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

  const isMock = !rawData;
  const data = rawData || MOCK_RECOMMENDATIONS;
  if (!data)
    return (
      <div
        style={{
          ...shellStyle,
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading recommendations...
      </div>
    );

  const allRecs = Array.isArray(data) ? data : (data.recommendations ?? []);
  const activeRecs = allRecs.filter(r => (actionStates[r.recommendationId]?.status || r.status) === "pending");
  const resolvedRecs = allRecs.filter(r => {
    const status = actionStates[r.recommendationId]?.status || r.status;
    return status === "executed" || status === "rejected";
  });
  const displayedRecs = activeTab === "active" ? activeRecs : resolvedRecs;

  const handleAction = async (recommendationId: string, approve: boolean, token?: string) => {
    setActionStates((prev) => ({
      ...prev,
      [recommendationId]: { loading: true },
    }));

    try {
      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        const toolName = approve
          ? "approveRecommendation"
          : "rejectRecommendation";
        await callTool(toolName, { recommendationId, zero_trust_token: token });
      }

      setActionStates((prev) => ({
        ...prev,
        [recommendationId]: {
          loading: false,
          status: approve ? "executed" : "rejected",
        },
      }));
    } catch (err) {
      console.error(err);
      setActionStates((prev) => ({
        ...prev,
        [recommendationId]: {
          loading: false,
          error:
            err instanceof Error ? err.message : "Action execution failed.",
        },
      }));
    }
  };

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
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.5px",
              color: "#ffffff",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Operational Control
          </div>
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
          Action Recommendations
        </div>
        <div style={{ fontSize: 13, color: muted, marginTop: 4 }}>
          Executive Agent proposals requiring explicit approval workflow
          confirmation.
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("active")}
          style={{
            background: activeTab === "active" ? "#ffffff" : "transparent",
            color: activeTab === "active" ? "#111111" : "#888888",
            border: `1px solid ${activeTab === "active" ? "#ffffff" : border}`,
            padding: "8px 18px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Active ({activeRecs.length})
        </button>
        <button
          onClick={() => setActiveTab("resolved")}
          style={{
            background: activeTab === "resolved" ? "#ffffff" : "transparent",
            color: activeTab === "resolved" ? "#111111" : "#888888",
            border: `1px solid ${activeTab === "resolved" ? "#ffffff" : border}`,
            padding: "8px 18px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Resolved ({resolvedRecs.length})
        </button>
      </div>

      {displayedRecs.length === 0 ? (
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
              background: activeTab === "active" ? "linear-gradient(135deg, #052e16 0%, #14532d 100%)" : "linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)",
              border: activeTab === "active" ? "2px solid #16a34a" : `2px solid ${border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              boxShadow: activeTab === "active" ? "0 0 24px rgba(22,163,74,0.25)" : "none",
            }}
          >
            {activeTab === "active" ? "✓" : "∅"}
          </div>
          <div style={{ color: activeTab === "active" ? "#4ade80" : "#ffffff", fontWeight: 700, fontSize: 16 }}>
            {activeTab === "active" ? "All Actions Resolved" : "No Resolved Actions"}
          </div>
          <div style={{ color: muted, fontSize: 12, maxWidth: 280, lineHeight: 1.6 }}>
            {activeTab === "active" 
              ? "No pending recommendations require your approval. The system is fully operational."
              : "No historical or completed recommendations found in this session."
            }
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {displayedRecs.map((r) => {
            const state = actionStates[r.recommendationId] || {};
            const currentStatus = state.status || r.status;
            const isPending = currentStatus === "pending";

            return (
              <div
                key={r.recommendationId}
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: 8,
                  padding: 20,
                  boxShadow: shadow,
                  backdropFilter,
                  transition: "all 0.3s ease",
                }}
              >
                {/* Meta details */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "#1c1c1c",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {r.priority} Priority
                  </span>
                  <span style={{ fontSize: 12, color: muted, fontWeight: 700 }}>
                    Incident: {r.incidentId} · Recommendation:{" "}
                    {r.recommendationId}
                  </span>

                  {/* Status Tag */}
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 6,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      background:
                        currentStatus === "executed"
                          ? "rgba(16,185,129,0.15)"
                          : currentStatus === "rejected"
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(245,158,11,0.15)",
                      color:
                        currentStatus === "executed"
                          ? "#10b981"
                          : currentStatus === "rejected"
                            ? "#ef4444"
                            : "#f59e0b",
                    }}
                  >
                    {currentStatus}
                  </span>
                </div>

                {/* Body */}
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
                  {r.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: text,
                    marginBottom: 12,
                  }}
                >
                  {r.description}
                </div>

                {/* Sub-details (Impact, Evidence, Confidence) */}
                {(r.businessImpact || r.evidence || r.confidence) && (
                  <div
                    style={{
                      background: isDark ? "rgba(15, 23, 42, 0.4)" : "#f1f5f9",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 16,
                      fontSize: 12,
                      lineHeight: 1.4,
                      border: `1px solid ${border}`,
                    }}
                  >
                    {r.confidence && (
                      <div style={{ marginBottom: 6 }}>
                        <b>Confidence Level:</b>{" "}
                        <span style={{ color: "#10b981", fontWeight: 500 }}>
                          {r.confidence}%
                        </span>
                      </div>
                    )}
                    {r.businessImpact && (
                      <div style={{ marginBottom: 6 }}>
                        <b>Estimated Impact:</b> {r.businessImpact}
                      </div>
                    )}
                    {r.evidence && (
                      <div>
                        <b>Supporting Evidence:</b> <i>{r.evidence}</i>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                {isPending && (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      borderTop: `1px solid ${border}`,
                      paddingTop: 14,
                    }}
                  >
                    <button
                      onClick={() => handleAction(r.recommendationId, true, r.zero_trust_token)}
                      disabled={state.loading}
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 20px",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        flex: 1,
                        boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
                        transition: "opacity 0.2s",
                        opacity: state.loading ? 0.6 : 1,
                      }}
                    >
                      {state.loading ? "Executing..." : "Approve & Execute"}
                    </button>
                    <button
                      onClick={() => handleAction(r.recommendationId, false, r.zero_trust_token)}
                      disabled={state.loading}
                      style={{
                        background: "none",
                        color: "#ef4444",
                        border: `1px solid #ef4444`,
                        borderRadius: 8,
                        padding: "10px 20px",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        flex: 1,
                        transition: "background 0.2s",
                        opacity: state.loading ? 0.6 : 1,
                      }}
                    >
                      Reject Proposal
                    </button>
                  </div>
                )}

                {/* Error message */}
                {state.error && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: 12,
                      marginTop: 8,
                      fontWeight: 700,
                    }}
                  >
                    ❌ {state.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
