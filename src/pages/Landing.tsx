import React from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  BarChart3,
  Shield,
  Zap,
  Check,
  DollarSign,
  RefreshCw,
  Users,
  Handshake,
  Lightbulb,
  TrendingUp,
  Smartphone,
  X,
  CreditCard,
} from 'lucide-react';

// Products & Features
const products = [
  { id: 'prod_Starter_ID', priceId: 'price_Starter_Monthly', name: 'Starter', description: 'For solopreneurs & micro-SMBs.', price: 19 },
  { id: 'prod_Growth_ID', priceId: 'price_Growth_Monthly', name: 'Growth', description: 'Designed for 1–5 location businesses.', price: 49 },
  { id: 'prod_Pro_ID', priceId: 'price_Pro_Monthly', name: 'Pro', description: 'For franchises, agencies, or multi-location SMBs.', price: 149 },
];

const tierFeatures: Record<string, string[]> = {
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
  Pro: [
    'Everything in Growth',
    'Multi-location dashboards',
    'Team accounts (staff logins per branch)',
    'White-label branding (agency re-sell)',
    'API access / Zapier integration',
    'Exportable analytics reports',
  ],
};

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

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans antialiased">

      {/* Header */}
      <header className="backdrop-blur-md bg-black/40 border-b border-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-8">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <div className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-cyan-400 drop-shadow-glow" />
                <span className="font-extrabold text-xl text-white tracking-wide">ReviewBoost</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-3 md:flex-1 md:space-x-4 lg:w-0">
              <Link to="/pricing" className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-cyan-400 transition py-2 px-3 rounded-xl hidden md:inline-flex items-center">
                <DollarSign className="h-4 w-4 mr-1" /> Pricing
              </Link>
              <Link to="/login" className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-cyan-400 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300">
                Sign in
              </Link>
              <Link to="/signup" className="hidden md:inline-flex whitespace-nowrap text-base font-medium text-gray-300 hover:text-cyan-400 transition py-2 px-3 rounded-xl">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              Turn Every Customer Into a{' '}
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent xl:inline">
                5-Star Google Review
              </span>{' '}
              — Without Printing a Single New QR Code.
            </h1>
            <h2 className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-300">
              Dynamic QR codes that never go stale, giving your SMB more reviews, better reputation, and less hassle.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-xl text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 text-lg">
                Start Free Trial
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-xl text-center border border-cyan-400 text-cyan-400 font-semibold bg-black/40 hover:bg-black/60 transition text-lg">
                See How It Works
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative p-8 bg-gray-900/60 rounded-3xl shadow-2xl border border-gray-800">
              <QrCode className="h-48 w-48 text-cyan-400 opacity-70 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white text-gray-900 px-4 py-2 rounded-lg text-lg font-bold shadow-md flex items-center space-x-2">
                  <Smartphone className="h-6 w-6" />
                  <span>Scan & Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 sm:py-24 bg-black/30 backdrop-blur-xl border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Stop Losing Reviews Because Your QR Codes Are Outdated
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-red-500 text-white mx-auto">
                <DollarSign className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">Reprints cost money and slow you down</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-yellow-500 text-white mx-auto">
                <X className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">Outdated QR codes frustrate customers</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500 text-white mx-auto">
                <BarChart3 className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-semibold text-white">Low review count impacts search & credibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-center">
            Meet ReviewBoost: Dynamic QR Codes That Work for You
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: RefreshCw, title: 'Update Instantly', desc: 'Change destination links anytime, without reprinting.' },
              { icon: Check, title: 'Get More 5-Star Reviews', desc: 'Funnel positive reviews to Google, capture negative privately.' },
              { icon: TrendingUp, title: 'Track Performance', desc: 'See scans, reviews, and trends at a glance.' },
              { icon: Lightbulb, title: 'Easy to Use', desc: 'No tech expertise required, intuitive interface.' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg hover:border-cyan-500 transition">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg sm:text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-gray-400 text-sm sm:text-base">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div id="pricing" className="bg-gray-950 py-16 sm:py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">Pick the Plan That Fits Your Business</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-400">Choose the perfect plan to boost your online reputation and customer engagement.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className={`relative bg-black/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-800 p-8 flex flex-col ${product.name === 'Growth' ? 'border-cyan-500 ring-2 ring-cyan-500' : ''}`}>
                {product.name === 'Growth' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white text-center">{product.name}</h3>
                <p className="mt-4 text-center">
                  <span className="text-5xl font-extrabold text-cyan-400">${product.price}</span>
                  <span className="text-xl font-medium text-gray-400">/mo</span>
                </p>
                <p className="mt-4 text-sm text-gray-300 text-center">{product.description}</p>

                <ul className="mt-8 space-y-4 flex-1">
                  {(tierFeatures[product.name] || []).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-400" />
                      <span className="ml-3 text-base text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link to="/signup" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <QrCode className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg text-white tracking-wide">ReviewBoost</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 ReviewBoost. All rights reserved.{' '}
            <a href="https://www.schulzcorp.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-blue-400 underline">
              Crafted by SchulzCorp
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
