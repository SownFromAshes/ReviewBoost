import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BarChart3, QrCode, Users, TrendingUp } from 'lucide-react';

interface QRCodeData {
  id: string;
  title: string;
  scan_count: number;
  created_at: string;
}

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('id, title, scan_count, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setQrCodes(data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalScans = qrCodes.reduce((sum, code) => sum + code.scan_count, 0);
  const totalCodes = qrCodes.length;

  const stats = [
    {
      name: 'Total QR Codes',
      value: totalCodes.toString(),
      icon: QrCode,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Scans',
      value: totalScans.toString(),
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      name: 'Avg. Scans per Code',
      value: totalCodes > 0 ? Math.round(totalScans / totalCodes).toString() : '0',
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
    {
      name: 'Active Campaigns',
      value: totalCodes.toString(),
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  const trialDaysRemaining = profile?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased p-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            Welcome back, {profile?.company_name || 'there'}!
          </p>
        </div>
      </div>

      {/* Trial Status */}
      {profile?.subscription_status === 'trial' && (
        <div className="rounded-md bg-yellow-900/30 border border-yellow-700 p-4">
          <div className="flex">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-300">
                Free Trial Active
              </h3>
              <p className="text-sm text-yellow-400">
                {trialDaysRemaining > 0 
                  ? `${trialDaysRemaining} days remaining in your free trial.`
                  : 'Your trial has expired.'
                } Upgrade to continue using ReviewBoost.
              </p>
            </div>
            <button className="ml-3 text-sm font-medium text-yellow-300 hover:text-yellow-200">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`inline-flex items-center justify-center p-3 rounded-md ${stat.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-300 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent QR Codes */}
      <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Recent QR Codes</h3>
        </div>
        <div className="px-6 py-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
            </div>
          ) : qrCodes.length === 0 ? (
            <div className="text-center py-8">
              <QrCode className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-white">No QR codes yet</h3>
              <p className="mt-1 text-sm text-gray-300">
                Get started by creating your first QR code.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/60">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Scans
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-700">
                  {qrCodes.map((code) => (
                    <tr key={code.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {code.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {code.scan_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(code.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
