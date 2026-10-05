import { site } from "@/config/site";

/**
 * Pickup / delivery scheduling, always in the shop's own time zone (IST).
 *
 * How notice works:
 * - `leadDays: 0` (donuts…): same day, needs `site.sameDayHours` of notice, during opening hours.
 * - `leadDays: 1+` (cakes): ready from `site.readyFromHour` on the Nth *open* day after the order's
 *   "baking day". Orders placed after midnight but before opening count as the previous night,
 *   so a 1 am order for a 1-day cake can still be picked up that afternoon.
 */

export type SlotId = (typeof site.slots)[number]["id"];
export type DayStatus = "open" | "closed" | "too-soon";

export type Day = {
  key: string; // YYYY-MM-DD
  weekday: string; // Tue
  dayNum: string; // 14
  month: string; // Oct
  label: string; // Today / Tomorrow / Tue
  status: DayStatus;
  slots: { id: SlotId; label: string; available: boolean }[];
};

const pad = (n: number) => String(n).padStart(2, "0");
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function parseDayKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function prettyDay(key: string) {
  return parseDayKey(key).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/**
 * "Now" as the shop's wall clock: a Date whose local fields read in IST,
 * whatever time zone the browser or server is in.
 */
export function shopNow(at = Date.now()) {
  const localOffset = -new Date(at).getTimezoneOffset(); // minutes east of UTC on this machine
  return new Date(at + (site.utcOffsetMinutes - localOffset) * 60_000);
}

const isClosed = (d: Date) => (site.closedWeekdays as readonly number[]).includes(d.getDay());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const at = (d: Date, hour: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(hour), Math.round((hour % 1) * 60));

/** The earliest moment a box needing `leadDays` of notice can be ready, in shop time. */
export function earliestReady(leadDays: number, now = shopNow()): Date {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const hour = now.getHours() + now.getMinutes() / 60;

  if (leadDays <= 0) {
    // same day: from opening (or now) + a few hours, on an open day
    let day = today;
    let from = Math.max(hour, site.openFrom) + site.sameDayHours;
    while (isClosed(day) || from > site.slots[site.slots.length - 1].start) {
      day = addDays(day, 1);
      from = site.openFrom + site.sameDayHours;
    }
    return at(day, from);
  }

  // the "baking day" an order belongs to: late-night orders count as the previous evening
  let bakingDay = hour < site.openFrom ? addDays(today, -1) : today;
  let counted = 0;
  while (counted < leadDays) {
    bakingDay = addDays(bakingDay, 1);
    if (!isClosed(bakingDay)) counted++;
  }
  return at(bakingDay, site.readyFromHour);
}

/**
 * Every day from today to the end of the booking window: open days with their
 * slots, plus closed and too-soon days so the strip reads like a calendar.
 */
export function bookableDays(leadDays: number, now = shopNow()): Day[] {
  const earliest = earliestReady(leadDays, now).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const out: Day[] = [];
  for (let i = 0; i <= site.bookingWindowDays; i++) {
    const date = addDays(today, i);
    const slots = site.slots.map((s) => ({
      id: s.id,
      label: s.label,
      available: !isClosed(date) && at(date, s.start).getTime() >= earliest,
    }));
    const status: DayStatus = isClosed(date) ? "closed" : slots.some((s) => s.available) ? "open" : "too-soon";
    out.push({
      key: dayKey(date),
      weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNum: String(date.getDate()),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : date.toLocaleDateString("en-IN", { weekday: "short" }),
      status,
      slots,
    });
  }
  return out;
}

/** True when this day + slot can still be booked (used again on the server). */
export function isBookable(leadDays: number, date: string, slot: string, now = shopNow()) {
  const day = bookableDays(leadDays, now).find((d) => d.key === date);
  return Boolean(day?.slots.find((s) => s.id === slot)?.available);
}

export function noticeLabel(leadDays: number) {
  if (leadDays <= 0) return `${site.sameDayHours} hours' notice`;
  if (leadDays === 1) return "ordering by the night before";
  return `${leadDays} days' notice`;
}
