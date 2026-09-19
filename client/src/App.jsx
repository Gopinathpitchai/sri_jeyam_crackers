import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import FireworksCanvas from './components/FireworksCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import SafetyTips from './components/SafetyTips';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingCartPopBox from './components/FloatingCartPopBox';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackModal from './components/OrderTrackModal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BillInvoiceModal from './components/BillInvoiceModal';
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
  const [billModalOrder, setBillModalOrder] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Active discount percent derived from products catalog
  const discountPercent = products.length > 0 && products[0]?.discount_percent !== undefined 
    ? products[0].discount_percent 
    : 75;

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
      <div className="relative min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        {/* Animated Fireworks Canvas Particles */}
        <FireworksCanvas />

        {/* Storefront Navigation */}
        <Navbar
          onOpenTrack={() => setIsTrackOpen(true)}
          onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          discountPercent={discountPercent}
        />

        {/* Hero Section based on Poster */}
        <main className="flex-1">
          <HeroSection
            onExploreClick={() => {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            discountPercent={discountPercent}
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
        <Footer discountPercent={discountPercent} />

        {/* Full Cart Drawer (Can be opened from top navbar) */}
        <CartDrawer
          onProceedCheckout={() => setIsCheckoutOpen(true)}
        />

        {/* Right-Side Down Corner Pop Box & Add to Cart Toast Widget */}
        <FloatingCartPopBox
          onProceedCheckout={() => setIsCheckoutOpen(true)}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onViewBill={(order) => {
            setBillModalOrder(order);
            setIsBillModalOpen(true);
          }}
        />

        {/* Order Tracking Modal */}
        <OrderTrackModal
          isOpen={isTrackOpen}
          onClose={() => setIsTrackOpen(false)}
          onViewBill={(order) => {
            setBillModalOrder(order);
            setIsBillModalOpen(true);
          }}
        />

        {/* Storefront Bill / Invoice Modal */}
        {isBillModalOpen && (
          <BillInvoiceModal
            order={billModalOrder}
            products={products}
            onClose={() => {
              setIsBillModalOpen(false);
              setBillModalOrder(null);
            }}
          />
        )}
      </div>
    </CartProvider>
  );
}
