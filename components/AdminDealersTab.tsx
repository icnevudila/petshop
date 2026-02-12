import React, { useState, useEffect } from 'react';
import * as dealerService from '../services/dealerService';
import * as b2bOrderService from '../services/b2bOrderService';
import { Dealer, DealerOrder, DealerStatus, DealerOrderStatus } from '../types';
import {
    Building2, Check, X, Clock, Ban, Eye,
    Percent, Users, ClipboardList, DollarSign,
    AlertCircle, RefreshCw
} from 'lucide-react';

// Turkish labels for English dealer status values  
const dealerStatusLabels: Record<DealerStatus, string> = {
    'pending': 'Beklemede',
    'approved': 'Onaylandı',
    'rejected': 'Reddedildi',
    'suspended': 'Askıya Alındı',
};

const dealerStatusColors: Record<DealerStatus, string> = {
    'pending': 'bg-amber-100 text-amber-700',
    'approved': 'bg-green-100 text-green-700',
    'rejected': 'bg-red-100 text-red-700',
    'suspended': 'bg-gray-100 text-gray-700',
};

const orderStatusColors: Record<string, string> = {
    'Beklemede': 'bg-amber-100 text-amber-700',
    'Onaylandı': 'bg-blue-100 text-blue-700',
    'Hazırlanıyor': 'bg-indigo-100 text-indigo-700',
    'Kargolandı': 'bg-purple-100 text-purple-700',
    'Teslim Edildi': 'bg-green-100 text-green-700',
    'İptal Edildi': 'bg-red-100 text-red-700',
};

