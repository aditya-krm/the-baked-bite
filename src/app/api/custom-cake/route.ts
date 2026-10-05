import { newOrderId } from "@/lib/order";
import { demoAllowed, tooMany } from "@/lib/guard";
import { sendMessage, sendPhoto, telegramReady } from "@/lib/telegram";

const MAX_BYTES = 8 * 1024 * 1024;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "That request didn't come through properly." }, { status: 400 });
  }
  const get = (k: string) => String(form.get(k) ?? "").trim().slice(0, 800);

  if (get("company")) return Response.json({ ok: true, requestId: newOrderId("BB-C") });
  if (tooMany(req, 4)) return Response.json({ ok: false, error: "Too many requests in a short time. Please message us instead." }, { status: 429 });

  const phone = get("phone").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (get("name").length < 2 || !/^[6-9]\d{9}$/.test(phone) || get("idea").length < 10 || !get("date")) {
    return Response.json({ ok: false, error: "A few details are missing. Please check the form." }, { status: 422 });
  }

  const photo = form.get("photo");
  const file = photo instanceof File && photo.size > 0 ? photo : null;
  if (file && (file.size > MAX_BYTES || !file.type.startsWith("image/"))) {
    return Response.json({ ok: false, error: "The photo must be an image under 8 MB." }, { status: 422 });
  }

  const requestId = newOrderId("BB-C");
  const date = new Date(get("date")).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const lines = [
    `🎨 <b>Custom cake request ${requestId}</b>`,
    "",
    `🎉 ${esc(get("occasion"))} · ${esc(get("size"))} · ${get("eggless") === "true" ? "eggless" : "with egg OK"}`,
    `🍰 ${esc(get("flavour"))}`,
    `📅 Needed on ${esc(date)}`,
    `💰 Budget ${esc(get("budget"))}`,
    get("message") ? `✍️ Message: “${esc(get("message"))}”` : null,
    "",
    `<b>Idea</b>\n${esc(get("idea"))}`,
    "",
    `👤 ${esc(get("name"))} · +91 ${phone}`,
    file ? "📸 Reference photo attached above" : null,
  ].filter((l) => l !== null);
  const text = lines.join("\n");

  if (!telegramReady()) {
    if (demoAllowed()) {
      console.info(`\n[demo custom request]\n${text.replace(/<[^>]+>/g, "")}${file ? `\n(photo: ${file.name}, ${file.size} bytes)` : ""}\n`);
      return Response.json({ ok: true, requestId, demo: true });
    }
    return Response.json({ ok: false, error: "Online requests aren't switched on yet." }, { status: 503 });
  }

  try {
    if (file) await sendPhoto(file, file.name || "reference.jpg", `📸 Reference for <b>${requestId}</b>`);
    await sendMessage(text);
    return Response.json({ ok: true, requestId });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: "We couldn't reach the baker just now." }, { status: 502 });
  }
}
