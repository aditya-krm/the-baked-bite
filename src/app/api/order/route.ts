import { newOrderId, orderText, priceBox, validateOrder, type OrderPayload } from "@/lib/order";
import { demoAllowed, tooMany } from "@/lib/guard";
import { activeOfferIds } from "@/lib/offers";
import { isBookable } from "@/lib/schedule";
import { sendMessage, telegramReady } from "@/lib/telegram";

export async function POST(req: Request) {
  let body: OrderPayload & { company?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "That order didn't come through properly. Please try again." }, { status: 400 });
  }

  // honeypot: real people never fill this hidden field
  if (body.company) return Response.json({ ok: true, orderId: newOrderId() });
  if (tooMany(req)) return Response.json({ ok: false, error: "Too many orders in a short time. Please message us instead." }, { status: 429 });

  const errors = validateOrder(body);
  const offerIds = activeOfferIds();
  const { priced, leadDays } = priceBox(body.lines ?? [], body.extras ?? [], offerIds);
  if (!priced.length) errors.lines = "Your box is empty.";
  else if (!errors.date && !errors.slot && !isBookable(leadDays, body.fulfilment.date, body.fulfilment.slot)) {
    errors.slot = "That time is no longer available. Please pick another slot.";
  }
  if (Object.keys(errors).length) return Response.json({ ok: false, error: Object.values(errors)[0], errors }, { status: 422 });

  const orderId = newOrderId();
  const text = orderText(body, orderId, true, offerIds);

  if (!telegramReady()) {
    if (demoAllowed()) {
      console.info(`\n[demo order — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to send for real]\n${orderText(body, orderId, false, offerIds)}\n`);
      return Response.json({ ok: true, orderId, demo: true });
    }
    return Response.json({ ok: false, error: "Online ordering isn't switched on yet." }, { status: 503 });
  }

  try {
    await sendMessage(text);
    return Response.json({ ok: true, orderId });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: "We couldn't reach the baker just now." }, { status: 502 });
  }
}
