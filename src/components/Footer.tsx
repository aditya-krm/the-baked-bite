import Link from "next/link";
import { instagramUrl, site, whatsappUrl } from "@/config/site";
import { Wordmark } from "./ui";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-blush/50 pb-28 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Wordmark full className="h-24 -ml-1" />
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">{site.tagline}</p>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted">
            Eggless cake shop in {site.city}, West Bengal: birthday, anniversary, theme and custom cakes, with pickup or delivery around English Bazar.
          </p>
        </div>
        <div>
          <h2 className="text-[12px] font-semibold tracking-[0.18em] text-muted uppercase">Visit</h2>
          <p className="mt-3 text-[15px] leading-relaxed">{site.address}</p>
          <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[14px] text-muted underline underline-offset-4 hover:text-ink">
            Open in Maps
          </a>
        </div>
        <div>
          <h2 className="text-[12px] font-semibold tracking-[0.18em] text-muted uppercase">Hours</h2>
          <dl className="mt-3 space-y-1 text-[15px]">
            {site.hoursLabel.map((h) => (
              <div key={h.days}>
                <dt className="inline text-muted">{h.days} · </dt>
                <dd className="inline">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-[12px] font-semibold tracking-[0.18em] text-muted uppercase">Talk to us</h2>
          <ul className="mt-3 space-y-1.5 text-[15px]">
            {site.phones.map((ph) => (
              <li key={ph.tel} className="flex flex-wrap items-baseline gap-x-2">
                <a href={`tel:${ph.tel}`} className="tabular-nums hover:text-accent">
                  {ph.display}
                </a>
                <a href={whatsappUrl(undefined, ph.whatsapp)} target="_blank" rel="noreferrer" className="text-[13px] text-muted underline underline-offset-4 hover:text-accent">
                  WhatsApp
                </a>
              </li>
            ))}
            <li>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-accent">Instagram @{site.instagram}</a>
            </li>
            <li>
              <Link href="/custom-cake" className="hover:text-accent">Request a custom cake</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-2 px-4 text-[13px] text-muted sm:px-6 lg:px-10">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>All prices in ₹, inclusive of taxes.</span>
        <span className="w-full text-center sm:w-auto">
          Made by{" "}
          <a href="https://www.krmsolutions.in/" target="_blank" rel="noopener" className="font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
            krmsolutions.in
          </a>
        </span>
      </div>
    </footer>
  );
}
