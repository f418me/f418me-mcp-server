# f418.me Paid MCP Server

This is a [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/mcp) server that enables AI agents to interact with paid tools and services using Bitcoin Lightning payments.

## Core Technology

This server is built upon the following foundational projects from Alby:

- **[Alby Bitcoin Payments MCP Server (getAlby/mcp)](https://github.com/getAlby/mcp):** This is the core component that connects a Bitcoin Lightning wallet to a Large Language Model (LLM) using Nostr Wallet Connect (NWC). It allows the AI agent to send and receive Lightning payments.

- **[PaidMCP Boilerplate (getAlby/paidmcp-boilerplate)](https://github.com/getAlby/paidmcp-boilerplate):** This serves as the basis for the paid tools integrated into this server. It provides a template for creating tools that require a payment to be used.

## Tools

This MCP server includes currently the following tool:

### Paid SMS Tool

The sms tool allows the AI agent to send SMS messages via Twilio. It is a paid tool, and the cost of sending an SMS is covered by a Lightning payment.

- **Source:** The implementation is based on [YiyangLi/sms-mcp-server](https://github.com/YiyangLi/sms-mcp-server).

## Connecting to the f418.me MCP Server

If your agent supports remote MCP servers - HTTP Streamable transports or SSE (e.g. N8N, Goose, Claude), you can connect to f418me's MCP server:

- HTTP Streamable: `https://f418me-mcp-server.fly.dev/mcp`
- SSE (Deprecated): `https://f418me-mcp-server.fly.dev/sse`

That server is hosted on Fly.io and is available for public use. It supports the Model Context Protocol and allows AI agents to interact with paid tools.

> You need to install the [Alby MCP server](https://github.com/getAlby/mcp) to handle the payment requests automatically. The Alby MCP server will handle the Nostr Wallet Connect (NWC) connection and payment processing.


## Getting Started locally
This section provides instructions for setting up the f418.me MCP server locally for development and testing.

### Prerequisites

- Node.js 20+
- Yarn
- A connection string from a lightning wallet that supports NWC (e.g., from [Alby Hub](https://albyhub.com)).

### Installation

1.  Install dependencies:
    ```bash
    yarn install
    ```
2.  Set up your environment variables by copying `.env.example` to `.env` and adding your NWC connection string and any other required secrets (like Twilio credentials).

    ```
    NWC_CONNECTION_STRING="nostr+walletconnect://..."
    ACCOUNT_SID=
    AUTH_TOKEN=
    FROM_NUMBER=
    SMS_COST_SATS=79
    ```
3.  Build the server:
    ```bash
    yarn build
    ```


### Configure in your AI environment

To use this server locally with your AI agent, you need to add it to your MCP server list. For example, in your `mcp_config.json`:

```json
{
  "mcpServers": {
    "my_paid_mcp_server": {
      "command": "node",
      "args": ["/path/to/your/f418me-mcp-server/build/index.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "disabled": false
    }
  }
}
```
