"use client";

import { useState } from "react";
import {
  egglessExtra,
  flavourExtra,
  flavours,
  formatINR,
  getCategory,
  leadDaysFor,
  optionsFor,
  unitPrice,
  type MenuItem,
} from "@/data/menu";
import { box, useBox } from "@/lib/box-store";
import { boxUI } from "@/lib/box-ui";
import { discounted, offerFor } from "@/lib/offers";
import { useActiveOffers } from "@/lib/offers-context";
import { noticeLabel } from "@/lib/schedule";
import { useUnit } from "@/lib/unit-store";
import { UnitToggle } from "./UnitToggle";
import { Stepper } from "./box/BoxDrawer";
import { BoxIcon, CheckIcon, ClockIcon, DietMark, SparkIcon, btn } from "./ui";

const MAX_MESSAGE = 25;

export function PurchasePanel({ item }: { item: MenuItem }) {
  const cat = getCategory(item.category);
  const unitPref = useUnit();
  const unit = item.weight ? unitPref : "lb";
  const options = optionsFor(item, unit);
  const [sizeRaw, setSize] = useState(0);
  const size = Math.min(sizeRaw, options.length - 1);
  const [flavour, setFlavour] = useState<string>(item.defaultFlavour ?? "vanilla");
  const [eggless, setEggless] = useState(false);
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(1);
  const [addedSig, setAddedSig] = useState<string | null>(null);
  const { lines } = useBox();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const offer = offerFor(item, useActiveOffers());

  const option = options[size];
  const opts = { eggless, flavour: item.flavours ? flavour : undefined };
  const full = unitPrice(item, unit, size, opts);
  const each = discounted(full, offer);
  const total = each * qty;
  const extra = egglessExtra(item, option);
  const lead = leadDaysFor(item);

  const sig = `${unit}|${size}|${flavour}|${eggless}|${message.trim()}|${qty}`;
  const added = addedSig === sig;

  const add = () => {
    box.add(
      {
        id: item.id,
        unit,
        sizeIndex: size,
        flavour: opts.flavour,
        eggless: item.diet === "egg" && eggless,
        message: cat.allowMessage ? message : "",
      },
      qty,
    );
    boxUI.bump();
    setAddedSig(sig);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1" aria-live="polite">
        <p className="text-[28px] font-semibold tabular-nums">{formatINR(total)}</p>
        {offer && <p className="text-[17px] text-muted line-through tabular-nums">{formatINR(full * qty)}</p>}
        {qty > 1 && <p className="text-[15px] text-muted">({qty} × {formatINR(each)})</p>}
      </div>
      {offer && (
        <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[13px] font-semibold text-accent">
          <SparkIcon className="size-3.5" /> {offer.short}: {offer.percent}% off
        </p>
      )}

      {/* size */}
      {options.length > 1 && (
        <fieldset className="mt-8">
          <legend className="mb-3 flex w-full items-center justify-between gap-3 text-[14px] font-semibold">
            <span>
              Size {option.serves && <span className="ml-1.5 font-normal text-muted">serves {option.serves}</span>}
            </span>
            {item.weight && <UnitToggle />}
          </legend>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-2.5">
            {options.map((o, i) => {
              const on = i === size;
              return (
                <label
                  key={o.label}
                  className={`cursor-pointer rounded-2xl px-4 py-3.5 text-center transition ${on ? "bg-paper ring-2 ring-ink" : "bg-paper/60 ring-1 ring-line hover:ring-blush-2"}`}
                >
                  <input type="radio" name="size" className="sr-only" checked={on} onChange={() => setSize(i)} id={`size-${i}`} />
                  <span className="block text-[15px] font-semibold">{o.label}</span>
                  <span className="mt-0.5 block text-[13px] text-muted tabular-nums">{formatINR(discounted(unitPrice(item, unit, i, opts), offer))}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      {options.length === 1 && option.serves && <p className="mt-3 text-[14px] text-muted">{option.label} · serves {option.serves}</p>}

      {/* flavour */}
      {item.flavours && (
        <fieldset className="mt-7">
          <legend className="mb-3 text-[14px] font-semibold">Flavour</legend>
          <div className="flex flex-wrap gap-2">
            {flavours.map((f) => {
              const on = f.id === flavour;
              const plus = flavourExtra(option, f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFlavour(f.id)}
                  className={`rounded-full px-3.5 py-2 text-[14px] transition ${on ? "bg-ink text-ground" : "bg-paper ring-1 ring-line hover:ring-blush-2"}`}
                >
                  {f.name}
                  {plus > 0 && <span className={`ml-1 text-[12px] ${on ? "opacity-75" : "text-muted"}`}>+{formatINR(plus)}</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* eggless */}
      <div className="mt-7 flex items-center gap-3 rounded-2xl bg-blush/70 px-4 py-3.5">
        <DietMark diet={item.diet === "eggless" || eggless ? "eggless" : "egg"} />
        {item.diet === "eggless" ? (
          <p className="text-[14.5px]">
            <span className="font-semibold">Eggless</span> <span className="text-muted">as standard, no extra cost</span>
          </p>
        ) : (
          <label className="flex flex-1 cursor-pointer items-center justify-between gap-3 text-[14.5px]">
            <span>
              <span className="font-semibold">Make it eggless</span> <span className="text-muted">+{formatINR(extra)}</span>
            </span>
            <input type="checkbox" id="eggless" checked={eggless} onChange={(e) => setEggless(e.target.checked)} className="peer sr-only" />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-veg peer-focus-visible:outline-2 peer-focus-visible:outline-accent after:absolute after:top-0.75 after:left-0.75 after:size-4.5 after:rounded-full after:bg-paper after:shadow after:transition-all peer-checked:after:left-5.75" />
          </label>
        )}
      </div>

      {/* message */}
      {cat.allowMessage && (
        <div className="mt-7">
          <div className="mb-2 flex items-baseline justify-between text-[14px]">
            <label htmlFor="message" className="font-semibold text-ink">
              Message on the cake
            </label>
            <span className="text-[12.5px] text-muted tabular-nums">
              {message.length}/{MAX_MESSAGE} · Free
            </span>
          </div>
          <input
            id="message"
            value={message}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Happy birthday, Riya!"
            className="w-full rounded-xl bg-paper px-4 py-3 text-[15px] ring-1 ring-line outline-none placeholder:text-muted/50 focus:ring-2 focus:ring-accent"
          />
          <p className="mt-2 text-[12.5px] text-muted">Piped by hand in icing, exactly as you type it. Names and numbers welcome.</p>
        </div>
      )}

      <p className="mt-7 flex items-center gap-2 text-[14px] text-muted">
        <ClockIcon className="size-4.5 shrink-0 text-ink" />
        {lead === 0 ? `Ready the same day with ${noticeLabel(0)}.` : lead === 1 ? "Order by the night before." : `Order ${lead} days ahead.`} You&rsquo;ll pick the day and time at checkout.
      </p>

      {/* add: sticks to the bottom on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ground/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] backdrop-blur md:static md:z-auto md:mt-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <div className="flex items-center gap-3">
          <Stepper value={qty} onChange={(q) => setQty(Math.max(1, q))} label={item.name} />
          <button type="button" onClick={add} className={`${btn.primary} flex-1`}>
            {added ? <CheckIcon className="size-4.5" /> : null}
            {added ? "Added · add another" : `Add to box · ${formatINR(total)}`}
          </button>
        </div>
        {addedSig !== null && count > 0 && (
          <button type="button" onClick={boxUI.open} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[15px] font-semibold ring-1 ring-ink">
            <BoxIcon className="size-4.5" /> View box &amp; choose a time ({count})
          </button>
        )}
      </div>
    </div>
  );
}
