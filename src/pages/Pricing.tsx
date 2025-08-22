import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products, Product } from '../stripe-config';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePurchase = async (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
    }
  };

  // Define features for each tier for display purposes
  const tierFeatures = {
    Starter: [
      '2 dynamic QR codes',
      'Branded QR design (logo, color)',
      'Google Review linking',
      'Basic scan analytics',
      'Email support',
    ],
    Growth: [
      'Unlimited dynamic QR codes',
      'Advanced analytics (time of day, location of scans)',
      'Negative review filter (private feedback option)',
      'Automated monthly performance email',
      'Template library (restaurants, salons, dentists, gyms, etc.)',
      'Priority support',
    ],
    'Pro / Agency': [
      'Everything in Growth',
      'Multi-location dashboards',
      'Team accounts (staff logins per branch)',
      'White-label branding (agency re-sell)',
      'API access / Zapier integration',
      'Exportable analytics reports',
    ],
  };

  // Define features for the comparison table
  const comparisonFeatures = [
    { name: 'Dynamic QR Codes', Starter: '2', Growth: 'Unlimited', Pro: 'Unlimited' },
    { name: 'Branded QR', Starter: true, Growth: true, Pro: true },
    { name: 'Google Review Linking', Starter: true, Growth: true, Pro: true },
    { name: 'Analytics', Starter: 'Basic', Growth: 'Advanced', Pro: 'Advanced + Export' },
    { name: 'Negative Review Capture', Starter: false, Growth: true, Pro: true },
    { name: 'Templates', Starter: false, Growth: true, Pro: true },
    { name: 'Multi-location', Starter: false, Growth: false, Pro: true },
    { name: 'White-label / API', Starter: false, Growth: false, Pro: true },
    { name: 'Team Accounts', Starter: false, Growth: false, Pro: true },
    { name: 'Priority Support', Starter: false, Growth: true, Pro: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased p-6">
      <div className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Pick the Plan That Fits Your Business
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            Choose the perfect plan to boost your online reputation and customer engagement.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`relative bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-8 flex flex-col ${
                product.name === 'Growth' ? 'border-cyan-500 ring-2 ring-cyan-500' : ''
              }`}
            >
              {product.name === 'Growth' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-white text-center">
                {product.name}
              </h3>
              <p className="mt-4 text-center">
                <span className="text-5xl font-extrabold text-cyan-400">
                  ${product.price}
                </span>
                <span className="text-xl font-medium text-gray-400">/mo</span>
              </p>
              <p className="mt-4 text-sm text-gray-300 text-center">
                {product.description}
              </p>

              <ul className="mt-8 space-y-4 flex-1">
                {tierFeatures[product.name as keyof typeof tierFeatures].map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-3 text-base text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => handlePurchase(product)}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <h3 className="text-3xl font-extrabold text-white text-center mb-8">
            Detailed Feature Comparison
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Starter <br /> $19/mo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider relative">
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      Recommended
                    </span>
                    Growth <br /> $49/mo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pro / Agency <br /> $149/mo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-gray-700">
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                      {typeof feature.Starter === 'boolean' ? (
                        feature.Starter ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                      ) : (
                        feature.Starter
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                      {typeof feature.Growth === 'boolean' ? (
                        feature.Growth ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                      ) : (
                        feature.Growth
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                      {typeof feature.Pro === 'boolean' ? (
                        feature.Pro ? <Check className="h-5 w-5 text-green-400 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                      ) : (
                        feature.Pro
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
