import React, { useState, useEffect } from 'react';
import { QrCode, BarChart3, Shield, Zap, Check, Menu, X } from 'lucide-react';

// Main App Component
export default function App() {
    return <Landing />;
}

// Helper component for animated text
const AnimatedText = ({ text, el: Component = 'span', className, once }) => {
    const [animation, setAnimation] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimation(true);
                    if (once) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [once]);

    return (
        <Component
            ref={ref}
            className={`${className} transition-all duration-1000 ${animation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {text}
        </Component>
    );
};


// Header Component
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-lg shadow-2xl' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex justify-start items-center">
                        <QrCode className="h-8 w-8 text-blue-400" />
                        <span className="ml-3 font-bold text-2xl text-white">ReviewBoost</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-base font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="text-base font-medium text-gray-300 hover:text-white transition-colors">Pricing</a>
                        <a href="#signin" className="text-base font-medium text-gray-300 hover:text-white transition-colors">Sign In</a>
                    </div>
                    <div className="hidden md:flex items-center">
                         <a href="#signup" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-transform">
                            Start Free Trial
                        </a>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-gray-900/90 backdrop-blur-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Features</a>
                        <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Pricing</a>
                        <a href="#signin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Sign In</a>
                        <a href="#signup" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700">Start Free Trial</a>
                    </div>
                </div>
            )}
        </header>
    );
};


// Hero Section Component
const Hero = () => (
    <div className="relative bg-gray-900 text-white min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="https://cdn.pixabay.com/video/2024/05/23/211512_large.mp4" type="video/mp4" />
            </video>
        </div>
        <div className="relative z-10 text-center px-4">
            <AnimatedText text={
                <>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
                        <span className="block">Get more reviews with</span>
                        <span className="block text-blue-400">ReviewBoost</span>
                    </h1>
                </>
            } el="div" className="mb-4" />
            <AnimatedText text="Generate QR codes and short links that make it effortless for customers to leave Google Business reviews. Track performance with powerful analytics." el="p" className="max-w-2xl mx-auto mt-5 text-lg sm:text-xl text-gray-300" />
            <div className="mt-10 flex justify-center gap-4">
                 <a href="#signup" className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-transform">
                    Start 7-Day Free Trial
                </a>
                <a href="#signin" className="inline-block px-8 py-4 text-lg font-semibold text-blue-300 bg-gray-700/50 rounded-lg shadow-lg hover:bg-gray-600/50 transform hover:scale-105 transition-transform">
                    Sign In
                </a>
            </div>
        </div>
    </div>
);


// Features Section Component
const FeatureCard = ({ icon, title, children }) => (
    <div className="relative p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
        <div className="absolute top-0 left-0 -mt-5 -ml-2">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
                {icon}
            </div>
        </div>
        <h3 className="mt-8 text-xl font-bold text-white">{title}</h3>
        <p className="mt-4 text-base text-gray-400">{children}</p>
    </div>
);

const Features = () => (
    <div id="features" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <AnimatedText text="Features" el="h2" className="text-base text-blue-400 font-semibold tracking-wide uppercase" />
                <AnimatedText text="Everything you need to boost your reviews" el="p" className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl" />
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-2">
                <FeatureCard icon={<QrCode size={32} />} title="QR Code Generation">
                    Create professional QR codes that link directly to your Google Business review page.
                </FeatureCard>
                <FeatureCard icon={<BarChart3 size={32} />} title="Analytics & Tracking">
                    Monitor scan rates, click-through rates, and review conversion metrics in real-time.
                </FeatureCard>
                <FeatureCard icon={<Zap size={32} />} title="Short Links">
                    Generate memorable short links perfect for social media, emails, and marketing materials.
                </FeatureCard>
                <FeatureCard icon={<Shield size={32} />} title="Enterprise Security">
                    Bank-level security with encrypted data storage and secure payment processing.
                </FeatureCard>
            </div>
        </div>
    </div>
);


// Pricing Section Component
const Pricing = () => (
    <div id="pricing" className="py-24 bg-gray-900/95" style={{backgroundImage: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.1), transparent 40%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <AnimatedText text="Simple, transparent pricing" el="h2" className="text-3xl font-extrabold text-white sm:text-4xl" />
                <AnimatedText text="Start free, upgrade when you're ready to grow" el="p" className="mt-4 text-lg text-gray-400" />
            </div>
            <div className="mt-12 flex justify-center">
                <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
                    <div className="p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-semibold text-white">Pro Plan</h3>
                            <div className="mt-4 flex items-baseline justify-center">
                                <span className="text-5xl font-extrabold text-white">$29.99</span>
                                <span className="ml-1 text-xl text-gray-400">/month</span>
                            </div>
                            <p className="mt-4 text-lg text-gray-400">ReviewBoostSC Plan</p>
                        </div>
                        <div className="mt-8">
                            <ul className="space-y-4">
                                {[
                                    'Unlimited QR codes',
                                    'Unlimited short links',
                                    'Advanced analytics',
                                    'Custom branding',
                                    'Priority support',
                                    'Export data',
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="flex-shrink-0 h-6 w-6 text-green-400" />
                                        <span className="ml-3 text-base text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <a href="#signup" className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-5 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 transition-colors">
                                    Start Free Trial
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Footer Component
const Footer = () => (
    <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                    <QrCode className="h-6 w-6 text-blue-400" />
                    <span className="font-bold text-lg text-white">ReviewBoost</span>
                </div>
                <p className="mt-4 text-base text-gray-500">
                    &copy; 2025 ReviewBoost. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
);


// Landing Page Component
const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-900 font-sans">
            <Header />
            <main>
                <Hero />
                <Features />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
};
