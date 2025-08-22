import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  // Determine the customer ID from the event object
  let customerId: string | null = null;
  if ('customer' in stripeData && typeof stripeData.customer === 'string') {
    customerId = stripeData.customer;
  } else if ('id' in stripeData && event.type === 'customer.created') {
    customerId = stripeData.id as string;
  } else if ('customer' in stripeData && typeof stripeData.customer === 'object' && stripeData.customer !== null && 'id' in stripeData.customer) {
    customerId = (stripeData.customer as { id: string }).id;
  }

  if (!customerId) {
    console.error(`No customer ID found in event: ${JSON.stringify(event)}`);
    return;
  }

  // Fetch the user_id associated with this customer_id from our database
  const { data: customerMapping, error: customerMappingError } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', customerId)
    .maybeSingle();

  if (customerMappingError || !customerMapping) {
    console.error(`User ID not found for customer_id: ${customerId}`, customerMappingError);
    return;
  }

  const userId = customerMapping.user_id;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.payment_succeeded': // For status changes like 'past_due' to 'active'
      await syncSubscriptionStatus(customerId, userId);
      break;
    case 'checkout.session.completed':
      const session = stripeData as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.subscription) {
        await syncSubscriptionStatus(customerId, userId);
      } else if (session.mode === 'payment' && session.payment_status === 'paid') {
        // Handle one-time payments if needed, e.g., record in a separate table
        console.info(`One-time payment completed for customer: ${customerId}`);
      }
      break;
    // Add other event types as needed, e.g., 'customer.subscription.trial_will_end'
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }
}

async function syncSubscriptionStatus(customerId: string, userId: string) {
  try {
    // Fetch the latest subscription data from Stripe for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1, // Assuming one active subscription per customer
      status: 'all', // Include all statuses to get the most recent state
      expand: ['data.default_payment_method', 'data.plan.product'], // Expand product to get name
    });

    const subscription = subscriptions.data[0];

    let subscriptionStatus: string = 'canceled'; // Default to canceled if no subscription found or it's truly ended
    let priceId: string | null = null;
    let currentPeriodStart: number | null = null;
    let currentPeriodEnd: number | null = null;
    let cancelAtPeriodEnd: boolean = false;
    let paymentMethodBrand: string | null = null;
    let paymentMethodLast4: string | null = null;
    let trialEnd: number | null = null;
    let subscriptionTier: string = 'free'; // Default tier

    if (subscription) {
      subscriptionStatus = subscription.status;
      priceId = subscription.items.data[0]?.price?.id || null;
      currentPeriodStart = subscription.current_period_start;
      currentPeriodEnd = subscription.current_period_end;
      cancelAtPeriodEnd = subscription.cancel_at_period_end;
      trialEnd = subscription.trial_end;

      if (subscription.default_payment_method && typeof subscription.default_payment_method !== 'string') {
        paymentMethodBrand = subscription.default_payment_method.card?.brand || null;
        paymentMethodLast4 = subscription.default_payment_method.card?.last4 || null;
      }

      // Determine subscription tier based on price_id
      if (priceId) {
        // This mapping should match your stripe-config.ts
        if (priceId.includes('Starter')) { // Using includes for flexibility, better to use exact IDs
          subscriptionTier = 'starter';
        } else if (priceId.includes('Growth')) {
          subscriptionTier = 'growth';
        } else if (priceId.includes('Pro')) {
          subscriptionTier = 'pro';
        }
      }

      if (subscriptionStatus === 'trialing') {
        subscriptionTier = 'trial';
      } else if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
        // If not active or trialing, and there's a subscription object, it's likely canceled/incomplete/past_due
        subscriptionTier = 'free'; // Or 'canceled', depending on how you want to categorize
      }
    } else {
      // No active subscription found for the customer, ensure profile reflects 'free'
      subscriptionTier = 'free';
      subscriptionStatus = 'canceled'; // Explicitly set status if no subscription object
    }

    // Update stripe_user_subscriptions table
    const { error: upsertSubError } = await supabase
      .from('stripe_user_subscriptions')
      .upsert({
        customer_id: customerId,
        user_id: userId,
        subscription_id: subscription?.id || null,
        price_id: priceId,
        subscription_status: subscriptionStatus,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: cancelAtPeriodEnd,
        payment_method_brand: paymentMethodBrand,
        payment_method_last4: paymentMethodLast4,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'customer_id' });

    if (upsertSubError) {
      console.error('Error upserting stripe_user_subscriptions:', upsertSubError);
      throw new Error('Failed to upsert subscription in database');
    }

    // Update profiles table
    const isProfileActive = (subscriptionStatus === 'active' || subscriptionStatus === 'trialing');
    const profileTrialEndsAt = trialEnd ? new Date(trialEnd * 1000).toISOString() : null;

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: subscriptionTier,
        is_active_subscription: isProfileActive,
        trial_ends_at: profileTrialEndsAt,
      })
      .eq('id', userId);

    if (updateProfileError) {
      console.error('Error updating user profile subscription status:', updateProfileError);
      throw new Error('Failed to update user profile in database');
    }

    console.info(`Successfully synced subscription for user ${userId} (Customer: ${customerId}). Tier: ${subscriptionTier}, Status: ${subscriptionStatus}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId} (User: ${userId}):`, error);
    throw error;
  }
}
