"use client";

import { usePathname } from "next/navigation";
import { formatINR } from "@/data/menu";
import { useBox } from "@/lib/box-store";
import { boxUI, useBoxUI } from "@/lib/box-ui";
import { useActiveOffers } from "@/lib/offers-context";
import { priceBox } from "@/lib/order";
import { BoxIcon } from "../ui";

/** Mobile-only bar that keeps the box one thumb-tap away. */
export function BoxBar() {
  const path = usePathname();
  const { lines, extras } = useBox();
  const { open, bump } = useBoxUI();
  const offerIds = useActiveOffers();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  // cake pages have their own sticky "Add to box" bar
  if (!count || open || path.startsWith("/cakes/")) return null;
  const { subtotal } = priceBox(lines, extras, offerIds);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:hidden">
      <button
        key={bump}
        type="button"
        onClick={boxUI.open}
        className={`flex w-full items-center gap-3 rounded-full bg-ink py-3 pr-3 pl-5 text-ground shadow-lift ${bump ? "animate-bump" : ""}`}
      >
        <BoxIcon className="size-5" />
        <span className="text-[15px] font-semibold">
          Your box · {count} item{count === 1 ? "" : "s"}
        </span>
        <span className="ml-auto rounded-full bg-ground/15 px-3.5 py-1.5 text-[14px] font-semibold tabular-nums">{formatINR(subtotal)} →</span>
      </button>
    </div>
  );
}
