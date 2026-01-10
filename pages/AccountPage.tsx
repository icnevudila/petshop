
import React, { useState, useEffect } from 'react';
import { User, Package, Heart, LogOut, MapPin, Settings, Plus, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import { getAddresses, addAddress, deleteAddress, Address } from '../services/addressService';
import { updateProfile, UserProfile, getProfile } from '../services/authService';
import { Order } from '../types';

const AccountPage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);

    // Data States
    const [orders, setOrders] = useState<Order[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Form States
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({ title: '', full_address: '', city: '', district: '', postal_code: '' });
    const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/giris');
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                const [fetchedOrders, fetchedAddresses, fetchedProfile] = await Promise.all([
                    getOrders(currentUser.id),
                    getAddresses(currentUser.id),
                    getProfile(currentUser.id)
                ]);

                setOrders(fetchedOrders);
                setAddresses(fetchedAddresses);
                setProfile(fetchedProfile);

                if (fetchedProfile) {
                    setProfileForm({
                        full_name: fetchedProfile.full_name || '',
                        phone: fetchedProfile.phone || ''
                    });
                }
            } catch (error) {
                console.error('Error loading account data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentUser, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            await addAddress(currentUser.id, newAddress);
            const updated = await getAddresses(currentUser.id);
            setAddresses(updated);
            setIsAddressModalOpen(false);
            setNewAddress({ title: '', full_address: '', city: '', district: '', postal_code: '' });
            setMessage({ text: 'Adres başarıyla eklendi.', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Adres eklenirken hata oluştu.', type: 'error' });
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
        try {
            await deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
            setMessage({ text: 'Adres silindi.', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Silme işlemi başarısız.', type: 'error' });
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            await updateProfile(currentUser.id, profileForm);
            setMessage({ text: 'Profil güncellendi.', type: 'success' });
            // Update local profile state
            setProfile(prev => prev ? { ...prev, ...profileForm } : null);
        } catch (error) {
            setMessage({ text: 'Güncelleme başarısız.', type: 'error' });
        }
    };

    // Status Badge Helper
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'Hazırlanıyor': 'bg-yellow-100 text-yellow-700',
            'Kargolandı': 'bg-blue-100 text-blue-700',
            'Teslim Edildi': 'bg-green-100 text-green-700',
            'İptal Edildi': 'bg-red-100 text-red-700'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-[260px] md:pt-12 pb-12">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-secondary">Hesabım</h1>
                        <p className="text-gray-500 font-medium">Hoşgeldiniz, {profile?.full_name || currentUser?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold transition-colors">
                        <LogOut size={20} /> Çıkış Yap
                    </button>
                </div>

                {/* Message Alert */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto">x</button>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar scroll-smooth">
                        <div className="bg-white rounded-3xl p-2 lg:p-4 shadow-sm border border-gray-100 sticky top-32 flex lg:block gap-2 min-w-max lg:min-w-0 mb-6 lg:mb-0">
                            <nav className="flex lg:block gap-2 space-y-0 lg:space-y-1">
                                {[
                                    { id: 'orders', label: 'Siparişlerim', icon: Package },
                                    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
                                    { id: 'profile', label: 'Hesap Detayları', icon: Settings },
                                    { id: 'favorites', label: 'Favorilerim', icon: Heart, link: '/favoriler' },
                                ].map((item) => (
                                    item.link ? (
                                        <Link key={item.id} to={item.link} className="flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-brand transition-all text-sm whitespace-nowrap">
                                            <item.icon size={18} />
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-auto lg:w-full flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap ${activeTab === item.id
                                                ? 'bg-brand text-white shadow-brand-glow'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-brand'
                                                }`}
                                        >
                                            <item.icon size={18} />
                                            {item.label}
                                        </button>
                                    )
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">

                        {/* ORDERS TAB */}
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-black text-secondary">Sipariş Geçmişi</h2>
                                {orders.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900">Henüz siparişiniz yok</h3>
                                        <p className="text-gray-500 mt-2 mb-6">İlk siparişinizi oluşturmak için alışverişe başlayın.</p>
                                        <Link to="/" className="inline-block bg-brand text-white px-8 py-3 rounded-xl font-bold shadow-brand-glow hover:bg-brand-hover transition-all">
                                            Alışverişe Başla
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-gray-50 pb-4">
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Sipariş No</p>
                                                        <p className="font-bold text-gray-900">#{order.id.slice(0, 8)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Tarih</p>
                                                        <p className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Toplam</p>
                                                        <p className="font-bold text-brand">{order.total_price.toLocaleString('tr-TR')} TL</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Durum</p>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-gray-500 font-medium">
                                                        {order.address_info}
                                                    </p>
                                                    {/* Note: In a real app we might show order items here or link to details */}
                                                    <span className="text-xs font-bold text-brand cursor-pointer hover:underline">Detayları Gör</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ADDRESSES TAB */}
                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-black text-secondary">Kayıtlı Adreslerim</h2>
                                    <button
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
                                    >
                                        <Plus size={16} /> Yeni Adres Ekle
                                    </button>
                                </div>

                                {isAddressModalOpen && (
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg mb-8 animate-in fade-in slide-in-from-top-4">
                                        <h3 className="font-bold text-lg mb-4">Yeni Adres Ekle</h3>
                                        <form onSubmit={handleAddAddress} className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Adres Başlığı (Ev, İş vb.)"
                                                    value={newAddress.title}
                                                    onChange={e => setNewAddress({ ...newAddress, title: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-sm w-full"
                                                />
                                                <input
                                                    placeholder="Şehir"
                                                    value={newAddress.city}
                                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-sm w-full"
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    placeholder="İlçe"
                                                    value={newAddress.district}
                                                    onChange={e => setNewAddress({ ...newAddress, district: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-sm w-full"
                                                />
                                                <input
                                                    placeholder="Posta Kodu"
                                                    value={newAddress.postal_code}
                                                    onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-sm w-full"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Tam Adres (Mahalle, Sokak, No...)"
                                                value={newAddress.full_address}
                                                onChange={e => setNewAddress({ ...newAddress, full_address: e.target.value })}
                                                required
                                                className="bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-sm w-full min-h-[100px]"
                                            />
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddressModalOpen(false)}
                                                    className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-50 text-sm"
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-brand text-white px-6 py-2 rounded-xl font-bold shadow-brand-glow hover:bg-brand-hover text-sm"
                                                >
                                                    Kaydet
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    {addresses.length === 0 && !isAddressModalOpen && (
                                        <p className="text-gray-500 col-span-2 text-center py-8">Henüz kayıtlı adresiniz yok.</p>
                                    )}
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-gray-900">{addr.title}</h4>
                                                <button onClick={() => handleDeleteAddress(addr.id)} aria-label="Adresi Sil" className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed mb-4 min-h-[60px]">{addr.full_address}</p>
                                            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                                <span>{addr.district}, {addr.city}</span>
                                                <span>{addr.postal_code}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="max-w-xl">
                                <h2 className="text-xl font-black text-secondary mb-6">Hesap Bilgilerim</h2>
                                <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">E-posta</label>
                                        <input
                                            value={profile?.email || ''}
                                            disabled
                                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Ad Soyad</label>
                                        <input
                                            value={profileForm.full_name}
                                            onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                                            className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Telefon</label>
                                        <input
                                            value={profileForm.phone}
                                            onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            placeholder="05XX XXX XX XX"
                                            className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-black shadow-lg hover:bg-gray-800 transition-all">
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
