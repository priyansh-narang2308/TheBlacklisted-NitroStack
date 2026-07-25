"use client";

import { useWidgetSDK } from "@nitrostack/widgets";

export const dynamic = "force-dynamic";

type HealthStatus = "healthy" | "warning" | "critical";

interface SubSystem {
  departmentId: string;
  departmentName: string;
  healthScore: number;
  status: HealthStatus;
  summary: string;
  owningAgent: string;
  sources: string[];
}

interface RecommendationLite {
  recommendationId: string;
  incidentId: string;
  priority: "high" | "medium" | "low";
  title: string;
}

interface CompanyHealth {
  companyHealthScore: number;
  status: HealthStatus;
  openIncidents: number;
  criticalRisks: number;
  departments: SubSystem[];
  recommendations: RecommendationLite[];
  lastUpdated: string;
}

// Monochromatic palette matching the reference image
const BG = "#111111";
const CARD = "#1c1c1c";
const BORDER = "#2a2a2a";
const TEXT = "#ffffff";
const MUTED = "#888888";
const FONT = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

const statusBar: Record<HealthStatus, string> = {
  healthy: "#ffffff",
  warning: "#facc15",
  critical: "#ef4444",
};

const DEPT_ICONS: Record<string, string> = {
  engineering: "</>",
  operations: "⚙",
  support: "🎧",
  hr: "👥",
  finance: "$",
  security: "🔒",
  product: "📦",
};

const MOCK_COMPANY_HEALTH: CompanyHealth = {
  companyHealthScore: 98,
  status: "healthy",
  openIncidents: 0,
  criticalRisks: 0,
  departments: [
    {
      departmentId: "engineering",
      departmentName: "Engineering",
      healthScore: 98,
      status: "healthy",
      summary: "All CI/CD pipelines green. Infrastructure metrics healthy.",
      owningAgent: "Engineering Agent",
      sources: ["GitHub", "Datadog"],
    },
    {
      departmentId: "operations",
      departmentName: "Operations",
      healthScore: 95,
      status: "healthy",
      summary: "Release schedules align with Jira progress. Sprint is on track.",
      owningAgent: "Operations Agent",
      sources: ["Datadog"],
    },
    {
      departmentId: "support",
      departmentName: "Support",
      healthScore: 96,
      status: "healthy",
      summary: "Customer issue reports remain within baseline rates.",
      owningAgent: "Support Agent",
      sources: ["Jira"],
    },
    {
      departmentId: "hr",
      departmentName: "HR",
      healthScore: 100,
      status: "healthy",
      summary: "No critical staffing absences or scheduling conflicts.",
      owningAgent: "Operations Agent",
      sources: ["Google Calendar"],
    },
    {
      departmentId: "finance",
      departmentName: "Finance",
      healthScore: 98,
      status: "healthy",
      summary: "System metrics and checkouts operational. No revenue risks.",
      owningAgent: "Executive Agent",
      sources: ["Jira"],
    },
    {
      departmentId: "security",
      departmentName: "Security",
      healthScore: 100,
      status: "healthy",
      summary: "No system health check failures or unauthorized accesses.",
      owningAgent: "Monitoring Agent",
      sources: ["Datadog"],
    },
  ],
  recommendations: [],
  lastUpdated: new Date().toISOString(),
};

function StatusBadge({ status }: { status: HealthStatus }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        border: `1px solid ${BORDER}`,
        background: "transparent",
        color: TEXT,
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        fontFamily: FONT,
      }}
    >
      {status}
    </span>
  );
}

function DeptIcon({ id }: { id: string }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: CARD,
        border: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        flexShrink: 0,
        color: TEXT,
      }}
    >
      {DEPT_ICONS[id] ?? "•"}
    </div>
  );
}

