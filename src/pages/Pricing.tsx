import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, QrCode } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../stripe-config';

export const Pricing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const product = products[0]; // Get the single product

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-black/40 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-cyan-400" />
                <span className="font-bold text-xl text-white">ReviewBoost</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Simple, Transparent</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Pricing
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Start your free trial today. No credit card required.
          </p>
        </div>

        {/* Single Product Card */}
        <div className="mt-16 flex justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full relative">
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">
                Recommended
              </div>
            </div>

            <div className="text-center pt-4">
              <h3 className="text-2xl font-bold text-white">{product.name}</h3>
              <p className="mt-2 text-gray-300">{product.description}</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-white">${product.price}</span>
                <span className="text-gray-300 text-lg">/month</span>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-white mb-6">Everything you need:</h4>
              <ul className="space-y-4">
                {[
                  'Dynamic QR code generation',
                  'Custom branding and colors',
                  'Logo upload and embedding',
                  'Scan analytics and tracking',
                  'Google Business integration',
                  'Mobile-responsive design',
                  'Email support',
                  'Unlimited updates'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <ProductCard
                product={product}
                loading={loading}
                setLoading={setLoading}
                className="w-full"
              />
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Start with a free trial. Cancel anytime.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  What makes ReviewBoost different from other QR code generators?
                </h3>
                <p className="text-gray-300">
                  ReviewBoost creates dynamic QR codes that you can update anytime without reprinting. 
                  Change your Google Business review link, menu URL, or any destination instantly.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  How does the free trial work?
                </h3>
                <p className="text-gray-300">
                  Start with a free trial that includes all features. No credit card required to begin. 
                  Upgrade anytime to continue using ReviewBoost after your trial ends.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-300">
                  Yes, you can cancel your subscription at any time through your account settings. 
                  Your QR codes will remain active until the end of your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <QrCode className="h-6 w-6 text-cyan-400" />
              <span className="font-bold text-lg text-white">ReviewBoost</span>
            </div>
            <p className="text-gray-400">
              © 2025 ReviewBoost. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};