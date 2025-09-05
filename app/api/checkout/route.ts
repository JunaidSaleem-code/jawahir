import Stripe from 'stripe';
import { NextRequest } from 'next/server';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2025-08-27.basil' }) : (null as unknown as Stripe);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const items = Array.isArray(body?.items) ? body.items : [];
    const successPath = typeof body?.successPath === 'string' ? body.successPath : '/success';
    const cancelPath = typeof body?.cancelPath === 'string' ? body.cancelPath : '/cart';

    if (!items.length) {
      return new Response(JSON.stringify({ error: 'No items to checkout.' }), { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.' }),
        { status: 400 }
      );
    }

    const line_items = items.map((it: any) => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(Number(it.price) * 100),
        product_data: {
          name: `${it.title}${it.size ? ` • ${it.size}` : ''}`,
          metadata: { id: String(it.id) },
        },
      },
      quantity: Math.max(1, Number(it.quantity) || 1),
      adjustable_quantity: { enabled: true, minimum: 1 },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}`,
      automatic_tax: { enabled: false },
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to create checkout session' }), { status: 500 });
  }
}



