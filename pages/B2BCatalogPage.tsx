import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../ProductContext';
import * as dealerService from '../services/dealerService';
import B2BLayout from '../components/B2BLayout';
import { Dealer, Product, B2BCartEntry } from '../types';
import {
    Search, Filter, ShoppingCart, Plus, Minus, Package, Grid, List,
    ChevronDown, Check, X, Building2, LogIn, ArrowRight,
    Phone, User, Lock, MapPin, Mail
} from 'lucide-react';

const B2BCatalogPage: React.FC = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const { products, categories, brands } = useProducts();
    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [b2bCart, setB2bCart] = useState<B2BCartEntry[]>(() => {
        const saved = localStorage.getItem('b2b_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [showCartToast, setShowCartToast] = useState('');

    useEffect(() => {
        const loadDealer = async () => {
            if (authLoading) return; // Wait for Auth Context

            console.log('B2BCatalogPage: Checking Auth', { currentUser, authLoading });

            if (!currentUser) {
                console.log('B2BCatalogPage: No user, setting isGuest=true');
                setIsGuest(true);
                setLoading(false);
                return;
            }

            try {
                const d = await dealerService.getDealerByUserId(currentUser.id);
                console.log('B2BCatalogPage: Dealer check', d);

                if (!d || d.status !== 'approved') {
                    console.log('B2BCatalogPage: Not a dealer or not approved, setting isGuest=true');
                    setIsGuest(true);
                } else {
                    console.log('B2BCatalogPage: Dealer approved');
                    setDealer(d);
                    setIsGuest(false);
                }
            } catch (e) {
                console.error('Error loading dealer:', e);
                setIsGuest(true);
            } finally {
                setLoading(false);
            }
        };
        loadDealer();
    }, [currentUser, authLoading]);

    // Persist B2B cart
    useEffect(() => {
        localStorage.setItem('b2b_cart', JSON.stringify(b2bCart));
    }, [b2bCart]);

    const discountRate = dealer?.discount_rate || 0;

    const getDiscountedPrice = (price: number) => {
        return price * (1 - discountRate / 100);
    };

    const filteredProducts = products.filter(p => {
        if (!p.is_active) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedCategory && p.category_id !== selectedCategory) return false;
        if (selectedBrand && p.brand_id !== selectedBrand) return false;
        return true;
    });

    const addToB2BCart = (product: Product, qty: number = 1) => {
        if (isGuest) return; // Guests can't add to cart
        setB2bCart(prev => {
            const existing = prev.find(item => item.product_id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...prev, {
                product_id: product.id,
                product_name: product.name,
                quantity: qty,
                unit_price: product.discounted_price || product.price,
                discounted_unit_price: getDiscountedPrice(product.discounted_price || product.price),
                images: product.images,
            }];
        });
        setShowCartToast(product.name);
        setTimeout(() => setShowCartToast(''), 2000);
    };

    const updateB2BCartQty = (productId: string, qty: number) => {
        if (qty <= 0) {
            setB2bCart(prev => prev.filter(item => item.product_id !== productId));
        } else {
            setB2bCart(prev => prev.map(item =>
                item.product_id === productId ? { ...item, quantity: qty } : item
            ));
        }
    };

    const getCartQty = (productId: string) => {
        return b2bCart.find(item => item.product_id === productId)?.quantity || 0;
    };

    const totalCartItems = b2bCart.reduce((sum, item) => sum + item.quantity, 0);

    const catalogContent = (
        <div className="space-y-6">
            {/* Guest Banner */}
            {isGuest && (
                <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] rounded-full filter blur-[100px] opacity-10 pointer-events-none"></div>

                    <div className="relative z-10 flex-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-3 py-1 mb-3">
                            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
                            <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-wider">Kurumsal Fırsatlar</span>
                        </div>
                        <h3 className="text-white font-black text-2xl sm:text-3xl tracking-tight mb-2">Toptan Fiyatlarla Alışveriş Yapın</h3>
                        <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                            Onaylı bayi hesabınızla giriş yapın, <span className="text-white font-bold">%15-40 arası</span> özel iskontolardan ve <span className="text-white font-bold">vadeli ödeme</span> seçeneklerinden yararlanın.
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-3 flex-shrink-0">
                        <Link
                            to="/bayi/giris"
                            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700"
                        >
                            <LogIn size={18} /> Giriş Yap
                        </Link>
                        <Link
                            to="/bayi/basvuru"
                            className="flex items-center gap-2 bg-[#38BDF8] text-[#0F172A] px-6 py-3 rounded-xl font-black text-sm hover:bg-[#0EA5E9] transition-all shadow-lg shadow-sky-500/20"
                        >
                            Hemen Başvur <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ürün Kataloğu</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isGuest
                            ? 'Toptan ürün kataloğumuzu inceleyin'
                            : `Tüm ürünler %${discountRate} bayi iskontosu ile gösterilmektedir`
                        }
                    </p>
                </div>
                {!isGuest && (
                    <a
                        href="#/bayi/sepet"
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                    >
                        <ShoppingCart size={18} />
                        Sepet ({totalCartItems})
                    </a>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ürün ara..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none min-w-[180px]"
                        aria-label="Kategori filtresi"
                    >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none min-w-[180px]"
                        aria-label="Marka filtresi"
                    >
                        <option value="">Tüm Markalar</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            aria-label="Grid görünümü"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            aria-label="Liste görünümü"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Count */}
            <p className="text-gray-500 text-sm">{filteredProducts.length} ürün bulundu</p>

            {/* Products Grid */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => {
                        const originalPrice = product.discounted_price || product.price;
                        const dealerPrice = getDiscountedPrice(originalPrice);
                        const cartQty = getCartQty(product.id);

                        return (
                            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
                                {/* Image */}
                                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                    <img
                                        src={product.images?.[0] || '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Ürün'; }}
                                    />
                                    {!isGuest && discountRate > 0 && (
                                        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                            %{discountRate} Bayi İskonto
                                        </div>
                                    )}
                                    {cartQty > 0 && (
                                        <div className="absolute top-3 right-3 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                            {cartQty}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <p className="text-gray-400 text-xs font-medium mb-1">{product.brand_name}</p>
                                    <h3 className="text-gray-900 font-semibold text-sm mb-3 line-clamp-2">{product.name}</h3>

                                    <div className="flex items-center gap-2 mb-4">
                                        {isGuest ? (
                                            <span className="text-primary font-bold text-lg">
                                                ₺{originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </span>
                                        ) : (
                                            <>
                                                <span className="text-primary font-bold text-lg">
                                                    ₺{dealerPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </span>
                                                {discountRate > 0 && (
                                                    <span className="text-gray-400 text-sm line-through">
                                                        ₺{originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Add to Cart Controls */}
                                    {isGuest ? (
                                        <Link
                                            to="/bayi/giris"
                                            className="w-full bg-orange-50 text-orange-600 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <LogIn size={16} /> Giriş Yapın
                                        </Link>
                                    ) : cartQty > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateB2BCartQty(product.id, cartQty - 1)}
                                                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                                                aria-label="Adet azalt"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                type="number"
                                                value={cartQty}
                                                onChange={(e) => updateB2BCartQty(product.id, parseInt(e.target.value) || 0)}
                                                className="flex-1 text-center bg-gray-50 border border-gray-200 rounded-xl py-2 text-gray-900 font-bold text-sm"
                                                min="0"
                                                aria-label="Ürün adedi"
                                            />
                                            <button
                                                onClick={() => updateB2BCartQty(product.id, cartQty + 1)}
                                                className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                                aria-label="Adet artır"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => addToB2BCart(product)}
                                            className="w-full bg-primary/10 text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={16} /> Sepete Ekle
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredProducts.map(product => {
                        const originalPrice = product.discounted_price || product.price;
                        const dealerPrice = getDiscountedPrice(originalPrice);
                        const cartQty = getCartQty(product.id);

                        return (
                            <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-primary/30 transition-all flex items-center gap-4">
                                <img
                                    src={product.images?.[0] || '/placeholder.jpg'}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Ürün'; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-400 text-xs">{product.brand_name}</p>
                                    <h3 className="text-gray-900 font-medium text-sm truncate">{product.name}</h3>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    {isGuest ? (
                                        <p className="text-primary font-bold">₺{originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                    ) : (
                                        <>
                                            <p className="text-primary font-bold">₺{dealerPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                            {discountRate > 0 && (
                                                <p className="text-gray-400 text-xs line-through">₺{originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                                {!isGuest && (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {cartQty > 0 && (
                                            <button
                                                onClick={() => updateB2BCartQty(product.id, cartQty - 1)}
                                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                                                aria-label="Adet azalt"
                                            >
                                                <Minus size={14} />
                                            </button>
                                        )}
                                        {cartQty > 0 && (
                                            <span className="text-gray-900 font-bold text-sm w-8 text-center">{cartQty}</span>
                                        )}
                                        <button
                                            onClick={() => addToB2BCart(product)}
                                            className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                            aria-label="Sepete ekle"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                )}
                                {isGuest && (
                                    <Link
                                        to="/bayi/giris"
                                        className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition-all flex-shrink-0"
                                    >
                                        Giriş Yap
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <Package size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Ürün bulunamadı</p>
                </div>
            )}

            {/* Cart Toast */}
            {showCartToast && (
                <div className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-xl shadow-2xl shadow-primary/30 flex items-center gap-2 animate-bounce z-50">
                    <Check size={18} /> {showCartToast} sepete eklendi!
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Katalog Yükleniyor...</p>
                </div>
            </div>
        );
    }

    <div className="min-h-screen bg-gray-50 font-sans">
        {/* 1. Top Bar - Corporate Info */}
        <div className="bg-[#0F172A] text-white py-2 px-4 border-b border-gray-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs font-medium text-gray-400 gap-2">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5"><Building2 size={12} className="text-[#FF7A30]" /> Kurumsal Bayi Portalı</span>
                    <span className="hidden sm:flex items-center gap-1.5"><Phone size={12} className="text-[#FF7A30]" /> 0850 123 45 67</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/iletisim" className="hover:text-white transition-colors">Bize Ulaşın</Link>
                    <Link to="/sss" className="hover:text-white transition-colors">S.S.S.</Link>
                    <span className="text-gray-600">|</span>
                    <span className="text-[#FF7A30] font-bold">Toptan Satış</span>
                </div>
            </div>
        </div>

        {/* 2. Main Header - Sticky */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-lg shadow-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link to="/bayi/giris" className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-12 h-12 bg-[#FF7A30] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                        <Building2 size={24} className="text-white" />
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">PatiDükkan</h1>
                        <span className="text-[#FF7A30] text-[11px] font-bold uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full inline-block">B2B Portalı</span>
                    </div>
                </Link>

                {/* Search Bar - Desktop */}
                <div className="hidden lg:flex flex-1 max-w-xl relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Barkod, Ürün Adı veya Stok Kodu ile arayın..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#FF7A30] outline-none font-medium text-gray-600 transition-all placeholder-gray-400"
                    />
                    <button className="absolute right-2 top-2 bottom-2 bg-[#FF7A30] hover:bg-[#E6621F] text-white px-4 rounded-lg font-bold text-sm transition-colors">
                        Ara
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Link to="/bayi/giris" className="hidden sm:flex flex-col items-end text-right px-2">
                        <span className="text-xs text-gray-400 font-medium">Bayi Girişi</span>
                        <span className="text-sm font-bold text-gray-900">Hesabım</span>
                    </Link>
                    <Link to="/bayi/giris" className="w-10 h-10 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-[#FF7A30] rounded-xl flex items-center justify-center transition-all border border-gray-100">
                        <User size={20} />
                    </Link>
                    <Link to="/bayi/basvuru" className="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5">
                        Bayi Ol <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Navigation Categories - Desktop */}
            <div className="border-t border-gray-100 hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 h-12 text-sm font-bold text-gray-600">
                    <button className="flex items-center gap-2 text-[#FF7A30] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Grid size={16} /> Tüm Kategoriler
                    </button>
                    <Link to="/bayi/katalog" className="hover:text-[#FF7A30] transition-colors">Kedi Mamaları</Link>
                    <Link to="/bayi/katalog" className="hover:text-[#FF7A30] transition-colors">Köpek Mamaları</Link>
                    <Link to="/bayi/katalog" className="hover:text-[#FF7A30] transition-colors">Kum & Hijyen</Link>
                    <Link to="/bayi/katalog" className="hover:text-[#FF7A30] transition-colors">Aksesuarlar</Link>
                    <Link to="/bayi/katalog" className="hover:text-[#FF7A30] transition-colors">Veteriner Ürünleri</Link>
                    <div className="flex-grow"></div>
                    <Link to="/bayi/giris" className="text-gray-400 hover:text-[#FF7A30] flex items-center gap-1">
                        <Lock size={14} /> Fiyatları Görmek İçin Giriş Yapın
                    </Link>
                </div>
            </div>
        </header>

        {/* 3. Hero Section - Value Propositions */}
        <div className="bg-white border-b border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Package size={400} />
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 relative z-10">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-[#FF7A30] px-3 py-1 rounded-full text-xs font-bold mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#FF7A30]"></span>
                        Sadece Kurumsal Müşteriler İçin
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                        Pet Shop ve Veterinerler İçin <br />
                        <span className="text-[#FF7A30]">Toptan Tedarik</span> Merkezi
                    </h2>
                    <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed font-medium">
                        En iyi markalar, avantajlı iskontolar ve aynı gün kargo imkanı ile işletmenizin tüm ihtiyaçlarını karşılıyoruz.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/bayi/basvuru" className="px-8 py-4 bg-[#FF7A30] hover:bg-[#E6621F] text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-2">
                            Hemen Başvur <ArrowRight size={20} />
                        </Link>
                        <Link to="/bayi/giris" className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-2xl font-bold text-lg transition-all">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Strip */}
            <div className="bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: Building2, title: "Kurumsal Faturalı", desc: "Resmi işletme faturalı satış" },
                        { icon: Package, title: "Hızlı Teslimat", desc: "Stoktan aynı gün kargo" },
                        { icon: Check, title: "Orijinal Ürün", desc: "%100 Distribütör garantili" },
                        { icon: Lock, title: "Güvenli Ödeme", desc: "3D Secure ve Havale/EFT" }
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-[#FF7A30]">
                                <f.icon size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{f.title}</h4>
                                <p className="text-xs text-gray-400">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 4. Products Preview */}
        <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-gray-900">Öne Çıkan Ürünler</h3>
                    <p className="text-gray-500 text-sm mt-1">Giriş yaparak toptan fiyatları görebilirsiniz.</p>
                </div>
                <div className="flex gap-2">
                    {/* Filters could go here */}
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={16} /> Filtrele
                    </button>
                </div>
            </div>

            {catalogContent}

            <div className="mt-12 text-center bg-[#0F172A] rounded-2xl p-12 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white mb-4">Tüm Avantajlardan Yararlanmak İçin</h3>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
                        Bayilik başvurunuzu yapın, özel fiyat listemize ve kampanyalı ürünlerimize anında erişim sağlayın.
                    </p>
                    <Link to="/bayi/basvuru" className="inline-block bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-sky-900/30 transition-all transform hover:scale-105">
                        Ücretsiz Bayi Olun
                    </Link>
                </div>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #1E293B 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
            </div>
        </main>

        {/* 5. Footer */}
        <footer className="bg-white border-t border-gray-200 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-[#FF7A30] rounded-lg flex items-center justify-center text-white"><Building2 size={16} /></div>
                        <span className="font-black text-xl text-gray-900">PatiDükkan <span className="text-[#FF7A30]">B2B</span></span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Türkiye'nin lider pet shop tedarik platformu. İşletmeniz için en iyi ürünleri en iyi fiyatlarla sunuyoruz.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Hızlı Erişim</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><Link to="/bayi/giris" className="hover:text-[#FF7A30]">Bayi Girişi</Link></li>
                        <li><Link to="/bayi/basvuru" className="hover:text-[#FF7A30]">Bayi Başvurusu</Link></li>
                        <li><Link to="/bayi/katalog" className="hover:text-[#FF7A30]">Ürün Kataloğu</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Kategoriler</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-[#FF7A30]">Kedi Mamaları</a></li>
                        <li><a href="#" className="hover:text-[#FF7A30]">Köpek Mamaları</a></li>
                        <li><a href="#" className="hover:text-[#FF7A30]">Kedi Kumu</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">İletişim</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li className="flex items-center gap-2"><Phone size={14} className="text-[#FF7A30]" /> 0850 123 45 67</li>
                        <li className="flex items-center gap-2"><Mail size={14} className="text-[#FF7A30]" /> bayi@patidukkan.com</li>
                        <li className="flex items-center gap-2"><MapPin size={14} className="text-[#FF7A30]" /> İstanbul, Türkiye</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                &copy; 2026 PatiDükkan B2B Portalı. Tüm hakları saklıdır.
            </div>
        </footer>
    </div>

    // Logged in dealer view with B2BLayout
    return (
        <B2BLayout>
            {catalogContent}
        </B2BLayout>
    );
};

export default B2BCatalogPage;
