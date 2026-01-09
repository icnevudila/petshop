import React, { useMemo } from 'react';
import { Link } from "react-router-dom";
import { CartEntry } from '../types';
import { Trash2, ShoppingBag, CreditCard, Truck, ShieldCheck, Minus, Plus, Zap, Award } from 'lucide-react';
import { useProducts } from '../ProductContext';
import FreeShippingProgressBar from '../components/FreeShippingProgressBar';

interface CartPageProps {
  cart: CartEntry[];
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart, updateCartQuantity, clearCart }) => {
  const { products } = useProducts();

  const cartItems = useMemo(() => {
    return cart
      .map(entry => {
        const product = products.find(p => p.id === entry.product_id);
        return product ? { product, quantity: entry.quantity } : null;
      })
      .filter(Boolean) as { product: typeof products[number]; quantity: number }[];
  }, [cart, products]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.discounted_price || item.product.price) * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const threshold = 799;
  const shipping = subtotal >= threshold ? 0 : 49.00;
  const total = subtotal + shipping;

  if (cart.length > 0 && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-[3rem] p-16 shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-secondary">Sepet yükleniyor...</h2>
          <p className="text-gray-500 mt-3">Ürün bilgileri hazırlanıyor.</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[3rem] p-16 shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 text-gray-200">
            <ShoppingBag size={64} />
          </div>
          <h2 className="text-3xl font-black mb-4 text-secondary">Sepetiniz Boş</h2>
          <p className="text-gray-500 mb-12 font-medium max-w-sm mx-auto">Anlaşılan henüz alışverişe başlamadınız. Evcil dostunuz için en kaliteli ürünleri keşfedin.</p>
          <Link to="/" className="inline-block bg-brand text-white px-12 py-5 rounded-2xl font-black shadow-brand-glow hover:bg-brand-hover hover:scale-105 transition-all text-xs uppercase tracking-widest">Alışverişe Başla</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-32">
      {/* Top Banner Message */}
      <div className="bg-white border-b border-gray-50 py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Siparişinizi <span className="text-brand">1 saat 42 dakika</span> içinde tamamlarsanız <span className="text-green-600">YARIN KARGODA! 🚚</span>
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">

            {/* Free Shipping Progress Bar */}
            <FreeShippingProgressBar currentTotal={subtotal} threshold={threshold} />

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h1 className="text-2xl font-black text-secondary">Sepetim ({totalItems})</h1>
                <button onClick={clearCart} className="text-[11px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2">Tümünü Sil <Trash2 size={14} /></button>
              </div>
              <div className="divide-y divide-gray-50">
                {cartItems.map(({ product, quantity }) => (
                  <div key={`${product.id}`} className="p-8 flex items-center gap-8 group">
                    <div className="w-24 h-24 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-2 group-hover:shadow-md transition-all">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-black text-brand uppercase mb-1 tracking-widest">{product.brand_name}</p>
                      <Link to={`/urun/${product.slug}`} className="text-sm font-black text-gray-900 line-clamp-2 leading-relaxed mb-4 group-hover:text-brand transition-colors">{product.name}</Link>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                          <button onClick={() => updateCartQuantity(product.id, quantity - 1)} aria-label="Adeti azalt" className="p-1.5 hover:bg-white rounded-md transition-all"><Minus size={14} /></button>
                          <span className="w-8 text-center text-xs font-black">{quantity}</span>
                          <button onClick={() => updateCartQuantity(product.id, quantity + 1)} aria-label="Adeti artır" className="p-1.5 hover:bg-white rounded-md transition-all"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(product.id)} className="text-[10px] font-black text-gray-300 hover:text-rose-500 uppercase tracking-widest">Sil</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-900">{((product.discounted_price || product.price) * quantity).toLocaleString('tr-TR')} TL</p>
                      <p className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1 justify-end"><Zap size={12} fill="currentColor" /> Stokta Var</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Info Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, text: '%100 Orijinal Ürün' },
                { icon: Award, text: 'Kargo Bedava Avantajı' },
                { icon: Zap, text: 'Aynı Gün Hızlı Kargo' },
                { icon: CreditCard, text: 'Güvenli Ödeme 256Bit SSL' }
              ].map((badge, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-3">
                  <badge.icon size={24} className="text-brand" />
                  <span className="text-xs font-black text-gray-900">{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Recently Viewed or Suggestions */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
              <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-secondary">Önerilen Ürünler</h4>
              <div className="space-y-6">
                {products.slice(0, 2).map(p => (
                  <div key={p.id} className="flex gap-4 group cursor-pointer">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 flex-shrink-0 group-hover:border-brand/30 border border-transparent transition-all">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-800 line-clamp-1 group-hover:text-brand transition-colors">{p.name}</p>
                      <p className="text-xs font-black text-brand mt-1">{p.price.toLocaleString('tr-TR')} TL</p>
                      <button className="text-[9px] font-black text-gray-300 hover:text-brand transition-colors uppercase mt-1 tracking-widest">Sepete Ekle</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Summary Area (Desktop) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 sticky top-32 space-y-8">
              <h3 className="text-xl font-black text-secondary tracking-tight">Sipariş Özeti</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Ürün Toplamı</span>
                  <span>{subtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Kargo Ücreti</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Bedava' : `${shipping.toLocaleString('tr-TR')} TL`}</span>
                </div>
                <div className="h-px bg-gray-100"></div>
                <div className="flex justify-between items-end">
                  <span className="text-base font-black text-gray-900">Genel Toplam</span>
                  <span className="text-3xl font-black text-brand tracking-tighter">{total.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>

              <Link to="/checkout" className="hidden lg:flex w-full bg-brand text-white font-black py-5 rounded-2xl shadow-brand-glow items-center justify-center gap-3 hover:bg-brand-hover transition-all text-sm uppercase tracking-widest">
                SEPETİ ONAYLA
              </Link>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <ShieldCheck size={18} className="text-green-500" /> %100 Orijinal Ürün Garantisi
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <Truck size={18} className="text-blue-500" /> Ücretsiz ve Kolay İade
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Cart Summary */}
      <div className="lg:hidden fixed bottom-[56px] left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-[990] flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400">Toplam</span>
          <span className="text-xl font-black text-brand tracking-tighter">{total.toLocaleString('tr-TR')} TL</span>
        </div>
        <Link
          to="/checkout"
          className="flex-grow bg-brand text-white h-12 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-hover transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          Sepeti Onayla
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
