/**
 * Rate Limiting Utility
 * 
 * Provides rate limiting for admin API routes using @upstash/ratelimit for production
 * with Redis, and an in-memory fallback for development.
 */

// In-memory rate limiting fallback for development
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const requestCounts = new Map<string, RateLimitRecord>();

/**
 * Simple in-memory rate limiter for development
 */
function inMemoryRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 10000
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  // Clean up old records periodically
  if (requestCounts.size > 1000) {
    const expiredKeys: string[] = [];
    requestCounts.forEach((value, key) => {
      if (now > value.resetTime) {
        expiredKeys.push(key);
      }
    });
    expiredKeys.forEach(key => requestCounts.delete(key));
  }

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    requestCounts.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: resetTime,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count++;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    reset: record.resetTime,
  };
}

/**
 * Initialize Upstash rate limiter (production)
 */
let upstashRatelimit: any = null;
let useUpstash = false;

try {
  // Only load Upstash if environment variables are set
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Dynamic import to avoid errors when @upstash packages are not installed
    const initUpstash = async () => {
      try {
        const { Ratelimit } = await import('@upstash/ratelimit');
        const { Redis } = await import('@upstash/redis');
        
        upstashRatelimit = new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
          analytics: true,
          prefix: '@ratelimit/admin',
        });
        useUpstash = true;
        console.log('✅ Upstash rate limiting initialized');
      } catch (error) {
        console.warn('⚠️ Failed to initialize Upstash rate limiting, falling back to in-memory:', error);
        useUpstash = false;
      }
    };
    
    // Initialize asynchronously (non-blocking)
    initUpstash().catch(() => {
      console.warn('⚠️ Upstash initialization failed, using in-memory rate limiting');
    });
  } else {
    console.log('ℹ️ Upstash environment variables not set, using in-memory rate limiting');
  }
} catch (error) {
  console.warn('⚠️ Rate limiting setup error, using in-memory fallback:', error);
}

/**
 * Check rate limit for a given identifier
 * 
 * @param identifier - Unique identifier for rate limiting (e.g., user ID or IP address)
 * @returns Promise resolving to an object with the following properties:
 *   - success: boolean - false when the rate limit is exceeded, true otherwise
 *   - limit: number - maximum number of requests allowed in the time window
 *   - remaining: number - number of requests remaining in the current window
 *   - reset: number - timestamp (in milliseconds) when the rate limit window resets
 * @note Rate limiting is currently disabled for development/college project purposes
 */
export async function checkRateLimit(
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  // Rate limiting disabled - always allow requests
  return {
    success: true,
    limit: 999999,
    remaining: 999999,
    reset: Date.now() + 3600000, // 1 hour from now
  };
}

/**
 * Get a stable identifier for rate limiting from a request
 * Prefers authenticated user ID, falls back to IP address
 * 
 * @param request - The incoming request
 * @param userId - Optional authenticated user ID
 * @returns A stable identifier for rate limiting
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `admin_user_${userId}`;
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `admin_ip_${ip}`;
}

