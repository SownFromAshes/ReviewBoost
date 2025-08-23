import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: { name: 'Bolt Integration', version: '1.0.0' },
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
  if (status === 204) return new Response(null, { status, headers });
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') return corsResponse({}, 204);
    if (req.method !== 'POST') return corsResponse({ error: 'Method not allowed' }, 405);

    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) return corsResponse({ error: 'Authorization header missing' }, 401);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (getUserError) return corsResponse({ error: 'Failed to authenticate user' }, 401);
    if (!user) return corsResponse({ error: 'User not found' }, 404);

    // Fetch Stripe customer ID from Supabase
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Error fetching customer from database:', getCustomerError);
      return corsResponse({ error: 'Failed to fetch customer information' }, 500);
    }

    if (!customer?.customer_id) {
      return corsResponse({ error: 'Customer not found or not linked to Stripe.' }, 404);
    }

    // Create Stripe billing portal session
    const returnUrl = req.headers.get('origin') ?? `${Deno.env.get('VITE_SUPABASE_URL')}/settings`;
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.customer_id,
      return_url: returnUrl,
    });

    console.log(`Created billing portal session for user ${user.id}, customer ${customer.customer_id}`);
    return corsResponse({ url: portalSession.url });
  } catch (error: any) {
    console.error('Billing portal error:', error);
    return corsResponse({ error: error.message }, 500);
  }
});
