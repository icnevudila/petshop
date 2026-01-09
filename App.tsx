
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import FAQPage from './pages/FAQPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import CheckoutPage from './pages/CheckoutPage';
import CartModal from './components/CartModal';
import QuickViewModal from './components/QuickViewModal';
import ChatBot from './components/ChatBot';
import MobileBottomNav from './components/MobileBottomNav';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './ProductContext';
import { CartEntry, Product } from './types';
import * as cartService from './services/cartService';
import * as wishlistService from './services/wishlistService';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main App Content - Has access to AuthContext
const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  // Load cart and wishlist - from Supabase if logged in, localStorage otherwise
  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        // Load from Supabase for logged-in users
        try {
          const dbCart = await cartService.getCart(currentUser.id);
          setCart(dbCart.map(item => ({ product_id: item.product_id, quantity: item.quantity })));

          const dbWishlist = await wishlistService.getWishlistProductIds(currentUser.id);
          setWishlist(dbWishlist);
        } catch (e) {
          console.error('Error loading from Supabase:', e);
          // Fallback to localStorage
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      const savedCart = localStorage.getItem('cart');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            if (parsed.length > 0 && typeof parsed[0] === 'string') {
              setCart(parsed.map((id: string) => ({ product_id: id, quantity: 1 })));
            } else {
              const normalized = parsed
                .filter((entry: any) => entry && typeof entry.product_id === 'string')
                .map((entry: any) => ({
                  product_id: entry.product_id,
                  quantity: Math.max(1, Number(entry.quantity) || 1)
                }));
              setCart(normalized);
            }
          }
        } catch {
          setCart([]);
        }
      }
    };

    loadData();
  }, [currentUser]);

  // Sync local cart to Supabase when user logs in
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (currentUser && cart.length > 0) {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            await cartService.syncLocalCartToDb(currentUser.id, cart);
            localStorage.removeItem('cart'); // Clear local after sync
          } catch (e) {
            console.error('Error syncing cart:', e);
          }
        }
      }
    };
    syncCartOnLogin();
  }, [currentUser]);

  const persistCart = useCallback((nextCart: CartEntry[]) => {
    localStorage.setItem('cart', JSON.stringify(nextCart));
  }, []);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    const nextQty = Math.max(1, quantity);

    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      const newCart = existing
        ? prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + nextQty } : item)
        : [...prev, { product_id: product.id, quantity: nextQty }];
      persistCart(newCart);
      return newCart;
    });

    // Sync to Supabase if logged in
    if (currentUser) {
      try {
        await cartService.addToCart(currentUser.id, product.id, nextQty);
      } catch (e) {
        console.error('Supabase cart add error:', e);
      }
    }

    setLastAddedProduct(product);
    setIsCartModalOpen(true);
    setQuickViewProduct(null);
  }, [currentUser, persistCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.product_id !== productId);
      persistCart(newCart);
      return newCart;
    });

    if (currentUser) {
      try {
        await cartService.removeFromCart(currentUser.id, productId);
      } catch (e) {
        console.error('Supabase cart remove error:', e);
      }
    }
  }, [currentUser, persistCart]);

  const updateCartQuantity = useCallback(async (productId: string, nextQuantity: number) => {
    const quantity = Math.max(0, Math.floor(nextQuantity));

    setCart(prev => {
      const newCart = quantity === 0
        ? prev.filter(item => item.product_id !== productId)
        : prev.map(item => item.product_id === productId ? { ...item, quantity } : item);
      persistCart(newCart);
      return newCart;
    });

    if (currentUser) {
      try {
        await cartService.updateCartQuantity(currentUser.id, productId, quantity);
      } catch (e) {
        console.error('Supabase cart update error:', e);
      }
    }
  }, [currentUser, persistCart]);

  const clearCart = useCallback(async () => {
    setCart([]);
    persistCart([]);

    if (currentUser) {
      try {
        await cartService.clearCart(currentUser.id);
      } catch (e) {
        console.error('Supabase cart clear error:', e);
      }
    }
  }, [currentUser, persistCart]);

  const toggleWishlist = useCallback(async (productId: string) => {
    const isInWishlist = wishlist.includes(productId);

    setWishlist(prev => {
      const newList = isInWishlist
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(newList));
      return newList;
    });

    if (currentUser) {
      try {
        await wishlistService.toggleWishlist(currentUser.id, productId);
      } catch (e) {
        console.error('Supabase wishlist error:', e);
      }
    }
  }, [currentUser, wishlist]);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen font-sans selection:bg-primary selection:text-white relative overflow-hidden bg-transparent">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="shape-blob one mix-blend-multiply filter blur-3xl opacity-60"></div>
          <div className="shape-blob two mix-blend-multiply filter blur-3xl opacity-60"></div>
        </div>
        <ScrollToTop />
        {/* Hide Header on Admin Pages */}
        <Routes>
          <Route path="/admin" element={null} />
          <Route path="*" element={<Header cartCount={cartCount} wishlistCount={wishlist.length} />} />
        </Routes>

        <main className="flex-grow relative z-10 pb-16 lg:pb-0">
          <Routes>
            <Route path="/" element={
              <HomePage
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
                openQuickView={handleOpenQuickView}
              />
            } />
            <Route path="/kategori/:slug" element={
              <CategoryPage
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
                openQuickView={handleOpenQuickView}
              />
            } />
            <Route path="/urun/:slug" element={
              <ProductDetailPage
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            } />
            <Route
              path="/sepet"
              element={
                <CartPage
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartQuantity={updateCartQuantity}
                  clearCart={clearCart}
                />
              }
            />
            <Route path="/favoriler" element={
              <WishlistPage
                wishlistIds={wishlist}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                openQuickView={handleOpenQuickView}
              />
            } />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/giris" element={<LoginPage />} />
            <Route path="/kayit" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/hesabim" element={<AccountPage />} />
            <Route path="/gizlilik-politikasi" element={<PrivacyPolicyPage />} />
            <Route path="/iade-politikasi" element={<ReturnPolicyPage />} />
            <Route path="/sss" element={<FAQPage />} />
            <Route path="/siparis-takibi" element={<OrderTrackingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>

        <Footer />

        <CartModal
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          lastProduct={lastAddedProduct}
          onAddToCart={addToCart}
        />

        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          toggleWishlist={toggleWishlist}
          isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        />


        <MobileBottomNav cartCount={cartCount} wishlistCount={wishlist.length} />

        {/* ChatBot - Desktop Only */}
        <div className="hidden md:block">
          <ChatBot />
        </div>
      </div>
    </HashRouter>
  );
};

// Root App - Provides context
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <AppContent />
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
