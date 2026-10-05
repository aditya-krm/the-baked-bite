/** Best-effort spam guard: a per-IP limit kept in memory (resets on redeploy, which is fine for a small shop). */
const hits = new Map<string, number[]>();

export function tooMany(req: Request, limit = 6, windowMs = 10 * 60_000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

/** Without Telegram credentials, development "sends" succeed and are logged to the terminal. */
export const demoAllowed = () => process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_ORDERS === "1";
