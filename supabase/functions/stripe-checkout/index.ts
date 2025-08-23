import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: { name: 'Bolt Integration', version: '1.0.0' },
});

// Helper function for CORS responses
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
  if (status === 204) return new Response(null, { status, headers });
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

// Main edge function
Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') return corsResponse({}, 204);
    if (req.method !== 'POST') return corsResponse({ error: 'Method not allowed' }, 405);

    const { price_id, success_url, cancel_url, mode } = await req.json();

    const validationError = validateParameters(
      { price_id, success_url, cancel_url, mode },
      {
        cancel_url: 'string',
        price_id: 'string',
        success_url: 'string',
        mode: { values: ['payment', 'subscription'] },
      }
    );
    if (validationError) return corsResponse({ error: validationError }, 400);

    // Authenticate user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);
    if (getUserError) return corsResponse({ error: 'Failed to authenticate user' }, 401);
    if (!user) return corsResponse({ error: 'User not found' }, 404);

    // Fetch existing Stripe customer
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer info:', getCustomerError);
      return corsResponse({ error: 'Failed to fetch customer information' }, 500);
    }

    let customerId: string;

    // Create Stripe customer if not exists
    if (!customer || !customer.customer_id) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      console.log(`Created Stripe customer ${newCustomer.id} for user ${user.id}`);

      const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
        user_id: user.id,
        customer_id: newCustomer.id,
      });
      if (createCustomerError) {
        console.error('Failed to save customer mapping:', createCustomerError);
        try {
          await stripe.customers.del(newCustomer.id);
          await supabase.from('stripe_subscriptions').delete().eq('customer_id', newCustomer.id);
        } catch (cleanupError) {
          console.error('Failed cleanup after customer insert error:', cleanupError);
        }
        return corsResponse({ error: 'Failed to create customer mapping' }, 500);
      }

      // Create subscription record if mode is subscription
      if (mode === 'subscription') {
        const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
          customer_id: newCustomer.id,
          status: 'not_started',
        });
        if (createSubscriptionError) {
          console.error('Failed to save subscription record:', createSubscriptionError);
          try { await stripe.customers.del(newCustomer.id); } catch {}
          return corsResponse({ error: 'Unable to save subscription in database' }, 500);
        }
      }

      customerId = newCustomer.id;
      console.log(`Setup new customer ${customerId} with subscription record`);
    } else {
      customerId = customer.customer_id;

      // Ensure subscription record exists for existing customer
      if (mode === 'subscription') {
        const { data: subscription, error: getSubscriptionError } = await supabase
          .from('stripe_subscriptions')
          .select('status')
          .eq('customer_id', customerId)
          .maybeSingle();

        if (getSubscriptionError) {
          console.error('Failed fetching subscription info:', getSubscriptionError);
          return corsResponse({ error: 'Failed to fetch subscription info' }, 500);
        }

        if (!subscription) {
          const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: customerId,
            status: 'not_started',
          });
          if (createSubscriptionError) {
            console.error('Failed creating subscription for existing customer:', createSubscriptionError);
            return corsResponse({ error: 'Failed to create subscription record' }, 500);
          }
        }
      }
    }

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: price_id, quantity: 1 }],
      mode,
      success_url,
      cancel_url,
    });

    console.log(`Created checkout session ${session.id} for customer ${customerId}`);
    return corsResponse({ sessionId: session.id, url: session.url });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return corsResponse({ error: error.message }, 500);
  }
});

// Parameter validation helpers
type ExpectedType = 'string' | { values: string[] };
type Expectations<T> = { [K in keyof T]: ExpectedType };
function validateParameters<T extends Record<string, any>>(values: T, expected: Expectations<T>): string | undefined {
  for (const param in values) {
    const expectation = expected[param];
    const value = values[param];

    if (expectation === 'string') {
      if (value == null) return `Missing required parameter ${param}`;
      if (typeof value !== 'string') return `Expected parameter ${param} to be a string got ${JSON.stringify(value)}`;
    } else {
      if (!expectation.values.includes(value)) return `Expected parameter ${param} to be one of ${expectation.values.join(', ')}`;
    }
  }
  return undefined;
}
