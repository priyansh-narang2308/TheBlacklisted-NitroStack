"use client";

import React, { useState } from "react";
import { useWidgetSDK } from "@nitrostack/widgets";

export const dynamic = "force-dynamic";

interface Scenario {
  id: string;
  name: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  systems: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "cicd_failure",
    name: "CI/CD Pipeline Crash",
    category: "CI/CD Failure",
    severity: "high",
    description: "Trigger a Jest test suite failure on main branch to block integration checks.",
    systems: ["GitHub"],
  },
  {
    id: "merge_failure",
    name: "Primary Auth Merge Lock",
    category: "Merge Failure",
    severity: "medium",
    description: "Create a merge check conflict for the primary authorization router branch.",
    systems: ["GitHub"],
  },
  {
    id: "deployment_failure",
    name: "Production Rollout Failure",
    category: "Deployment Failure",
    severity: "critical",
    description: "Simulate a database migration mismatch crash on deployment of container pods.",
    systems: ["GitHub", "Datadog"],
  },
  {
    id: "issue_spike",
    name: "Customer Support Alert",
    category: "Issue Spike",
    severity: "high",
    description: "Trigger a surge of Github HTTP 500 issue reports for Checkout & Payments.",
    systems: ["GitHub"],
  },
  {
    id: "infra_cpu_spike",
    name: "Auth Gateway CPU Exhaustion",
    category: "Infrastructure Spike",
    severity: "critical",
    description: "Spike Gateway CPU capacity usage to 99% and trigger Datadog alerting.",
    systems: ["Datadog"],
  },
  {
    id: "sprint_risk",
    name: "Sprint Delivery Overload",
    category: "Sprint Risk",
    severity: "medium",
    description: "Simulate developer backlog overflow with remaining story points > 75.",
    systems: ["Jira"],
  },
  {
    id: "feature_incomplete",
    name: "Demo Review Block",
    category: "Feature Incomplete",
    severity: "medium",
    description: "Trigger incomplete critical tickets blocking the Enterprise Demo Review meeting.",
    systems: ["Jira", "Google Calendar"],
  },
  {
    id: "k8s_pod_crash",
    name: "Kubernetes OOMKilled CrashLoop",
    category: "Infrastructure Spike",
    severity: "critical",
    description: "Simulate payment-processor pod OOMKilled leading to CrashLoopBackOff.",
    systems: ["Datadog"],
  },
  {
    id: "database_latency",
    name: "Postgres Connection Pool Exhaustion",
    category: "Infrastructure Spike",
    severity: "high",
    description: "Exhaust pgBouncer connections causing 5000ms latency on checkouts.",
    systems: ["Datadog"],
  },
  {
    id: "oauth_token_leak",
    name: "Unrotated OAuth Token Detection",
    category: "Security Alert",
    severity: "critical",
    description: "Simulate Secret Scanner detecting an unencrypted OAuth client secret.",
    systems: ["GitHub"],
  },
];

const BG = "#0a0d14";
const CARD = "#121722";
const CARD_HOVER = "#181f2e";
const BORDER = "#232d42";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";
const FONT = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

const severityStyles: Record<
  string,
  { text: string; bg: string; border: string; glow: string }
> = {
  critical: {
    text: "#f87171",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.35)",
    glow: "0 0 20px rgba(239, 68, 68, 0.25)",
  },
  high: {
    text: "#fbbf24",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.35)",
    glow: "0 0 20px rgba(245, 158, 11, 0.2)",
  },
  medium: {
    text: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.35)",
    glow: "0 0 20px rgba(56, 189, 248, 0.2)",
  },
  low: {
    text: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.3)",
    glow: "none",
  },
};

