/**
 * In-memory token bucket rate limiter for sensitive public endpoints (AI Chat, Auth)
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000),
  };
}
