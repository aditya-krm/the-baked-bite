/**
 * Tiny Telegram Bot API client. Needs two env vars (see .env.example):
 *   TELEGRAM_BOT_TOKEN  — from @BotFather
 *   TELEGRAM_CHAT_ID    — the chat (or group) that should receive orders
 */
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export const telegramReady = () => Boolean(token && chatId);

async function call(method: string, body: BodyInit, json = true) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: json ? { "content-type": "application/json" } : undefined,
    body,
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
  if (!res.ok || !data.ok) throw new Error(`Telegram ${method} failed: ${data.description ?? res.status}`);
}

export function sendMessage(html: string) {
  return call(
    "sendMessage",
    JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
  );
}

export function sendPhoto(photo: Blob, filename: string, captionHtml: string) {
  const form = new FormData();
  form.set("chat_id", String(chatId));
  form.set("caption", captionHtml.slice(0, 1000));
  form.set("parse_mode", "HTML");
  form.set("photo", photo, filename);
  return call("sendPhoto", form, false);
}
