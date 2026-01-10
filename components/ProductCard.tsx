import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { triggerConfetti } from '../utils/confetti';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product, quantity?: number) => void;
  toggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  onQuickView?: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, toggleWishlist, isWishlisted, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart(product, 1);
    triggerConfetti();
  };
  const hasDiscount = product.discounted_price !== null;
  const discountRate = hasDiscount && product.discounted_price
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  // Kargo Bedava Logic > 500 TL
  const isFreeShipping = (product.discounted_price || product.price) > 500;

  return (
    <div
      ref={cardRef}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 flex flex-col h-full relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* Image Area */}
      <div className="relative aspect-[3/4] p-4 overflow-hidden bg-gray-50/50">
        <Link to={`/urun/${product.slug}`} className="block h-full w-full relative z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.name}
              className={`max-h-full max-w-full object-contain mix-blend-multiply transition-opacity duration-300 ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
            />
            {product.images[1] && (
              <img
                src={product.images[1]}
                alt={`${product.name} Hover`}
                className={`absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </div>
        </Link>
        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20 pointer-events-none">
          {hasDiscount && (
            <div className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              %{discountRate} İndirim
            </div>
          )}
          {isFreeShipping && (
            <div className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
              Kargo Bedava
            </div>
          )}
          {product.review_count > 100 && (
            <div className="bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm hidden sm:block">
              Çok Satan
            </div>
          )}
        </div>

        {/* Action Buttons - Right Side (Slide in on hover) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          {/* Wishlist Button */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist && toggleWishlist(product.id); }}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100"
            title="Favorilere Ekle"
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
          </button>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all border border-gray-100"
              title="Hızlı Bakış"
            >
              <Eye size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="px-3 pb-3 flex flex-col flex-grow">
        <Link to={`/urun/${product.slug}`} className="mb-2">
          <h3 className="text-[13px] leading-tight text-gray-700 line-clamp-2 h-[2.5em] group-hover:text-orange-600 transition-colors">
            <span className="font-bold text-black mr-1">{product.brand_name}</span>
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto">
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-yellow-400 text-[10px]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-[10px] text-gray-400">({product.review_count})</span>
            </div>
          )}

          <div className="flex items-end gap-2 mb-3">
            <span className="text-lg font-bold text-orange-600">
              {Math.floor(product.discounted_price || product.price).toLocaleString('tr-TR')}
              <span className="text-xs ml-0.5">TL</span>
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through mb-1">
                {Math.floor(product.price).toLocaleString('tr-TR')} TL
              </span>
            )}
          </div>

          {/* Add to Cart Button - Premium Mobile Design */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2 opacity-100 translate-y-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 duration-200 btn-glow active:scale-95"
          >
            <ShoppingCart size={14} strokeWidth={2.5} />
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
