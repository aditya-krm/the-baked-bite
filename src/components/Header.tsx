import { site, telegramUrl } from "@/config/site";
import { Logo, TelegramIcon } from "./ui";

export function Header() {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line/70 bg-ground/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <Logo className="size-9" />
          <span className="font-display text-[21px] leading-none font-semibold tracking-tight">
            {site.name.replace(/Bite$/, "")}
            <em className="text-berry">Bite</em>
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-[15px] font-bold text-ink-soft md:flex" aria-label="Sections">
          <a href="#menu" className="transition-colors hover:text-berry">Menu</a>
          <a href="#extras" className="transition-colors hover:text-berry">Add-ons</a>
          <a href="#good-to-know" className="transition-colors hover:text-berry">Good to know</a>
          <a href="#visit" className="transition-colors hover:text-berry">Visit us</a>
        </nav>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-extrabold text-ground transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <TelegramIcon className="size-4" />
          <span className="hidden sm:inline">Order on Telegram</span>
          <span className="sm:hidden">Order</span>
        </a>
      </div>
    </header>
  );
}
