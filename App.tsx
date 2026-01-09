
import React, { useState, useEffect } from 'react';
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
import CartModal from './components/CartModal';
import QuickViewModal from './components/QuickViewModal';
import BottomNav from './components/BottomNav';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './ProductContext';
import { CartEntry, Product } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  // Load cart and wishlist from local storage
  useEffect(() => {
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
  }, []);

  const persistCart = (nextCart: CartEntry[]) => {
    localStorage.setItem('cart', JSON.stringify(nextCart));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const nextQty = Math.max(1, quantity);
      const existing = prev.find(item => item.product_id === product.id);
      const newCart = existing
        ? prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + nextQty } : item)
        : [...prev, { product_id: product.id, quantity: nextQty }];
      persistCart(newCart);
      return newCart;
    });
    setLastAddedProduct(product);
    setIsCartModalOpen(true);
    setQuickViewProduct(null);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.product_id !== productId);
      persistCart(newCart);
      return newCart;
    });
  };

  const updateCartQuantity = (productId: string, nextQuantity: number) => {
    setCart(prev => {
      const quantity = Math.max(0, Math.floor(nextQuantity));
      const newCart = quantity === 0
        ? prev.filter(item => item.product_id !== productId)
        : prev.map(item => item.product_id === productId ? { ...item, quantity } : item);
      persistCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    persistCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newList = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(newList));
      return newList;
    });
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen font-sans selection:bg-primary selection:text-white bg-white">
            <ScrollToTop />
            <Header cartCount={cartCount} wishlistCount={wishlist.length} />

            <main className="flex-grow pb-16 lg:pb-0">
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
              </Routes>
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav cartCount={cartCount} />

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

            {/* Mobile Bottom Navigation */}
            <BottomNav cartCount={cartCount} />

            <Footer />
          </div>
        </HashRouter>
      </ProductProvider>
    </AuthProvider >
  );
};

export default App;
