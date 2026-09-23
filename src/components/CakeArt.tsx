import type { ReactNode } from "react";
import type { ArtSpec, Topping } from "@/data/menu";

/* ───────────────────────── colour helpers ───────────────────────── */

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]: number[]) {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}
/** amt > 0 lightens toward white, amt < 0 darkens toward a warm cocoa-black */
export function shade(hex: string, amt: number) {
  const rgb = hexToRgb(hex);
  const target = amt >= 0 ? [255, 255, 255] : [34, 16, 12];
  const a = Math.abs(amt);
  return rgbToHex(rgb.map((v, i) => v + (target[i] - v) * a));
}

/* deterministic randomness so SSR and client agree */
function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

/* ───────────────────────── shared pieces ───────────────────────── */

type Ctx = { uid: string; rand: () => number };

function CylGrad({ id, color, strength = 1 }: { id: string; color: string; strength?: number }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={shade(color, -0.22 * strength)} />
      <stop offset="0.28" stopColor={shade(color, 0.12 * strength)} />
      <stop offset="0.62" stopColor={color} />
      <stop offset="1" stopColor={shade(color, -0.28 * strength)} />
    </linearGradient>
  );
}

function cylinderSide(cx: number, top: number, bottom: number, rx: number, ry: number) {
  return `M${cx - rx} ${top} L${cx - rx} ${bottom} A${rx} ${ry} 0 0 0 ${cx + rx} ${bottom} L${cx + rx} ${top} A${rx} ${ry} 0 0 1 ${cx - rx} ${top} Z`;
}
/** band that hugs the front curvature between two heights */
function curvedBand(cx: number, y1: number, y2: number, rx: number, ry: number) {
  return `M${cx - rx} ${y1} A${rx} ${ry} 0 0 0 ${cx + rx} ${y1} L${cx + rx} ${y2} A${rx} ${ry} 0 0 1 ${cx - rx} ${y2} Z`;
}
const frontY = (cx: number, cy: number, rx: number, ry: number, x: number) =>
  cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));

function Pedestal() {
  return (
    <g>
      <ellipse cx="100" cy="194" rx="46" ry="4.5" fill="#2a1410" opacity="0.1" />
      <path d="M88 172 C90 182 80 186 76 191 L124 191 C120 186 110 182 112 172 Z" fill="#F4ECEE" />
      <path d="M100 172 L112 172 C110 182 120 186 124 191 L104 191 C106 184 102 178 100 172 Z" fill="#E3D6DA" />
      <ellipse cx="100" cy="191.5" rx="26" ry="4" fill="#E8DCE0" />
      <ellipse cx="100" cy="170" rx="84" ry="12.5" fill="#E6D9DD" />
      <ellipse cx="100" cy="167.5" rx="84" ry="12" fill="#FFFFFF" />
      <ellipse cx="100" cy="167.5" rx="74" ry="9.5" fill="none" stroke="#F1E6E9" strokeWidth="1.2" />
    </g>
  );
}

function Beads({ cx, cy, rx, ry, color, r = 4.2, count = 15, back = false }: {
  cx: number; cy: number; rx: number; ry: number; color: string; r?: number; count?: number; back?: boolean;
}) {
  const out: ReactNode[] = [];
  for (let i = 0; i <= count; i++) {
    const t = back ? Math.PI + (Math.PI * i) / count : (Math.PI * i) / count;
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    out.push(
      <g key={i}>
        <circle cx={f(x)} cy={f(y)} r={r} fill={shade(color, -0.08)} />
        <circle cx={f(x - r * 0.25)} cy={f(y - r * 0.3)} r={r * 0.78} fill={color} />
        <circle cx={f(x - r * 0.4)} cy={f(y - r * 0.5)} r={r * 0.25} fill="#fff" opacity="0.7" />
      </g>,
    );
  }
  return <g>{out}</g>;
}

/* ───────────────────────── toppings ───────────────────────── */

