import { MemoryStorage, PaidMcpServer } from "@getalby/paidmcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSendSmsTool } from "./tools/send_sms.js";
import { Sentry } from "./sentry.js";

const storage = new MemoryStorage();

export function createMcpServer(): McpServer {
  try {
    if (!process.env.NWC_CONNECTION_STRING) {
      const error = new Error("No NWC URL set");
      Sentry.captureException(error);
      throw error;
    }

    const server = new PaidMcpServer(
      {
        name: "@f418.me/sms-paid-mcp-server",
        version: "1.0.0",
        title: "SMS Paid MCP Server",
      },
      { nwcUrl: process.env.NWC_CONNECTION_STRING, storage }
    );

    registerSendSmsTool(server);

    return server;
  } catch (error) {
    console.error("Failed to create MCP server:", error);
    Sentry.captureException(error);
    throw error;
  }
}
