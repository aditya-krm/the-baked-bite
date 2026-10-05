import Link from "next/link";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 pt-24 text-center">
      <p className="font-display text-[clamp(2.4rem,6vw,3.6rem)] leading-tight">This page crumbled.</p>
      <p className="mt-3 text-[16px] text-muted">The link may be old, or the cake may have left the menu.</p>
      <Link href="/cakes" className={`${btn.primary} mt-8`}>
        See today&rsquo;s cakes
      </Link>
    </div>
  );
}
