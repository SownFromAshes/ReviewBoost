import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Subscription {
  id: string;
  user_id: string;
  customer_id: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  product_name: string | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  subscription_tier: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user, profile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setSubscription(data || null);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = (): boolean => {
    if (!subscription || !subscription.subscription_status) {
      return profile?.subscription_tier === 'trial' || false;
    }
    return ['active', 'trialing'].includes(subscription.subscription_status);
  };

  const isSubscriptionCanceled = (): boolean => {
    return subscription?.subscription_status === 'canceled' || subscription?.cancel_at_period_end || false;
  };

  const getCurrentPeriodEnd = (): Date | null => {
    if (subscription?.current_period_end) {
      return new Date(subscription.current_period_end);
    }
    if (profile?.trial_ends_at) {
      return new Date(profile.trial_ends_at);
    }
    return null;
  };

  return {
    subscription,
    loading,
    hasActiveSubscription,
    isSubscriptionCanceled,
    getCurrentPeriodEnd,
    refetch: fetchSubscription,
  };
};