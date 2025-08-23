import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Star, Zap, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { products } from '../stripe-config';

export const Landing: React.FC = () => {
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
                to="/pricing"
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pricing
              </Link>
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Boost Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Google Reviews
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Generate dynamic QR codes that drive customers to your Google Business review page. 
              Update destinations anytime without reprinting.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 md:py-4 md:text-lg md:px-10"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need to grow your reviews
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  <QrCode className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">Dynamic QR Codes</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Update destinations anytime without reprinting. Perfect for changing review links or menu updates.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">Review Analytics</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Track scan counts and monitor which QR codes drive the most customer engagement.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">Custom Branding</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Add your logo and customize colors to match your brand identity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Simple, transparent pricing
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white mb-4">
                  Recommended
                </div>
                <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                <p className="mt-2 text-gray-300">{product.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">${product.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-medium text-white mb-4">What's Included:</h4>
                <ul className="space-y-3">
                  {[
                    'Dynamic QR code generation',
                    'Custom branding and colors',
                    'Scan analytics and tracking',
                    'Google Business integration',
                    'Mobile-responsive design',
                    'Email support'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your reviews?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-cyan-100">
            Join businesses already using ReviewBoost to grow their online reputation.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-cyan-600 bg-white hover:bg-gray-50 sm:w-auto"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
};