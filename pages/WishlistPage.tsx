
import React from 'react';
import { Link } from "react-router-dom";
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Heart, ChevronRight } from 'lucide-react';
import { useProducts } from '../ProductContext';

interface WishlistPageProps {
  wishlistIds: string[];
  addToCart: (p: Product, quantity?: number) => void;
  toggleWishlist: (id: string) => void;
  openQuickView: (p: Product) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlistIds, addToCart, toggleWishlist, openQuickView }) => {
  const { products } = useProducts();
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  if (wishlistIds.length > 0 && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-[3rem] p-16 shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-secondary">Favoriler yükleniyor...</h2>
          <p className="text-gray-500 mt-3">Ürün bilgileri hazırlanıyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight size={10} />
        <span className="text-gray-900">Favorilerim</span>
      </div>

      <div className="flex items-center gap-4 mb-12">
         <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
            <Heart size={24} fill="currentColor" />
         </div>
         <div>
            <h1 className="text-3xl font-black text-gray-900">Favori Listem</h1>
            <p className="text-sm font-medium text-gray-500">{wishlistProducts.length} ürün kayıtlı</p>
         </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Heart size={32} />
           </div>
           <h3 className="text-xl font-black text-gray-900 mb-2">Listeniz Henüz Boş</h3>
           <p className="text-gray-500 mb-8">Beğendiğiniz ürünleri kalp ikonuna tıklayarak buraya ekleyebilirsiniz.</p>
           <Link to="/" className="bg-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all">
             Ürünleri Keşfet
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {wishlistProducts.map(product => (
             <ProductCard 
               key={product.id} 
               product={product} 
               onAddToCart={addToCart} 
               toggleWishlist={toggleWishlist}
               isWishlisted={true}
               onQuickView={openQuickView}
             />
           ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
