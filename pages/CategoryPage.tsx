import React, { useState, useMemo } from 'react';
import { useParams, Link } from "react-router-dom";
import { NAV_DATA, CATEGORY_DATA } from '../constants';
import { useProducts } from '../ProductContext';
import ProductCard from '../components/ProductCard';
import { Product, FilterState } from '../types';
import { SlidersHorizontal, ChevronDown, ChevronRight, X, LayoutGrid, List, ChevronLeft, Cat, Dog, Bird, Home, Heart, Check, Filter } from 'lucide-react';

interface CategoryPageProps {
  addToCart: (p: Product, quantity?: number) => void;
  toggleWishlist: (id: string) => void;
  wishlist: string[];
  openQuickView: (p: Product) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ addToCart, toggleWishlist, wishlist, openQuickView }) => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'editor' | 'price-asc' | 'price-desc' | 'best' | 'rating'>('editor');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    age: [],
    weight: [],
    grain: [],
    specialNeeds: []
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const normalizeText = (value: string) => value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

  // Kategoriye göre ürünleri filtrele
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Kategori Filtresi
    if (slug) {
      const categoryMappings: Record<string, string[]> = {
        'kedi': ['kedi-mamasi', 'kedi-kumu', 'kedi-oyuncak', 'kedi-bakim', 'kedi-tirmalama', 'kedi-saglik', 'kedi-mama-kap', 'kedi-odul', 'kedi-tuvalet', 'kedi-vitamin', 'kedi-tasma', 'kedi-tasima', 'kedi-hijyen', 'kedi-yatak'],
        'kopek': ['kopek-mamasi', 'kopek-oyuncak', 'kopek-bakim', 'kopek-tasma', 'kopek-yatak', 'kopek-mama-kap', 'kopek-odul', 'kopek-saglik', 'kopek-vitamin', 'kopek-tasima', 'kopek-giyim'],
        'kus': ['kus-yemi', 'kus-kafes', 'kus-aksesuar'],
        'balik': ['balik-yemi', 'akvaryum'],
        'kemirgen': ['kemirgen-yemi', 'kemirgen-kafes', 'kemirgen-bakim']
      };

      if (slug === 'yavru-kedi') {
        result = result.filter(p => p.category_id.startsWith('kedi') && (p.tags.includes('Yavru') || p.name.toLowerCase().includes('yavru') || p.name.toLowerCase().includes('kitten')));
      } else if (slug === 'yavru-kopek') {
        result = result.filter(p => p.category_id.startsWith('kopek') && (p.tags.includes('Yavru') || p.name.toLowerCase().includes('yavru') || p.name.toLowerCase().includes('puppy')));
      } else if (categoryMappings[slug]) {
        result = result.filter(p => categoryMappings[slug].includes(p.category_id));
      } else {
        result = result.filter(p => p.category_id === slug);
      }
    }

    // 2. Sidebar Filtreleri
    if (filters.brands.length > 0) {
      result = result.filter(p => p.brand_name && filters.brands.includes(p.brand_name));
    }

    if (filters.age.length > 0) {
      // "Yavru", "Yetişkin", "Yaşlı" kelimelerini tag/isim içinde ara
      result = result.filter(p => {
        const searchText = (p.name + p.tags.join(' ')).toLowerCase();
        return filters.age.some(f => {
          if (f.includes('Yavru')) return searchText.includes('yavru') || searchText.includes('kitten') || searchText.includes('junior');
          if (f.includes('Yetişkin')) return searchText.includes('yetişkin') || searchText.includes('adult');
          if (f.includes('Yaşlı')) return searchText.includes('yaşlı') || searchText.includes('senior');
          return false;
        });
      });
    }

    if (filters.weight.length > 0) {
      result = result.filter(p => {
        // Extract weight from name (e.g., "15kg", "1.5kg", "2 kg")
        const weightMatch = p.name.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
        if (!weightMatch) return false;

        const weight = parseFloat(weightMatch[1].replace(',', '.'));

        return filters.weight.some(range => {
          if (range === '0 - 2 kg') return weight < 2;
          if (range === '2 - 7 kg') return weight >= 2 && weight < 7;
          if (range === '7 - 12 kg') return weight >= 7 && weight < 12;
          if (range === '12 kg +') return weight >= 12;
          return false;
        });
      });
    }

    if (filters.grain.length > 0) {
      result = result.filter(p => {
        const searchable = normalizeText(`${p.name} ${p.description} ${p.tags.join(' ')} ${p.features.join(' ')}`);
        return filters.grain.some(f => {
          // Tahılsız: "tahilsiz", "grain free"
          if (f.includes('Tahılsız')) return searchable.includes('tahilsiz') || searchable.includes('grain free');
          // Düşük Tahıllı: "dusuk tahil", "low grain"
          if (f.includes('Düşük Tahıllı')) return searchable.includes('dusuk tahil') || searchable.includes('low grain');
          // Tahıllı: "tahilli" var ama "tahilsiz" YOK
          if (f.includes('Tahıllı')) return searchable.includes('tahilli') && !searchable.includes('tahilsiz');
          return false;
        });
      });
    }

    if (filters.specialNeeds.length > 0) {
      result = result.filter(p => {
        const searchable = normalizeText(`${p.name} ${p.description} ${p.tags.join(' ')} ${p.features.join(' ')}`);
        return filters.specialNeeds.some(f => {
          if (f.includes('Kısırlaştırılmış')) return searchable.includes('kisir') || searchable.includes('steril');
          if (f.includes('Hassas Sindirim')) return searchable.includes('hassas') || searchable.includes('sensitive') || searchable.includes('digest');
          if (f.includes('Tüy Yumağı')) return searchable.includes('tuy yuma') || searchable.includes('hairball');
          if (f.includes('Veteriner')) return searchable.includes('veteriner') || searchable.includes('vet') || searchable.includes('diet');
          return false;
        });
      });
    }

    if (sortOrder !== 'editor') {
      result = [...result];
      result.sort((a, b) => {
        const aPrice = a.discounted_price || a.price;
        const bPrice = b.discounted_price || b.price;
        if (sortOrder === 'price-asc') return aPrice - bPrice;
        if (sortOrder === 'price-desc') return bPrice - aPrice;
        if (sortOrder === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortOrder === 'best') return (b.review_count || 0) - (a.review_count || 0);
        return 0;
      });
    }

    return result;
  }, [slug, filters, products, sortOrder]);

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Sayfa değiştiğinde en üste scroll
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtre değiştiğinde sayfayı 1'e döndür
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOrder, slug]);

  // Kategori başlığını al
  const getCategoryTitle = () => {
    const navItem = NAV_DATA.find(n => n.slug === slug);
    if (navItem) return navItem.name;

    const category = CATEGORY_DATA.find(c => c.slug === slug);
    if (category) return category.name;

    if (slug === 'yavru-kedi') return 'Yavru Kedi Ürünleri';
    if (slug === 'yavru-kopek') return 'Yavru Köpek Ürünleri';

    return slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Tüm Ürünler';
  };

  // Kategori ikonunu al
  const getCategoryIcon = () => {
    switch (slug) {
      case 'kedi': return <Cat size={24} className="text-brand" />;
      case 'kopek': return <Dog size={24} className="text-brand" />;
      case 'kus': return <Bird size={24} className="text-brand" />;
      case 'balik': return <span className="text-xl">🐟</span>;
      case 'kemirgen': return <span className="text-xl">🐹</span>;
      default: return null;
    }
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  const FilterSection = ({ title, options, type }: { title: string, options: string[], type: keyof FilterState }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="py-2 border-b border-gray-50 last:border-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center mb-2 group py-1"
        >
          <h4 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors uppercase">{title}</h4>
          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {options.map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer group select-none" onClick={() => toggleFilter(type, opt)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${filters[type].includes(opt) ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white group-hover:border-orange-400'}`}>
                  {filters[type].includes(opt) && <Check size={10} className="text-white" strokeWidth={4} />}
                </div>
                <span className={`text-[13px] transition-colors ${filters[type].includes(opt) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>{opt}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="container mx-auto px-4 py-12 pb-32">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">
        <Link to="/" className="hover:text-brand cursor-pointer transition-colors flex items-center gap-1">
          <Home size={12} /> Ana Sayfa
        </Link>
        <ChevronRight size={12} className="text-gray-200" />
        <span className="text-gray-900 font-black flex items-center gap-2">
          {getCategoryIcon()}
          {getCategoryTitle()}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filtering */}
        <aside className={`fixed inset-0 z-[2000] bg-white p-6 overflow-y-auto transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:p-0 lg:bg-transparent lg:overflow-visible lg:block shadow-2xl lg:shadow-none ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="sticky top-24 px-2">
            {/* Mobile Close Button */}
            <div className="flex lg:hidden items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <span className="text-lg font-black text-gray-900">Filtreler</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
              <h3 className="font-bold text-sm text-gray-900">Filtreler</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({ brands: [], age: [], weight: [], grain: [], specialNeeds: [] })}
                  className="text-[10px] font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase"
                >
                  Temizle
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto pr-2 custom-scrollbar">
              {/* Dinamik Markalar */}
              <FilterSection
                title="Markalar"
                type="brands"
                options={[...new Set(filteredProducts.map(p => p.brand_name))] as string[]}
              />
              <FilterSection
                title="Yaş Grubu"
                type="age"
                options={['Yavru (0-12 ay)', 'Yetişkin (1-7 yaş)', 'Yaşlı (7+ yaş)']}
              />
              <FilterSection
                title="Paket Ağırlığı"
                type="weight"
                options={['0 - 2 kg', '2 - 7 kg', '7 - 12 kg', '12 kg +']}
              />
              <FilterSection
                title="Tahıl Durumu"
                type="grain"
                options={['Tahılsız', 'Düşük Tahıllı', 'Tahıllı']}
              />
              <FilterSection
                title="Özel İhtiyaçlar"
                type="specialNeeds"
                options={['Kısırlaştırılmış', 'Hassas Sindirim', 'Tüy Yumağı Önleyici', 'Veteriner Diyeti']}
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          {/* Active Chips Area */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {Object.entries(filters).map(([type, values]) =>
                (values as string[]).map(val => (
                  <span key={val} className="bg-brand/10 text-brand px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-3 border border-brand/20">
                    {val}
                    <button onClick={() => toggleFilter(type as any, val)} aria-label={`${val} filtresini kaldır`}><X size={14} /></button>
                  </span>
                ))
              )}
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div>
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {getCategoryIcon()}
                {getCategoryTitle()}
                <span className="text-xs font-normal text-gray-500 ml-2">({filteredProducts.length} ürün)</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-gray-900 text-white rounded-md text-xs font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <Filter size={14} /> Filtrele
              </button>
              {/* Sort Select - Clean */}
              <div className="relative group">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-md pl-3 pr-8 py-2 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none cursor-pointer"
                  aria-label="Sıralama seçin"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                >
                  <option value="editor">Önerilen Sıralama</option>
                  <option value="price-asc">En Düşük Fiyat</option>
                  <option value="price-desc">En Yüksek Fiyat</option>
                  <option value="best">En Çok Satanlar</option>
                  <option value="rating">Yüksek Puanlılar</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggles - Compact */}
              <div className="flex bg-gray-50 p-1 rounded-md border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="Grid görünümü"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="Liste görünümü"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h2>
              <p className="text-gray-500 text-sm mb-6">Seçtiğiniz kriterlere uygun ürün bulunmamaktadır.</p>
              <button onClick={() => setFilters({ brands: [], age: [], weight: [], grain: [], specialNeeds: [] })} className="text-orange-600 font-bold hover:underline text-sm">
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            viewMode === 'grid' ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    isWishlisted={wishlist.includes(product.id)}
                    onQuickView={openQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {paginatedProducts.map(product => (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center shadow-soft">
                    <Link to={`/urun/${product.slug}`} className="w-32 h-32 bg-gray-50 rounded-2xl p-4 flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </Link>
                    <div className="flex-grow w-full">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-black text-brand uppercase tracking-widest">{product.brand_name}</p>
                          <Link to={`/urun/${product.slug}`} className="text-lg font-black text-gray-900 hover:text-brand transition-colors line-clamp-2">
                            {product.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`h-10 w-10 rounded-xl border-2 flex items-center justify-center transition-all ${wishlist.includes(product.id) ? 'border-rose-500 text-rose-500 bg-rose-50' : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500'}`}
                          aria-label="Favoriye ekle"
                        >
                          <Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {product.features.slice(0, 3).map((f, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                      <div className="text-right">
                        {product.discounted_price && (
                          <div className="text-xs text-gray-400 line-through font-bold">{product.price.toLocaleString('tr-TR')} TL</div>
                        )}
                        <div className="text-2xl font-black text-secondary">{(product.discounted_price || product.price).toLocaleString('tr-TR')} TL</div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openQuickView(product)}
                          className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-brand hover:text-brand transition-all"
                        >
                          Hızlı Bakış
                        </button>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-5 py-2 rounded-xl bg-brand text-white text-xs font-black uppercase tracking-widest hover:bg-brand-hover transition-all"
                        >
                          Sepete Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Premium Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} arası gösteriliyor (Toplam {filteredProducts.length} Ürün)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Önceki sayfa"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Sayfa numaraları */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // İlk 3, son 3 ve aktif sayfanın etrafındaki 2 sayfayı göster
                    if (page <= 2) return true;
                    if (page >= totalPages - 1) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="text-gray-300 px-1">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                          }`}
                        aria-label={`Sayfa ${page}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))
                }

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Sonraki sayfa"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
