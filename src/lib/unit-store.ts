"use client";

import { useSyncExternalStore } from "react";
import type { Unit } from "@/data/menu";

/** Pound / kilo preference. Pound is the default; the choice is remembered on this device. */
const KEY = "tbb-unit";
let unit: Unit = "lb";
let loaded = false;
const ls = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "kg" || v === "lb") unit = v;
  } catch {}
}

export function setUnit(next: Unit) {
  unit = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {}
  ls.forEach((l) => l());
}

export function useUnit(): Unit {
  return useSyncExternalStore(
    (l) => {
      ls.add(l);
      return () => ls.delete(l);
    },
    () => {
      load();
      return unit;
    },
    () => "lb",
  );
}