export default function TriggerIncidentWidget() {
  const { isReady, callTool } = useWidgetSDK();
  const [selectedScenario, setSelectedScenario] = useState<string>("cicd_failure");
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerSuccess, setTriggerSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isReady) {
    return (
      <div
        style={{
          padding: 48,
          textAlign: "center",
          color: TEXT,
          background: BG,
          borderRadius: 16,
          fontFamily: FONT,
          border: `1px solid ${BORDER}`,
        }}
      >
        <div className="spinner" style={{ marginBottom: 16, margin: "0 auto" }} />
        <div style={{ fontSize: 15, color: MUTED }}>Connecting to Protocol-0 Chaos Simulator...</div>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .spinner { width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #38bdf8; border-radius: 50%; animation: spin 1s linear infinite; }
        `}</style>
      </div>
    );
  }

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenario) || SCENARIOS[0];

  const handleTrigger = async () => {
    setIsTriggering(true);
    setTriggerSuccess(null);
    setError(null);

    try {
      await callTool("trigger_incident", {
        scenario_id: activeScenario.id,
        severity: activeScenario.severity,
        category: activeScenario.category,
      });
      setTriggerSuccess(`Incident [${activeScenario.name}] triggered successfully! Multi-agent diagnosis initiated.`);
      setIsTriggering(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to trigger incident scenario.");
      setIsTriggering(false);
    }
  };

  return (
    <div
      style={{
        background: BG,
        color: TEXT,
        padding: 28,
        borderRadius: 16,
        fontFamily: FONT,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.92); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .interactive-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .interactive-card:hover {
          transform: translateY(-2px);
          border-color: #38bdf8 !important;
          box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
        }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: `1px solid ${BORDER}`,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "2px 8px",
                borderRadius: 999,
                background: "rgba(56, 189, 248, 0.1)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                color: "#38bdf8",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", animation: "pulse 1.5s infinite" }} />
              LIVE TELEMETRY STREAM
            </span>
            <span style={{ fontSize: 11, color: MUTED }}>• Chaos Engineering Simulator</span>
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Incident Scenario Generator
          </div>
        </div>

        <span style={{ fontSize: 12, color: MUTED, background: "#090d14", padding: "6px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontWeight: 600 }}>
          ⚡ 10 Chaos Scenarios Loaded
        </span>
      </div>

      {/* Notifications */}
      {triggerSuccess && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#34d399",
            padding: "14px 18px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
            animation: "fadeIn 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>✓</span>
          <span>{triggerSuccess}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#f87171",
            padding: "14px 18px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
            animation: "fadeIn 0.2s ease",
          }}
        >
          ⚠️ Execution Error: {error}
        </div>
      )}

      {/* ── Main Split View ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        {/* Left: Scenarios Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxHeight: 460, overflowY: "auto", paddingRight: 6 }}>
          {SCENARIOS.map((s) => {
            const isSelected = selectedScenario === s.id;
            const sevTheme = severityStyles[s.severity] || severityStyles.low;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className="interactive-card"
                style={{
                  background: isSelected ? CARD_HOVER : CARD,
                  border: `1px solid ${isSelected ? "#38bdf8" : BORDER}`,
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: isSelected ? "0 0 20px rgba(56, 189, 248, 0.15)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: sevTheme.bg,
                      border: `1px solid ${sevTheme.border}`,
                      color: sevTheme.text,
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {s.severity}
                  </span>
                  <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>{s.category}</span>
                </div>

                <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? "#38bdf8" : TEXT, marginBottom: 6 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {s.description}
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {s.systems.map((sys) => (
                    <span key={sys} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: "#cbd5e1" }}>
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Scenario Trigger Console */}
        <div
          style={{
            background: "linear-gradient(145deg, #121722 0%, #0c1018 100%)",
            border: `1px solid #38bdf8`,
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 10px 30px rgba(56, 189, 248, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>
              <div>
                <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                  Selected Chaos Payload
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{activeScenario.name}</div>
              </div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: (severityStyles[activeScenario.severity] || severityStyles.low).bg,
                  color: (severityStyles[activeScenario.severity] || severityStyles.low).text,
                  border: `1px solid ${(severityStyles[activeScenario.severity] || severityStyles.low).border}`,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {activeScenario.severity}
              </span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Simulation Summary</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, background: "#090d14", padding: 14, borderRadius: 10, border: `1px solid ${BORDER}`, color: "#e2e8f0" }}>
                {activeScenario.description}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Targeted MCP Integrations</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {activeScenario.systems.map((sys) => (
                  <div key={sys} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 500 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171" }} />
                    {sys} Server
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px dashed rgba(239, 68, 68, 0.3)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "#f87171" }}>Initiate Multi-Agent Incident Loop</div>
            <button
              onClick={handleTrigger}
              disabled={isTriggering}
              style={{
                width: "100%",
                background: isTriggering ? "#334155" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#ffffff",
                border: "none",
                padding: "12px 20px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: isTriggering ? "not-allowed" : "pointer",
                boxShadow: isTriggering ? "none" : "0 4px 15px rgba(239, 68, 68, 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {isTriggering ? "⚡ Injecting Chaos Scenario..." : `🔥 Trigger Chaos Scenario: ${activeScenario.name}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
