
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../ProductContext';
import { createOrder } from '../services/orderService';
import { CartEntry } from '../types';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Truck } from 'lucide-react';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { products } = useProducts();
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<CartEntry[]>([]);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        notes: ''
    });

    // Payment Method: 'shopier' | 'havale'
    const [paymentMethod, setPaymentMethod] = useState<'shopier' | 'havale'>('shopier');

    useEffect(() => {
        // Load cart from local storage or context if accessed via prop
        // Ideally we should pass cart prop or use a CartContext, but for now loading from localStorage/Supabase logic
        // For simplicity, let's grab from localStorage as App.tsx syncs it.
        // Actually, better to fetch fresh cart if logged in or use local.
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch { }
        }

        // Prefill user info if available
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                email: currentUser.email || '',
                name: currentUser.user_metadata?.name || ''
            }));
        }
    }, [currentUser]);

    const cartItems = cart.map(entry => {
        const product = products.find(p => p.id === entry.product_id);
        return product ? { product, quantity: entry.quantity } : null;
    }).filter(Boolean) as { product: typeof products[number]; quantity: number }[];

    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.discounted_price || item.product.price) * item.quantity, 0);
    const shipping = subtotal >= 799 ? 0 : 49.00;
    const total = subtotal + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Sipariş vermek için lütfen giriş yapınız.');
            navigate('/giris');
            return;
        }

        setLoading(true);
        try {
            // Apply Havale Discount if needed
            const finalTotal = paymentMethod === 'havale' ? total * 0.95 : total;

            const order = await createOrder({
                userId: currentUser.id,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress: `${formData.address}, ${formData.city}`,
                notes: `${formData.notes} [Ödeme: ${paymentMethod === 'shopier' ? 'Kredi Kartı' : 'Havale'}]`,
                totalPrice: finalTotal,
                items: cartItems.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    unitPrice: item.product.discounted_price || item.product.price
                }))
            });

            // Clear cart
            localStorage.setItem('cart', '[]');
            setCart([]);

            if (paymentMethod === 'shopier') {
                // IYZICO SANDBOX SIMULATION
                // In a real app, we would make a POST to our backend to get the 'checkoutFormContent'
                // and then render it in a modal or div.
                // For now, we simulate a successful payment delay.

                // Show a fake processing modal or alert
                alert('Iyzico Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz... (Sandbox: İşlem Başarılı Varsayılıyor)');

                setTimeout(() => {
                    alert('Ödeme Başarılı! Siparişiniz alındı ve işleme konuldu.');
                    navigate('/hesabim');
                }, 1500);

            } else {
                alert('Siparişiniz başarıyla alındı! Havale bilgileri sipariş detaylarında mevcuttur.');
                navigate('/hesabim');
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Sipariş oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="p-20 text-center">Sepetiniz boş.</div>;
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-[260px] md:pt-12 pb-12">
            <div className="container mx-auto px-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-8 hover:text-brand transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Alışverişe Dön
                </button>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-secondary mb-8 flex items-center gap-3">
                                <ShieldCheck className="text-brand" /> Teslimat & Ödeme
                            </h2>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">1. İletişim Bilgileri</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Ad Soyad</label>
                                            <input
                                                required
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                                placeholder="Adınız Soyadınız"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Telefon</label>
                                            <input
                                                required
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                                placeholder="05XX XXX XX XX"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">E-posta</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Adres</label>
                                            <textarea
                                                required
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                                                placeholder="Mahalle, Sokak, Kapı No"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Şehir / İlçe</label>
                                            <input
                                                required
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                                placeholder="İl / İlçe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Sipariş Notu</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                                            placeholder="Varsa kurye veya paketleme notunuz"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="space-y-4 pt-6 text-left">
                                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">2. Ödeme Yöntemi</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setPaymentMethod('shopier')}
                                            className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-4 transition-all ${paymentMethod === 'shopier' ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-brand/30'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'shopier' ? 'border-brand' : 'border-gray-300'}`}>
                                                {paymentMethod === 'shopier' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={20} className="text-secondary" />
                                                    <span className="font-bold text-secondary">Kredi Kartı (Iyzico)</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">SANDBOX</span>
                                                    <p className="text-xs text-gray-500">Güvenli Ödeme</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('havale')}
                                            className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-4 transition-all ${paymentMethod === 'havale' ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-brand/30'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'havale' ? 'border-brand' : 'border-gray-300'}`}>
                                                {paymentMethod === 'havale' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="font-black text-secondary border border-secondary rounded px-1.5 text-[10px]">TL</div>
                                                    <span className="font-bold text-secondary">Havale / EFT</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">%5 İndirimli ödeme</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box based on Selection */}
                                    {paymentMethod === 'havale' && (
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                                            <p className="font-bold mb-1">Banka Bilgileri:</p>
                                            <p>IBAN: TR12 3456 0000 0000 1234 5678 90</p>
                                            <p>Alıcı: PatiDükkan Ltd.</p>
                                            <p className="mt-2 text-xs">Siparişinizi tamamladıktan sonra dekontu whatsapp hattımıza iletiniz.</p>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-32">
                            <h3 className="text-xl font-black text-secondary mb-6">Sipariş Özeti</h3>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 flex-shrink-0">
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 line-clamp-2">{item.product.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.quantity} adet x {(item.product.discounted_price || item.product.price).toLocaleString('tr-TR')} TL</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-gray-100 my-4"></div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-500 font-bold">
                                    <span>Ara Toplam</span>
                                    <span>{subtotal.toLocaleString('tr-TR')} TL</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-bold">
                                    <span>Kargo</span>
                                    <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Bedava' : `${shipping} TL`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-secondary pt-4 border-t border-gray-100">
                                    <span>Toplam</span>
                                    <span className="text-brand">{total.toLocaleString('tr-TR')} TL</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="hidden lg:flex w-full mt-8 bg-brand text-white font-black py-4 rounded-xl shadow-brand-glow hover:bg-brand-hover hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
                            >
                                {loading ? 'İşleniyor...' : (
                                    <>Siparişi Tamamla <CheckCircle2 size={20} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="lg:hidden fixed bottom-[56px] left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-[990] flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400">Ödenecek Tutar</span>
                    <span className="text-xl font-black text-brand tracking-tighter">{total.toLocaleString('tr-TR')} TL</span>
                </div>
                <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="flex-grow bg-brand text-white h-12 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-hover transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '...' : 'Siparişi Tamamla'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
