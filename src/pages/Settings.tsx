import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account and billing preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label htmlFor="googleBusinessUrl" className="block text-sm font-medium text-gray-700">
                  Default Google Business URL
                </label>
                <input
                  type="url"
                  id="googleBusinessUrl"
                  value={formData.googleBusinessUrl}
                  onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://g.page/your-business/review"
                />
                <p className="mt-1 text-sm text-gray-500">Used as default when creating new QR codes</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Billing Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Billing & Subscription
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Current Plan</h4>
                  <p className="text-sm text-gray-500">
                    {profile?.subscription_status === 'trial' ? 'Free Trial' : 'Pro Plan'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.subscription_status === 'trial' ? '$0/month' : '$29/month'}
                  </p>
                  {profile?.trial_ends_at && profile.subscription_status === 'trial' && (
                    <p className="text-sm text-gray-500">
                      Trial ends {new Date(profile.trial_ends_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Unlimited QR codes</li>
                  <li>• Advanced analytics</li>
                  <li>• Custom short links</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={openBillingPortal}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Manage Billing
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Update payment method, view invoices, and manage your subscription
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};