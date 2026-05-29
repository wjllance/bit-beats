import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";

const LOG_KEY = "flip:request_logs";

let redisClient: Redis | null | undefined;

export interface FlipLogEvent {
  endpoint: string;
  target: string | null;
  referrer: string | null;
  user_agent: string | null;
  ref: string | null;
  ip_hash: string | null;
  created_at: string;
}

interface BuildFlipLogEventOptions {
  endpoint: string;
  target?: string | null;
  now?: Date;
}

export function hashIpAddress(ipAddress: string): string {
  return createHash("sha256")
    .update(`${process.env.LOG_HASH_SALT ?? "btchits"}:${ipAddress}`)
    .digest("hex");
}

export function buildFlipLogEvent(
  request: Request,
  options: BuildFlipLogEventOptions
): FlipLogEvent {
  const url = new URL(request.url);
  const ipAddress = getClientIp(request);

  return {
    endpoint: options.endpoint,
    target: options.target ?? null,
    referrer: request.headers.get("referer"),
    user_agent: request.headers.get("user-agent"),
    ref: url.searchParams.get("ref"),
    ip_hash: ipAddress ? hashIpAddress(ipAddress) : null,
    created_at: (options.now ?? new Date()).toISOString(),
  };
}

export async function logFlipRequest(
  request: Request,
  options: BuildFlipLogEventOptions
): Promise<void> {
  try {
    const redis = getRedisClient();
    if (!redis) {
      return;
    }

    await redis.lpush(LOG_KEY, buildFlipLogEvent(request, options));
    await redis.ltrim(LOG_KEY, 0, 999);
  } catch {
    // Logging must never break public image or data responses.
  }
}

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip");
}

function getRedisClient(): Redis | null {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}
