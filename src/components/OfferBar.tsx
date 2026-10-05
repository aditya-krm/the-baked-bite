import Link from "next/link";
import { prettyDay } from "@/lib/schedule";
import { SparkIcon } from "./ui";

/** Thin strip above the header announcing the current offer. */
export function OfferBar({ title, ends }: { title: string; ends: string }) {
  return (
    <Link
      href="/cakes"
      className="flex items-center justify-center gap-2 bg-accent px-4 py-2 text-center text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
    >
      <SparkIcon className="size-3.5 shrink-0" />
      <span>
        {title} <span className="opacity-80 max-sm:hidden">· till {prettyDay(ends)}</span>
      </span>
    </Link>
  );
}
