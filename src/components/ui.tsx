import type { ReactNode } from "react";
import type { Diet } from "@/data/menu";

/* ─────────── food mark ─────────── */

/** FSSAI-style mark: green dot = eggless (veg), brown triangle = contains egg */
export function DietMark({ diet, className = "" }: { diet: Diet; className?: string }) {
  const color = diet === "eggless" ? "var(--veg)" : "var(--egg)";
  const label = diet === "eggless" ? "Eggless" : "Contains egg";
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-grid size-3.5 shrink-0 place-items-center rounded-[3px] border-[1.5px] ${className}`}
      style={{ borderColor: color }}
    >
      {diet === "eggless" ? (
        <span className="size-1.5 rounded-full" style={{ background: color }} />
      ) : (
        <svg viewBox="0 0 10 9" className="size-1.75" aria-hidden>
          <path d="M5 0 10 9H0Z" fill={color} />
        </svg>
      )}
    </span>
  );
}

/* ─────────── buttons ─────────── */

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-ink transition-[background-color,transform] duration-300 hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
  dark: "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-ground transition-transform duration-300 active:scale-[0.98]",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-ink ring-1 ring-line transition-colors duration-300 hover:bg-blush hover:ring-blush-2",
  link: "inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-accent",
};

/* ─────────── type helpers ─────────── */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[12px] font-semibold tracking-[0.18em] text-muted uppercase ${className}`}>{children}</p>;
}

/* ─────────── watercolour wash ─────────── */

/**
 * A soft watercolour bloom: turbulence-displaced ellipses with a darker rim,
 * like pigment pooling at the edge of a wet wash.
 */
export function Wash({
  id,
  colors = ["#F2C9CF", "#F6DCC8"],
  className = "",
  seed = 3,
}: {
  id: string;
  colors?: string[];
  className?: string;
  seed?: number;
}) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden preserveAspectRatio="none">
      <defs>
        <filter id={`wash-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="46" />
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed + 2} />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#wash-${id})`} style={{ mixBlendMode: "multiply" }}>
        <ellipse cx="190" cy="150" rx="150" ry="104" fill={colors[0]} opacity="0.7" />
        <ellipse cx="190" cy="150" rx="150" ry="104" fill="none" stroke={colors[0]} strokeWidth="7" opacity="0.55" />
        {colors[1] && <ellipse cx="250" cy="185" rx="100" ry="70" fill={colors[1]} opacity="0.6" />}
      </g>
      <g filter={`url(#grain-${id})`}>
        <ellipse cx="190" cy="150" rx="150" ry="104" fill="#000" />
      </g>
    </svg>
  );
}

/* ─────────── icons ─────────── */

type IconProps = { className?: string };
const I = (d: ReactNode, vb = "0 0 24 24") =>
  function Icon({ className = "size-5" }: IconProps) {
    return (
      <svg viewBox={vb} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {d}
      </svg>
    );
  };

export const BoxIcon = I(
  <>
    <path d="M4 9.5h16v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z" />
    <path d="M3 6.5h18v3H3z" />
    <path d="M12 6.5v13.5M12 6.5c-1.6-2.8-5.4-3-5.4-.9 0 1.2 2.3.9 5.4.9Zm0 0c1.6-2.8 5.4-3 5.4-.9 0 1.2-2.3.9-5.4.9Z" />
  </>,
);
export const ArrowRight = I(<path d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5" />);
export const ArrowLeft = I(<path d="M19 12H5m0 0 5.5-5.5M5 12l5.5 5.5" />);
export const CloseIcon = I(<path d="M6 6l12 12M18 6 6 18" />);
export const PlusIcon = I(<path d="M12 5v14M5 12h14" />);
export const MinusIcon = I(<path d="M5 12h14" />);
export const CheckIcon = I(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const MenuIcon = I(<path d="M4 8h16M4 16h16" />);
export const UploadIcon = I(
  <>
    <path d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5" />
    <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
  </>,
);
export const ClockIcon = I(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
);
export const PinIcon = I(
  <>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </>,
);
export const LeafIcon = I(
  <>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
    <path d="M5 19 13 11" />
  </>,
);
export const SnowIcon = I(<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 6.5l2.5-2M9.5 19.5 12 17.5l2.5 2" />);
export const SparkIcon = I(<path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2Z" />);

export function WhatsAppIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.5-.4Z"
      />
    </svg>
  );
}

/* ─────────── logo ─────────── */

/* The Baked Bite logo (public/brand). Light and dark versions swap with the theme (see globals.css). */
export function Wordmark({ className = "h-12", full = false }: { className?: string; full?: boolean }) {
  const file = full ? "logo" : "wordmark";
  const [w, h] = full ? [2680, 1310] : [2680, 1190];
  return (
    <span className={`inline-flex shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, no optimisation needed */}
      <img src={`/brand/${file}.svg`} alt="The Baked Bite" width={w} height={h} className="logo-light h-full w-auto" />
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, no optimisation needed */}
      <img src={`/brand/${file}-dark.svg`} alt="" aria-hidden width={w} height={h} className="logo-dark h-full w-auto" />
    </span>
  );
}
