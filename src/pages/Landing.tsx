import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, BarChart3, Shield, Zap, Check } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="backdrop-blur-md bg-black/40 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <div className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-cyan-400 drop-shadow-glow" />
                <span className="font-extrabold text-xl text-white tracking-wide">
                  ReviewBoost
                </span>
              </div>
            </div>
            <div className="md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
              <Link
                to="/login"
                className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-cyan-400 transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-cyan-400 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl">
                  <span className="block xl:inline">Get more reviews with</span>{' '}
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent xl:inline">
                    ReviewBoost
                  </span>
                </h1>
                <p className="mt-5 text-lg text-gray-300 sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
                  Generate QR codes and short links that make it effortless for customers
                  to leave Google Business reviews. Track performance with powerful
                  analytics.
                </p>
                <div className="mt-8 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/signup"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                  >
                    Start 7-Day Free Trial
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 rounded-xl border border-cyan-400 text-cyan-400 font-semibold bg-black/40 hover:bg-black/60 transition"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 sm:h-72 md:h-96 lg:h-full flex items-center justify-center">
            <QrCode className="h-40 w-40 text-white opacity-25 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-black/30 backdrop-blur-xl border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-cyan-400 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need to boost your reviews
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-10">
            {[
              {
                title: 'QR Code Generation',
                desc: 'Create professional QR codes that link directly to your Google Business review page.',
                icon: <QrCode className="h-6 w-6" />,
              },
              {
                title: 'Analytics & Tracking',
                desc: 'Monitor scan rates, click-through rates, and review conversion metrics in real-time.',
                icon: <BarChart3 className="h-6 w-6" />,
              },
              {
                title: 'Short Links',
                desc: 'Generate memorable short links perfect for social media, emails, and marketing materials.',
                icon: <Zap className="h-6 w-6" />,
              },
              {
                title: 'Enterprise Security',
                desc: 'Bank-level security with encrypted data storage and secure payment processing.',
                icon: <Shield className="h-6 w-6" />,
              },
            ].map((f, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg hover:border-cyan-500 transition">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                  {f.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-3 text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-gray-950 py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Start free, upgrade when you're ready to grow
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-800 hover:border-cyan-500 transition overflow-hidden max-w-md">
              <div className="px-8 py-10">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-white">Pro Plan</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-cyan-400">$29.99</span>
                    <span className="ml-2 text-xl text-gray-400">/month</span>
                  </div>
                  <p className="mt-4 text-lg text-gray-400">ReviewBoostSC Plan</p>
                </div>
                <ul className="mt-8 space-y-4">
                  {[
                    'Unlimited QR codes',
                    'Unlimited short links',
                    'Advanced analytics',
                    'Custom branding',
                    'Priority support',
                    'Export data',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="flex-shrink-0 h-5 w-5 text-cyan-400" />
                      <span className="ml-3 text-base text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    to="/signup"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border border-transparent rounded-xl py-3 px-6 flex items-center justify-center text-base font-medium text-white shadow-lg transition-all"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <QrCode className="h-6 w-6 text-cyan-400" />
              <span className="font-bold text-lg text-white tracking-wide">ReviewBoost</span>
            </div>
            <p className="mt-4 text-base text-gray-500">
              © 2025 ReviewBoost. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
