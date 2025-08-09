import { z } from "zod";
import { PaidMcpServer } from "@getalby/paidmcp";
import twilio from "twilio";

export function registerSendSmsTool(server: PaidMcpServer) {
  // Environment variables validation
  const requiredEnvVars = ["ACCOUNT_SID", "AUTH_TOKEN", "FROM_NUMBER"];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Error: ${envVar} environment variable is required`);
      process.exit(1);
    }
  }

  // Initialize Twilio client
  const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

  server.registerPaidTool(
    "send_sms",
    {
      title: "Send SMS",
      description: "Send an SMS message for 25 sats",
      inputSchema: {
        to: z.string().describe("Recipient phone number in E.164 format (e.g., +11234567890)"),
        message: z.string().describe("Message content to send")
      },
      outputSchema: {
        sid: z.string().describe("The message SID"),
      },
    },
    (params) =>
      Promise.resolve({
        satoshi: 25,
        description: "An SMS to be sent",
      }),
    async (params) => {
      const { to, message } = params;
      try {
        // Validate phone number format
        if (!to.startsWith("+")) {
          return {
            content: [{
              type: "text",
              text: "Error: Phone number must be in E.164 format (e.g., +11234567890)"
            }],
            isError: true
          };
        }

        // Send message via Twilio
        const response = await client.messages.create({
          body: message,
          from: process.env.FROM_NUMBER,
          to: to
        });

        const result = {
          sid: response.sid,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
          structuredContent: result,
        };
      } catch (error) {
        console.error("Error sending message:", error);
        return {
          content: [{
            type: "text",
            text: `Error sending message: ${error instanceof Error ? error.message : "Unknown error"}`
          }],
          isError: true
        };
      }
    }
  );
}
