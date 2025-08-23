import React from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode, BarChart3, Shield, Zap, Check, DollarSign,
  RefreshCw, // For "Update Instantly"
  Users, // For "Team Accounts" or "SMBs are seeing results"
  Handshake, // For "Priority Support" or "Partnerships"
  Lightbulb, // For "Easy to Use"
  Rocket, // For "Boost your business"
  TrendingUp, // For "Track Performance"
  Clock, // For "Time-based"
  MapPin, // For "Location-based"
  Smartphone, // For "Scan & Review" visual
  X, // For negative features in table
  CreditCard // For trust badge
} from 'lucide-react';

// Replicate product data and feature definitions from stripe-config.ts and Pricing.tsx
// This avoids circular dependencies and keeps the landing page self-contained for display purposes.
const products = [
  {
    id: 'prod_Starter_ID',
    priceId: 'price_Starter_Monthly',
    name: 'Starter',
    description: 'For solopreneurs & micro-SMBs.',
    mode: 'subscription',
    price: 19,
  },
  {
    id: 'prod_Growth_ID',
    priceId: 'price_Growth_Monthly',
    name: 'Growth',
    description: 'Designed for 1–5 location businesses.',
    mode: 'subscription',
    price: 49,
  },
  {
    id: 'prod_Pro_ID',
    priceId: 'price_Pro_Monthly',
    name: 'Pro / Agency',
    description: 'For franchises, agencies, or multi-location SMBs.',
    mode: 'subscription',
    price: 149,
  },
];

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
                <span className="font-extrabold text-xl text-white tracking-wide">
                  ReviewBoost
                </span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-3 md:flex-1 md:space-x-4 lg:w-0">
              <Link
                to="/pricing"
                className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-cyan-400 transition py-2 px-3 rounded-xl hidden md:inline-flex items-center"
              >
                <DollarSign className="h-4 w-4 mr-1" /> Pricing
              </Link>
              <Link
                to="/login"
                className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-cyan-400 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="hidden md:inline-flex whitespace-nowrap text-base font-medium text-gray-300 hover:text-cyan-400 transition py-2 px-3 rounded-xl"
              >
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
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 text-lg"
              >
                Start Free Trial
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-center border border-cyan-400 text-cyan-400 font-semibold bg-black/40 hover:bg-black/60 transition text-lg"
              >
                See How It Works
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            {/* Visual: A clean mockup of a branded QR code with “Scan & Review” overlay. */}
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

      {/* Problem + Pain Points Section */}
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
          <blockquote className="mt-12 text-lg italic text-gray-400 max-w-3xl mx-auto">
            “We used to reprint menus every month. Now one QR code handles everything!”
            <footer className="mt-2 text-base font-medium text-gray-500">— Local Cafe Owner</footer>
          </blockquote>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-center">
            Meet ReviewBoost: Dynamic QR Codes That Work for You
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg hover:border-cyan-500 transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg sm:text-xl font-bold text-white">Update Instantly</h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">Change destination links anytime, without reprinting.</p>
            </div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg hover:border-cyan-500 transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg sm:text-xl font-bold text-white">Get More 5-Star Reviews</h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">Funnel positive reviews to Google, capture negative privately.</p>
            </div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg hover:border-cyan-500 transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg sm:text-xl font-bold text-white">Track Performance</h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">See scans, reviews, and trends at a glance.</p>
            </div>
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg hover:border-cyan-500 transition">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg sm:text-xl font-bold text-white">Easy to Use</h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">No tech expertise required, intuitive interface.</p>
            </div>
          </div>
          {/* Simple flow diagram: QR Code → Scan → Google Review → Dashboard metrics */}
          <div className="mt-16 text-center text-gray-400 text-sm">
            <p className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <span className="flex items-center space-x-2"><QrCode className="h-5 w-5 text-cyan-400" /> <span>Branded QR Code</span></span>
              <span className="hidden sm:block">→</span>
              <span className="flex items-center space-x-2"><Smartphone className="h-5 w-5 text-cyan-400" /> <span>Customer Scans</span></span>
              <span className="hidden sm:block">→</span>
              <span className="flex items-center space-x-2"><img src="https://www.google.com/images/branding/product/2x/google_my_business_64dp.png" alt="Google" className="h-5 w-5" /> <span>Leaves Review</span></span>
              <span className="hidden sm:block">→</span>
              <span className="flex items-center space-x-2"><BarChart3 className="h-5 w-5 text-cyan-400" /> <span>Monitor Dashboard</span></span>
            </p>
          </div>
        </div>
      </div>

      {/* Proof / Social Validation Section */}
      <div className="py-16 sm:py-24 bg-black/30 backdrop-blur-xl border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            SMBs Are Already Seeing Results
          </h2>
          {/* Logos of beta testers (optional) */}
           <div className="mt-8 flex flex-wrap justify-center items-center gap-8">
            <img src="https://via.placeholder.com/100x40?text=Client%20A" alt="Client A" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
            <img src="https://via.placeholder.com/100x40?text=Client%20B" alt="Client B" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
            <img src="https://via.placeholder.com/100x40?text=Client%20C" alt="Client C" className="h-10 opacity-70 grayscale hover:grayscale-0 transition" />
           </div>

          {/* Mini case studies / metrics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <p className="text-4xl font-extrabold text-cyan-400">43+</p>
              <p className="mt-2 text-lg text-gray-300">new reviews in 30 days</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <p className="text-4xl font-extrabold text-cyan-400">3.8 → 4.6</p>
              <p className="mt-2 text-lg text-gray-300">average Google rating increase</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <p className="text-4xl font-extrabold text-cyan-400">90%</p>
              <p className="mt-2 text-lg text-gray-300">reduction in reprint costs</p>
            </div>
          </div>

          {/* Testimonials */}
           <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
           <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
            <p className="text-lg italic text-gray-300">
             “ReviewBoost has been a game-changer for our small restaurant. We've seen a significant increase in Google reviews, and the dynamic QR codes mean we never have to worry about outdated links. Highly recommend!”
            </p>
            <div className="mt-4 flex items-center">
             <img src="https://via.placeholder.com/40x40?text=JD" alt="John Doe" className="h-10 w-10 rounded-full mr-3" />
             <div>
              <p className="font-semibold text-white">Jane Doe</p>
              <p className="text-sm text-gray-400">Owner, "The Daily Grind Cafe"</p>
             </div>
            </div>
           </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
             <p className="text-lg italic text-gray-300">
              “The analytics feature is fantastic! We can see exactly when and where our QR codes are being scanned, helping us optimize our marketing efforts. Plus, the support team is incredibly responsive.”
             </p>
              <div className="mt-4 flex items-center">
               <img src="https://via.placeholder.com/40x40?text=AS" alt="Alice Smith" className="h-10 w-10 rounded-full mr-3" />
              <div>
              <p className="font-semibold text-white">Alex Smith</p>
              <p className="text-sm text-gray-400">Marketing Manager, "Urban Boutique"</p>
             </div>
            </div>
           </div>
          </div>

      {/* Feature / Tier Section (Replicated from Pricing.tsx logic) */}
      <div id="pricing" className="bg-gray-950 py-16 sm:py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Link
                    to="/signup"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
                  >
                    Start Free Trial
                  </Link>
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

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Get More Reviews in 3 Simple Steps
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500 text-white mx-auto text-3xl font-bold">1</div>
              <h3 className="mt-6 text-xl font-bold text-white">Generate</h3>
              <p className="mt-2 text-gray-400">Create a branded dynamic QR code in minutes.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white mx-auto text-3xl font-bold">2</div>
              <h3 className="mt-6 text-xl font-bold text-white">Place</h3>
              <p className="mt-2 text-gray-400">Display it on your table, receipt, or flyer.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-500 text-white mx-auto text-3xl font-bold">3</div>
              <h3 className="mt-6 text-xl font-bold text-white">Boost</h3>
              <p className="mt-2 text-gray-400">Watch reviews roll in and monitor results in your dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Closing / Final CTA */}
      <div className="py-16 sm:py-24 bg-black/30 backdrop-blur-xl border-t border-gray-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Don’t Let Outdated QR Codes Hold Back Your Reviews
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Join hundreds of SMBs already boosting their online reputation with ReviewBoost.
          </p>
          <div className="mt-8">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-10 py-4 border border-transparent rounded-xl shadow-lg text-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
            >
              Start Your Free Trial
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              No credit card required. Get your first dynamic QR code in minutes.
            </p>
          </div>
          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
            <span className="text-gray-500 text-sm flex items-center space-x-2">
              <CreditCard className="h-5 w-5" /> <span>Secure Payments by Stripe</span>
            </span>
            <span className="text-gray-500 text-sm flex items-center space-x-2">
              <Shield className="h-5 w-5" /> <span>GDPR Compliant</span>
            </span>
            <span className="text-gray-500 text-sm flex items-center space-x-2">
              <Zap className="h-5 w-5" /> <span>High Performance SaaS</span>
            </span>
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
            <a
              href="https://www.schulzcorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-blue-400 underline"
            >
              Crafted by SchulzCorp
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
