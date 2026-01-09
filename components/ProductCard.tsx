
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product, quantity?: number) => void;
  toggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  onQuickView?: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, toggleWishlist, isWishlisted, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasDiscount = product.discounted_price !== null;
  const discountRate = hasDiscount && product.discounted_price
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  // Kargo Bedava Logic > 500 TL
  const isFreeShipping = (product.discounted_price || product.price) > 500;

  return (
    <div
      className="group bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg flex flex-col h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-[3/4] p-4 overflow-hidden">
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
          {isFreeShipping && (
            <div className="bg-gray-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] flex items-center gap-1 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-400"></div> Kargo Bedava
            </div>
          )}
          {product.review_count > 100 && (
            <div className="bg-yellow-400/20 text-yellow-700 border border-yellow-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded-[4px]">
              Çok Satan
            </div>
          )}
        </div>

        {/* Wishlist - Top Right */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist && toggleWishlist(product.id); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors z-20 border border-gray-100"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
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

          {/* Add to Cart Button - Explicit Orange */}
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(product, 1); }}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 rounded-md transition-all shadow-sm flex items-center justify-center gap-1 opacity-100 translate-y-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 duration-200"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
