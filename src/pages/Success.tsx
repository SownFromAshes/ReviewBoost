import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../contexts/AuthContext';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, profile, isLoading: isUserLoading } = useAuth();
  const { refetch, loading: subscriptionLoading } = useSubscription();
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    const refreshData = async () => {
      if (!user || !profile) return;

      setIsRefetching(true);

      // Give webhook a moment to process subscription
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        await refetch();
      } catch (err) {
        console.error('Error refetching subscription:', err);
      } finally {
        setIsRefetching(false);
      }
    };

    if (sessionId && user && profile) {
      refreshData();
    }
  }, [sessionId, user, profile, refetch]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/30 border border-green-700">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your subscription is now active.
          </p>
        </div>

        {/* Real-time updating subscription */}
        {(isRefetching || subscriptionLoading) && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-md p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
              <p className="text-sm text-blue-300">
                Updating your subscription...
              </p>
            </div>
          </div>
        )}

        <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-4">What's Next?</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
              <span>Your subscription is now active</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
              <span>You can now create unlimited QR codes</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
              <span>Access to advanced analytics and features</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/qr-codes"
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-700 rounded-xl shadow-sm text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
          >
            Create Your First QR Code
          </Link>
        </div>

        {sessionId && (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Session ID: {sessionId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
