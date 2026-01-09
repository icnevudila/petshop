import React, { useEffect } from 'react';
import { Product } from '../types';
import { X, Star, Heart, Share2, ShieldCheck, Truck, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, quantity?: number) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onAddToCart, toggleWishlist, isWishlisted }) => {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [product]);

  if (!product) return null;

  const hasDiscount = product.discounted_price !== null;
  const discountRate = hasDiscount && product.discounted_price
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden grid lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white transition-all shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Left: Image Gallery (Simplified for Quick View) */}
        <div className="bg-[#fcfcfc] p-8 lg:p-12 flex items-center justify-center relative">
          <div className="aspect-square w-full max-w-md relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
            {hasDiscount && (
              <div className="absolute top-0 left-0 bg-rose-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg shadow-rose-500/30">
                %{discountRate} İNDİRİM
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="p-8 lg:p-12 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <Link to={`/kategori/${product.category}`} className="text-xs font-black text-brand uppercase tracking-widest mb-2 block hover:underline">
              {product.brand_name}
            </Link>
            <h2 className="text-2xl font-black text-secondary leading-tight mb-3">
              {product.name}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={16} fill="currentColor" />
                <span className="text-gray-900 font-bold">{product.rating}</span>
                <span className="text-gray-400">({product.review_count} Değerlendirme)</span>
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-green-600 font-bold">Stokta Var</span>
            </div>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-black text-brand tracking-tight">
              {(product.discounted_price || product.price).toLocaleString('tr-TR')} TL
            </span>
            {hasDiscount && (
              <div className="flex flex-col mb-1.5">
                <span className="text-sm font-bold text-gray-400 line-through">
                  {product.price.toLocaleString('tr-TR')} TL
                </span>
              </div>
            )}
          </div>

          <div className="prose prose-sm text-gray-500 mb-8 line-clamp-3">
            {product.description}
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  onAddToCart(product, 1);
                  onClose();
                }}
                className="flex-grow bg-brand text-white h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-hover hover:scale-[1.02] active:scale-95 transition-all shadow-brand-glow flex items-center justify-center gap-3 text-sm"
              >
                <ShoppingCart size={20} />
                Sepete Hızlı Ekle
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Favorilere Ekle"
                className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all ${isWishlisted ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'}`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <Link
              to={`/urun/${product.slug}`}
              onClick={onClose}
              className="text-center text-xs font-black text-gray-400 hover:text-brand uppercase tracking-widest transition-colors py-2"
            >
              Ürüne Git & Detaylı İncele →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
              <ShieldCheck size={18} className="text-green-500" />
              %100 Orijinal Ürün
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
              <Truck size={18} className="text-blue-500" />
              Hızlı Teslimat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
