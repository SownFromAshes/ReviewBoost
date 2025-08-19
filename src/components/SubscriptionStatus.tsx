import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

export const SubscriptionStatus: React.FC = () => {
  const { subscription, loading, hasActiveSubscription, isSubscriptionCanceled, getCurrentPeriodEnd } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <XCircle className="h-6 w-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">No Active Subscription</h3>
            <p className="text-yellow-700">Subscribe to access all features.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (hasActiveSubscription()) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (isSubscriptionCanceled()) {
      return <XCircle className="h-6 w-6 text-red-600" />;
    } else {
      return <Clock className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    if (hasActiveSubscription()) {
      return 'bg-green-50 border-green-200';
    } else if (isSubscriptionCanceled()) {
      return 'bg-red-50 border-red-200';
    } else {
      return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = () => {
    switch (subscription.subscription_status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trial';
      case 'canceled':
        return 'Canceled';
      case 'past_due':
        return 'Past Due';
      case 'incomplete':
        return 'Incomplete';
      default:
        return subscription.subscription_status;
    }
  };

  const periodEnd = getCurrentPeriodEnd();

  return (
    <div className={`border rounded-lg p-6 ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              {subscription.product_name || 'Subscription'}
            </h3>
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium">{getStatusText()}</span>
            </p>
            {periodEnd && (
              <p className="text-sm text-gray-600">
                {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on{' '}
                <span className="font-medium">{periodEnd.toLocaleDateString()}</span>
              </p>
            )}
          </div>
        </div>
        <CreditCard className="h-5 w-5 text-gray-400" />
      </div>
      
      {subscription.payment_method_brand && subscription.payment_method_last4 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Payment method: {subscription.payment_method_brand.toUpperCase()} ending in {subscription.payment_method_last4}
          </p>
        </div>
      )}
    </div>
  );
};