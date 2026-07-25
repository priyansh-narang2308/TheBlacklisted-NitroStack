import {
  ToolDecorator as Tool,
  Widget,
  Injectable,
  ExecutionContext,
  z,
  UsePipes,
  UseGuards,
} from "@nitrostack/core";
import { ProtocolZeroService } from "../../modules/protocol-zero.service.js";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe.js";
import { ZeroTrustGuard } from "../guards/zero-trust.guard.js";

@Injectable({ deps: [ProtocolZeroService] })
export class ActionTools {
  constructor(private readonly twin: ProtocolZeroService) {}

  @Tool({
    name: "approveRecommendation",
    description:
      "Action Agent: approve and execute a recommended action through its designated MCP server.",
    inputSchema: z.object({
      recommendationId: z.string().describe("Recommendation ID, e.g. REC-1"),
      zero_trust_token: z.string().describe("Cryptographic HMAC validation token"),
    }),
  })
  @UsePipes(ZodValidationPipe)
  @UseGuards(ZeroTrustGuard)
  async approveRecommendation(
    input: { recommendationId: string; zero_trust_token: string },
    ctx: ExecutionContext,
  ) {
    const secret = process.env.ZERO_TRUST_SECRET;
    if (!secret) return { error: "ZERO_TRUST_VIOLATION", hint: "Server missing ZERO_TRUST_SECRET configuration." };
    const crypto = await import("crypto");
    const expectedHash = crypto.createHmac("sha256", secret).update(input.recommendationId).digest("hex");
    if (input.zero_trust_token !== expectedHash) {
      return { error: "ZERO_TRUST_VIOLATION", hint: "Invalid zero_trust_token cryptographic signature." };
    }

    ctx.logger.info("Action Agent approving recommendation", {
      recommendationId: input.recommendationId,
    });
    const result = this.twin.approveAction(input.recommendationId, true);
    if (!result.found) {
      throw new Error(`Recommendation ${input.recommendationId} not found`);
    }
    return result;
  }

  @Tool({
    name: "rejectRecommendation",
    description:
      "Action Agent: reject a recommended action, marking it as rejected in the timeline.",
    inputSchema: z.object({
      recommendationId: z.string().describe("Recommendation ID, e.g. REC-1"),
      zero_trust_token: z.string().describe("Cryptographic HMAC validation token"),
    }),
  })
  @UseGuards(ZeroTrustGuard)
  async rejectRecommendation(
    input: { recommendationId: string; zero_trust_token: string },
    ctx: ExecutionContext,
  ) {
    const secret = process.env.ZERO_TRUST_SECRET;
    if (!secret) return { error: "ZERO_TRUST_VIOLATION", hint: "Server missing ZERO_TRUST_SECRET configuration." };
    const crypto = await import("crypto");
    const expectedHash = crypto.createHmac("sha256", secret).update(input.recommendationId).digest("hex");
    if (input.zero_trust_token !== expectedHash) {
      return { error: "ZERO_TRUST_VIOLATION", hint: "Invalid zero_trust_token cryptographic signature." };
    }

    ctx.logger.info("Action Agent rejecting recommendation", {
      recommendationId: input.recommendationId,
    });
    const result = this.twin.approveAction(input.recommendationId, false);
    if (!result.found) {
      throw new Error(`Recommendation ${input.recommendationId} not found`);
    }
    return result;
  }

  @Tool({
    name: "approve_action",
    description: "Legacy alias for approveRecommendation.",
    inputSchema: z.object({
      recommendationId: z.string(),
      approve: z.boolean().default(true),
      zero_trust_token: z.string().describe("Cryptographic HMAC validation token"),
    }),
  })
  @UseGuards(ZeroTrustGuard)
  async approve_action(
    input: { recommendationId: string; approve?: boolean; zero_trust_token: string },
    ctx: ExecutionContext,
  ) {
    const secret = process.env.ZERO_TRUST_SECRET;
    if (!secret) return { error: "ZERO_TRUST_VIOLATION", hint: "Server missing ZERO_TRUST_SECRET configuration." };
    const crypto = await import("crypto");
    const expectedHash = crypto.createHmac("sha256", secret).update(input.recommendationId).digest("hex");
    if (input.zero_trust_token !== expectedHash) {
      return { error: "ZERO_TRUST_VIOLATION", hint: "Invalid zero_trust_token cryptographic signature." };
    }

    const approve = input.approve ?? true;
    return this.twin.approveAction(input.recommendationId, approve);
  }
}
