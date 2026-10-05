"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, whatsappUrl } from "@/config/site";
import { useBox } from "@/lib/box-store";
import { boxUI, useBoxUI } from "@/lib/box-ui";
import { ThemeButton } from "./ThemeToggle";
import { BoxIcon, CloseIcon, MenuIcon, WhatsAppIcon, Wordmark } from "./ui";

const nav = [
  { href: "/cakes", label: "Cakes" },
  { href: "/custom-cake", label: "Custom cake" },
  { href: "/about", label: "About" },
];

export function Header() {
  const path = usePathname();
  const { lines } = useBox();
  const { bump } = useBoxUI();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const menuOpen = openFor === path; // closes itself on navigation

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line/80 bg-ground/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          className="-ml-2 grid size-10 place-items-center rounded-full md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setOpenFor(menuOpen ? null : path)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link href="/" aria-label={`${site.name}, home`} className="max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2">
          <Wordmark className="h-12 md:h-14" />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-9 md:flex">
          {nav.map((n) => {
            const active = path === n.href || path.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-[15px] transition-colors hover:text-ink ${active ? "text-ink" : "text-muted"}`}
              >
                {n.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-500 ease-soft ${active ? "w-full" : "w-0"}`} />
              </Link>
            );
          })}
        </nav>

        <ThemeButton className="ml-auto max-md:size-9 md:ml-5" />

        <button
          type="button"
          onClick={boxUI.open}
          className="relative -ml-2 flex items-center gap-2 rounded-full py-2 pr-2 pl-3 text-[15px] font-semibold transition-colors hover:bg-blush md:ml-0 md:pr-4"
          aria-label={`Your box, ${count} item${count === 1 ? "" : "s"}`}
        >
          <span key={bump} className={bump ? "animate-bump" : ""}>
            <BoxIcon className="size-5.5" />
          </span>
          <span className="max-md:hidden">Your box</span>
          {count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-ink tabular-nums max-md:absolute max-md:-top-0.5 max-md:right-0">
              {count}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-ground px-4 pt-2 pb-6 md:hidden">
          <nav aria-label="Main" className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...nav].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpenFor(null)}
                className="font-display border-b border-line py-4 text-[26px]"
                aria-current={path === n.href ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <a href={whatsappUrl("Hi! I have a question about a cake.")} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold">
            <WhatsAppIcon className="size-5 text-veg" /> Chat with us on WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
