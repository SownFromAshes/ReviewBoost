import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { QrCode, Settings, Users, LogOut, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const { subscription } = useSubscription();
  const location = useLocation();

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
    <div className="min-h-screen"> {/* Removed bg-gray-50 here */}
      <nav className="backdrop-blur-md bg-black/40 border-b border-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-cyan-400" /> {/* Updated text color */}
                <span className="font-bold text-xl text-white">ReviewBoost</span> {/* Updated text color */}
              </Link>
              <div className="flex sm:ml-8 sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center space-x-1 px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-cyan-400 text-cyan-400' // Updated active link colors
                          : 'border-transparent text-gray-300 hover:border-gray-700 hover:text-cyan-400' // Updated inactive link colors
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-300">{profile?.company_name || profile?.email}</div> {/* Updated text color */}
                {subscription?.product_name && (
                  <div className="text-xs text-gray-400">{subscription.product_name}</div> {/* Updated text color */}
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center space-x-1 text-gray-300 hover:text-cyan-400" // Updated text color
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
