
import React, { useState } from 'react';
import { User, Package, Heart, LogOut, MapPin, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
    const { user, logout } = useAuth(); // Assuming AuthContext provides user object
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Mock Orders
    const orders = [
        { id: '10245', date: '01.01.2025', count: 3, total: '1.250 TL', status: 'Teslim Edildi', statusColor: 'text-green-600 bg-green-50' },
        { id: '10240', date: '15.12.2024', count: 1, total: '450 TL', status: 'Teslim Edildi', statusColor: 'text-gray-600 bg-gray-50' },
    ];

    if (!user) {
        // Redirect to login if accessed directly without auth (usually handled by ProtectedRoute but adding fallback UI)
        return (
            <div className="pt-32 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-4">Giriş Yapmalısınız</h2>
                <p className="text-gray-500 mb-6">Hesap detaylarını görmek için lütfen giriş yapın.</p>
                <Link to="/giris" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20">
                    Giriş Yap
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-32">
                            <div className="text-center mb-8 pb-8 border-b border-gray-100">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 font-black text-2xl">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <h2 className="font-bold text-lg text-secondary">{user.name || 'Kullanıcı'}</h2>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'orders' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Package size={18} /> Siparişlerim
                                </button>
                                <div onClick={() => navigate('/favoriler')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                                    <Heart size={18} /> İstek Listem
                                </div>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'addresses' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <MapPin size={18} /> Adreslerim
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === 'settings' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Settings size={18} /> Hesap Ayarları
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-red-500 hover:bg-red-50 mt-4"
                                >
                                    <LogOut size={18} /> Çıkış Yap
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">

                        {activeTab === 'orders' && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-black text-secondary mb-6">Siparişlerim</h2>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-gray-50 pb-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sipariş No</p>
                                                    <p className="font-bold text-secondary">#{order.id}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tarih</p>
                                                    <p className="font-medium text-gray-600">{order.date}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tutar</p>
                                                    <p className="font-black text-primary">{order.total}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-xl text-xs font-bold ${order.statusColor}`}>
                                                    {order.status}
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button className="text-primary text-sm font-bold hover:underline">Detayları Gör</button>
                                                <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20">Tekrar Satın Al</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 font-medium">Henüz hiç siparişiniz yok.</p>
                                        <Link to="/" className="text-primary font-bold mt-2 inline-block hover:underline">Alışverişe Başla</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center animate-fade-in">
                                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="font-bold text-lg text-secondary mb-2">Adreslerim</h3>
                                <p className="text-gray-500 mb-6">Kayıtlı adresiniz bulunmamaktadır.</p>
                                <button className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                    + Yeni Adres Ekle
                                </button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 max-w-xl animate-fade-in">
                                <h3 className="font-bold text-lg text-secondary mb-6">Hesap Bilgileri</h3>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Ad</label>
                                            <input type="text" defaultValue={user?.name?.split(' ')[0]} className="w-full px-4 py-2 bg-gray-50 rounded-xl border-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Soyad</label>
                                            <input type="text" defaultValue={user?.name?.split(' ')[1]} className="w-full px-4 py-2 bg-gray-50 rounded-xl border-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">E-Posta</label>
                                        <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 bg-gray-50 rounded-xl border-none" disabled />
                                    </div>
                                    <button type="button" className="bg-primary text-white px-6 py-3 rounded-xl font-bold w-full mt-4 hover:bg-primary-hover">
                                        Bilgileri Güncelle
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
