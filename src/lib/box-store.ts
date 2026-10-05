"use client";

import { useSyncExternalStore } from "react";
import { getItem, optionsFor } from "@/data/menu";
import { lineKey, type BoxExtra, type BoxLine } from "./order";

/**
 * The customer's box: a tiny external store persisted to localStorage,
 * so it survives page changes and reloads without any backend.
 */
type BoxState = { lines: BoxLine[]; extras: BoxExtra[] };
const KEY = "tbb-box-v2";
const EMPTY: BoxState = { lines: [], extras: [] };

let state: BoxState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BoxState;
      if (Array.isArray(parsed.lines)) {
        // drop anything that's no longer on the menu (or a size that no longer exists)
        const lines = parsed.lines.filter((l) => {
          const item = getItem(l.id);
          return item && optionsFor(item, l.unit === "kg" ? "kg" : "lb")[l.sizeIndex];
        });
        state = { lines, extras: parsed.extras ?? [] };
      }
    }
  } catch {
    /* storage blocked: the box just won't persist */
  }
}

function set(next: BoxState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => EMPTY;

export function useBox() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const box = {
  add(line: Omit<BoxLine, "key" | "qty">, qty = 1) {
    load();
    const key = lineKey(line);
    const existing = state.lines.find((l) => l.key === key);
    const lines = existing
      ? state.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(20, l.qty + qty) } : l))
      : [...state.lines, { ...line, message: line.message.trim(), key, qty }];
    set({ ...state, lines });
  },
  setQty(key: string, qty: number) {
    set({
      ...state,
      lines: qty <= 0 ? state.lines.filter((l) => l.key !== key) : state.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(20, qty) } : l)),
    });
  },
  remove(key: string) {
    set({ ...state, lines: state.lines.filter((l) => l.key !== key) });
  },
  toggleExtra(id: string) {
    const on = state.extras.some((e) => e.id === id);
    set({ ...state, extras: on ? state.extras.filter((e) => e.id !== id) : [...state.extras, { id }] });
  },
  setExtraNote(id: string, note: string) {
    set({ ...state, extras: state.extras.map((e) => (e.id === id ? { ...e, note } : e)) });
  },
  clear() {
    set(EMPTY);
  },
};
