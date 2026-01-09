import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../types';

interface MobileProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (productId: string) => void;
    isWishlisted: boolean;
    onClick?: () => void;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
    product,
    onAddToCart,
    onToggleWishlist,
    isWishlisted,
    onClick,
}) => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(product);
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleWishlist(product.id);
    };

    return (
        <div className="mobile-product-card" onClick={handleCardClick}>
            {/* Image */}
            <div className="mobile-product-image-wrapper">
                <img
                    src={product.image}
                    alt={product.name}
                    className="mobile-product-image"
                    loading="lazy"
                />

                {/* Wishlist Button */}
                <button
                    className={`mobile-product-wishlist ${isWishlisted ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                    aria-label="Favorilere ekle"
                >
                    <Heart />
                </button>

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="mobile-product-badge">
                        %{discountPercent}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="mobile-product-info">
                {/* Brand */}
                {product.brand && (
                    <div className="mobile-product-brand">{product.brand}</div>
                )}

                {/* Name */}
                <div className="mobile-product-name">{product.name}</div>

                {/* Rating */}
                {product.rating && (
                    <div className="mobile-product-rating">
                        <div className="mobile-product-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
                                />
                            ))}
                        </div>
                        {product.reviewCount && (
                            <span className="mobile-product-review-count">
                                ({product.reviewCount})
                            </span>
                        )}
                    </div>
                )}

                {/* Price */}
                <div className="mobile-product-price-wrapper">
                    {hasDiscount && (
                        <div className="mobile-product-old-price">
                            {product.originalPrice?.toFixed(2)} ₺
                        </div>
                    )}
                    <div className="mobile-product-price">
                        {product.price.toFixed(2)} ₺
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    className="mobile-product-add-btn"
                    onClick={handleAddToCart}
                >
                    Sepete Ekle
                </button>
            </div>
        </div>
    );
};

export default MobileProductCard;
