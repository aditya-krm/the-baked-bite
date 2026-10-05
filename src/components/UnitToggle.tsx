"use client";

import { getItem } from "@/data/menu";
import { discounted, offerFor } from "@/lib/offers";
import { useActiveOffers } from "@/lib/offers-context";
import { setUnit, useUnit } from "@/lib/unit-store";

/** Segmented lb / kg switch. Every price on the site follows it. */
export function UnitToggle({ className = "" }: { className?: string }) {
  const unit = useUnit();
  return (
    <div role="radiogroup" aria-label="Weight unit" className={`inline-flex rounded-full bg-blush p-1 text-[13px] font-semibold ${className}`}>
      {(["lb", "kg"] as const).map((u) => (
        <button
          key={u}
          type="button"
          role="radio"
          aria-checked={unit === u}
          onClick={() => setUnit(u)}
          className={`rounded-full px-3.5 py-1.5 transition-colors ${unit === u ? "bg-paper text-ink shadow-soft" : "text-muted hover:text-ink"}`}
        >
          {u === "lb" ? "Pound" : "Kilo"}
        </button>
      ))}
    </div>
  );
}

/** "₹349 / lb" or "from ₹149", with any running offer applied. Client-side so it follows the toggle. */
export function FromPrice({
  itemId,
  perUnit,
  prices,
  multi,
  className = "",
}: {
  itemId: string;
  perUnit: boolean;
  prices: { lb: number; kg: number };
  multi: boolean;
  className?: string;
}) {
  const unit = useUnit();
  const offerIds = useActiveOffers();
  const item = getItem(itemId);
  const offer = item ? offerFor(item, offerIds) : undefined;
  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  return (
    <span className={className}>
      {multi && <span className="text-[12px]">from </span>}
      {offer && <span className="mr-1 text-[12.5px] line-through">{fmt(prices[unit])}</span>}
      <span className={`font-semibold ${offer ? "text-accent" : "text-ink"}`}>{fmt(discounted(prices[unit], offer))}</span>
      {perUnit && <span className="text-[12px]"> / {unit}</span>}
    </span>
  );
}

/** "10% off" pill on a card's photo while an offer runs. */
export function OfferBadge({ itemId, className = "" }: { itemId: string; className?: string }) {
  const offerIds = useActiveOffers();
  const item = getItem(itemId);
  const offer = item ? offerFor(item, offerIds) : undefined;
  if (!offer) return null;
  return (
    <span className={`rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold tracking-wide text-accent-ink ${className}`}>
      {offer.percent}% off
    </span>
  );
}
