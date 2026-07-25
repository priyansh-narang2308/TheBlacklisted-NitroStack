import { McpApp, Module, ConfigModule } from "@nitrostack/core";
import { ProtocolZeroModule } from "./modules/protocol-zero.module.js";
import { SystemHealthCheck } from "./health/system.health.js";

@McpApp({
  module: AppModule,
  server: {
    name: "ai-workplace-protocol-zero",
    version: "1.0.0",
  },
  logging: {
    level: "info",
  },
})
@Module({
  name: "app",
  description: "Root application module",
  imports: [ConfigModule.forRoot(), ProtocolZeroModule],
  providers: [
    SystemHealthCheck,
  ],
})
export class AppModule {}