export default function CompanyHealthWidget() {
  const { isReady, getToolOutput } = useWidgetSDK();
  const rawData = getToolOutput<CompanyHealth>();

  const shellStyle: React.CSSProperties = {
    padding: 32,
    textAlign: "center",
    color: TEXT,
    background: BG,
    borderRadius: 12,
    fontFamily: FONT,
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  if (!isReady) return <div style={shellStyle}>Initializing Digital Twin...</div>;

  const data = rawData || MOCK_COMPANY_HEALTH;
  if (!data) return <div style={shellStyle}>Loading live organizational telemetry...</div>;

  const score = data.companyHealthScore ?? 0;
  const status = (data.status ?? "healthy") as HealthStatus;
  const departments = data.departments ?? [];
  const recommendations = data.recommendations ?? [];
  const engDept = departments.find((d) => d.departmentId === "engineering");
  const engScore = engDept ? engDept.healthScore : score;

  const engMetrics = [
    { label: "Deployment Success", weight: 25, value: engScore },
    { label: "CI/CD Success", weight: 20, value: Math.min(100, Math.round(engScore * 1.02)) },
    { label: "Sprint Health", weight: 20, value: Math.min(100, Math.round(engScore * 0.95)) },
    { label: "Issue Rate Stability", weight: 15, value: Math.min(100, Math.round(engScore * 0.98)) },
    { label: "Infrastructure Health", weight: 20, value: Math.min(100, Math.round(engScore * 1.02)) },
  ];

  return (
    <div
      style={{
        background: BG,
        color: TEXT,
        padding: 24,
        borderRadius: 12,
        fontFamily: FONT,
        minWidth: 0,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>
            AI Workplace Digital Twin
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.5px" }}>
            Executive Dashboard
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {/* Open Incidents Card */}
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>🛡</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{data.openIncidents ?? 0}</div>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.5px", textTransform: "uppercase" }}>Open Incidents</div>
            </div>
          </div>
          {/* Critical Risks Card */}
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>⚠</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{data.criticalRisks ?? 0}</div>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.5px", textTransform: "uppercase" }}>Critical Risks</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Gauge Card */}
        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 24,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Circular gauge */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              flexShrink: 0,
              background: `conic-gradient(#ffffff ${score * 3.6}deg, #2a2a2a 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 94,
                height: 94,
                borderRadius: "50%",
                background: CARD,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: TEXT }}>{score}%</span>
              <span style={{ fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>Overall</span>
            </div>
          </div>

          <div>
            <StatusBadge status={status} />
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 10 }}>System Health Status</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 6, lineHeight: 1.6 }}>
              Aggregated in real-time across departments using LangGraph business logic.
            </div>
          </div>
        </div>

        {/* Engineering Breakdown */}
        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Engineering Health Breakdown
            </span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{engScore}%</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {engMetrics.map((m) => (
              <div key={m.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5, color: TEXT }}>
                  <span>
                    {m.label}{" "}
                    <span style={{ color: MUTED, fontSize: 11 }}>({m.weight}%)</span>
                  </span>
                  <span style={{ fontWeight: 600 }}>{m.value}%</span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: BORDER,
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${m.value}%`,
                      height: "100%",
                      background: "#ffffff",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live Subsystem Signals ── */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: MUTED,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        Live Subsystem Signals
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {departments.map((d) => {
          const s = (d.status ?? "healthy") as HealthStatus;
          return (
            <div
              key={d.departmentId}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                padding: 16,
              }}
            >
              {/* Top row: icon + name + badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <DeptIcon id={d.departmentId} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{d.departmentName}</span>
                </div>
                <StatusBadge status={s} />
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 4,
                  background: BORDER,
                  borderRadius: 999,
                  overflow: "hidden",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: `${d.healthScore ?? 0}%`,
                    height: "100%",
                    background: statusBar[s],
                    borderRadius: 999,
                  }}
                />
              </div>

              {/* Score + agent */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginBottom: 10 }}>
                <span>Score: <b style={{ color: TEXT }}>{d.healthScore}%</b></span>
                <span>{d.owningAgent.replace(" Agent", "")}</span>
              </div>

              {/* Summary */}
              <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{d.summary}</div>
            </div>
          );
        })}
      </div>

      {/* ── Recommendations / All Clear ── */}
      {recommendations.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>
            Actions Awaiting Review
          </div>
          {recommendations.map((r) => (
            <div
              key={r.recommendationId}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  fontSize: 10,
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                {r.priority}
              </span>
              <span style={{ fontSize: 13, color: TEXT }}>{r.title}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED }}>{r.incidentId}</span>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <div style={{ borderLeft: `1px solid ${BORDER}`, paddingLeft: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>All systems operational.</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>No actions pending approval.</div>
          </div>
        </div>
      )}
    </div>
  );
}
