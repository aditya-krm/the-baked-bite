"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Active offer ids, worked out on the server (refreshed hourly) and shared with every price on the page. */
const Ctx = createContext<readonly string[]>([]);

export function OffersProvider({ ids, children }: { ids: readonly string[]; children: ReactNode }) {
  return <Ctx.Provider value={ids}>{children}</Ctx.Provider>;
}
export const useActiveOffers = () => useContext(Ctx);
