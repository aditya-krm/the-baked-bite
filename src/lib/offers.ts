import { offers, type Offer } from "@/config/offers";
import type { MenuItem } from "@/data/menu";
import { dayKey, shopNow } from "./schedule";

/** Offers running on the given day (India time). */
export function activeOffers(now = shopNow()): Offer[] {
  const today = dayKey(now);
  return offers.filter((o) => o.starts <= today && today <= o.ends && o.percent > 0);
}
export const activeOfferIds = (now = shopNow()) => activeOffers(now).map((o) => o.id);

/** The best offer for a cake out of the given active offer ids. */
export function offerFor(item: MenuItem, activeIds: readonly string[]): Offer | undefined {
  let best: Offer | undefined;
  for (const o of offers) {
    if (!activeIds.includes(o.id)) continue;
    const a = o.appliesTo;
    const fits = !a || a.items?.includes(item.id) || a.categories?.includes(item.category);
    if (fits && (!best || o.percent > best.percent)) best = o;
  }
  return best;
}

export const discounted = (price: number, offer?: Offer) => (offer ? Math.round(price * (1 - offer.percent / 100)) : price);

export const bannerOffer = (activeIds: readonly string[]) => offers.find((o) => o.banner && activeIds.includes(o.id));
