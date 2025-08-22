import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getProductByPriceId } from '../stripe-config';

export interface Subscription {
  customer_id: string;
  user_id: string; // Added user_id
  subscription_id: string | null;
  price_id: string | null;
  subscription_status: string; // e.g., 'active', 'trialing', 'canceled', 'past_due', 'incomplete'
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  product_name?: string; // Derived from price_id
  // New fields from profiles table, synced by webhook
  subscription_tier?: string; // 'free', 'trial', 'starter', 'growth', 'pro'
  trial_ends_at?: string | null; // ISO string
  is_active_subscription?: boolean; // Derived from Stripe status and trial_ends_at
}

export const useSubscription = () => {
  const { user, profile } = useAuth(); // Get profile from AuthContext
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile) { // Wait for user and profile to be loaded
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user, profile]); // Depend on user and profile

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from stripe_user_subscriptions table
      const { data, error: fetchError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .eq('user_id', user?.id) // Ensure we query by user_id
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      let currentSubscription: Subscription | null = null;

      if (data) {
        const product = data.price_id ? getProductByPriceId(data.price_id) : null;
        currentSubscription = {
          ...data,
          product_name: product?.name,
          // These fields are now primarily sourced from the 'profiles' table,
          // which is updated by the webhook for consistency.
          subscription_tier: profile?.subscription_tier,
          trial_ends_at: profile?.trial_ends_at,
          is_active_subscription: profile?.is_active_subscription,
        };
      } else {
        // If no entry in stripe_user_subscriptions, default to profile's status
        currentSubscription = {
          customer_id: '', // No Stripe customer ID yet
          user_id: user.id,
          subscription_id: null,
          price_id: null,
          subscription_status: profile?.subscription_tier === 'trial' ? 'trialing' : 'free', // Default based on profile
          current_period_start: null,
          current_period_end: null,
          cancel_at_period_end: false,
          payment_method_brand: null,
          payment_method_last4: null,
          product_name: profile?.subscription_tier === 'trial' ? 'Trial' : (profile?.subscription_tier === 'free' ? 'Free' : 'ReviewBoostSC Test'),
          subscription_tier: profile?.subscription_tier || 'free',
          trial_ends_at: profile?.trial_ends_at,
          is_active_subscription: profile?.is_active_subscription || false,
        };
      }
      setSubscription(currentSubscription);

    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  // This function now relies on the profile's is_active_subscription field,
  // which is accurately updated by the webhook.
  const hasActiveSubscription = () => {
    return profile?.is_active_subscription || false;
  };

  const isSubscriptionCanceled = () => {
    return subscription?.subscription_status === 'canceled';
  };

  const getCurrentPeriodEnd = () => {
    if (!subscription?.current_period_end) return null;
    return new Date(subscription.current_period_end * 1000);
  };

  return {
    subscription,
    loading,
    error,
    hasActiveSubscription,
    isSubscriptionCanceled,
    getCurrentPeriodEnd,
    refetch: fetchSubscription, // Allow refetching subscription data
  };
};
