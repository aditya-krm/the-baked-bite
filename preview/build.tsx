/**
 * Builds a single self-contained HTML file of the menu (fonts, CSS and JS inlined,
 * markup pre-rendered) — handy for sharing a preview without deploying.
 *   bun run preview:build  →  preview/dist/index.html
 */
import { $ } from "bun";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { MenuApp } from "@/components/MenuApp";

const root = new URL("..", import.meta.url).pathname;
const out = `${root}preview/dist`;
mkdirSync(out, { recursive: true });

// 1. JS bundle
const js = await Bun.build({
  entrypoints: [`${root}preview/entry.tsx`],
  minify: true,
  target: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
});
if (!js.success) throw new AggregateError(js.logs, "bundle failed");
const script = await js.outputs[0].text();

// 2. Tailwind CSS
await $`bunx @tailwindcss/cli -i ${root}src/app/globals.css -o ${out}/app.css --minify`.cwd(root).quiet();
const css = readFileSync(`${out}/app.css`, "utf8");

// 3. Fonts as data URIs (latin + latin-ext only, to keep it light)
const nm = `${root}node_modules`;
const faces: [string, string, string, string, string][] = [
  ["Fraunces Variable", "normal", "100 900", `${nm}/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2`, "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"],
  ["Fraunces Variable", "normal", "100 900", `${nm}/@fontsource-variable/fraunces/files/fraunces-latin-ext-full-normal.woff2`, "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"],
  ["Fraunces Variable", "italic", "100 900", `${nm}/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2`, "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"],
  ["Nunito Variable", "normal", "200 1000", `${nm}/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2`, "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"],
  ["Nunito Variable", "normal", "200 1000", `${nm}/@fontsource-variable/nunito/files/nunito-latin-ext-wght-normal.woff2`, "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"],
  ["Caveat", "normal", "600", `${nm}/@fontsource/caveat/files/caveat-latin-600-normal.woff2`, "U+0000-00FF,U+2000-206F"],
  ["Caveat", "normal", "700", `${nm}/@fontsource/caveat/files/caveat-latin-700-normal.woff2`, "U+0000-00FF,U+2000-206F"],
];
const fontCss = faces
  .map(([family, style, weight, file, range]) => {
    const b64 = readFileSync(file).toString("base64");
    return `@font-face{font-family:'${family}';font-style:${style};font-display:swap;font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2');unicode-range:${range}}`;
  })
  .join("");

// 4. Pre-rendered markup
const html = renderToString(<MenuApp />);

const page = `<title>The Baked Bite Menu</title>
<meta name="description" content="Cakes, bentos, cheesecakes and bakes with prices in ₹.">
<style>${fontCss}${css}</style>
<div id="root">${html}</div>
<script>${script.replace(/<\/script/gi, "<\\/script")}</script>
`;
writeFileSync(`${out}/index.html`, page);
console.log(`preview/dist/index.html  ${(page.length / 1024).toFixed(0)} KB`);
