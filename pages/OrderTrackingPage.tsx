
import React, { useState } from 'react';
import { Truck, Search, AlertCircle, Package, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface OrderResult {
    id: string;
    status: string;
    total_price: number;
    created_at: string;
    customer_name: string;
    shipping_address: string;
    items: {
        product_name: string;
        quantity: number;
        unit_price: number;
    }[];
}

const statusConfig: Record<string, { icon: any; color: string; bgColor: string; borderColor: string }> = {
    'Hazırlanıyor': { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-500' },
    'Kargoda': { icon: Truck, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-500' },
    'Teslim Edildi': { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-500' },
    'İptal Edildi': { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-500' },
};

const OrderTrackingPage: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<OrderResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setNotFound(false);
        setResult(null);

        try {
            // Search by order ID and email
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select(`
                    id, status, total_price, created_at, customer_name, shipping_address,
                    order_items (product_name, quantity, unit_price)
                `)
                .eq('id', orderId.trim())
                .eq('customer_email', email.trim().toLowerCase())
                .single();

            if (orderError || !order) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setResult({
                id: order.id,
                status: order.status,
                total_price: order.total_price,
                created_at: order.created_at,
                customer_name: order.customer_name,
                shipping_address: order.shipping_address,
                items: (order.order_items || []).map((item: any) => ({
                    product_name: item.product_name,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                })),
            });
        } catch (err: any) {
            setError('Sipariş sorgulanırken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status: string) => {
        return statusConfig[status] || statusConfig['Hazırlanıyor'];
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="pt-36 pb-16 bg-gray-50 min-h-screen flex flex-col items-center px-4">
            <div className="container mx-auto max-w-lg">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-8">
                    <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <ChevronRight size={10} />
                    <span className="text-gray-900">Sipariş Takibi</span>
                </div>

                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary shadow-lg mx-auto mb-6">
                        <Truck size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-secondary">Sipariş Takibi</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Sipariş numaranız ve e-posta adresinizle kargonuzu sorgulayın.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Sipariş Numarası</label>
                            <input
                                type="text"
                                placeholder="Örn: 10245"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                required
                                aria-label="Sipariş numarası"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">E-Posta Adresi</label>
                            <input
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                required
                                aria-label="E-posta adresi"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Sorgulanıyor...
                                </span>
                            ) : (
                                <>
                                    <Search size={20} /> Sorgula
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Not Found */}
                {notFound && (
                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-md border-l-4 border-amber-500 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-secondary">Sipariş Bulunamadı</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Girdiğiniz bilgilerle eşleşen bir sipariş bulunamadı. Sipariş numarasını ve e-posta adresini kontrol ederek tekrar deneyin.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-8 bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="mt-8 space-y-4 animate-fade-in">
                        {/* Status Card */}
                        <div className={`bg-white p-6 rounded-2xl shadow-md border-l-4 ${getStatusInfo(result.status).borderColor}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-14 h-14 ${getStatusInfo(result.status).bgColor} rounded-full flex items-center justify-center ${getStatusInfo(result.status).color}`}>
                                    {React.createElement(getStatusInfo(result.status).icon, { size: 28 })}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sipariş Durumu</p>
                                    <h3 className={`text-xl font-black ${getStatusInfo(result.status).color}`}>{result.status}</h3>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Sipariş No:</span>
                                    <span className="font-bold text-secondary font-mono">#{result.id}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Tarih:</span>
                                    <span className="font-bold text-secondary">{formatDate(result.created_at)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Alıcı:</span>
                                    <span className="font-bold text-secondary">{result.customer_name}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500">Toplam Tutar:</span>
                                    <span className="font-black text-primary text-lg">₺{Number(result.total_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        {result.items.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
                                    <Package size={18} className="text-primary" />
                                    Sipariş İçeriği
                                </h4>
                                <div className="space-y-3">
                                    {result.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <div>
                                                <p className="text-sm font-medium text-secondary">{item.product_name}</p>
                                                <p className="text-xs text-gray-400">{item.quantity} adet × ₺{Number(item.unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <span className="font-bold text-secondary text-sm">
                                                ₺{(item.quantity * item.unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delivery Address */}
                        {result.shipping_address && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-secondary mb-2 text-sm">Teslimat Adresi</h4>
                                <p className="text-sm text-gray-600">{result.shipping_address}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 bg-blue-50 p-4 rounded-xl flex gap-3 items-start text-xs text-blue-700 leading-relaxed border border-blue-100">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <p>Sipariş numaranızı sipariş onay e-postasında bulabilirsiniz. Eğer bulamıyorsanız müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>
                </div>

            </div>
        </div>
    );
};

export default OrderTrackingPage;
