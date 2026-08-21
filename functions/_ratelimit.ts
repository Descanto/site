// Advisory IETF RateLimit headers (draft-ietf-httpapi-ratelimit-headers)
// for the marketing site's own /api/* form endpoints. These endpoints sit
// behind Cloudflare's platform-level abuse protection; the policy below is
// the documented per-client courtesy quota agents should self-throttle to.

export const RATE_LIMIT = { limit: 60, windowSecs: 60 };

/** Headers announcing the quota policy on a successful response. */
export function rateLimitHeaders(remaining = RATE_LIMIT.limit - 1): Record<string, string> {
  return {
    "RateLimit-Policy": `${RATE_LIMIT.limit};w=${RATE_LIMIT.windowSecs}`,
    "RateLimit-Limit": String(RATE_LIMIT.limit),
    "RateLimit-Remaining": String(Math.max(0, remaining)),
    "RateLimit-Reset": String(RATE_LIMIT.windowSecs),
  };
}