const AdminDealersTab: React.FC = () => {
    const [subTab, setSubTab] = useState<'dealers' | 'orders'>('dealers');
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [orders, setOrders] = useState<DealerOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<DealerOrder | null>(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [discountInput, setDiscountInput] = useState('');
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const loadDealers = async () => {
        try {
            const data = await dealerService.getAllDealers();
            setDealers(data);
        } catch (e) {
            console.error('Error loading dealers:', e);
        }
    };

    const loadOrders = async () => {
        try {
            const data = await b2bOrderService.getAllDealerOrders();
            setOrders(data);
        } catch (e) {
            console.error('Error loading dealer orders:', e);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([loadDealers(), loadOrders()]);
            setLoading(false);
        };
        init();
    }, []);

    const showNote = (msg: string, type: 'success' | 'error') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleStatusChange = async (dealerId: string, status: DealerStatus) => {
        try {
            await dealerService.updateDealerStatus(dealerId, status);
            showNote(`Bayi durumu "${dealerStatusLabels[status]}" olarak güncellendi`, 'success');
            await loadDealers();
            setSelectedDealer(null);
        } catch (e) {
            showNote('Durum güncellenemedi', 'error');
        }
    };

    const handleDiscountUpdate = async (dealerId: string) => {
        const rate = parseFloat(discountInput);
        if (isNaN(rate) || rate < 0 || rate > 100) {
            showNote('Geçerli bir iskonto oranı girin (0-100)', 'error');
            return;
        }
        try {
            await dealerService.updateDealerDiscount(dealerId, rate);
            showNote(`İskonto oranı %${rate} olarak güncellendi`, 'success');
            await loadDealers();
            setDiscountInput('');
        } catch (e) {
            showNote('İskonto güncellenemedi', 'error');
        }
    };

    const handleOrderStatusChange = async (orderId: string, status: DealerOrderStatus) => {
        try {
            await b2bOrderService.updateDealerOrderStatus(orderId, status);
            showNote(`Sipariş durumu "${status}" olarak güncellendi`, 'success');
            await loadOrders();
            setSelectedOrder(null);
        } catch (e) {
            showNote('Sipariş durumu güncellenemedi', 'error');
        }
    };

    const filteredDealers = filterStatus
        ? dealers.filter(d => d.status === filterStatus)
        : dealers;

    const pendingCount = dealers.filter(d => d.status === 'pending').length;
    const approvedCount = dealers.filter(d => d.status === 'approved').length;
    const pendingOrderCount = orders.filter(o => o.status === 'Beklemede').length;
    const totalOrderAmount = orders.reduce((sum, o) => sum + o.total_price, 0);

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-32 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-bold flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    {notification.msg}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-xs font-medium text-gray-500 mb-1">Toplam Bayi</p><p className="text-xl font-black text-secondary">{dealers.length}</p></div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center"><Users size={20} className="text-white" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-xs font-medium text-gray-500 mb-1">Bekleyen Başvuru</p><p className="text-xl font-black text-amber-600">{pendingCount}</p></div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center"><Clock size={20} className="text-white" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-xs font-medium text-gray-500 mb-1">Bekleyen Sipariş</p><p className="text-xl font-black text-blue-600">{pendingOrderCount}</p></div>
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center"><ClipboardList size={20} className="text-white" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div><p className="text-xs font-medium text-gray-500 mb-1">Toplam Sipariş Tutarı</p><p className="text-xl font-black text-secondary">₺{totalOrderAmount.toLocaleString('tr-TR')}</p></div>
                        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center"><DollarSign size={20} className="text-white" /></div>
                    </div>
                </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-gray-100">
                <button
                    onClick={() => setSubTab('dealers')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all ${subTab === 'dealers' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <Building2 size={14} /> Bayiler {pendingCount > 0 && <span className="bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingCount}</span>}
                </button>
                <button
                    onClick={() => setSubTab('orders')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-sm transition-all ${subTab === 'orders' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <ClipboardList size={14} /> B2B Siparişler {pendingOrderCount > 0 && <span className="bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingOrderCount}</span>}
                </button>
                <button
                    onClick={() => { loadDealers(); loadOrders(); }}
                    className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                    title="Yenile"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Dealers Sub-Tab */}
            {subTab === 'dealers' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h3 className="text-lg font-bold text-secondary">Bayi Yönetimi</h3>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            aria-label="Durum filtresi"
                        >
                            <option value="">Tüm Durumlar</option>
                            <option value="pending">Beklemede</option>
                            <option value="approved">Onaylandı</option>
                            <option value="rejected">Reddedildi</option>
                            <option value="suspended">Askıya Alındı</option>
                        </select>
                    </div>

                    {filteredDealers.length === 0 ? (
                        <div className="text-center py-12">
                            <Building2 size={40} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Bayi bulunamadı</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Firma</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Vergi No</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Şehir</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">İskonto</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Durum</th>
                                        <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Başvuru</th>
                                        <th className="text-right py-3 px-4 font-bold text-gray-500 text-xs uppercase">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDealers.map(dealer => (
                                        <tr key={dealer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4">
                                                <p className="font-bold text-secondary text-sm">{dealer.company_name}</p>
                                                <p className="text-xs text-gray-400">{dealer.company_phone}</p>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-700 font-mono">{dealer.tax_number}</td>
                                            <td className="py-4 px-4 text-sm text-gray-700">{dealer.city}/{dealer.district}</td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm font-bold text-emerald-600">%{dealer.discount_rate}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${dealerStatusColors[dealer.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {dealerStatusLabels[dealer.status] || dealer.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-xs text-gray-400">
                                                {new Date(dealer.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => { setSelectedDealer(dealer); setDiscountInput(dealer.discount_rate.toString()); }}
                                                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                                        title="Detay & Düzenle"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {dealer.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(dealer.id, 'approved')}
                                                                className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition-colors"
                                                                title="Onayla"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(dealer.id, 'rejected')}
                                                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                                                title="Reddet"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {dealer.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleStatusChange(dealer.id, 'suspended')}
                                                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                                                            title="Askıya Al"
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Orders Sub-Tab */}
            {subTab === 'orders' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-secondary mb-6">B2B Sipariş Yönetimi</h3>
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <ClipboardList size={40} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Henüz B2B sipariş bulunmuyor</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map(order => (
                                <div key={order.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Building2 size={20} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-black text-secondary font-mono">#{order.id.slice(0, 8)}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${orderStatusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-secondary text-sm">{order.dealer?.company_name || 'Bayi'}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    {order.discount_applied > 0 && <span className="ml-2 text-emerald-500">%{order.discount_applied} iskonto</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xl font-black text-secondary">₺{order.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={async () => {
                                                        const detail = await b2bOrderService.getDealerOrderDetail(order.id);
                                                        setSelectedOrder(detail);
                                                    }}
                                                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                                    title="Detay"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {order.status === 'Beklemede' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleOrderStatusChange(order.id, 'Onaylandı')}
                                                            className="p-2 hover:bg-green-50 rounded-lg text-green-500 transition-colors"
                                                            title="Onayla"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOrderStatusChange(order.id, 'İptal Edildi')}
                                                            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                                            title="İptal Et"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'Onaylandı' && (
                                                    <button
                                                        onClick={() => handleOrderStatusChange(order.id, 'Hazırlanıyor')}
                                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Hazırla
                                                    </button>
                                                )}
                                                {order.status === 'Hazırlanıyor' && (
                                                    <button
                                                        onClick={() => handleOrderStatusChange(order.id, 'Kargolandı')}
                                                        className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                                                    >
                                                        Kargola
                                                    </button>
                                                )}
                                                {order.status === 'Kargolandı' && (
                                                    <button
                                                        onClick={() => handleOrderStatusChange(order.id, 'Teslim Edildi')}
                                                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                                                    >
                                                        Teslim
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Dealer Detail Modal */}
            {selectedDealer && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
                            <h3 className="text-lg font-bold text-secondary">Bayi Detayı</h3>
                            <button onClick={() => setSelectedDealer(null)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Kapat">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Firma Adı</p>
                                    <p className="text-sm font-bold text-secondary">{selectedDealer.company_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Durum</p>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${dealerStatusColors[selectedDealer.status]}`}>
                                        {dealerStatusLabels[selectedDealer.status]}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Vergi No</p>
                                    <p className="text-sm text-gray-700 font-mono">{selectedDealer.tax_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Vergi Dairesi</p>
                                    <p className="text-sm text-gray-700">{selectedDealer.tax_office}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Telefon</p>
                                    <p className="text-sm text-gray-700">{selectedDealer.company_phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Şehir / İlçe</p>
                                    <p className="text-sm text-gray-700">{selectedDealer.city} / {selectedDealer.district}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-1">Adres</p>
                                <p className="text-sm text-gray-700">{selectedDealer.company_address}</p>
                            </div>
                            {selectedDealer.notes && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Notlar</p>
                                    <p className="text-sm text-gray-700">{selectedDealer.notes}</p>
                                </div>
                            )}

                            {/* Discount Rate Editor */}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-bold text-gray-400 mb-2">İskonto Oranı Güncelle</p>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={discountInput}
                                            onChange={(e) => setDiscountInput(e.target.value)}
                                            placeholder="Ör: 15"
                                            min="0"
                                            max="100"
                                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            aria-label="İskonto oranı"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDiscountUpdate(selectedDealer.id)}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                                    >
                                        Güncelle
                                    </button>
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
                                {selectedDealer.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(selectedDealer.id, 'approved')}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                                        >
                                            <Check size={14} /> Onayla
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(selectedDealer.id, 'rejected')}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} /> Reddet
                                        </button>
                                    </>
                                )}
                                {selectedDealer.status === 'approved' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedDealer.id, 'suspended')}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-500 text-white rounded-xl font-bold text-sm hover:bg-gray-600 transition-colors"
                                    >
                                        <Ban size={14} /> Askıya Al
                                    </button>
                                )}
                                {(selectedDealer.status === 'rejected' || selectedDealer.status === 'suspended') && (
                                    <button
                                        onClick={() => handleStatusChange(selectedDealer.id, 'approved')}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                                    >
                                        <Check size={14} /> Tekrar Onayla
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
                            <div>
                                <h3 className="text-lg font-bold text-secondary">Sipariş Detayı</h3>
                                <span className="text-xs text-gray-400 font-mono">#{selectedOrder.id.slice(0, 8)}</span>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Kapat">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-gray-400 mb-1">Durum</p>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${orderStatusColors[selectedOrder.status]}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-gray-400 mb-1">Toplam</p>
                                    <p className="text-lg font-black text-secondary">₺{selectedOrder.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-gray-400 mb-1">Tarih</p>
                                    <p className="text-sm text-gray-700">{new Date(selectedOrder.created_at).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-gray-400 mb-1">İskonto</p>
                                    <p className="text-sm text-emerald-600 font-bold">%{selectedOrder.discount_applied}</p>
                                </div>
                            </div>
                            {selectedOrder.shipping_address && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-gray-400 mb-1">Teslimat Adresi</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.shipping_address}</p>
                                </div>
                            )}
                            {selectedOrder.notes && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-gray-400 mb-1">Sipariş Notu</p>
                                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sipariş Kalemleri</p>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-secondary">{item.product_name}</p>
                                                <p className="text-xs text-gray-400">{item.quantity} adet × ₺{item.discounted_unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <p className="font-bold text-secondary text-sm">₺{(item.quantity * item.discounted_unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
                                {selectedOrder.status === 'Beklemede' && (
                                    <>
                                        <button onClick={() => handleOrderStatusChange(selectedOrder.id, 'Onaylandı')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">Onayla</button>
                                        <button onClick={() => handleOrderStatusChange(selectedOrder.id, 'İptal Edildi')}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">İptal Et</button>
                                    </>
                                )}
                                {selectedOrder.status === 'Onaylandı' && (
                                    <button onClick={() => handleOrderStatusChange(selectedOrder.id, 'Hazırlanıyor')}
                                        className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors">Hazırlanıyor</button>
                                )}
                                {selectedOrder.status === 'Hazırlanıyor' && (
                                    <button onClick={() => handleOrderStatusChange(selectedOrder.id, 'Kargolandı')}
                                        className="px-4 py-2 bg-purple-500 text-white rounded-xl font-bold text-sm hover:bg-purple-600 transition-colors">Kargolandı</button>
                                )}
                                {selectedOrder.status === 'Kargolandı' && (
                                    <button onClick={() => handleOrderStatusChange(selectedOrder.id, 'Teslim Edildi')}
                                        className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">Teslim Edildi</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDealersTab;
