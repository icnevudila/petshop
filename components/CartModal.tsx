
import React from 'react';
import { Link } from "react-router-dom";
import { X, CheckCircle2, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../ProductContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastProduct: Product | null;
  onAddToCart: (p: Product, quantity?: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, lastProduct, onAddToCart }) => {
  if (!isOpen || !lastProduct) return null;
  const { products } = useProducts();

  // Simulate "Frequently Bought Together"
  const suggestions = products.filter(p => p.id !== lastProduct.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            Ürün Sepetinizde <CheckCircle2 size={20} className="text-green-500" />
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-10">
          {/* Last Added Product Card */}
          <div className="bg-gray-50/50 p-4 rounded-2xl flex gap-4 border border-gray-100">
            <div className="w-24 h-24 bg-white rounded-xl border border-gray-100 p-2">
               <img src={lastProduct.images[0]} className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-black text-gray-800 line-clamp-2 leading-relaxed mb-2">{lastProduct.name}</p>
              <p className="text-base font-black text-brand">{(lastProduct.discounted_price || lastProduct.price).toLocaleString('tr-TR')} TL</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={onClose} className="border-2 border-gray-100 text-gray-500 font-black py-3 rounded-xl hover:bg-gray-50 transition-all text-xs uppercase tracking-widest">Alışverişe Devam Et</button>
            <Link to="/sepet" onClick={onClose} className="bg-brand text-white font-black py-3 rounded-xl hover:bg-brand-dark transition-all text-xs uppercase tracking-widest text-center shadow-brand-glow">Sepete Git</Link>
          </div>

          {/* Frequently Bought Together */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              Birlikte Alınanlar <div className="h-px bg-gray-100 flex-grow"></div>
            </h3>
            <div className="space-y-4">
              {suggestions.map(p => (
                <div key={p.id} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-white border border-gray-50 rounded-xl p-2 flex-shrink-0 group-hover:shadow-sm transition-all">
                    <img src={p.images[0]} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-gray-800 line-clamp-1 group-hover:text-brand transition-colors">{p.name}</p>
                    <div className="flex text-yellow-400 my-1">
                       {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < 4 ? "currentColor" : "none"} />)}
                       <span className="text-[8px] text-gray-300 ml-1 font-bold">({p.review_count})</span>
                    </div>
                    <p className="text-xs font-black text-gray-900">{(p.discounted_price || p.price).toLocaleString('tr-TR')} TL</p>
                  </div>
                  <button 
                    onClick={() => onAddToCart(p, 1)}
                    className="p-2 bg-gray-50 text-gray-400 hover:bg-brand hover:text-white rounded-lg transition-all"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
           <p className="text-[10px] font-bold text-gray-400 text-center leading-relaxed">
             Sepetine 770,00 TL daha ürün eklersen kargo bedava olur! 🚚
           </p>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
