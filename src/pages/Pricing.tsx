import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products, Product } from '../stripe-config';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Check, X, Loader2 } from 'lucide-react';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handlePurchase = async (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoadingProductId(product.id);
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
    } finally {
      setLoadingProductId(null);
                className="relative bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-cyan-500 ring-2 ring-cyan-500 p-8 flex flex-col"
  // Define features for the test product
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Recommended
                </div>
    'Template library',
    'Priority support',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased p-6">
      <div className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Choose Your ReviewBoost Plan
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            Boost your online reputation and customer engagement with our comprehensive QR code solution.
          </p>
                  {productFeatures.map((feature, idx) => (

        {/* Pricing Card */}
        <div className="mt-12 flex justify-center">
          <div className="max-w-md w-full">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`relative bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-8 flex flex-col ${
                product.name === 'Growth' ? 'border-cyan-500 ring-2 ring-cyan-500' : ''
              }`}
                    disabled={loadingProductId === product.id}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              {product.name === 'Growth' && (
                    {loadingProductId === product.id ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
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
          </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {productFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="flex-shrink-0 h-5 w-5 text-green-400 mt-0.5" />
                  <span className="ml-3 text-base text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
