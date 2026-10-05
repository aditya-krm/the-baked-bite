"use client";

import { useSyncExternalStore } from "react";

/**
 * Light by default; visitors can switch to dark and it's remembered.
 * The choice is applied before paint by the small script in app/layout.tsx.
 */
const KEY = "tbb-theme";
const ls = new Set<() => void>();
const read = () => (typeof document !== "undefined" && document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function setTheme(t: "light" | "dark") {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  ls.forEach((l) => l());
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(
    (l) => {
      ls.add(l);
      return () => ls.delete(l);
    },
    read,
    () => "light",
  );
  return (
    <div role="radiogroup" aria-label="Colour theme" className={`inline-flex rounded-full bg-paper/70 p-0.5 text-[12.5px] ring-1 ring-line ${className}`}>
      {(["light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={theme === t}
          onClick={() => setTheme(t)}
          className={`rounded-full px-3 py-1 capitalize transition-colors ${theme === t ? "bg-ink text-ground" : "text-muted hover:text-ink"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** Sun / moon button for the header. */
export function ThemeButton({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(
    (l) => {
      ls.add(l);
      return () => ls.delete(l);
    },
    read,
    () => "light",
  );
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`grid size-10 place-items-center rounded-full transition-colors hover:bg-blush max-md:hover:bg-transparent ${className}`}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" />
        </svg>
      )}
    </button>
  );
}

export const themeScript = `try{if(localStorage.getItem("${KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
