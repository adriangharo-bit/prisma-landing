import { kv } from "@vercel/kv";
import { RaffleResult } from "./types";

const RAFFLE_RESULT_KEY = "prisma:raffle:result";
const RAFFLE_LOCK_KEY = "prisma:raffle:lock";
const LOCK_TTL_SECONDS = 300;

const kvConfigured = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

// Fallback used only for local development without a real KV store attached.
// Does not persist across serverless invocations — a real KV binding is
// required in production (see checklist: "Habilitar Vercel KV").
const memoryStore = new Map<string, unknown>();
const memoryExpiry = new Map<string, number>();

if (!kvConfigured && process.env.VERCEL) {
  console.warn(
    "[prisma] KV_REST_API_URL/KV_REST_API_TOKEN are not set on Vercel — " +
      "raffle results and rate limiting will not persist across invocations. " +
      "Connect Vercel KV before running the raffle for real."
  );
}

export async function getRaffleResult(): Promise<RaffleResult | null> {
  if (kvConfigured) {
    const result = await kv.get<RaffleResult>(RAFFLE_RESULT_KEY);
    return result ?? null;
  }
  return (memoryStore.get(RAFFLE_RESULT_KEY) as RaffleResult) ?? null;
}

export async function setRaffleResult(result: RaffleResult): Promise<void> {
  if (kvConfigured) {
    await kv.set(RAFFLE_RESULT_KEY, result);
    return;
  }
  memoryStore.set(RAFFLE_RESULT_KEY, result);
}

// Atomic claim so two concurrent raffle runs can't both pass the
// "already run" check before either persists a result.
export async function claimRaffleLock(): Promise<boolean> {
  if (kvConfigured) {
    const result = await kv.set(RAFFLE_LOCK_KEY, "1", {
      nx: true,
      ex: LOCK_TTL_SECONDS,
    });
    return result !== null;
  }

  const now = Date.now();
  const expiry = memoryExpiry.get(RAFFLE_LOCK_KEY);
  if (expiry && expiry > now) return false;
  memoryStore.set(RAFFLE_LOCK_KEY, "1");
  memoryExpiry.set(RAFFLE_LOCK_KEY, now + LOCK_TTL_SECONDS * 1000);
  return true;
}

export async function releaseRaffleLock(): Promise<void> {
  if (kvConfigured) {
    await kv.del(RAFFLE_LOCK_KEY);
    return;
  }
  memoryStore.delete(RAFFLE_LOCK_KEY);
  memoryExpiry.delete(RAFFLE_LOCK_KEY);
}

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

export async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `prisma:ratelimit:register:${ip}`;

  if (kvConfigured) {
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    }
    return count <= RATE_LIMIT_MAX;
  }

  const now = Date.now();
  const expiry = memoryExpiry.get(key);
  if (!expiry || expiry < now) {
    memoryStore.set(key, 1);
    memoryExpiry.set(key, now + RATE_LIMIT_WINDOW_SECONDS * 1000);
    return true;
  }
  const count = ((memoryStore.get(key) as number) ?? 0) + 1;
  memoryStore.set(key, count);
  return count <= RATE_LIMIT_MAX;
}
