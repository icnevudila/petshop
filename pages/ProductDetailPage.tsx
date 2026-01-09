
import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, ChevronRight, Plus, Minus, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../ProductContext';

interface ProductDetailPageProps {
  addToCart: (p: Product, quantity?: number) => void;
  toggleWishlist: (id: string) => void;
  wishlist: string[];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ addToCart, toggleWishlist, wishlist }) => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProducts();
  const product = products.find(p => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'aciklama' | 'yorumlar'>('aciklama');

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 text-center">
          <h1 className="text-xl font-black text-gray-900">Ürün yükleniyor...</h1>
          <p className="text-gray-500 mt-2">Lütfen birkaç saniye bekleyin.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-3">Ürün bulunamadı</h1>
          <p className="text-gray-500 mb-8">Aradığınız ürün kaldırılmış veya taşınmış olabilir.</p>
          <Link to="/" className="inline-flex items-center justify-center bg-brand text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-hover transition-all">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discounted_price !== null;
  const isWishlisted = wishlist.includes(product.id);

  // Add to Recently Viewed on Mount
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (!viewed.includes(product.id)) {
      const newViewed = [product.id, ...viewed].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));
    }
  }, [product.id]);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* Gallery */}
            <div className="lg:col-span-5 p-6 lg:p-12 border-r border-gray-50">
              <div className="relative aspect-square mb-8 bg-gray-50 rounded-3xl flex items-center justify-center p-8">
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">
                    İndirim
                  </div>
                )}
              </div>
              <div className="flex gap-4 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`w-20 h-20 rounded-2xl border-2 p-2 transition-all bg-white ${idx === activeImg ? 'border-primary' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-7 p-6 lg:p-12 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full">{product.brand_name}</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={18} fill="currentColor" />
                  <span className="text-sm font-black text-gray-900">{product.rating}</span>
                  <span className="text-xs text-gray-400 font-bold ml-1">({product.review_count} Yorum)</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-black text-secondary leading-tight mb-8 tracking-tight">
                {product.name}
              </h1>

              {/* Price & Cart Area */}
              {/* Price & Cart Area */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">

                <div className="flex flex-col mb-6">
                  {hasDiscount ? (
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold text-orange-600 tracking-tight">{(product.discounted_price || 0).toLocaleString('tr-TR')} TL</span>
                      <div className="flex flex-col mb-1">
                        <span className="text-sm text-gray-400 line-through decoration-gray-300">{(product.price).toLocaleString('tr-TR')} TL</span>
                        <span className="text-xs text-red-600 font-bold">%{(Math.round(((product.price - (product.discounted_price || 0)) / product.price) * 100))} indirim</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-orange-600 tracking-tight">{(product.price).toLocaleString('tr-TR')} TL</span>
                  )}
                  {product.discounted_price && product.discounted_price > 500 && (
                    <div className="flex items-center gap-2 mt-2 text-green-600 font-bold text-xs bg-green-50 w-fit px-2 py-1 rounded">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Kargo Bedava
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg h-12 w-28 hover:border-gray-400 transition-colors">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-black transition-all" aria-label="Adeti azalt"><Minus size={16} /></button>
                    <span className="flex-grow text-center font-bold text-lg text-gray-900">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-black transition-all" aria-label="Adeti artır"><Plus size={16} /></button>
                  </div>
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-grow bg-orange-600 text-white h-12 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                  >
                    Sepete Ekle
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center transition-all ${isWishlisted ? 'border-orange-200 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-400 bg-white hover:border-orange-400 hover:text-orange-600'}`}
                    aria-label={isWishlisted ? "Favorilerden çıkar" : "Favorilere ekle"}
                  >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Delivery Badges */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900">Hızlı Teslimat</p>
                      <p className="text-gray-500">24 saatte kargoda</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-gray-900">Orijinal Ürün</p>
                      <p className="text-gray-500">%100 garanti</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Tabs */}
              <div className="mt-8">
                <div className="flex items-center gap-8 border-b border-gray-100 mb-8 relative">
                  <button
                    onClick={() => setActiveTab('aciklama')}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'aciklama' ? 'text-secondary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Ürün Açıklaması
                    {activeTab === 'aciklama' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
                  </button>
                  <button
                    onClick={() => setActiveTab('yorumlar')}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'yorumlar' ? 'text-secondary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Yorumlar
                    {activeTab === 'yorumlar' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
                  </button>
                </div>
                {activeTab === 'aciklama' && (
                  <div className="space-y-6 animate-in fade-in">
                    <p className="text-gray-600 leading-relaxed font-medium">{product.description}</p>
                    <ul className="space-y-3">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                          <Check size={16} className="text-green-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'yorumlar' && (
                  <div className="animate-in fade-in">
                    <p className="text-gray-500 italic">Henüz yorum yapılmamış.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] z-[1000] flex items-center justify-between gap-4 pb-safe safe-area-bottom">
        <div className="flex flex-col">
          {hasDiscount && <span className="text-xs text-gray-400 font-bold line-through">{(product.price).toLocaleString('tr-TR')} TL</span>}
          <span className="text-xl font-black text-orange-600">{(product.discounted_price || product.price).toLocaleString('tr-TR')} TL</span>
        </div>
        <button
          onClick={() => addToCart(product, 1)}
          className="flex-grow bg-orange-600 text-white h-12 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
