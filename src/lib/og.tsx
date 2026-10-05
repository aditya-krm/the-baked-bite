/* eslint-disable @next/next/no-img-element -- <img> is required inside next/og ImageResponse */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/** Shared look for the share images (WhatsApp / Facebook / Google previews). 1200 × 630. */
export const ogSize = { width: 1200, height: 630 };

const font = (pkg: string, file: string) => readFile(path.join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

async function fonts() {
  const [display, displayItalic, sans, sansExt] = await Promise.all([
    font("playfair-display", "playfair-display-latin-500-normal.woff"),
    font("playfair-display", "playfair-display-latin-500-italic.woff"),
    font("figtree", "figtree-latin-600-normal.woff"),
    font("figtree", "figtree-latin-ext-600-normal.woff"), // has the ₹ sign
  ]);
  return [
    { name: "Playfair", data: display, weight: 500 as const, style: "normal" as const },
    { name: "Playfair", data: displayItalic, weight: 500 as const, style: "italic" as const },
    { name: "Figtree", data: sans, weight: 600 as const, style: "normal" as const },
    { name: "Figtree Ext", data: sansExt, weight: 600 as const, style: "normal" as const },
  ];
}

/** A public/ image as a data URI (or null if missing). */
export async function photoData(publicPath?: string) {
  if (!publicPath) return null;
  try {
    const buf = await readFile(path.join(process.cwd(), "public", publicPath));
    const ext = publicPath.split(".").pop()?.toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

const C = { ground: "#FBF7F3", ink: "#2A1C19", muted: "#776560", accent: "#9E3B52", blush: "#F5E8E3", line: "#EBE0DA" };

function Brand({ logo }: { logo: string | null }) {
  if (!logo) {
    return (
      <div style={{ display: "flex", fontFamily: "Playfair", fontSize: 30, color: C.ink }}>
        The Baked&nbsp;<span style={{ fontStyle: "italic", color: C.accent }}>Bite</span>
      </div>
    );
  }
  return <img src={logo} alt="" width={225} height={100} style={{ width: 225, height: 100 }} />;
}

export async function cakeOgImage(opts: { photo: string | null; name: string; real: string; price: string; badge?: string }) {
  const logo = await photoData("brand/wordmark.png");
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: C.ground }}>
        <div style={{ display: "flex", width: 560, height: "100%", background: C.blush }}>
          {opts.photo && <img src={opts.photo} alt="" width={560} height={630} style={{ width: 560, height: 630, objectFit: "cover" }} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "56px 60px" }}>
          <Brand logo={logo} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {opts.badge && (
              <div style={{ display: "flex", alignSelf: "flex-start", background: C.accent, color: "#fff", fontFamily: "Figtree, Figtree Ext", fontSize: 22, padding: "8px 18px", borderRadius: 999, marginBottom: 22 }}>
                {opts.badge}
              </div>
            )}
            <div style={{ fontFamily: "Playfair", fontSize: 68, lineHeight: 1.05, color: C.ink }}>{opts.name}</div>
            <div style={{ fontFamily: "Figtree, Figtree Ext", fontSize: 28, color: C.muted, marginTop: 14 }}>{opts.real}</div>
            <div style={{ display: "flex", fontFamily: "Figtree, Figtree Ext", fontSize: 34, color: C.ink, marginTop: 30 }}>{opts.price}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Figtree, Figtree Ext", fontSize: 22, color: C.muted, borderTop: `2px solid ${C.line}`, paddingTop: 22 }}>
            <span>{`Eggless · baked to order in ${site.city}`}</span>
            <span style={{ color: C.accent }}>Order online</span>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}

export async function homeOgImage(photos: (string | null)[]) {
  const [a, b, c] = photos;
  const logo = await photoData("brand/wordmark.png");
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: C.ground }}>
        <div style={{ display: "flex", width: 640, height: 630, padding: 24, gap: 16 }}>
          <div style={{ display: "flex", width: 352, height: 582, borderRadius: 28, overflow: "hidden", background: C.blush }}>
            {a && <img src={a} alt="" width={352} height={582} style={{ width: 352, height: 582, objectFit: "cover" }} />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[b, c].map((p, i) => (
              <div key={i} style={{ display: "flex", width: 224, height: 283, borderRadius: 28, overflow: "hidden", background: C.blush }}>
                {p && <img src={p} alt="" width={224} height={283} style={{ width: 224, height: 283, objectFit: "cover" }} />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 56px 0 24px" }}>
          <Brand logo={logo} />
          <div style={{ fontFamily: "Playfair", fontSize: 62, lineHeight: 1.08, color: C.ink, marginTop: 28 }}>{`Cakes baked to order in ${site.city}`}</div>
          <div style={{ fontFamily: "Figtree, Figtree Ext", fontSize: 26, color: C.muted, marginTop: 22, lineHeight: 1.4 }}>
            {"Eggless birthday, anniversary & custom cakes. Order online for pickup or delivery."}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
