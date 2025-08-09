# f418.me Paid MCP Server

This is a [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/mcp) server that enables AI agents to interact with paid tools and services using Bitcoin Lightning payments.

## Core Technology

This server is built upon the following foundational projects from Alby:

- **[Alby Bitcoin Payments MCP Server (getAlby/mcp)](https://github.com/getAlby/mcp):** This is the core component that connects a Bitcoin Lightning wallet to a Large Language Model (LLM) using Nostr Wallet Connect (NWC). It allows the AI agent to send and receive Lightning payments.

- **[PaidMCP Boilerplate (getAlby/paidmcp-boilerplate)](https://github.com/getAlby/paidmcp-boilerplate):** This serves as the basis for the paid tools integrated into this server. It provides a template for creating tools that require a payment to be used.

## Tools

This MCP server includes several tools:

### Paid SMS Tool

This tool allows the AI agent to send SMS messages via Twilio. It is a paid tool, and the cost of sending an SMS is covered by a Lightning payment.

- **Source:** The implementation is based on [YiyangLi/sms-mcp-server](https://github.com/YiyangLi/sms-mcp-server).

#### SMS Tool Setup

To use the SMS tool, you need a Twilio account.

1.  Copy the `.env.example` file to `.env`.
2.  Add your Twilio credentials to the `.env` file:
    ```
    TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_AUTH_TOKEN=your_auth_token
    TWILIO_FROM_NUMBER=+15017122661
    ```

### Other Tools

- `get_weather`: A paid tool to fetch the weather for a given city.
- `get_food_delivery_menu`: A free tool that returns a menu of food items.
- `order_food_delivery`: A paid tool to order items from the food delivery menu.

## Getting Started

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
    ```
3.  Build the server:
    ```bash
    yarn build
    ```

## Deployment with Goose

You can deploy this server using Goose.

1.  **Login to Goose:**
    ```bash
    goose login
    ```
2.  **Launch the app:**
    ```bash
    goose launch
    ```
This will deploy the MCP server. You will be prompted to set secrets like `NWC_CONNECTION_STRING` during the deployment process.

## Local Development

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

> It is also recommended to install the [Alby MCP server](https://github.com/getAlby/mcp) to handle the payment requests.

### Inspect the tools

You can test the tools without an LLM by running:

```bash
yarn inspect
```

## Troubleshooting

- **Model Usage:** Ensure you are using a capable model (e.g., Claude 3.5 Sonnet, Gemini 1.5, or GPT-4) for the MCP server to function correctly.
- **Contact Alby Support:** For issues related to Lightning payments or NWC, visit [support.getalby.com](https://support.getalby.com).