import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import FireworksCanvas from './components/FireworksCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import SafetyTips from './components/SafetyTips';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackModal from './components/OrderTrackModal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './utils/api';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.pathname.startsWith('/admin'));
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('sjc_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = localStorage.getItem('sjc_admin_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  // Sync with browser URL navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Load catalog on start
  const loadStoreData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts().catch(() => []),
        api.getCategories().catch(() => [])
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (e) {
      console.error('Error loading store:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  const handleAdminLoginSuccess = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('sjc_admin_token');
    localStorage.removeItem('sjc_admin_user');
    setAdminToken('');
    setAdminUser(null);
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  const handleBackToSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    loadStoreData();
  };

  // Route 1: Admin route (/admin)
  if (isAdminRoute) {
    if (adminToken) {
      return (
        <AdminDashboard
          token={adminToken}
          user={adminUser}
          onLogout={handleAdminLogout}
          onBackToSite={handleBackToSite}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToSite={handleBackToSite}
      />
    );
  }

  // Route 2: Public Customer Storefront (NO admin button shown, frictionless guest shopping)
  return (
    <CartProvider>
      <div className="relative min-h-screen bg-midnight-950 text-slate-100 flex flex-col font-sans">
        {/* Animated Fireworks Canvas Particles */}
        <FireworksCanvas />

        {/* Storefront Navigation */}
        <Navbar
          onOpenTrack={() => setIsTrackOpen(true)}
          onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        {/* Hero Section based on Poster */}
        <main className="flex-1">
          <HeroSection
            onExploreClick={() => {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Crackers Catalog (With all 214 products from the price list) */}
          <ProductCatalog
            products={products}
            categories={categories}
          />

          {/* Safety & Sivakasi Quality Instructions */}
          <SafetyTips />
        </main>

        {/* Footer with shop contact numbers: 6380115587 / 9363243938 */}
        <Footer />

        {/* Cart Drawer */}
        <CartDrawer
          onProceedCheckout={() => setIsCheckoutOpen(true)}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />

        {/* Order Tracking Modal */}
        <OrderTrackModal
          isOpen={isTrackOpen}
          onClose={() => setIsTrackOpen(false)}
        />
      </div>
    </CartProvider>
  );
}
