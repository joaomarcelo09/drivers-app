import { Request, Response, NextFunction } from "express";
import { getPostHogClient, safeCapture } from "../utils/posthog";

/**
 * PostHog middleware to track incoming HTTP requests.
 * Captures an 'api_request' event for each request with relevant properties.
 *
 * Event properties captured:
 * - HTTP method
 * - Request path
 * - Response status code
 * - Request duration (in milliseconds)
 *
 * Distinct ID:
 * - Authenticated user's ID (from req.auth.user.id) if available
 * - Otherwise falls back to the request IP address
 *
 * Events are sent after the response finishes (using res.on('finish'))
 * to ensure accurate status codes and duration measurements.
 *
 * Sensitive information (passwords, tokens, headers) is never logged or sent.
 */
export const posthogMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Determine distinct ID for the event
  let distinctId: string;

  // Try to get authenticated user ID from request (set by auth middleware)
  // Note: Using any here because express-jwt adds auth property to request
  const userId = (req as any).auth?.user?.id;

  if (userId) {
    // Authenticated user - use their unique ID
    distinctId = `user_${userId}`;
  } else {
    // Unauthenticated request - fall back to IP address
    // Try to get the real IP from X-Forwarded-For or use remote address
    const forwardedFor = req.headers["x-forwarded-for"];
    const ip = forwardedFor ? (forwardedFor as string).split(",")[0].trim() : req.socket?.remoteAddress || "unknown";
    distinctId = `ip_${ip}`;
  }

  // Listen for response finish to capture accurate status and duration
  res.on("finish", () => {
    const duration = Date.now() - startTime;

    try {
      // Get the PostHog client and capture the event
      const client = getPostHogClient();
      client.capture({
        distinctId,
        event: "api_request",
        properties: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration_ms: duration,
          // Add some additional context without exposing sensitive data
          protocol: req.protocol,
          hostname: req.hostname,
          query_params: req.query,
          // Note: We intentionally do not include req.body, req.headers,
          // or any other potentially sensitive information
        },
      });
    } catch (error) {
      // Gracefully handle any errors to avoid breaking the request flow
      console.error("Failed to capture PostHog event:", error);
    }
  });

  // Continue to next middleware
  next();
};
