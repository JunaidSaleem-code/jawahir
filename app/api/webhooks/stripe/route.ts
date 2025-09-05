import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // In production, verify signature with STRIPE_WEBHOOK_SECRET
    const payload = await req.text();
    console.log('[stripe-webhook] event payload length:', payload.length);
    return new Response('ok');
  } catch (e) {
    return new Response('bad request', { status: 400 });
  }
}



