#!/usr/bin/env node
import { initSentry } from "./sentry.js";
import "websocket-polyfill";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

import dotenv from "dotenv";
import express from "express";
import { createMcpServer } from "./mcp_server.js";
import { addSSEEndpoints } from "./sse.js";
import { addStreamableHttpEndpoints } from "./streamable_http.js";
import { Sentry } from "./sentry.js";

// Load environment variables from .env file
dotenv.config({
  quiet: true,
});

// Initialize Sentry as early as possible
initSentry();

class NWCServer {
  async runSTDIO() {
    try {
      const transport = new StdioServerTransport();
      const server = createMcpServer();
      await server.connect(transport);
      // console.log("Server running in STDIO mode");
    } catch (error) {
      Sentry.captureException(error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to connect to NWC wallet: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async runHTTP() {
    try {
      const app = express();

      addSSEEndpoints(app);
      addStreamableHttpEndpoints(app);

      // Global error handler
      app.use((error: Error, req: any, res: any, next: any) => {
        console.error("Unhandled error:", error);
        Sentry.captureException(error);
        res.status(500).json({ error: "Internal Server Error" });
      });

      const port = parseInt(process.env.PORT || "3000");
      app.listen(port);
      console.log("Server running in HTTP mode on port", port);
    } catch (error) {
      console.error("Failed to start HTTP server:", error);
      Sentry.captureException(error);
      throw error;
    }
  }
}

// Global process error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
  Sentry.captureException(reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  Sentry.captureException(error);
  process.exit(1);
});

switch (process.env.MODE || "STDIO") {
  case "HTTP":
    new NWCServer().runHTTP().catch((error) => {
      console.error("HTTP server error:", error);
      Sentry.captureException(error);
    });
    break;
  case "STDIO":
    new NWCServer().runSTDIO().catch((error) => {
      console.error("STDIO server error:", error);
      Sentry.captureException(error);
    });
    break;
  default:
    const transportError = new Error("Unknown transport: " + process.env.MCP_TRANSPORT);
    console.error(transportError.message);
    Sentry.captureException(transportError);
}
