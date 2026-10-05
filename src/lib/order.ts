import { site } from "@/config/site";
import type { Offer } from "@/config/offers";
import {
  extras as extraList,
  formatINR,
  getFlavour,
  leadDaysFor,
  unitPrice,
  getItem,
  optionsFor,
  type MenuItem,
  type SizeOption,
  type Unit,
} from "@/data/menu";
import { discounted, offerFor } from "./offers";
import { prettyDay } from "./schedule";

export type BoxLine = {
  key: string;
  id: string;
  sizeIndex: number;
  /** pounds or kilos: which size list sizeIndex points into */
  unit: Unit;
  flavour?: string;
  eggless: boolean;
  message: string;
  qty: number;
};
export type BoxExtra = { id: string; note?: string };

export type OrderPayload = {
  lines: BoxLine[];
  extras: BoxExtra[];
  customer: { name: string; phone: string };
  fulfilment: { type: "pickup" | "delivery"; address?: string; date: string; slot: string };
  notes?: string;
};

export type PricedLine = {
  line: BoxLine;
  item: MenuItem;
  option: SizeOption;
  /** price of one, before any offer */
  full: number;
  /** price of one, after the offer */
  unit: number;
  total: number;
  offer?: Offer;
  saved: number;
};

export const lineKey = (l: Omit<BoxLine, "key" | "qty">) =>
  [l.id, l.unit, l.sizeIndex, l.flavour ?? "", l.eggless ? "e" : "", l.message.trim().toLowerCase()].join("|");

/**
 * Prices a box from the menu data. Never trusts prices sent by a browser.
 * `offerIds` are the offers running right now (see lib/offers).
 */
export function priceBox(lines: BoxLine[], extras: BoxExtra[], offerIds: readonly string[] = []) {
  const priced: PricedLine[] = [];
  for (const line of lines.slice(0, 30)) {
    const item = getItem(line.id);
    if (!item) continue;
    const lineUnit: Unit = line.unit === "kg" ? "kg" : "lb";
    const option = optionsFor(item, lineUnit)[line.sizeIndex];
    if (!option) continue;
    const eggless = item.diet === "egg" && line.eggless;
    const flavour = item.flavours && getFlavour(line.flavour) ? line.flavour : undefined;
    const full = unitPrice(item, lineUnit, line.sizeIndex, { eggless, flavour });
    const offer = offerFor(item, offerIds);
    const unit = discounted(full, offer);
    const qty = Math.max(1, Math.min(20, Math.floor(line.qty || 1)));
    priced.push({ line: { ...line, unit: lineUnit, flavour, eggless, qty }, item, option, full, unit, total: unit * qty, offer, saved: (full - unit) * qty });
  }
  const pickedExtras = extras
    .map((e) => ({ extra: extraList.find((x) => x.id === e.id), note: e.note?.trim() }))
    .filter((e): e is { extra: (typeof extraList)[number]; note: string | undefined } => Boolean(e.extra));
  const subtotal =
    priced.reduce((s, p) => s + p.total, 0) + pickedExtras.reduce((s, e) => s + e.extra.price, 0);
  const leadDays = Math.max(0, ...priced.map((p) => leadDaysFor(p.item)));
  const savings = priced.reduce((s, p) => s + p.saved, 0);
  return { priced, pickedExtras, subtotal, leadDays, savings };
}

export function newOrderId(prefix = "BB") {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = Math.floor(Math.random() * 36 ** 2).toString(36).toUpperCase().padStart(2, "0");
  return `${prefix}-${t}${r}`;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const slotLabel = (id: string) => site.slots.find((s) => s.id === id)?.label ?? id;

function lineText(p: PricedLine, html: boolean) {
  const e = html ? esc : (s: string) => s;
  const bits = [p.option.label];
  const fl = getFlavour(p.line.flavour);
  if (fl) bits.push(fl.name);
  if (p.item.diet === "eggless") bits.push("eggless");
  else bits.push(p.line.eggless ? "made eggless" : "with egg");
  let out = `• ${p.line.qty} × ${html ? `<b>${e(p.item.name)}</b>` : p.item.name} (${bits.join(", ")}) — ${formatINR(p.total)}`;
  if (p.offer) out += `\n   🏷️ ${e(p.offer.short)}: ${p.offer.percent}% off (was ${formatINR(p.full * p.line.qty)})`;
  if (p.line.message.trim()) out += `\n   ✍️ Message: “${e(p.line.message.trim())}”`;
  return out;
}

/** The order as the baker reads it. `html` = Telegram formatting, otherwise plain text (WhatsApp). */
export function orderText(order: OrderPayload, orderId: string, html = true, offerIds: readonly string[] = []) {
  const e = html ? esc : (s: string) => s;
  const b = (s: string) => (html ? `<b>${s}</b>` : `*${s}*`);
  const { priced, pickedExtras, subtotal, savings } = priceBox(order.lines, order.extras, offerIds);
  const f = order.fulfilment;
  const parts = [
    `🎂 ${b(`New order ${orderId}`)}`,
    "",
    ...priced.map((p) => lineText(p, html)),
    ...pickedExtras.map((x) => `• ${e(x.extra.name)}${x.note ? ` (${e(x.note)})` : ""} — ${formatINR(x.extra.price)}`),
    "",
    `${b("Total")}: ${formatINR(subtotal)}${f.type === "delivery" ? " + delivery" : ""}${savings ? ` (saved ${formatINR(savings)})` : ""}`,
    "",
    `${f.type === "delivery" ? "🛵 Delivery" : "🛍️ Pickup"} · ${prettyDay(f.date)} · ${slotLabel(f.slot)}`,
    ...(f.type === "delivery" && f.address ? [`📍 ${e(f.address)}`] : []),
    `👤 ${e(order.customer.name)} · ${e(order.customer.phone)}`,
    ...(order.notes?.trim() ? [`📝 ${e(order.notes.trim())}`] : []),
  ];
  return parts.join("\n");
}

/** Light validation shared by browser and server. Returns a map of field → problem. */
export function validateOrder(o: OrderPayload) {
  const errors: Record<string, string> = {};
  if (!o.lines?.length) errors.lines = "Your box is empty.";
  if (!o.customer?.name || o.customer.name.trim().length < 2) errors.name = "Please tell us your name.";
  const digits = (o.customer?.phone ?? "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = "Enter a 10-digit mobile number.";
  if (o.fulfilment?.type === "delivery" && (!o.fulfilment.address || o.fulfilment.address.trim().length < 8))
    errors.address = "Add the full delivery address, with a landmark.";
  if (!o.fulfilment?.date) errors.date = "Pick a day.";
  if (!o.fulfilment?.slot) errors.slot = "Pick a time.";
  return errors;
}
