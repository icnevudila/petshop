
import React from 'react';
import { X, Star, ShoppingCart, Heart, Check, Zap } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, quantity?: number) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onAddToCart, toggleWishlist, isWishlisted }) => {
  if (!product) return null;

  const hasDiscount = product.discounted_price !== null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-10 p-3 bg-white/80 rounded-full hover:bg-gray-100 transition-all text-gray-500 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 bg-gray-50 p-12 flex items-center justify-center relative">
          <img src={product.images[0]} className="w-full h-full object-contain mix-blend-multiply" alt={product.name} />
          {hasDiscount && (
             <div className="absolute top-8 left-8 bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase">
               İndirimli
             </div>
          )}
        </div>

        {/* Info Side */}
        <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto">
          <div className="mb-2">
             <span className="text-[10px] font-black text-primary uppercase tracking-widest">{product.brand_name}</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight mb-4">{product.name}</h2>
          
          <div className="flex items-center gap-4 mb-6">
             <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
             </div>
             <span className="text-xs font-bold text-gray-400">({product.review_count} Değerlendirme)</span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-8">{product.description}</p>

          <div className="space-y-2 mb-8">
             {product.features.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                   <Check size={14} className="text-green-500" /> {f}
                </div>
             ))}
          </div>

          <div className="mt-auto">
             <div className="flex items-end gap-4 mb-6">
                {hasDiscount ? (
                  <>
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">₺{product.discounted_price?.toLocaleString('tr-TR')}</span>
                    <span className="text-sm text-gray-400 line-through font-bold mb-1">₺{product.price.toLocaleString('tr-TR')}</span>
                  </>
                ) : (
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">₺{product.price.toLocaleString('tr-TR')}</span>
                )}
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => onAddToCart(product, 1)}
                  className="flex-grow bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={18} /> Sepete Ekle
                </button>
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-14 rounded-2xl border-2 flex items-center justify-center transition-all ${isWishlisted ? 'border-rose-500 text-rose-500 bg-rose-50' : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500'}`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
             </div>
             
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400 justify-center">
                <Zap size={12} className="text-yellow-500" fill="currentColor" /> Hızlı Bakış Modu
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
