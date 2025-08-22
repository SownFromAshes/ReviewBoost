import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Mail, Building, Calendar } from 'lucide-react';

interface User {
  id: string;
  email: string;
  company_name: string | null;
  subscription_status: string; // This is from stripe_user_subscriptions
  subscription_tier: string; // This is from profiles
  trial_ends_at: string | null;
  created_at: string;
}

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles and join with stripe_user_subscriptions to get full status
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          company_name,
          created_at,
          subscription_tier,
          trial_ends_at,
          stripe_user_subscriptions (
            subscription_status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to the User interface, handling the joined table
      const mappedUsers: User[] = data.map((profile: any) => ({
        id: profile.id,
        email: profile.email,
        company_name: profile.company_name,
        subscription_tier: profile.subscription_tier,
        trial_ends_at: profile.trial_ends_at,
        subscription_status: profile.stripe_user_subscriptions ? profile.stripe_user_subscriptions.subscription_status : 'N/A',
        created_at: profile.created_at,
      }));
      
      setUsers(mappedUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'starter':
      case 'growth':
      case 'pro':
        return 'bg-green-900/30 text-green-300';
      case 'trial':
      case 'trialing':
        return 'bg-yellow-900/30 text-yellow-300';
      case 'canceled':
      case 'free':
        return 'bg-red-900/30 text-red-300';
      default:
        return 'bg-gray-900/30 text-gray-300';
    }
  };

  const totalUsers = users.length;
  const activeSubscriptions = users.filter(u => u.subscription_tier === 'starter' || u.subscription_tier === 'growth' || u.subscription_tier === 'pro').length;
  const trialUsers = users.filter(u => u.subscription_tier === 'trial').length;
  const freeUsers = users.filter(u => u.subscription_tier === 'free').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased p-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            Manage users and monitor platform activity
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    Paid Subscriptions
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {activeSubscriptions}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    Trial Users
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {trialUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    Free/Canceled Users
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {freeUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 mt-6">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stripe Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trial Ends
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-white">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.company_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.subscription_tier)}`}>
                      {user.subscription_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.subscription_status)}`}>
                      {user.subscription_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.trial_ends_at ? new Date(user.trial_ends_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
