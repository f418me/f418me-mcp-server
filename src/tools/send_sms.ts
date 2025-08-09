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

  // Get SMS cost from environment variable, default to 79 sats
  const SMS_COST_SATS = parseInt(process.env.SMS_COST_SATS || "79");

  // Initialize Twilio client
  const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

  server.registerPaidTool(
    "send_sms",
    {
      title: "Send SMS",
      description: `Send an SMS message for ${SMS_COST_SATS} sats`,
      inputSchema: {
        to: z.string().describe("Recipient phone number (e.g., +11234567890 or +41 79 675 46 90)"),
        message: z.string().describe("Message content to send")
      },
      outputSchema: {
        sid: z.string().describe("The message SID"),
      },
    },
    (params) =>
      Promise.resolve({
        satoshi: SMS_COST_SATS,
        description: "An SMS to be sent",
      }),
    async (params) => {
      const { to, message } = params;
      try {
        // Validate and normalize phone number format
        if (!to.startsWith("+")) {
          return {
            content: [{
              type: "text",
              text: "Error: Phone number must start with + (e.g., +11234567890 or +41 79 675 46 90)"
            }],
            isError: true
          };
        }

        // Convert phone number to E.164 format by removing spaces and other formatting
        const normalizedTo = to.replace(/\s+/g, "").replace(/[^\+\d]/g, "");

        // Send message via Twilio
        const response = await client.messages.create({
          body: message,
          from: process.env.FROM_NUMBER,
          to: normalizedTo
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
