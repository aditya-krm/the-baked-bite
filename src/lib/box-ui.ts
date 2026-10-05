"use client";

import { useSyncExternalStore } from "react";

/** Whether the box drawer is open, plus a counter that ticks on every add (for a little bump animation). */
type UI = { open: boolean; bump: number };
let ui: UI = { open: false, bump: 0 };
const SERVER: UI = { open: false, bump: 0 };
const ls = new Set<() => void>();
const emit = (next: UI) => {
  ui = next;
  ls.forEach((l) => l());
};

export const boxUI = {
  open: () => emit({ ...ui, open: true }),
  close: () => emit({ ...ui, open: false }),
  bump: () => emit({ ...ui, bump: ui.bump + 1 }),
};

export function useBoxUI() {
  return useSyncExternalStore(
    (l) => {
      ls.add(l);
      return () => ls.delete(l);
    },
    () => ui,
    () => SERVER,
  );
}
