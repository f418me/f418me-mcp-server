import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn("SENTRY_DSN environment variable not set, Sentry disabled");
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration({ breadcrumbs: true }),
      Sentry.expressIntegration(),
    ],
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    beforeSend(event, hint) {
      if (process.env.NODE_ENV === "development") {
        console.log("Sentry event:", event);
      }
      return event;
    },
  });

  console.log("Sentry initialized successfully");
}

export { Sentry };