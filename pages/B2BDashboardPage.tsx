import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import * as b2bOrderService from '../services/b2bOrderService';
import B2BLayout from '../components/B2BLayout';
import { Dealer, DealerOrder } from '../types';
import {
    Package, ShoppingCart, ClipboardList, TrendingUp,
    ArrowRight, Calendar, DollarSign
} from 'lucide-react';

const B2BDashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [recentOrders, setRecentOrders] = useState<DealerOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!currentUser) return;
            try {
                const d = await dealerService.getDealerByUserId(currentUser.id);
                if (d) {
                    setDealer(d);
                    const orders = await b2bOrderService.getDealerOrders(d.id);
                    setRecentOrders(orders.slice(0, 5));
                }
            } catch (e) {
                console.error('Error loading dashboard:', e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentUser]);

    const totalSpent = recentOrders.reduce((sum, o) => sum + o.total_price, 0);
    const pendingOrders = recentOrders.filter(o => o.status === 'Beklemede').length;

    const statusColors: Record<string, string> = {
        'Beklemede': 'bg-amber-100 text-amber-700',
        'Onaylandı': 'bg-blue-100 text-blue-700',
        'Hazırlanıyor': 'bg-indigo-100 text-indigo-700',
        'Kargolandı': 'bg-purple-100 text-purple-700',
        'Teslim Edildi': 'bg-green-100 text-green-700',
        'İptal Edildi': 'bg-red-100 text-red-700',
    };

    return (
        <B2BLayout>
            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-primary/10 to-orange-50 rounded-2xl p-6 lg:p-8 border border-primary/10">
                    <h1 className="text-2xl lg:text-3xl font-bold text-secondary mb-2">
                        Hoş Geldiniz, {dealer?.company_name || 'Bayi'} 👋
                    </h1>
                    <p className="text-gray-500">
                        Toptan alışveriş portalınızdan siparişlerinizi yönetin
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <DollarSign size={24} className="text-primary" />
                            </div>
                            <TrendingUp size={16} className="text-primary" />
                        </div>
                        <p className="text-gray-400 text-sm">Toplam Sipariş Tutarı</p>
                        <p className="text-2xl font-bold text-secondary mt-1">₺{totalSpent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <ClipboardList size={24} className="text-blue-500" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">Toplam Sipariş</p>
                        <p className="text-2xl font-bold text-secondary mt-1">{recentOrders.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                <Calendar size={24} className="text-amber-500" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">Bekleyen Sipariş</p>
                        <p className="text-2xl font-bold text-secondary mt-1">{pendingOrders}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Package size={24} className="text-purple-500" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">İskonto Oranı</p>
                        <p className="text-2xl font-bold text-secondary mt-1">%{dealer?.discount_rate || 0}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/bayi/katalog"
                        className="bg-gradient-to-r from-primary/10 to-orange-50 rounded-2xl p-6 border border-primary/10 hover:border-primary/30 transition-all group flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-secondary font-bold text-lg">Ürün Kataloğu</h3>
                            <p className="text-gray-400 text-sm mt-1">Toptan fiyatlarla alışveriş yapın</p>
                        </div>
                        <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/bayi/siparisler"
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-all group flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-secondary font-bold text-lg">Siparişlerim</h3>
                            <p className="text-gray-400 text-sm mt-1">Tüm siparişlerinizi görüntüleyin</p>
                        </div>
                        <ArrowRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-secondary">Son Siparişler</h2>
                        <Link to="/bayi/siparisler" className="text-primary text-sm font-medium hover:underline transition-all">
                            Tümünü Gör →
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400">Henüz sipariş bulunmuyor</p>
                            <Link
                                to="/bayi/katalog"
                                className="inline-flex items-center gap-2 mt-4 text-primary text-sm font-medium hover:underline"
                            >
                                Kataloga Git <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-3">Sipariş No</th>
                                        <th className="px-6 py-3">Tarih</th>
                                        <th className="px-6 py-3">Tutar</th>
                                        <th className="px-6 py-3">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                                            <td className="px-6 py-4 text-secondary text-sm font-mono">#{order.id.slice(0, 8)}</td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(order.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-6 py-4 text-secondary text-sm font-semibold">
                                                ₺{order.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </B2BLayout>
    );
};

export default B2BDashboardPage;