function ToppingShape({ kind, x, y, s = 1, i, colors }: {
  kind: Topping; x: number; y: number; s?: number; i: number; ctx?: Ctx; colors: ArtSpec;
}) {
  const T = `translate(${f(x)} ${f(y)}) scale(${s})`;
  switch (kind) {
    case "rosette": {
      const c = colors.accent && colors.accent !== "#FFFFFF" ? colors.cream : shade(colors.cream, 0.35);
      return (
        <g transform={T}>
          <ellipse cx="0" cy="0" rx="10" ry="3" fill="#000" opacity="0.08" />
          <path d="M-10 -1 C-12 -9 -4 -11 0 -21 C4 -11 12 -9 10 -1 C6 2 -6 2 -10 -1 Z" fill={c} />
          <path d="M-6 -2 C-6 -8 -1 -10 0 -18 M4 -3 C5 -8 2 -11 0 -18 M-9 -3 C-9 -6 -6 -8 -4 -11" stroke={shade(c, -0.12)} strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <path d="M-3 -6 C-3 -10 -1 -13 0 -16" stroke="#fff" strokeWidth="1.4" opacity="0.8" fill="none" strokeLinecap="round" />
        </g>
      );
    }
    case "strawberry":
      return (
        <g transform={T}>
          <path d="M-9 -2 C-11 -12 -4 -21 0 -22 C4 -21 11 -12 9 -2 C6 2 -6 2 -9 -2 Z" fill="#E23A55" />
          <path d="M3 -20 C8 -16 10 -9 8 -3 C6 0 2 1 0 1 C5 -5 6 -13 3 -20 Z" fill="#B91F3C" />
          <path d="M-5 -16 C-6 -12 -6 -9 -5 -7" stroke="#fff" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" fill="none" />
          {[[-4, -12], [2, -15], [4, -8], [-2, -5], [-6, -6], [1, -10]].map(([a, b], k) => (
            <ellipse key={k} cx={a} cy={b} rx="0.8" ry="1.2" fill="#FFE08A" />
          ))}
          <path d="M-7 -1 L-3 -5 L0 -1 L3 -5 L7 -1 Z" fill="#5BA24A" />
        </g>
      );
    case "cherry":
      return (
        <g transform={T}>
          <path d="M1 -12 C2 -20 6 -25 11 -27" stroke="#5B7D2E" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <circle cx="0" cy="-6.5" r="7" fill="#C8102E" />
          <circle cx="1.5" cy="-5" r="5.5" fill="#A00C24" opacity="0.5" />
          <ellipse cx="-2.6" cy="-9.2" rx="2" ry="1.3" fill="#fff" opacity="0.85" transform="rotate(-30 -2.6 -9.2)" />
        </g>
      );
    case "blueberry":
      return (
        <g transform={T}>
          {[[-5, -4], [5, -4], [0, -10], [-9, -10], [8, -12]].map(([a, b], k) => (
            <g key={k}>
              <circle cx={a} cy={b} r="4.6" fill="#3B3585" />
              <circle cx={a - 1.4} cy={b - 1.6} r="1.3" fill="#9FA0E8" opacity="0.8" />
              <path d={`M${a - 1} ${b - 4} l1 1 l1 -1`} stroke="#241F5C" strokeWidth="0.8" fill="none" />
            </g>
          ))}
        </g>
      );
    case "candle":
      return (
        <g transform={T}>
          <rect x="-2.6" y="-26" width="5.2" height="26" rx="1.5" fill="#FFF" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M-2.6 ${-24 + k * 6.5} L2.6 ${-27 + k * 6.5} L2.6 ${-24 + k * 6.5} L-2.6 ${-21 + k * 6.5} Z`} fill="#F07A96" />
          ))}
          <line x1="0" y1="-26" x2="0" y2="-29" stroke="#3b2a24" strokeWidth="1" />
          <circle cx="0" cy="-34" r="7" fill="#FFD66B" opacity="0.25" />
          <path d="M0 -40 C3 -36 3 -31 0 -29.5 C-3 -31 -3 -36 0 -40 Z" fill="#FFB938" />
          <path d="M0 -36 C1.4 -34 1.4 -31.5 0 -30.6 C-1.4 -31.5 -1.4 -34 0 -36 Z" fill="#FFF4C9" />
        </g>
      );
    case "shards":
      return (
        <g transform={`${T} rotate(${i % 2 ? 14 : -10})`}>
          <path d="M-7 0 L-3 -26 L9 -4 Z" fill="#3A1D14" />
          <path d="M-3 -26 L9 -4 L4 -1 Z" fill="#5E3526" />
          <path d="M-5 -4 L-3 -20" stroke="#8B5A45" strokeWidth="0.9" opacity="0.8" />
        </g>
      );
    case "choco-ball":
      return (
        <g transform={T}>
          <circle cx="0" cy="-7" r="7" fill="#3B1F17" />
          <circle cx="1.6" cy="-5.4" r="5" fill="#2A140E" opacity="0.6" />
          <ellipse cx="-2.6" cy="-9.5" rx="2.2" ry="1.4" fill="#fff" opacity="0.55" />
          <circle cx="2.5" cy="-10.5" r="1" fill="#E7C15A" />
          <circle cx="-3" cy="-4" r="0.7" fill="#E7C15A" />
        </g>
      );
    case "gold":
      return (
        <g transform={T}>
          <path d="M-6 -12 L-1 -18 L6 -15 L4 -8 L-3 -7 Z" fill="#E6B84A" />
          <path d="M-1 -18 L6 -15 L2 -12 Z" fill="#F7DC8A" />
          <path d="M-8 -3 L-4 -6 L-1 -2 L-5 0 Z" fill="#D9A73C" />
        </g>
      );
    case "macaron":
      return (
        <g transform={T}>
          <ellipse cx="0" cy="-4" rx="9" ry="4" fill="#F4A9BD" />
          <rect x="-8" y="-9" width="16" height="3.5" rx="1.7" fill="#FFF3F6" />
          <ellipse cx="0" cy="-11" rx="9" ry="4.2" fill="#F7B8C9" />
          <ellipse cx="-3" cy="-12.5" rx="3" ry="1.2" fill="#fff" opacity="0.6" />
        </g>
      );
    case "mango":
      return (
        <g transform={`${T} rotate(${(i % 3) * 8 - 8})`}>
          <path d="M-7 -8 L0 -12 L7 -8 L0 -4 Z" fill="#FFC94D" />
          <path d="M-7 -8 L0 -4 L0 3 L-7 -1 Z" fill="#F4A21E" />
          <path d="M7 -8 L0 -4 L0 3 L7 -1 Z" fill="#E08A10" />
        </g>
      );
    case "rose":
      return (
        <g transform={T}>
          <path d="M-12 -2 C-10 -8 -4 -8 -2 -4 C-6 -2 -9 -1 -12 -2 Z" fill="#7FB06A" />
          <path d="M12 -3 C10 -9 4 -9 2 -5 C6 -3 9 -2 12 -3 Z" fill="#6A9C57" />
          <circle cx="0" cy="-8" r="7.5" fill="#E86A8E" />
          <path d="M0 -8 m-4 0 a4 4 0 1 1 4 4 a2.6 2.6 0 1 1 -2.4 -3.2 M-6.5 -5 C-5 -1 3 -1 6 -5" stroke="#B83E63" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "pistachio":
      return (
        <g transform={T}>
          {[[-9, -2], [-3, -4], [3, -2], [8, -4], [0, 0], [-6, 1], [6, 1]].map(([a, b], k) => (
            <ellipse key={k} cx={a} cy={b} rx="2.4" ry="1.4" transform={`rotate(${k * 40} ${a} ${b})`} fill={k % 2 ? "#8DBA5E" : "#B5D17E"} />
          ))}
        </g>
      );
    case "saffron":
      return (
        <g transform={T} stroke="#D9480F" strokeWidth="1" strokeLinecap="round" fill="none">
          <path d="M-8 -2 q3 -3 6 -1" />
          <path d="M2 -4 q3 2 6 -1" />
          <path d="M-3 1 q2 -3 5 -2" />
        </g>
      );
    case "pineapple":
      return (
        <g transform={`${T} rotate(${i % 2 ? 8 : -8})`}>
          <ellipse cx="0" cy="-10" rx="10" ry="10" fill="#E9B824" />
          <ellipse cx="-0.8" cy="-10.5" rx="8.4" ry="8.4" fill="#FBD74B" />
          <circle cx="-0.8" cy="-10.5" r="3" fill={shade(colors.cream, -0.04)} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
            const a = (k * Math.PI) / 4;
            return <line key={k} x1={f(-0.8 + Math.cos(a) * 3.8)} y1={f(-10.5 + Math.sin(a) * 3.8)} x2={f(-0.8 + Math.cos(a) * 7.4)} y2={f(-10.5 + Math.sin(a) * 7.4)} stroke="#E9A916" strokeWidth="0.9" />;
          })}
        </g>
      );
    case "walnut":
      return (
        <g transform={`${T} rotate(${(i % 3) * 20 - 20})`}>
          <path d="M-8 -3 C-9 -9 -4 -11 -2 -8 C-1 -12 4 -12 5 -8 C8 -10 10 -5 7 -2 C4 1 -5 1 -8 -3 Z" fill="#A86B3C" />
          <path d="M-5 -5 C-3 -7 -1 -5 0 -6 M2 -6 C4 -8 6 -6 6 -4" stroke="#6E4121" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      );
    case "lemon":
      return (
        <g transform={`${T} rotate(${i % 2 ? 12 : -12})`}>
          <circle cx="0" cy="-10" r="10" fill="#F2C511" />
          <circle cx="0" cy="-10" r="8.3" fill="#FFF3A6" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
            const a = (k * Math.PI) / 4 + 0.39;
            return <path key={k} d={`M0 -10 L${f(Math.cos(a) * 7.2)} ${f(-10 + Math.sin(a) * 7.2)} L${f(Math.cos(a + 0.6) * 7.2)} ${f(-10 + Math.sin(a + 0.6) * 7.2)} Z`} fill="#FBE36A" />;
          })}
          <circle cx="0" cy="-10" r="1.2" fill="#FFF8D6" />
        </g>
      );
    case "heart":
      return (
        <g transform={T}>
          <path d="M0 -2 C-8 -8 -9 -15 -4.5 -16.5 C-2 -17.3 -0.5 -15.5 0 -14 C0.5 -15.5 2 -17.3 4.5 -16.5 C9 -15 8 -8 0 -2 Z" fill="#E4436D" />
          <ellipse cx="-4" cy="-13" rx="1.6" ry="1" fill="#fff" opacity="0.7" />
        </g>
      );
    case "caramel":
      return (
        <g transform={`${T} rotate(${(i % 3) * 18 - 18})`}>
          <path d="M-7 -1 L-4 -15 L6 -12 L8 -2 Z" fill="#D98E2B" />
          <path d="M-4 -15 L6 -12 L1 -8 Z" fill="#F4C074" />
          <circle cx="1" cy="-6" r="1.4" fill="#F7E0B5" />
        </g>
      );
    case "cookie":
      return (
        <g transform={`${T} rotate(-14)`}>
          <rect x="-11" y="-24" width="22" height="7" rx="3.5" fill="#2B1A16" />
          <rect x="-10" y="-17.5" width="20" height="4" rx="2" fill="#FFFFFF" />
          <rect x="-11" y="-14" width="22" height="7" rx="3.5" fill="#2B1A16" />
          <path d="M-7 -21 h3 M-1 -21 h3 M5 -21 h2" stroke="#4A332C" strokeWidth="1" />
        </g>
      );
    case "sprinkles":
      return null; // scattered separately
  }
}

const SPRINKLE_COLORS = ["#F07A96", "#8FC9F2", "#FFD166", "#9ED9A8", "#B9A6EE", "#FF9F68"];

function Scatter({ cx, cy, rx, ry, n, ctx, colors, kind }: {
  cx: number; cy: number; rx: number; ry: number; n: number; ctx: Ctx; colors?: string[]; kind: "sprinkle" | "crumb";
}) {
  const out: ReactNode[] = [];
  const palette = colors ?? SPRINKLE_COLORS;
  for (let i = 0; i < n; i++) {
    const a = ctx.rand() * Math.PI * 2;
    const r = Math.sqrt(ctx.rand()) * 0.9;
    const x = cx + Math.cos(a) * rx * r;
    const y = cy + Math.sin(a) * ry * r;
    const rot = Math.round(ctx.rand() * 180);
    const col = palette[i % palette.length];
    out.push(
      kind === "sprinkle" ? (
        <rect key={i} x={f(x - 2.4)} y={f(y - 0.8)} width="4.8" height="1.6" rx="0.8" fill={col} transform={`rotate(${rot} ${f(x)} ${f(y)})`} />
      ) : (
        <ellipse key={i} cx={f(x)} cy={f(y)} rx="1.8" ry="1.1" fill={col} transform={`rotate(${rot} ${f(x)} ${f(y)})`} />
      ),
    );
  }
  return <g>{out}</g>;
}

/** Arrange toppings on an elliptical top surface — back row first so depth reads right */
function TopRing({ cx, cy, rx, ry, list, ctx, spec, scale = 1 }: {
  cx: number; cy: number; rx: number; ry: number; list: Topping[]; ctx: Ctx; spec: ArtSpec; scale?: number;
}) {
  const solid = list.filter((t) => t !== "sprinkles" && t !== "pistachio" && t !== "saffron");
  const scatter = list.filter((t) => t === "sprinkles" || t === "pistachio" || t === "saffron");
  const n = solid.length;
  const pts = solid.map((kind, i) => {
    // spread along an arc that hugs the rim, biased toward the back so the front edge stays visible
    const t = n === 1 ? Math.PI / 2 : Math.PI * 1.08 - (i / (n - 1)) * Math.PI * 1.16 + Math.PI;
    const ring = n === 1 ? 0 : 0.64;
    return { kind, i, x: cx + Math.cos(t) * rx * ring, y: cy + Math.sin(t) * ry * ring + (n === 1 ? 2 : 0) };
  });
  pts.sort((a, b) => a.y - b.y);
  return (
    <g>
      {scatter.map((k, j) => (
        <Scatter
          key={k + j}
          cx={cx}
          cy={cy}
          rx={rx * 0.86}
          ry={ry * 0.8}
          n={k === "sprinkles" ? 38 : k === "pistachio" ? 22 : 14}
          ctx={ctx}
          kind={k === "sprinkles" ? "sprinkle" : "crumb"}
          colors={k === "pistachio" ? ["#8DBA5E", "#B5D17E", "#A3C96F"] : k === "saffron" ? ["#D9480F", "#F08C00"] : undefined}
        />
      ))}
      {pts.map((p) => (
        <ToppingShape key={p.i} kind={p.kind} x={p.x} y={p.y} s={scale} i={p.i} ctx={ctx} colors={spec} />
      ))}
    </g>
  );
}

/* ───────────────────────── cake kinds ───────────────────────── */

function dripPath(cx: number, top: number, rx: number, ry: number, rand: () => number) {
  const drips: { x: number; w: number; l: number }[] = [];
  let x = cx - rx + 6;
  while (x < cx + rx - 4) {
    const w = 3.6 + rand() * 3.2;
    drips.push({ x, w, l: 8 + rand() * 20 });
    x += w * 2 + 3 + rand() * 6;
  }
  const pts: string[] = [];
  const steps = 120;
  for (let k = 0; k <= steps; k++) {
    const px = cx - rx + (2 * rx * k) / steps;
    let y = frontY(cx, top, rx, ry, px) + 5;
    for (const d of drips) {
      const dist = Math.abs(px - d.x);
      if (dist < d.w) {
        const g = 1 - (dist / d.w) ** 2.2;
        y = Math.max(y, frontY(cx, top, rx, ry, px) + 5 + d.l * Math.pow(g, 0.32));
      }
    }
    pts.push(`${f(px)} ${f(y)}`);
  }
  return {
    d: `M${cx - rx} ${top} L${pts.join(" L")} L${cx + rx} ${top} A${rx} ${ry} 0 0 1 ${cx - rx} ${top} Z`,
    drips,
  };
}

function RoundCake({ spec, ctx, kind }: { spec: ArtSpec; ctx: Ctx; kind: "drip" | "frosted" | "naked" }) {
  const cx = 100, top = 92, bottom = 160, rx = 62, ry = 15;
  const g = (n: string) => `${ctx.uid}-${n}`;
  const glaze = spec.glaze ?? spec.cream;
  const drip = kind === "drip" ? dripPath(cx, top, rx, ry, ctx.rand) : null;
  const layerH = (bottom - top) / 3;

  return (
    <g>
      <defs>
        <CylGrad id={g("side")} color={kind === "naked" ? spec.sponge : spec.cream} />
        <CylGrad id={g("glaze")} color={glaze} strength={0.8} />
        <CylGrad id={g("fill")} color={spec.cream} strength={0.6} />
        <radialGradient id={g("top")} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor={shade(kind === "drip" ? glaze : spec.cream, 0.18)} />
          <stop offset="1" stopColor={kind === "drip" ? glaze : shade(spec.cream, -0.04)} />
        </radialGradient>
      </defs>
      <Pedestal />
      <path d={cylinderSide(cx, top, bottom, rx, ry)} fill={`url(#${g("side")})`} />

      {kind === "naked" && (
        <g>
          {[1, 2].map((k) => (
            <path key={k} d={curvedBand(cx, top + layerH * k - 3.5, top + layerH * k + 3.5, rx, ry)} fill={`url(#${g("fill")})`} />
          ))}
          <path d={cylinderSide(cx, top, bottom, rx, ry)} fill={spec.cream} opacity="0.28" />
          {/* scraped cream highlights */}
          <path d={`M${cx - rx + 10} ${top + 10} L${cx - rx + 10} ${bottom}`} stroke="#fff" strokeWidth="5" opacity="0.28" strokeLinecap="round" />
        </g>
      )}

      {kind === "frosted" && (
        <g>
          <path d={curvedBand(cx, top + 30, top + 36, rx, ry)} fill={shade(spec.cream, -0.05)} opacity="0.7" />
          {spec.glaze && spec.glaze !== spec.cream && (
            <Scatter cx={cx} cy={bottom - 26} rx={rx - 2} ry={16} n={60} ctx={ctx} kind="crumb" colors={[spec.glaze, shade(spec.glaze, 0.2)]} />
          )}
          <Beads cx={cx} cy={bottom - 2} rx={rx} ry={ry} color={shade(spec.cream, 0.2)} count={16} r={4.4} />
        </g>
      )}

      {drip && (
        <g>
          <path d={drip.d} fill={`url(#${g("glaze")})`} />
          {drip.drips.map((d, k) => (
            <ellipse key={k} cx={f(d.x - d.w * 0.3)} cy={f(frontY(cx, top, rx, ry, d.x) + d.l * 0.55)} rx="0.9" ry={f(Math.max(1.5, d.l * 0.22))} fill="#fff" opacity="0.35" />
          ))}
          <Beads cx={cx} cy={bottom - 2} rx={rx} ry={ry} color={shade(spec.cream, 0.15)} count={17} r={3.6} />
        </g>
      )}

      {/* top surface */}
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={`url(#${g("top")})`} />
      <ellipse cx={cx - 14} cy={top - 4} rx={rx * 0.42} ry={ry * 0.28} fill="#fff" opacity="0.22" />
      {kind !== "drip" && <Beads cx={cx} cy={top + 1} rx={rx - 2} ry={ry - 1} color={shade(spec.cream, 0.25)} count={15} r={3.6} />}
      <TopRing cx={cx} cy={top} rx={rx} ry={ry} list={spec.toppings ?? []} ctx={ctx} spec={spec} />
    </g>
  );
}

function TierCake({ spec, ctx }: { spec: ArtSpec; ctx: Ctx }) {
  const g = (n: string) => `${ctx.uid}-${n}`;
  const accent = spec.accent ?? "#E8A33D";
  return (
    <g>
      <defs>
        <CylGrad id={g("side")} color={spec.cream} />
        <CylGrad id={g("ribbon")} color={accent} strength={0.7} />
        <radialGradient id={g("top")} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor={shade(spec.cream, 0.4)} />
          <stop offset="1" stopColor={shade(spec.cream, -0.05)} />
        </radialGradient>
      </defs>
      <Pedestal />
      {/* bottom tier */}
      <path d={cylinderSide(100, 118, 162, 64, 14)} fill={`url(#${g("side")})`} />
      <path d={curvedBand(100, 148, 155, 64, 14)} fill={`url(#${g("ribbon")})`} />
      {[...Array(9)].map((_, k) => {
        const x = 46 + k * 13.5;
        return <circle key={k} cx={f(x)} cy={f(frontY(100, 132, 64, 14, x))} r="1.5" fill={accent} opacity="0.8" />;
      })}
      <ellipse cx="100" cy="118" rx="64" ry="14" fill={`url(#${g("top")})`} />
      <Scatter cx={100} cy={120} rx={60} ry={10} n={16} ctx={ctx} kind="crumb" colors={["#8DBA5E", "#B5D17E"]} />
      {/* top tier */}
      <path d={cylinderSide(100, 76, 118, 42, 10)} fill={`url(#${g("side")})`} />
      <path d={curvedBand(100, 104, 110, 42, 10)} fill={`url(#${g("ribbon")})`} />
      {/* gold leaf patch on the side */}
      <path d="M72 90 L80 86 L86 92 L80 98 L74 96 Z" fill="#E6B84A" opacity="0.95" />
      <path d="M80 86 L86 92 L81 91 Z" fill="#F7DC8A" />
      <ellipse cx="100" cy="76" rx="42" ry="10" fill={`url(#${g("top")})`} />
      <Beads cx={100} cy={116} rx={42} ry={10} color={shade(spec.cream, 0.3)} count={12} r={3} />
      <Beads cx={100} cy={160} rx={64} ry={14} color={shade(spec.cream, 0.3)} count={17} r={3.6} />
      <TopRing cx={100} cy={76} rx={42} ry={10} list={spec.toppings ?? []} ctx={ctx} spec={spec} scale={0.9} />
      <ToppingShape kind="rose" x={150} y={126} s={0.8} i={9} ctx={ctx} colors={spec} />
      <ToppingShape kind="rose" x={54} y={127} s={0.7} i={10} ctx={ctx} colors={spec} />
    </g>
  );
}

function Plate({ y = 164, rx = 82, ry = 17 }: { y?: number; rx?: number; ry?: number }) {
  return (
    <g>
      <ellipse cx="100" cy={y + 12} rx={rx * 0.7} ry="5" fill="#2a1410" opacity="0.1" />
      <ellipse cx="100" cy={y + 3} rx={rx} ry={ry} fill="#E6D9DD" />
      <ellipse cx="100" cy={y} rx={rx} ry={ry} fill="#FFFFFF" />
      <ellipse cx="100" cy={y} rx={rx * 0.72} ry={ry * 0.7} fill="#FAF4F5" stroke="#F0E5E8" strokeWidth="1" />
    </g>
  );
}

function CheesecakeSlice({ spec, ctx }: { spec: ArtSpec; ctx: Ctx }) {
  const g = (n: string) => `${ctx.uid}-${n}`;
  const T = { x: 36, y: 132 }, B2 = { x: 168, y: 116 }, B1 = { x: 124, y: 80 };
  const h = 44, crust = 10, topL = 7;
  const glaze = spec.glaze ?? "#E0A45A";
  const quad = (a: number, b: number) =>
    `M${T.x} ${T.y + a} L${B2.x} ${B2.y + a} L${B2.x} ${B2.y + b} L${T.x} ${T.y + b} Z`;
  // drips down the cut face
  const drips = [0.22, 0.4, 0.58, 0.8].map((p, k) => {
    const x = T.x + (B2.x - T.x) * p;
    const y = T.y + (B2.y - T.y) * p + topL;
    const l = 6 + ((k * 7) % 11);
    return `M${f(x - 3.5)} ${f(y - 1)} L${f(x - 3.5)} ${f(y + l - 3.5)} A3.5 3.5 0 0 0 ${f(x + 3.5)} ${f(y + l - 3.5)} L${f(x + 3.5)} ${f(y - 1)} Z`;
  });
  return (
    <g>
      <defs>
        <linearGradient id={g("cut")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(spec.cream, 0.25)} />
          <stop offset="1" stopColor={shade(spec.cream, -0.06)} />
        </linearGradient>
        <linearGradient id={g("topf")} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={shade(glaze, 0.2)} />
          <stop offset="1" stopColor={shade(glaze, -0.1)} />
        </linearGradient>
      </defs>
      <Plate y={160} />
      {/* back outer crust edge, peeking out */}
      <path d={`M${B1.x} ${B1.y} Q 162 86 ${B2.x} ${B2.y} L${B2.x} ${B2.y + h} Q 164 104 ${B1.x + 8} ${B1.y + 20} Z`} fill={shade(spec.cream, -0.12)} />
      {/* cut face */}
      <path d={quad(0, h)} fill={`url(#${g("cut")})`} />
      <path d={quad(h - crust, h)} fill={spec.sponge} />
      <path d={quad(h - crust, h - crust + 2)} fill={shade(spec.sponge, 0.25)} opacity="0.7" />
      <Scatter cx={(T.x + B2.x) / 2} cy={(T.y + B2.y) / 2 + h - crust / 2} rx={60} ry={4} n={30} ctx={ctx} kind="crumb" colors={[shade(spec.sponge, -0.2), shade(spec.sponge, 0.2)]} />
      <path d={quad(0, topL)} fill={glaze} />
      {spec.toppings?.includes("blueberry") || spec.glaze === "#5A3325" ? drips.map((d, k) => <path key={k} d={d} fill={glaze} />) : null}
      {/* top face */}
      <path d={`M${T.x} ${T.y} L${B1.x} ${B1.y} Q 162 86 ${B2.x} ${B2.y} Z`} fill={`url(#${g("topf")})`} />
      <path d={`M${T.x + 16} ${T.y - 4} L${B1.x - 8} ${B1.y + 6}`} stroke="#fff" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
      {/* cream dollop + garnish */}
      <ToppingShape kind="rosette" x={126} y={100} s={1} i={0} ctx={ctx} colors={{ ...spec, cream: "#FFFFFF", accent: "#FFFFFF" }} />
      {(spec.toppings ?? []).map((t, k) => (
        <ToppingShape key={k} kind={t} x={t === "walnut" ? 104 : 108} y={t === "walnut" ? 110 : 112} s={t === "strawberry" ? 1 : 0.95} i={k} ctx={ctx} colors={spec} />
      ))}
      {spec.toppings?.includes("walnut") && <ToppingShape kind="walnut" x={80} y={120} s={0.8} i={2} ctx={ctx} colors={spec} />}
      {/* sauce swoosh on the plate */}
      <path d="M150 160 C160 156 176 158 178 164 C170 168 156 166 150 160 Z" fill={glaze} opacity="0.85" />
      <circle cx="44" cy="172" r="2.4" fill={glaze} opacity="0.85" />
      <circle cx="52" cy="176" r="1.6" fill={glaze} opacity="0.85" />
    </g>
  );
}

function wavyTop(x0: number, x1: number, yt: number, bottom: number, amp: number, seed: number) {
  const n = 6;
  const step = (x1 - x0) / n;
  let d = `M${x0} ${bottom} L${x0} ${yt}`;
  for (let k = 0; k < n; k++) {
    const flip = (k + seed) % 2 ? 1 : -1;
    d += ` Q${f(x0 + step * k + step / 2)} ${f(yt + amp * flip)} ${f(x0 + step * (k + 1))} ${yt}`;
  }
  return d + ` L${x1} ${bottom} Z`;
}

function JarCake({ spec, ctx }: { spec: ArtSpec; ctx: Ctx }) {
  const g = (n: string) => `${ctx.uid}-${n}`;
  const x0 = 66, x1 = 134, bottom = 170;
  const layers: { h: number; c: string; wavy: boolean }[] = [
    { h: 24, c: spec.sponge, wavy: false },
    { h: 18, c: spec.cream, wavy: true },
    { h: 20, c: spec.sponge, wavy: true },
    { h: 16, c: spec.cream, wavy: true },
    { h: 7, c: spec.glaze ?? spec.sponge, wavy: true },
  ];
  let y = bottom;
  const bands = layers.map((l, k) => {
    const yb = y;
    y -= l.h;
    return { ...l, yt: y, yb, k };
  });
  const surface = y;
  return (
    <g>
      <defs>
        <clipPath id={g("clip")}>
          <rect x={x0} y="70" width={x1 - x0} height={bottom - 70 + 2} rx="12" />
        </clipPath>
        <linearGradient id={g("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.25" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="0.8" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="182" rx="52" ry="6" fill="#2a1410" opacity="0.12" />
      {/* spoon behind */}
      <g transform="rotate(24 120 60)">
        <rect x="116" y="18" width="7" height="70" rx="3.5" fill="#D8B287" />
        <rect x="118" y="18" width="2" height="70" rx="1" fill="#E9C9A3" />
      </g>
      <rect x="62" y="64" width="76" height={bottom - 58} rx="15" fill="#FFFFFF" opacity="0.35" />
      <g clipPath={`url(#${g("clip")})`}>
        {bands.slice().reverse().map((b) => (
          <path key={b.k} d={b.wavy ? wavyTop(x0 - 2, x1 + 2, b.yt, bottom + 4, 2.6, b.k) : `M${x0 - 2} ${bottom + 4} L${x0 - 2} ${b.yt} L${x1 + 2} ${b.yt} L${x1 + 2} ${bottom + 4} Z`} fill={b.c} />
        ))}
        <Scatter cx={100} cy={bands[0].yt + 12} rx={30} ry={8} n={24} ctx={ctx} kind="crumb" colors={[shade(spec.sponge, -0.2), shade(spec.sponge, 0.18)]} />
        <Scatter cx={100} cy={bands[2].yt + 10} rx={30} ry={6} n={18} ctx={ctx} kind="crumb" colors={[shade(spec.sponge, -0.2), shade(spec.sponge, 0.18)]} />
        <rect x={x0} y="70" width={x1 - x0} height={bottom - 68} fill={`url(#${g("glass")})`} />
      </g>
      {/* glass outline + rim */}
      <rect x="62" y="64" width="76" height={bottom - 58} rx="15" fill="none" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="2.5" />
      <rect x="68" y="78" width="6" height="70" rx="3" fill="#fff" opacity="0.55" />
      <ellipse cx="100" cy="64" rx="38" ry="6" fill="none" stroke="#fff" strokeWidth="3" opacity="0.95" />
      <ellipse cx="100" cy={surface + 1} rx="33" ry="5" fill={shade(spec.glaze ?? spec.cream, 0.08)} />
      {/* whipped crown */}
      <g transform={`translate(100 ${surface + 2}) scale(1.35)`}>
        <ToppingShape kind="rosette" x={0} y={0} i={0} ctx={ctx} colors={{ ...spec, accent: "#FFFFFF", cream: shade(spec.cream, 0.3) }} />
      </g>
      {(spec.toppings ?? []).map((t, k) => (
        <ToppingShape key={k} kind={t} x={t === "pistachio" ? 100 : 110} y={t === "pistachio" ? surface - 18 : surface - 6} s={t === "cookie" ? 0.8 : 0.85} i={k} ctx={ctx} colors={spec} />
      ))}
      {spec.glaze === "#5A3325" && <Scatter cx={100} cy={surface - 10} rx={14} ry={10} n={40} ctx={ctx} kind="crumb" colors={["#5A3325", "#7B4A36"]} />}
    </g>
  );
}

function Cupcake({ spec, ctx }: { spec: ArtSpec; ctx: Ctx }) {
  const g = (n: string) => `${ctx.uid}-${n}`;
  const liner = spec.accent ?? "#B9A6EE";
  const tiers = [
    { cy: 112, rx: 44, ry: 13, h: 14 },
    { cy: 96, rx: 36, ry: 11, h: 14 },
    { cy: 80, rx: 26, ry: 9, h: 12 },
  ];
  return (
    <g>
      <defs>
        <CylGrad id={g("liner")} color={liner} />
        <CylGrad id={g("frost")} color={spec.cream} strength={0.9} />
      </defs>
      <ellipse cx="100" cy="182" rx="44" ry="5.5" fill="#2a1410" opacity="0.12" />
      {/* liner */}
      <path d="M58 122 L70 176 Q100 182 130 176 L142 122 Z" fill={`url(#${g("liner")})`} />
      {[...Array(9)].map((_, k) => {
        const t = (k + 1) / 10;
        const xt = 58 + 84 * t;
        const xb = 70 + 60 * t;
        return <line key={k} x1={f(xt)} y1="123" x2={f(xb)} y2="177" stroke={shade(liner, -0.18)} strokeWidth="1.2" opacity="0.55" />;
      })}
      <path d="M66 130 L74 172" stroke="#fff" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
      {/* sponge dome */}
      <ellipse cx="100" cy="122" rx="45" ry="10" fill={spec.sponge} />
      {/* frosting swirl */}
      {tiers.map((t, k) => (
        <g key={k}>
          <path
            d={`M${100 - t.rx} ${t.cy} C${100 - t.rx - 4} ${t.cy + t.ry + 2} ${100 + t.rx + 4} ${t.cy + t.ry + 2} ${100 + t.rx} ${t.cy} C${100 + t.rx - 2} ${t.cy - t.h} ${100 - t.rx + 2} ${t.cy - t.h} ${100 - t.rx} ${t.cy} Z`}
            fill={`url(#${g("frost")})`}
          />
          <path d={`M${100 - t.rx + 6} ${t.cy + 2} C${100 - t.rx / 2} ${t.cy + t.ry} ${100 + t.rx / 2} ${t.cy + t.ry} ${100 + t.rx - 6} ${t.cy + 2}`} stroke={shade(spec.cream, -0.14)} strokeWidth="1.3" fill="none" opacity="0.7" />
        </g>
      ))}
      <path d="M86 76 C88 62 96 54 100 44 C104 54 112 62 114 76 C108 80 92 80 86 76 Z" fill={`url(#${g("frost")})`} />
      <path d="M92 70 C94 62 98 56 100 50" stroke="#fff" strokeWidth="2" opacity="0.7" fill="none" strokeLinecap="round" />
      <path d="M70 104 C74 100 80 98 86 99" stroke="#fff" strokeWidth="2.2" opacity="0.5" fill="none" strokeLinecap="round" />
      {spec.toppings?.includes("sprinkles") && <Scatter cx={100} cy={94} rx={40} ry={24} n={34} ctx={ctx} kind="sprinkle" />}
      {spec.toppings?.includes("pistachio") && <Scatter cx={100} cy={96} rx={40} ry={22} n={30} ctx={ctx} kind="crumb" colors={["#8DBA5E", "#B5D17E", "#A3C96F"]} />}
      {spec.toppings?.includes("cherry") && <ToppingShape kind="cherry" x={101} y={50} s={1.1} i={0} ctx={ctx} colors={spec} />}
      {spec.toppings?.includes("rose") && <ToppingShape kind="rose" x={100} y={52} s={1} i={0} ctx={ctx} colors={spec} />}
    </g>
  );
}

function Block({ x, y, w, d, h, spec, ctx, top }: { x: number; y: number; w: number; d: number; h: number; spec: ArtSpec; ctx: Ctx; top?: boolean }) {
  const dy = d * 0.55;
  const g = (n: string) => `${ctx.uid}-${n}`;
  return (
    <g>
      <path d={`M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`} fill={`url(#${g("front")})`} />
      <path d={`M${x + w} ${y} L${x + w + d} ${y - dy} L${x + w + d} ${y - dy + h} L${x + w} ${y + h} Z`} fill={shade(spec.sponge, -0.22)} />
      <path d={`M${x} ${y} L${x + w} ${y} L${x + w + d} ${y - dy} L${x + d} ${y - dy} Z`} fill={spec.cream} />
      {/* crackle */}
      <path d={`M${x + 8} ${y - 4} l10 -3 l8 4 l12 -5 M${x + 22} ${y - 9} l9 2 l10 -3 M${x + 40} ${y - 3} l12 -4`} stroke={shade(spec.cream, 0.28)} strokeWidth="1.1" fill="none" opacity="0.75" strokeLinejoin="round" />
      <Scatter cx={x + w / 2} cy={y + h / 2} rx={w / 2 - 4} ry={h / 2 - 4} n={12} ctx={ctx} kind="crumb" colors={[shade(spec.sponge, 0.18), shade(spec.sponge, -0.25)]} />
      {top && spec.toppings?.includes("walnut") && (
        <g>
          <ToppingShape kind="walnut" x={x + 20} y={y - 3} s={0.9} i={0} ctx={ctx} colors={spec} />
          <ToppingShape kind="walnut" x={x + 48} y={y - 6} s={0.85} i={1} ctx={ctx} colors={spec} />
        </g>
      )}
      {top && spec.toppings?.includes("caramel") && (
        <g>
          <path d={`M${x + 6} ${y - 3} q8 -10 14 -2 q6 8 12 -3 q6 -10 12 -1 q6 8 12 -4 q4 -6 10 -3`} stroke="#D98E2B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx={x + 30} cy={y - 7} r="3" fill="#FFF6E6" />
          <circle cx={x + 52} cy={y - 10} r="2.6" fill="#FFF6E6" />
          <circle cx={x + 16} cy={y - 8} r="2.2" fill="#FFF6E6" />
        </g>
      )}
      {top && spec.toppings?.includes("shards") && (
        <path d={`M${x + 10} ${y - 5} c8 -8 18 4 26 -4 c8 -8 18 2 26 -6 M${x + 14} ${y - 10} c8 -4 14 2 22 -3`} stroke="#3B1F17" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.85" />
      )}
      {top && <path d={`M${x + 4} ${y - 1.5} L${x + w - 4} ${y - 1.5}`} stroke="#fff" strokeWidth="1.4" opacity="0.25" />}
    </g>
  );
}

function Brownies({ spec, ctx }: { spec: ArtSpec; ctx: Ctx }) {
  const g = (n: string) => `${ctx.uid}-${n}`;
  return (
    <g>
      <defs>
        <linearGradient id={g("front")} x1="0" x2="1">
          <stop offset="0" stopColor={shade(spec.sponge, -0.1)} />
          <stop offset="0.4" stopColor={shade(spec.sponge, 0.08)} />
          <stop offset="1" stopColor={shade(spec.sponge, -0.12)} />
        </linearGradient>
      </defs>
      <ellipse cx="104" cy="182" rx="66" ry="6" fill="#2a1410" opacity="0.12" />
      {/* parchment */}
      <path d="M22 172 L118 186 L186 164 L96 150 Z" fill="#F5E9D6" />
      <path d="M22 172 L118 186 L118 189 L22 175 Z" fill="#E4D2B8" />
      <path d="M118 186 L186 164 L186 167 L118 189 Z" fill="#D9C4A6" />
      <Block x={46} y={152} w={74} d={34} h={24} spec={spec} ctx={ctx} />
      <Block x={60} y={126} w={70} d={32} h={24} spec={spec} ctx={ctx} />
      <Block x={50} y={100} w={70} d={32} h={24} spec={spec} ctx={ctx} top />
    </g>
  );
}

function Loaf({ spec, ctx }: { spec: ArtSpec; ctx: Ctx }) {
  const g = (n: string) => `${ctx.uid}-${n}`;
  const crust = spec.glaze && spec.glaze !== "#FFFDF4" ? spec.glaze : "#D9A350";
  const isLemon = spec.glaze === "#FFFDF4";
  return (
    <g>
      <defs>
        <linearGradient id={g("crust")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade(crust, 0.1)} />
          <stop offset="1" stopColor={shade(crust, -0.2)} />
        </linearGradient>
        <clipPath id={g("slice")}>
          <path d="M144 122 C146 108 176 106 180 120 L182 174 L146 176 Z" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="184" rx="80" ry="5" fill="#2a1410" opacity="0.12" />
      {/* board */}
      <path d="M14 172 L166 172 L192 158 L40 158 Z" fill="#D8B287" />
      <path d="M14 172 L166 172 L166 178 L14 178 Z" fill="#BF9467" />
      <path d="M166 172 L192 158 L192 164 L166 178 Z" fill="#A87E54" />
      <path d="M40 162 L180 162 M30 167 L170 167" stroke="#C9A174" strokeWidth="0.8" />
      {/* loaf front face */}
      <path d="M28 164 L28 120 C40 110 116 110 128 120 L128 164 Z" fill={`url(#${g("crust")})`} />
      {/* end face (cut, showing crumb) */}
      <path d="M128 164 L128 120 C130 100 150 92 152 106 L152 150 Z" fill={spec.cream} />
      <path d="M128 120 C130 100 150 92 152 106" stroke={shade(crust, -0.1)} strokeWidth="3" fill="none" />
      {spec.swirl && (
        <path d="M132 150 C136 140 146 146 148 134 C150 124 138 124 140 116" stroke={spec.swirl} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
      )}
      <Scatter cx={140} cy={134} rx={9} ry={20} n={14} ctx={ctx} kind="crumb" colors={[shade(spec.cream, -0.12), shade(spec.cream, 0.2)]} />
      {/* domed top */}
      <path d="M28 120 C40 110 116 110 128 120 C130 100 150 92 152 106 C140 94 64 92 52 106 C40 96 28 104 28 120 Z" fill={shade(crust, 0.05)} />
      <path d="M44 110 C70 102 110 102 136 106" stroke={shade(crust, 0.35)} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M44 111 C70 103 110 103 136 107" stroke={shade(crust, -0.3)} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      {isLemon && (
        <g>
          <path d="M28 120 C40 110 116 110 128 120 C130 100 150 92 152 106 C140 94 64 92 52 106 C40 96 28 104 28 120 Z" fill="#FFFDF4" opacity="0.92" />
          {[40, 56, 76, 98, 116].map((x, k) => (
            <path key={k} d={`M${x - 4} 114 L${x - 4} ${122 + (k % 3) * 6} a4 4 0 0 0 8 0 L${x + 4} 116 Z`} fill="#FFFDF4" />
          ))}
          <Scatter cx={92} cy={100} rx={30} ry={6} n={20} ctx={ctx} kind="crumb" colors={["#F2C511", "#9ED36A"]} />
        </g>
      )}
      {/* leaning slice */}
      <g transform="rotate(6 162 150)">
        <path d="M144 122 C146 108 176 106 180 120 L182 174 L146 176 Z" fill={shade(crust, -0.1)} />
        <g clipPath={`url(#${g("slice")})`}>
          <path d="M148 124 C150 114 172 112 176 122 L177 170 L150 172 Z" fill={spec.cream} />
          {spec.swirl && <path d="M152 164 C158 150 172 160 172 144 C172 132 156 134 160 122" stroke={spec.swirl} strokeWidth="7" fill="none" strokeLinecap="round" />}
          <Scatter cx={163} cy={146} rx={12} ry={22} n={22} ctx={ctx} kind="crumb" colors={[shade(spec.cream, -0.12), shade(spec.cream, 0.25)]} />
          {spec.toppings?.includes("walnut") && (
            <g>
              <ellipse cx="156" cy="138" rx="3" ry="2" fill="#8C5A2E" />
              <ellipse cx="170" cy="156" rx="3" ry="2" fill="#8C5A2E" />
              <ellipse cx="164" cy="128" rx="2.4" ry="1.6" fill="#8C5A2E" />
            </g>
          )}
          {isLemon && <path d="M144 122 C146 108 176 106 180 120 L180 126 C176 116 148 116 146 128 Z" fill="#FFFDF4" />}
        </g>
      </g>
      {(spec.toppings ?? []).filter((t) => t !== "walnut" || true).map((t, k) => (
        <g key={k}>
          <ToppingShape kind={t} x={t === "lemon" ? 70 : 64} y={t === "lemon" ? 104 : 104} s={0.9} i={k} ctx={ctx} colors={spec} />
          <ToppingShape kind={t} x={t === "lemon" ? 98 : 92} y={t === "lemon" ? 102 : 100} s={0.9} i={k + 1} ctx={ctx} colors={spec} />
          {t === "walnut" && <ToppingShape kind={t} x={118} y={104} s={0.8} i={k + 2} ctx={ctx} colors={spec} />}
        </g>
      ))}
    </g>
  );
}

function Bento({ spec, ctx }: { spec: ArtSpec; ctx: Ctx }) {
  const g = (n: string) => `${ctx.uid}-${n}`;
  const kraft = "#D6AE80";
  const accent = spec.accent ?? "#E47A9A";
  return (
    <g>
      <defs>
        <CylGrad id={g("side")} color={spec.cream} strength={0.8} />
        <radialGradient id={g("top")} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor={shade(spec.cream, 0.3)} />
          <stop offset="1" stopColor={spec.cream} />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="186" rx="76" ry="5" fill="#2a1410" opacity="0.12" />
      {/* lid, hinged open behind */}
      <path d="M40 116 L50 40 L150 40 L160 116 Z" fill={kraft} />
      <path d="M48 110 L56 48 L144 48 L152 110 Z" fill={shade(kraft, 0.12)} />
      <path d="M100 56 C92 50 84 58 100 70 C116 58 108 50 100 56 Z" fill={shade(kraft, -0.12)} opacity="0.6" />
      {/* tray back rim */}
      <path d="M30 124 L170 124 L160 112 L40 112 Z" fill={shade(kraft, -0.18)} />
      {/* cake */}
      <path d={cylinderSide(100, 104, 142, 48, 12)} fill={`url(#${g("side")})`} />
      <ellipse cx="100" cy="104" rx="48" ry="12" fill={`url(#${g("top")})`} />
      <Beads cx={100} cy={104} rx={46} ry={11} color={accent} r={3} count={18} back />
      <Beads cx={100} cy={105} rx={46} ry={11} color={accent} r={3.2} count={16} />
      <text
        x="0"
        y="0"
        transform="translate(100 107) scale(1 0.6)"
        textAnchor="middle"
        fontFamily="Caveat, 'Segoe Print', cursive"
        fontWeight="700"
        fontSize="15"
        fill={accent}
      >
        {spec.message}
      </text>
      <ToppingShape kind="heart" x={132} y={103} s={0.5} i={0} ctx={ctx} colors={spec} />
      {/* tray front */}
      <path d="M30 124 L170 124 L166 176 L34 176 Z" fill={kraft} />
      <path d="M30 124 L170 124 L169 132 L31 132 Z" fill={shade(kraft, 0.14)} />
      <path d="M34 176 L166 176" stroke={shade(kraft, -0.2)} strokeWidth="2" />
      {/* sticker */}
      <circle cx="100" cy="152" r="11" fill="#FFF6F2" />
      <path d="M100 157 C93 152 93 147 96.5 146 C98.5 145.5 99.6 146.8 100 148 C100.4 146.8 101.5 145.5 103.5 146 C107 147 107 152 100 157 Z" fill={accent} />
      {/* tiny spoon */}
      <g transform="rotate(-12 160 150)">
        <rect x="150" y="134" width="30" height="4" rx="2" fill="#E9C9A3" />
        <ellipse cx="148" cy="136" rx="7" ry="4.5" fill="#E9C9A3" />
      </g>
    </g>
  );
}

/* ───────────────────────── public component ───────────────────────── */

export function CakeArt({ spec, id, variant = "card", className, title }: {
  spec: ArtSpec;
  id: string;
  /** keeps SVG gradient ids unique when the same cake is drawn twice on a page */
  variant?: string;
  className?: string;
  title?: string;
}) {
  const uid = `cake-${id}-${variant}`;
  const ctx: Ctx = { uid, rand: seeded(id) };
  let body: ReactNode;
  switch (spec.kind) {
    case "drip":
    case "frosted":
    case "naked":
      body = <RoundCake spec={spec} ctx={ctx} kind={spec.kind} />;
      break;
    case "tier":
      body = <TierCake spec={spec} ctx={ctx} />;
      break;
    case "slice":
      body = <CheesecakeSlice spec={spec} ctx={ctx} />;
      break;
    case "jar":
      body = <JarCake spec={spec} ctx={ctx} />;
      break;
    case "cupcake":
      body = <Cupcake spec={spec} ctx={ctx} />;
      break;
    case "brownie":
      body = <Brownies spec={spec} ctx={ctx} />;
      break;
    case "loaf":
      body = <Loaf spec={spec} ctx={ctx} />;
      break;
    case "bento":
      body = <Bento spec={spec} ctx={ctx} />;
      break;
  }
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title ?? "Cake illustration"}>
      {body}
    </svg>
  );
}
