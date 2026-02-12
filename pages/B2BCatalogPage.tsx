import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../ProductContext';
import * as dealerService from '../services/dealerService';
import B2BLayout from '../components/B2BLayout';
import { Dealer, Product, B2BCartEntry } from '../types';
import {
    Search, Filter, ShoppingCart, Plus, Minus, Package, Grid, List,
    ChevronDown, Check, X
} from 'lucide-react';

const B2BCatalogPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { products, categories, brands } = useProducts();
    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [loading, setLoading] = useState(true);
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
            if (!currentUser) return;
            try {
                const d = await dealerService.getDealerByUserId(currentUser.id);
                setDealer(d);
            } catch (e) {
                console.error('Error loading dealer:', e);
            } finally {
                setLoading(false);
            }
        };
        loadDealer();
    }, [currentUser]);

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

    return (
    return (
        <B2BLayout>
            {loading ? (
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Katalog Yükleniyor...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-secondary">Ürün Kataloğu</h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Tüm ürünler %{discountRate} bayi iskontosu ile gösterilmektedir
                            </p>
                        </div>
                        <a
                            href="#/bayi/sepet"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                        >
                            <ShoppingCart size={18} />
                            Sepet ({totalCartItems})
                        </a>
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
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-secondary placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none min-w-[180px]"
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
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none min-w-[180px]"
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
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                                    aria-label="Grid görünümü"
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                                    aria-label="Liste görünümü"
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Count */}
                    <p className="text-gray-400 text-sm">{filteredProducts.length} ürün bulundu</p>

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
                                            {discountRate > 0 && (
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
                                            <h3 className="text-secondary font-semibold text-sm mb-3 line-clamp-2">{product.name}</h3>

                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-primary font-bold text-lg">
                                                    ₺{dealerPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </span>
                                                {discountRate > 0 && (
                                                    <span className="text-gray-400 text-sm line-through">
                                                        ₺{originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Add to Cart Controls */}
                                            {cartQty > 0 ? (
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
                                                        className="flex-1 text-center bg-gray-50 border border-gray-200 rounded-xl py-2 text-secondary font-bold text-sm"
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
                                            <h3 className="text-secondary font-medium text-sm truncate">{product.name}</h3>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-primary font-bold">₺{dealerPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                            {discountRate > 0 && (
                                                <p className="text-gray-400 text-xs line-through">₺{originalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                            )}
                                        </div>
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
                                                <span className="text-secondary font-bold text-sm w-8 text-center">{cartQty}</span>
                                            )}
                                            <button
                                                onClick={() => addToB2BCart(product)}
                                                className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                                aria-label="Sepete ekle"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <Package size={48} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400">Ürün bulunamadı</p>
                        </div>
                    )}

                    {/* Cart Toast */}
                    {showCartToast && (
                        <div className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-xl shadow-2xl shadow-primary/30 flex items-center gap-2 animate-bounce z-50">
                            <Check size={18} /> {showCartToast} sepete eklendi!
                        </div>
                    )}
                </div>
            )}
        </B2BLayout>
    );
};

export default B2BCatalogPage;
