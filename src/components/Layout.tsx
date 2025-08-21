import React, { useState } from 'react'; // Import useState
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { QrCode, Settings, Users, LogOut, BarChart3, Menu, X } from 'lucide-react'; // Import Menu and X icons

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const { subscription } = useSubscription();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  if (!user) {
    return <>{children}</>;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'QR Codes', href: '/qr-codes', icon: QrCode },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (profile?.email === 'admin@reviewboost.com') {
    navigation.push({ name: 'Admin', href: '/admin', icon: Users });
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="backdrop-blur-md bg-black/40 border-b border-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-cyan-400" />
                <span className="font-bold text-xl text-white">ReviewBoost</span>
              </Link>
              {/* Desktop Navigation Links */}
              <div className="hidden sm:flex sm:ml-8 sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-gray-800 text-cyan-400'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-cyan-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* Desktop User Info and Sign Out */}
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-300">{profile?.company_name || profile?.email}</div>
                {subscription?.product_name && (
                  <div className="text-xs text-gray-400">{subscription.product_name}</div>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center space-x-1 text-gray-300 hover:text-cyan-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Sign out</span>
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="-mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-black/50 backdrop-blur-md border-b border-gray-800 pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)} // Close menu on click
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-gray-800 text-cyan-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-cyan-400'
                  }`}
                >
                  <Icon className="inline-block h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                {/* User avatar placeholder or initial */}
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-lg font-semibold">
                  {profile?.email ? profile.email[0].toUpperCase() : '?'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{profile?.company_name || profile?.email}</div>
                {subscription?.product_name && (
                  <div className="text-sm font-medium text-gray-400">{subscription.product_name}</div>
                )}
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false); // Close menu on sign out
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-cyan-400"
              >
                <LogOut className="inline-block h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
