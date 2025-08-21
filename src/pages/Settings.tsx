import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionStatus } from '../components/SubscriptionStatus';
import { CreditCard, Building, User } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    companyName: profile?.company_name || '',
    googleBusinessUrl: profile?.google_business_url || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        company_name: formData.companyName,
        google_business_url: formData.googleBusinessUrl,
      });
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const openBillingPortal = () => {
    toast.info('Stripe Customer Portal will be integrated here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased p-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            Manage your account and billing preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-cyan-400" />
              Profile Information
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-xl border border-gray-700 bg-gray-900/60 shadow-sm sm:text-sm text-gray-400"
                />
                <p className="mt-1 text-sm text-gray-400">Email cannot be changed</p>
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label htmlFor="googleBusinessUrl" className="block text-sm font-medium text-gray-300">
                  Default Google Business URL
                </label>
                <input
                  type="url"
                  id="googleBusinessUrl"
                  value={formData.googleBusinessUrl}
                  onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-gray-700 placeholder-gray-500 text-gray-200 bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="https://g.page/your-business/review"
                />
                <p className="mt-1 text-sm text-gray-400">Used as default when creating new QR codes</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Subscription Status */}
        <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-cyan-400" />
              Subscription Status
            </h3>
          </div>
          <div className="p-6">
            <SubscriptionStatus />
            <div className="mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={openBillingPortal}
                className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Building className="h-4 w-4 mr-2" />
                Manage Billing
              </button>
              <p className="mt-2 text-sm text-gray-400">
                Update payment method, view invoices, and manage your subscription
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
