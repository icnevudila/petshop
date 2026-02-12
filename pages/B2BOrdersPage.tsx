import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import * as b2bOrderService from '../services/b2bOrderService';
import B2BLayout from '../components/B2BLayout';
import { Dealer, DealerOrder, DealerOrderItem } from '../types';
import {
    ClipboardList, Eye, X, Package, Calendar, ChevronDown
} from 'lucide-react';

const B2BOrdersPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [orders, setOrders] = useState<DealerOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<DealerOrder | null>(null);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (!currentUser) return;
            try {
                const d = await dealerService.getDealerByUserId(currentUser.id);
                if (d) {
                    setDealer(d);
                    const o = await b2bOrderService.getDealerOrders(d.id);
                    setOrders(o);
                }
            } catch (e) {
                console.error('Error loading orders:', e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentUser]);

    const viewOrderDetail = async (orderId: string) => {
        try {
            const detail = await b2bOrderService.getDealerOrderDetail(orderId);
            setSelectedOrder(detail);
        } catch (e) {
            console.error('Error loading order detail:', e);
        }
    };

    const statusColors: Record<string, string> = {
        'Beklemede': 'bg-amber-100 text-amber-700 border-amber-200',
        'Onaylandı': 'bg-blue-100 text-blue-700 border-blue-200',
        'Hazırlanıyor': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        'Kargolandı': 'bg-purple-100 text-purple-700 border-purple-200',
        'Teslim Edildi': 'bg-green-100 text-green-700 border-green-200',
        'İptal Edildi': 'bg-red-100 text-red-700 border-red-200',
    };

    const filteredOrders = filterStatus
        ? orders.filter(o => o.status === filterStatus)
        : orders;

    return (
        <B2BLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary">Siparişlerim</h1>
                        <p className="text-gray-400 text-sm mt-1">Toptan sipariş geçmişiniz</p>
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none min-w-[180px]"
                        aria-label="Durum filtresi"
                    >
                        <option value="">Tüm Durumlar</option>
                        <option value="Beklemede">Beklemede</option>
                        <option value="Onaylandı">Onaylandı</option>
                        <option value="Hazırlanıyor">Hazırlanıyor</option>
                        <option value="Kargolandı">Kargolandı</option>
                        <option value="Teslim Edildi">Teslim Edildi</option>
                        <option value="İptal Edildi">İptal Edildi</option>
                    </select>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Yükleniyor...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <ClipboardList size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">Sipariş bulunamadı</p>
                        <a
                            href="#/bayi/katalog"
                            className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                        >
                            Kataloga Git →
                        </a>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredOrders.map(order => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-primary/20 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-secondary font-mono font-bold">#{order.id.slice(0, 8)}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                            {order.discount_applied > 0 && (
                                                <span className="text-primary font-medium">%{order.discount_applied} iskonto</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-secondary font-bold text-lg">
                                                ₺{order.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => viewOrderDetail(order.id)}
                                            className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                                            title="Detay Görüntüle"
                                            aria-label="Detay görüntüle"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Detail Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
                                <div>
                                    <h3 className="text-lg font-bold text-secondary">Sipariş Detayı</h3>
                                    <p className="text-gray-400 text-sm font-mono">#{selectedOrder.id.slice(0, 8)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 text-gray-400 hover:text-secondary rounded-lg hover:bg-gray-50 transition-all"
                                    aria-label="Kapat"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Order Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-400 text-xs font-medium mb-1">Durum</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-400 text-xs font-medium mb-1">Tarih</p>
                                        <p className="text-secondary text-sm font-medium">
                                            {new Date(selectedOrder.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-400 text-xs font-medium mb-1">Toplam Tutar</p>
                                        <p className="text-primary text-lg font-bold">
                                            ₺{selectedOrder.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-400 text-xs font-medium mb-1">İskonto</p>
                                        <p className="text-secondary text-sm font-medium">%{selectedOrder.discount_applied}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {selectedOrder.shipping_address && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-400 text-xs font-medium mb-2">Teslimat Adresi</p>
                                        <p className="text-secondary text-sm">{selectedOrder.shipping_address}</p>
                                    </div>
                                )}

                                {/* Order Notes */}
                                {selectedOrder.notes && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-400 text-xs font-medium mb-2">Sipariş Notu</p>
                                        <p className="text-secondary text-sm">{selectedOrder.notes}</p>
                                    </div>
                                )}

                                {/* Order Items */}
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Sipariş Kalemleri</p>
                                    <div className="space-y-2">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-secondary text-sm font-medium">{item.product_name}</p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        {item.quantity} adet × ₺{item.discounted_unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <p className="text-secondary font-bold text-sm">
                                                    ₺{(item.quantity * item.discounted_unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </B2BLayout>
    );
};

export default B2BOrdersPage;
