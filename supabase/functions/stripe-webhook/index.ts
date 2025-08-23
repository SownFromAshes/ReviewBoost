import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js';
import { products, getProductByPriceId } from './stripe-config.ts';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, { appInfo: { name: 'Bolt Integration', version: '1.0.0' } });

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    // 1️⃣ Read the request body
    const body = await req.text();
    let event: Stripe.Event;

    const signature = req.headers.get('stripe-signature');

    if (signature) {
      // 2️⃣ Real Stripe event
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return new Response(JSON.stringify({ error: `Webhook verification failed: ${err.message}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      // 3️⃣ Test event via curl (no signature)
      try {
        event = JSON.parse(body) as Stripe.Event;
        console.warn('Processing test event (no signature)');
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid JSON payload for test event' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 4️⃣ Fire-and-forget processing
    EdgeRuntime.waitUntil(handleEvent(event));

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event.data.object as any;

  let customerId: string | null = null;
  if (stripeData.customer && typeof stripeData.customer === 'string') customerId = stripeData.customer;
  if (!customerId && stripeData.id && event.type === 'customer.created') customerId = stripeData.id;

  if (!customerId) return console.error(`No customer ID found in event: ${event.type}`);

  // Map Stripe customer to Supabase user
  const { data: customerMapping, error: customerMappingError } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', customerId)
    .maybeSingle();

  if (customerMappingError || !customerMapping) return console.error(`No user found for customer: ${customerId}`);
  const userId = customerMapping.user_id;

  // Handle relevant Stripe events
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.payment_succeeded':
      await syncSubscription(customerId, userId);
      break;

    case 'checkout.session.completed':
      const session = stripeData as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.subscription) await syncSubscription(customerId, userId);
      break;

    default:
      console.warn(`Unhandled Stripe event: ${event.type}`);
  }
}

async function syncSubscription(customerId: string, userId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'all' });
    const subscription = subscriptions.data[0];

    let subscriptionStatus = 'canceled';
    let subscriptionTier = 'free';
    let trialEnd: number | null = null;
    let priceId: string | null = null;

    if (subscription) {
      subscriptionStatus = subscription.status;
      priceId = subscription.items.data[0]?.price?.id ?? null;
      trialEnd = subscription.trial_end;

      if (subscriptionStatus === 'trialing') {
        subscriptionTier = 'trial';
      } else if (subscriptionStatus === 'active') {
        const product = getProductByPriceId(priceId!);
        subscriptionTier = product?.name.toLowerCase() ?? 'free';
      } else {
        subscriptionTier = 'free';
      }
    }

    // Upsert subscription in Supabase
    await supabase.from('stripe_user_subscriptions').upsert({
      customer_id: customerId,
      user_id: userId,
      subscription_id: subscription?.id ?? null,
      price_id: priceId,
      subscription_status: subscriptionStatus,
      updated_at: new Date().toISOString(),
    }, { onConflict: ['customer_id'] });

    // Update profile table
    const profileUpdates: any = {
      subscription_tier: subscriptionTier,
      is_active_subscription: subscriptionStatus === 'active' || subscriptionStatus === 'trialing',
    };
    if (trialEnd) profileUpdates.trial_ends_at = new Date(trialEnd * 1000).toISOString();

    await supabase.from('profiles').update(profileUpdates).eq('id', userId);

    console.info(`Synced subscription for user ${userId} (Customer: ${customerId})`);
  } catch (err) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, err);
  }
}
