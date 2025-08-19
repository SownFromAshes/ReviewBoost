import React, { useState } from 'react';
import { Product } from '../stripe-config';
import { Check, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => Promise<void>;
  isPopular?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPurchase, isPopular = false }) => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await onPurchase(product);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${isPopular ? 'ring-2 ring-blue-500' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="px-6 py-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900">{product.name}</h3>
          <div className="mt-4 flex items-baseline justify-center">
            <span className="text-5xl font-extrabold text-gray-900">${product.price}</span>
            {product.mode === 'subscription' && (
              <span className="ml-1 text-xl text-gray-500">/month</span>
            )}
          </div>
          <p className="mt-4 text-lg text-gray-500">{product.description}</p>
        </div>
        
        <div className="mt-8">
          <ul className="space-y-4">
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span className="ml-3 text-base text-gray-700">Unlimited QR codes</span>
            </li>
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span className="ml-3 text-base text-gray-700">Advanced analytics</span>
            </li>
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span className="ml-3 text-base text-gray-700">Custom short links</span>
            </li>
            <li className="flex items-start">
              <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
              <span className="ml-3 text-base text-gray-700">Priority support</span>
            </li>
          </ul>
          
          <div className="mt-8">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-5 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                `${product.mode === 'subscription' ? 'Subscribe' : 'Purchase'} Now`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};