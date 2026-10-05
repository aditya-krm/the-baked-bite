"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./ui";

/**
 * Share a cake: the phone's own share sheet where available (WhatsApp, Instagram…),
 * otherwise a small menu with WhatsApp and Copy link.
 */
export function ShareButton({ title, text, path }: { title: string; text: string; path: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const url = () => `${window.location.origin}${path}`;

  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: url() });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return; // they closed the sheet
      }
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
    } catch {
      window.prompt("Copy this link", url());
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={share}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-semibold ring-1 ring-line transition-colors hover:bg-blush"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5" />
          <path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" />
        </svg>
        Share
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl bg-paper p-1.5 shadow-lift ring-1 ring-line">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${typeof window !== "undefined" ? url() : ""}`)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] hover:bg-blush"
          >
            <WhatsAppIcon className="size-4 text-veg" /> Share on WhatsApp
          </a>
          <button type="button" onClick={copy} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[14px] hover:bg-blush">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
            </svg>
            {copied ? "Link copied ✓" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
