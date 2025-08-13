# f418.me MCP Server

A [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/mcp) server that enables AI agents to interact with paid tools and services using Bitcoin Lightning payments.

## Overview

This server bridges AI agents with paid services through Bitcoin Lightning micropayments, allowing secure and instant payment processing for various tools and APIs.

## Built On

This server leverages proven Bitcoin Lightning infrastructure:

- **[Alby Bitcoin Payments MCP Server](https://github.com/getAlby/mcp)** - Core Lightning wallet integration via Nostr Wallet Connect (NWC)
- **[PaidMCP Boilerplate](https://github.com/getAlby/paidmcp-boilerplate)** - Template for creating payment-enabled tools

## Available Tools

### SMS Tool (Paid)

Send SMS messages via Twilio with Lightning payment integration.

- **Cost:** Configurable (default: 79 sats)
- **Provider:** Twilio
- **Source:** Based on [YiyangLi/sms-mcp-server](https://github.com/YiyangLi/sms-mcp-server)

## Connecting to the f418.me MCP Server

If your agent supports remote MCP servers - HTTP Streamable transports or SSE (e.g., N8N, Goose, Claude), you can connect to f418.me's MCP server:

- HTTP Streamable: `https://f418me-mcp-server.fly.dev/mcp`
- SSE (Deprecated): `https://f418me-mcp-server.fly.dev/sse`

The server is hosted on Fly.io and available for public use. It supports the Model Context Protocol and enables AI agents to interact with paid tools.

> You need to install the [Alby MCP server](https://github.com/getAlby/mcp) to handle the payment requests automatically. The Alby MCP server will handle the Nostr Wallet Connect (NWC) connection and payment processing.


## Getting Started Locally

This section provides instructions for setting up the f418.me MCP server locally for development and testing.

### Prerequisites

- Node.js 20+
- Yarn
- A connection string from a Lightning wallet that supports NWC (e.g., from [Alby Hub](https://albyhub.com))

### Installation

1.  Install dependencies:
    ```bash
    yarn install
    ```
2.  Set up your environment variables by copying `.env.example` to `.env` and adding your NWC connection string and any other required secrets (like Twilio credentials):

    ```env
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


### Configure in Your AI Environment

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

## Using Kiro with Alby NWC and the Public f418.me Server

To use the f418.me MCP server with Alby NWC and the public f418.me server, you need to configure your AI agent to connect to these services. [Kiro](https://kiro.dev) provides a convenient way to set up these connections using the `mcp.json` file.

Here we set up the Alby NWC server for handling Lightning payments, the public f418.me server, and an optional memory tool server:

```json
{
  "mcpServers": {
    "nwc": {
      "command": "npx",
      "args": ["-y", "@getalby/mcp"],
      "env": {
        "NWC_CONNECTION_STRING": "nostr+walletconnect://..."
      }
    },
    "f418-remote-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://f418me-mcp-server.fly.dev/mcp",
        "--transport",
        "sse"
      ],
      "disabled": false
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

Replace the `NWC_CONNECTION_STRING` value with your own Lightning wallet connection string.

## Requirements

- Node.js 20+
- Lightning wallet with NWC support (e.g., [Alby Hub](https://albyhub.com))
- Twilio account (for SMS functionality)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/f418me/f418me-mcp-server/issues) page.
