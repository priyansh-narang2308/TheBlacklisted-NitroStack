import { Module } from "@nitrostack/core";
import { MonitoringTools } from "../lib/tools/monitoring.tools.js";
import { InfrastructureTools } from "../lib/tools/infrastructure.tools.js";
import { IncidentTools } from "../lib/tools/incident.tools.js";
import { ExecutiveTools } from "../lib/tools/executive.tools.js";
import { ActionTools } from "../lib/tools/action.tools.js";
import { SimulationTools } from "../lib/tools/simulation.tools.js";
import { ProtocolZeroService } from "./protocol-zero.service.js";
import { ProtocolZeroPrompts } from "../lib/prompts/protocol-zero.prompts.js";
import { ProtocolZeroResources } from "../lib/resources/protocol-zero.resources.js";

/**
 * ProtocolZeroModule — the AI Workplace Digital Twin.
 *
 * Multi-agent enterprise operations control center: monitoring, root-cause
 * analysis, business impact prediction, prioritized recommendations, approved
 * action execution through MCP servers, and an executive copilot.
 */
@Module({
  name: "protocol-zero",
  description:
    "AI Workplace Digital Twin — multi-agent enterprise operations control center",
  controllers: [
    MonitoringTools,
    InfrastructureTools,
    IncidentTools,
    ExecutiveTools,
    ActionTools,
    SimulationTools,
    ProtocolZeroPrompts,
    ProtocolZeroResources,
  ],
  providers: [ProtocolZeroService],
})
export class ProtocolZeroModule {}
