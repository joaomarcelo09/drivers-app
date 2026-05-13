import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

/**
 * Initialize PostHog client with the provided API key.
 * Uses https://app.posthog.com as the default host unless configured otherwise.
 *
 * @param apiKey - PostHog project API key
 * @param host - Optional PostHog host (defaults to https://app.posthog.com)
 * @returns Initialized PostHog client
 */
export const initializePostHog = (apiKey: string, host?: string): PostHog => {
  if (posthogClient) {
    return posthogClient;
  }

  posthogClient = new PostHog(apiKey, {
    host: host || "https://app.posthog.com",
    flushAt: 1,
    flushInterval: 1000,
  });

  return posthogClient;
};

/**
 * Get the PostHog client instance.
 * Throws an error if the client has not been initialized.
 *
 * @returns PostHog client instance
 * @throws {Error} If PostHog client is not initialized
 */
export const getPostHogClient = (): PostHog => {
  if (!posthogClient) {
    throw new Error("PostHog client has not been initialized. Call initializePostHog first.");
  }
  return posthogClient;
};

/**
 * Shutdown PostHog client and flush pending events.
 * Should be called on application exit.
 *
 * @returns Promise that resolves when shutdown is complete
 */
export const shutdownPostHog = async (): Promise<void> => {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
};

/**
 * Safely capture an event without throwing errors.
 * Logs errors to console but does not propagate them.
 *
 * @param distinctId - User identifier
 * @param eventName - Event name
 * @param properties - Event properties
 */
export const safeCapture = (distinctId: string, eventName: string, properties?: Record<string, any>): void => {
  try {
    const client = getPostHogClient();
    client.capture({
      distinctId,
      event: eventName,
      properties,
    });
  } catch (error) {
    console.error("Failed to capture PostHog event:", error);
  }
};
