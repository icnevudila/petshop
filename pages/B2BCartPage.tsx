import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import * as b2bOrderService from '../services/b2bOrderService';
import B2BLayout from '../components/B2BLayout';
import { Dealer, B2BCartEntry } from '../types';
import {
    ShoppingCart, Trash2, Plus, Minus, AlertCircle, CheckCircle2,
    ArrowRight, Package, MapPin, FileText, CreditCard, Banknote
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

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'havale' | 'credit_card'>('havale');
    const [cardData, setCardData] = useState({
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'cardNumber') formattedValue = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim();
        else if (name === 'expiry') formattedValue = value.replace(/\D/g, '').substring(0, 4).replace(/(\d{2})(\d{1,2})/, '$1/$2');
        else if (name === 'cvc') formattedValue = value.replace(/\D/g, '').substring(0, 3);
        else if (name === 'cardHolder') formattedValue = value.toUpperCase();
        setCardData(prev => ({ ...prev, [name]: formattedValue }));
    };

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

        if (paymentMethod === 'credit_card') {
            if (cardData.cardNumber.length < 19 || cardData.expiry.length < 5 || cardData.cvc.length < 3 || cardData.cardHolder.length < 3) {
                setError('Lütfen geçerli kart bilgileri giriniz.');
                return;
            }
        }

        setIsSubmitting(true);
        try {
            // Simulate Payment Delay
            if (paymentMethod === 'credit_card') {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

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
                `${orderNotes} [Ödeme: ${paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Havale/EFT'}]`
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
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-secondary mb-4">Siparişiniz Alındı!</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            {paymentMethod === 'havale'
                                ? 'Toptan siparişiniz başarıyla oluşturuldu. Ödeme bilgileriniz e-posta adresinize gönderilmiştir. Ödeme sonrası dekont paylaşmayı unutmayınız.'
                                : 'Kredi kartı ile ödemeniz başarıyla alındı. Siparişiniz hazırlanmaya başlanacaktır.'
                            }
                        </p>
                        {paymentMethod === 'havale' && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-8 text-left">
                                <p className="font-bold text-blue-800 mb-2">Banka Bilgileri:</p>
                                <p className="text-sm text-blue-700">IBAN: TR12 3456 0000 0000 1234 5678 90</p>
                                <p className="text-sm text-blue-700">Alıcı: PatiDükkan Ltd. Şti.</p>
                            </div>
                        )}
                        <div className="flex gap-3 justify-center">
                            <Link
                                to="/bayi/siparisler"
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                            >
                                Siparişlerimi Gör
                            </Link>
                            <Link
                                to="/bayi/katalog"
                                className="bg-gray-100 text-secondary px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
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
                        <h1 className="text-2xl font-bold text-secondary">Toptan Sipariş Sepeti</h1>
                        <p className="text-gray-400 text-sm mt-1">{b2bCart.length} ürün</p>
                    </div>
                    {b2bCart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-red-500 text-sm font-medium hover:text-red-600 transition-all flex items-center gap-1"
                        >
                            <Trash2 size={14} /> Sepeti Temizle
                        </button>
                    )}
                </div>

                {b2bCart.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Sepetiniz boş</p>
                        <Link
                            to="/bayi/katalog"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
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
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
                                >
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/80x80?text=Ürün'}
                                        alt={item.product_name}
                                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Ürün'; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-secondary font-medium text-sm truncate">{item.product_name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-primary font-bold text-sm">
                                                ₺{item.discounted_unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </span>
                                            {item.unit_price !== item.discounted_unit_price && (
                                                <span className="text-gray-400 text-xs line-through">
                                                    ₺{item.unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                                            aria-label="Adet azalt"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 0)}
                                            className="w-16 text-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 text-secondary font-bold text-sm"
                                            min="0"
                                            aria-label="Ürün adedi"
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                            aria-label="Adet artır"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="text-right flex-shrink-0 w-28">
                                        <p className="text-secondary font-bold text-sm">
                                            ₺{(item.discounted_unit_price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.product_id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                                        aria-label="Ürünü kaldır"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-4">
                            {/* Pricing */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <h3 className="text-secondary font-bold text-lg">Sipariş Özeti</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Ara Toplam</span>
                                        <span className="text-secondary">₺{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary">Bayi İskontosu (%{dealer?.discount_rate})</span>
                                            <span className="text-primary">-₺{totalDiscount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                                        <span className="text-secondary font-bold">Toplam</span>
                                        <span className="text-primary font-bold text-xl">₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                {minOrderAmount > 0 && !meetsMinOrder && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-amber-700 text-xs">
                                        <AlertCircle size={14} className="inline mr-1" />
                                        Minimum sipariş tutarı: ₺{minOrderAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        <div className="mt-1">
                                            Kalan: ₺{(minOrderAmount - total).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <h3 className="text-secondary font-bold flex items-center gap-2"><MapPin size={16} /> Teslimat Adresi</h3>
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Teslimat adresi..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-secondary placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
                                />
                            </div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <h3 className="text-secondary font-bold flex items-center gap-2"><FileText size={16} /> Sipariş Notu</h3>
                                <textarea
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    placeholder="Opsiyonel sipariş notu..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-secondary placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
                                />
                            </div>

                            {/* Payment Method Selection */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <h3 className="text-secondary font-bold flex items-center gap-2"><CreditCard size={16} /> Ödeme Yöntemi</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('havale')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'havale' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                    >
                                        <Banknote size={24} className="mb-2" />
                                        <span className="font-bold text-sm">Havale / EFT</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('credit_card')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                    >
                                        <CreditCard size={24} className="mb-2" />
                                        <span className="font-bold text-sm">Kredi Kartı</span>
                                    </button>
                                </div>

                                {paymentMethod === 'credit_card' && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-gray-400">Kart Üzerindeki İsim</label>
                                                <input
                                                    type="text"
                                                    name="cardHolder"
                                                    value={cardData.cardHolder}
                                                    onChange={handleCardChange}
                                                    placeholder="AD SOYAD"
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold uppercase"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-gray-400">Kart Numarası</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={cardData.cardNumber}
                                                        onChange={handleCardChange}
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pl-10 text-sm font-bold"
                                                    />
                                                    <CreditCard size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Son Kullanma (Ay/Yıl)</label>
                                                    <input
                                                        type="text"
                                                        name="expiry"
                                                        value={cardData.expiry}
                                                        onChange={handleCardChange}
                                                        placeholder="MM/YY"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">CVC / CVV</label>
                                                    <input
                                                        type="text"
                                                        name="cvc"
                                                        value={cardData.cvc}
                                                        onChange={handleCardChange}
                                                        placeholder="123"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
                                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">SANDBOX</span>
                                                Güvenli Ödeme Simülasyonu
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={isSubmitting || b2bCart.length === 0 || !meetsMinOrder}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sipariş Oluşturuluyor...' : 'Siparişi Oluştur'} <ArrowRight size={18} />
                            </button>

                            <p className="text-gray-400 text-xs text-center">
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
