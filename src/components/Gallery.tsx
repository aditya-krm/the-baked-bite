"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/data/menu";
import { Media, type Slide } from "./Media";
import { ArrowLeft, ArrowRight, CloseIcon } from "./ui";

/** Swipeable photo carousel with thumbnails and a full-screen viewer. */
export function Gallery({ item, slides }: { item: MenuItem; slides: Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const many = slides.length > 1;

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const n = (i + slides.length) % slides.length;
      el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
    },
    [slides.length],
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (zoom === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
      if (e.key === "ArrowRight") setZoom((z) => (z === null ? z : (z + 1) % slides.length));
      if (e.key === "ArrowLeft") setZoom((z) => (z === null ? z : (z - 1 + slides.length) % slides.length));
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, slides.length]);

  return (
    <div className="flex flex-col gap-3">
      <div className="group/g relative">
        <div
          ref={track}
          className="no-scrollbar flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[28px] sm:aspect-square lg:aspect-[4/5]"
          aria-roledescription="carousel"
          aria-label={`${item.name} photos`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
        >
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setZoom(i)}
              className="relative h-full w-full shrink-0 snap-center cursor-zoom-in"
              aria-label={`View image ${i + 1} of ${slides.length} larger`}
            >
              <Media
                item={item}
                slide={s}
                variant="gallery"
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="absolute inset-0"
              />
            </button>
          ))}
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-4 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink opacity-0 shadow-soft backdrop-blur transition-opacity group-hover/g:opacity-100 focus-visible:opacity-100 max-md:hidden"
              aria-label="Previous image"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-4 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink opacity-0 shadow-soft backdrop-blur transition-opacity group-hover/g:opacity-100 focus-visible:opacity-100 max-md:hidden"
              aria-label="Next image"
            >
              <ArrowRight className="size-5" />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden">
              {slides.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-ink/80" : "w-1.5 bg-ink/30"}`} />
              ))}
            </div>
            <span className="absolute top-4 right-4 rounded-full bg-paper/85 px-2.5 py-1 text-[12px] font-semibold tabular-nums backdrop-blur max-md:hidden">
              {index + 1} / {slides.length}
            </span>
          </>
        )}
      </div>

      {many && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto max-md:hidden" role="tablist" aria-label="Choose image">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => go(i)}
              className={`relative size-20 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ${
                i === index ? "ring-2 ring-ink ring-offset-2 ring-offset-ground" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Media item={item} slide={s} variant="thumb" sizes="80px" className="absolute inset-0" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {zoom !== null && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgb(20_12_10/0.86)] p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${item.name}, image ${zoom + 1}`}
          >
            <motion.div
              key={zoom}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square w-full max-w-[min(88vh,900px)] overflow-hidden rounded-[28px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Media item={item} slide={slides[zoom]} variant="zoom" sizes="90vw" className="absolute inset-0" />
            </motion.div>
            <button type="button" className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Close">
              <CloseIcon />
            </button>
            {many && (
              <>
                <button
                  type="button"
                  className="absolute left-4 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom((zoom - 1 + slides.length) % slides.length);
                  }}
                >
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  className="absolute right-4 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom((zoom + 1) % slides.length);
                  }}
                >
                  <ArrowRight />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
