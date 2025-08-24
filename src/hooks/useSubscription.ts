import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getProductByPriceId } from '../stripe-config';

export interface Subscription {
  customer_id: string;
  user_id: string;
  subscription_id: string | null;
  price_id: string | null;
  subscription_status: string;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  product_name?: string;
  subscription_tier?: string;
  trial_ends_at?: string | null;
  is_active_subscription?: boolean;
}

export const useSubscription = () => {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription from Supabase
  const fetchSubscription = useCallback(async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const currentSubscription: Subscription = data
        ? {
            ...data,
            product_name: data.price_id ? getProductByPriceId(data.price_id)?.name : undefined,
            subscription_tier: profile.subscription_tier,
            trial_ends_at: profile.trial_ends_at,
            is_active_subscription: profile.is_active_subscription,
          }
        : {
            customer_id: '',
            user_id: user.id,
            subscription_id: null,
            price_id: null,
            subscription_status: profile.subscription_tier === 'trial' ? 'trialing' : 'free',
            current_period_start: null,
            current_period_end: null,
            cancel_at_period_end: false,
            payment_method_brand: null,
            payment_method_last4: null,
            product_name:
              profile.subscription_tier === 'trial'
                ? 'Trial'
                : profile.subscription_tier === 'free'
                ? 'Free'
                : 'ReviewBoostSC Test',
            subscription_tier: profile.subscription_tier || 'free',
            trial_ends_at: profile.trial_ends_at,
            is_active_subscription: profile.is_active_subscription || false,
          };

      setSubscription(currentSubscription);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // --------------------------
  // Real-time subscription to profile changes using Supabase v2 channels
  // --------------------------
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        payload => {
          console.log('Profile updated', payload);
          fetchSubscription(); // refetch subscription when profile updates
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchSubscription]);

  const hasActiveSubscription = () => profile?.is_active_subscription || false;
  const isSubscriptionCanceled = () => subscription?.subscription_status === 'canceled';
  const getCurrentPeriodEnd = () =>
    subscription?.current_period_end ? new Date(subscription.current_period_end * 1000) : null;

  return {
    subscription,
    loading,
    error,
    hasActiveSubscription,
    isSubscriptionCanceled,
    getCurrentPeriodEnd,
    refetch: fetchSubscription,
  };
};