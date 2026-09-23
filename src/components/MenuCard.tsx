"use client";

import { formatINR, type MenuItem } from "@/data/menu";
import { CakeArt } from "./CakeArt";
import { BadgePill, DietMark, PriceTag } from "./ui";

export function MenuCard({
  item,
  sizeIndex,
  onSize,
  onOpen,
}: {
  item: MenuItem;
  sizeIndex: number;
  onSize: (i: number) => void;
  onOpen: () => void;
}) {
  const opt = item.options[sizeIndex] ?? item.options[0];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-surface shadow-soft ring-1 ring-line/60 transition-shadow duration-300 hover:shadow-lift">
      <button
        type="button"
        onClick={onOpen}
        className="tile relative block aspect-[5/4] w-full overflow-hidden rounded-t-[28px] rounded-b-[20px] text-left focus-visible:outline-offset-[-4px]"
        style={{ ["--tint" as string]: item.tint }}
        aria-label={`See details for ${item.name}`}
      >
        <CakeArt
          spec={item.art}
          id={item.id}
          title={item.real}
          className="absolute inset-x-[12%] bottom-[1%] h-[94%] w-[76%] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
        />
        {item.badges && (
          <span className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
            {item.badges.map((b) => (
              <BadgePill key={b} badge={b} />
            ))}
          </span>
        )}
        <PriceTag
          caption={item.options.length > 1 ? opt.label : "just"}
          price={formatINR(opt.price)}
          className="absolute -top-1 right-5 origin-top transition-transform duration-500 group-hover:rotate-[-4deg]"
        />
      </button>

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <p className="flex items-center gap-2 text-[11.5px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          <DietMark diet={item.diet} />
          <span className="truncate">{item.real}</span>
        </p>
        <h3 className="font-display mt-1.5 text-[25px] leading-[1.08] font-semibold tracking-[-0.01em]">
          <button type="button" onClick={onOpen} className="text-left transition-colors hover:text-berry">
            {item.name}
          </button>
        </h3>
        <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-ink-soft">{item.blurb}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {item.options.length > 1 ? (
            <div role="radiogroup" aria-label={`Size for ${item.name}`} className="flex flex-wrap gap-1 rounded-full bg-ground-2 p-1">
              {item.options.map((o, i) => (
                <button
                  key={o.label}
                  type="button"
                  role="radio"
                  aria-checked={i === sizeIndex}
                  onClick={() => onSize(i)}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-extrabold whitespace-nowrap transition-all ${
                    i === sizeIndex ? "bg-surface text-ink shadow-soft" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="rounded-full bg-ground-2 px-3 py-1.5 text-[12.5px] font-extrabold text-ink-soft">
              {opt.label}
              {opt.serves ? ` · serves ${opt.serves}` : ""}
            </span>
          )}
          <button
            type="button"
            onClick={onOpen}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-ground transition-transform group-hover:rotate-[-45deg] hover:scale-105"
            aria-label={`Open ${item.name}`}
          >
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <path d="M3 8h10m0 0L8.5 3.5M13 8l-4.5 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
