// Simple in-memory rate limiter
// For production, consider using Redis or similar distributed cache

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetInMs: number
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  // No existing entry or entry expired
  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetInMs: config.windowMs,
    }
  }

  // Entry exists and not expired
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetInMs: entry.resetTime - now,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetInMs: entry.resetTime - now,
  }
}

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Pre-configured rate limiters
export const ES_GENERATION_LIMIT: RateLimitConfig = {
  maxRequests: 10, // 10 requests
  windowMs: 60 * 1000, // per minute
}

export const INTERVIEW_TURN_LIMIT: RateLimitConfig = {
  maxRequests: 30, // 30 messages
  windowMs: 60 * 1000, // per minute
}

export class RateLimitError extends Error {
  public resetInMs: number

  constructor(resetInMs: number) {
    super(`Rate limit exceeded. Try again in ${Math.ceil(resetInMs / 1000)} seconds.`)
    this.name = 'RateLimitError'
    this.resetInMs = resetInMs
  }
}
