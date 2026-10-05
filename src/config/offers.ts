import type { CategoryId } from "@/data/menu";

/**
 * ✨ Offers & festival discounts. Edit this list; the site switches each offer on and off by date.
 *
 * - `starts` / `ends` are inclusive dates (YYYY-MM-DD, India time).
 * - `percent` is taken off the cake price (extras like candles stay full price).
 * - Leave out `appliesTo` to cover everything, or limit it to categories or particular cakes.
 * - If two offers fit the same cake, the bigger one wins (they don't stack).
 * - The first active offer with `banner: true` is shown in the strip at the top of every page.
 *
 * The site refreshes itself every hour, so an offer goes live within an hour of its start date.
 */
export type Offer = {
  id: string;
  /** shown in the top strip and at checkout */
  title: string;
  /** short badge on cards, e.g. "Puja special" */
  short: string;
  percent: number;
  starts: string;
  ends: string;
  appliesTo?: { categories?: CategoryId[]; items?: string[] };
  banner?: boolean;
};

export const offers: Offer[] = [
  {
    id: "grand-opening",
    title: "Launching offer: 10% off every cake",
    short: "Opening offer",
    percent: 10,
    starts: "2026-10-01",
    ends: "2026-10-31",
    banner: true,
  },
  {
    id: "durga-puja",
    title: "Durga Puja special: 15% off on every items",
    short: "Puja special",
    percent: 15,
    starts: "2026-10-10",
    ends: "2026-10-21",
    banner: true,
  },
];
