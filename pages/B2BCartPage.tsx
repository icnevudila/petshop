import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import * as b2bOrderService from '../services/b2bOrderService';
import B2BLayout from '../components/B2BLayout';
import { Dealer, B2BCartEntry } from '../types';
import {
    ShoppingCart, Trash2, Plus, Minus, AlertCircle, CheckCircle2,
    ArrowRight, Package, MapPin, FileText
} from 'lucide-react';

const B2BCartPage: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [b2bCart, setB2bCart] = useState<B2BCartEntry[]>(() => {
        const saved = localStorage.getItem('b2b_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [shippingAddress, setShippingAddress] = useState('');
    const [orderNotes, setOrderNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadDealer = async () => {
            if (!currentUser) return;
            try {
                const d = await dealerService.getDealerByUserId(currentUser.id);
                setDealer(d);
                if (d) {
                    setShippingAddress(d.company_address || '');
                }
            } catch (e) {
                console.error('Error loading dealer:', e);
            }
        };
        loadDealer();
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('b2b_cart', JSON.stringify(b2bCart));
    }, [b2bCart]);

    const updateQuantity = (productId: string, qty: number) => {
        if (qty <= 0) {
            setB2bCart(prev => prev.filter(item => item.product_id !== productId));
        } else {
            setB2bCart(prev => prev.map(item =>
                item.product_id === productId ? { ...item, quantity: qty } : item
            ));
        }
    };

    const removeItem = (productId: string) => {
        setB2bCart(prev => prev.filter(item => item.product_id !== productId));
    };

    const clearCart = () => {
        setB2bCart([]);
    };

    const subtotal = b2bCart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const totalDiscount = b2bCart.reduce((sum, item) => sum + ((item.unit_price - item.discounted_unit_price) * item.quantity), 0);
    const total = b2bCart.reduce((sum, item) => sum + (item.discounted_unit_price * item.quantity), 0);
    const minOrderAmount = dealer?.min_order_amount || 0;
    const meetsMinOrder = minOrderAmount <= 0 || total >= minOrderAmount;

    const handleSubmitOrder = async () => {
        setError('');

        if (b2bCart.length === 0) {
            setError('Sepetiniz boş');
            return;
        }

        if (!shippingAddress.trim()) {
            setError('Lütfen teslimat adresini girin');
            return;
        }

        if (!meetsMinOrder) {
            setError(`Minimum sipariş tutarı ₺${minOrderAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`);
            return;
        }

        if (!dealer) return;

        setIsSubmitting(true);
        try {
            await b2bOrderService.createDealerOrder(
                dealer.id,
                b2bCart.map(item => ({
                    product_id: item.product_id,
                    product_name: item.product_name,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    discounted_unit_price: item.discounted_unit_price,
                })),
                shippingAddress,
                dealer.discount_rate,
                orderNotes || undefined
            );
            setSuccess(true);
            setB2bCart([]);
            localStorage.removeItem('b2b_cart');
        } catch (err: any) {
            setError('Sipariş oluşturulamadı: ' + (err.message || 'Lütfen tekrar deneyin'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <B2BLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Siparişiniz Alındı!</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Toptan siparişiniz başarıyla oluşturuldu. Siparişiniz en kısa sürede
                            incelenecek ve onaylandığında bilgilendirileceksiniz.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link
                                to="/bayi/siparisler"
                                className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all"
                            >
                                Siparişlerimi Gör
                            </Link>
                            <Link
                                to="/bayi/katalog"
                                className="bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-600 transition-all"
                            >
                                Kataloga Dön
                            </Link>
                        </div>
                    </div>
                </div>
            </B2BLayout>
        );
    }

    return (
        <B2BLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Toptan Sipariş Sepeti</h1>
                        <p className="text-slate-400 text-sm mt-1">{b2bCart.length} ürün</p>
                    </div>
                    {b2bCart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-red-400 text-sm font-medium hover:text-red-300 transition-all flex items-center gap-1"
                        >
                            <Trash2 size={14} /> Sepeti Temizle
                        </button>
                    )}
                </div>

                {b2bCart.length === 0 ? (
                    <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                        <ShoppingCart size={48} className="text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">Sepetiniz boş</p>
                        <Link
                            to="/bayi/katalog"
                            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all"
                        >
                            Ürün Kataloğu <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {b2bCart.map(item => (
                                <div
                                    key={item.product_id}
                                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 flex items-center gap-4"
                                >
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/80x80?text=Ürün'}
                                        alt={item.product_name}
                                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Ürün'; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium text-sm truncate">{item.product_name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-emerald-400 font-bold text-sm">
                                                ₺{item.discounted_unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </span>
                                            {item.unit_price !== item.discounted_unit_price && (
                                                <span className="text-slate-500 text-xs line-through">
                                                    ₺{item.unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 0)}
                                            className="w-16 text-center bg-slate-700/50 border border-slate-600/50 rounded-lg py-1.5 text-white font-bold text-sm"
                                            min="0"
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="text-right flex-shrink-0 w-28">
                                        <p className="text-white font-bold text-sm">
                                            ₺{(item.discounted_unit_price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.product_id)}
                                        className="p-2 text-slate-500 hover:text-red-400 transition-all flex-shrink-0"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-4">
                            {/* Pricing */}
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 space-y-4">
                                <h3 className="text-white font-bold text-lg">Sipariş Özeti</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Ara Toplam</span>
                                        <span className="text-white">₺{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-400">Bayi İskontosu (%{dealer?.discount_rate})</span>
                                            <span className="text-emerald-400">-₺{totalDiscount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-700/50 pt-3 flex justify-between">
                                        <span className="text-white font-bold">Toplam</span>
                                        <span className="text-emerald-400 font-bold text-xl">₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                {minOrderAmount > 0 && !meetsMinOrder && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-400 text-xs">
                                        <AlertCircle size={14} className="inline mr-1" />
                                        Minimum sipariş tutarı: ₺{minOrderAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        <div className="mt-1">
                                            Kalan: ₺{(minOrderAmount - total).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 space-y-4">
                                <h3 className="text-white font-bold flex items-center gap-2"><MapPin size={16} /> Teslimat Adresi</h3>
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Teslimat adresi..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-none text-sm"
                                />
                            </div>

                            {/* Order Notes */}
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 space-y-4">
                                <h3 className="text-white font-bold flex items-center gap-2"><FileText size={16} /> Sipariş Notu</h3>
                                <textarea
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    placeholder="Opsiyonel sipariş notu..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-none text-sm"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={isSubmitting || b2bCart.length === 0 || !meetsMinOrder}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sipariş Oluşturuluyor...' : 'Siparişi Oluştur'} <ArrowRight size={18} />
                            </button>

                            <p className="text-slate-500 text-xs text-center">
                                Siparişiniz onaylandıktan sonra ödeme bilgileri tarafınıza iletilecektir.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </B2BLayout>
    );
};

export default B2BCartPage;
