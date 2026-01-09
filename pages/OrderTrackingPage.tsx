
import React, { useState } from 'react';
import { Truck, Search, AlertCircle } from 'lucide-react';

const OrderTrackingPage: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock simulation
        setTimeout(() => {
            setLoading(false);
            setResult({
                status: 'Kargoda',
                location: 'Transfer Merkezinde',
                date: '09.01.2025',
                carrier: 'Yurtiçi Kargo',
                trackingCode: '12345678901'
            });
        }, 1500);
    };

    return (
        <div className="pt-32 pb-16 bg-gray-50 min-h-screen flex flex-col items-center">
            <div className="container mx-auto px-4 max-w-lg">

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
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">Sorgulanıyor...</span>
                            ) : (
                                <>
                                    <Search size={20} /> Sorgula
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Result Area */}
                {result && (
                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500 animate-slide-up">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Truck size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Durum</p>
                                <h3 className="text-lg font-black text-green-600">{result.status}</h3>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span>Son Konum:</span>
                                <span className="font-bold">{result.location}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span>Tarih:</span>
                                <span className="font-bold">{result.date}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span>Kargo Firması:</span>
                                <span className="font-bold">{result.carrier}</span>
                            </div>
                            <div className="mt-4 pt-4 text-center">
                                <a href="#" className="text-primary font-bold hover:underline text-xs">Kargo Firması Sitesinde Göster →</a>
                            </div>
                        </div>
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
