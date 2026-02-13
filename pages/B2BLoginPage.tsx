import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, Building2, AlertCircle,
    Clock, ShoppingBag, TrendingUp, Package, Truck, Star, Shield, Percent
} from 'lucide-react';

const B2BLoginPage: React.FC = () => {
    const { login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkDealerStatus = async () => {
            if (!currentUser) return;
            try {
                const dealer = await dealerService.getDealerByUserId(currentUser.id);
                if (!dealer) {
                    setInfo('Bu hesap bir bayi hesabı değil. Bayi başvurusu yapabilirsiniz.');
                    return;
                }
                if (dealer.status === 'approved') {
                    navigate('/bayi');
                } else if (dealer.status === 'pending') {
                    setInfo('Bayi başvurunuz inceleniyor. Onaylandığında giriş yapabilirsiniz.');
                } else if (dealer.status === 'rejected') {
                    setError('Bayi başvurunuz reddedilmiştir. Detaylar için iletişime geçin.');
                } else if (dealer.status === 'suspended') {
                    setError('Bayi hesabınız askıya alınmıştır. Detaylar için iletişime geçin.');
                }
            } catch {
                // Not a dealer
            }
        };
        checkDealerStatus();
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setInfo('');

        if (!formData.email || !formData.password) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }

        setIsSubmitting(true);
        try {
            await login(formData.email, formData.password);
        } catch (err: any) {
            if (err.message?.includes('Invalid login')) {
                setError('E-posta veya şifre hatalı.');
            } else {
                setError('Giriş başarısız: ' + (err.message || 'Lütfen tekrar deneyin.'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-orange-300/20 to-yellow-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100/60 overflow-hidden border border-orange-100/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">

                        {/* Left Side - Image */}
                        <div className="hidden lg:block relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=1000&fit=crop"
                                alt="Pet shop wholesale"
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-orange-900/20"></div>

                            {/* Content overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">B2B Portal</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white leading-tight mb-2">Toptan Alışverişte<br />Ayrıcalıklı Fiyatlar</h2>
                                    <p className="text-white/80 text-sm max-w-xs">Türkiye'nin en geniş pet ürünleri toptan ağına katılın ve özel avantajlardan yararlanın.</p>
                                </div>

                                {/* Stats / Feature badges */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Percent size={14} className="text-orange-300" />
                                            <span className="text-white/60 text-xs font-medium">İskonto Oranı</span>
                                        </div>
                                        <p className="text-white font-black text-lg">%15-40</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Truck size={14} className="text-orange-300" />
                                            <span className="text-white/60 text-xs font-medium">Teslimat</span>
                                        </div>
                                        <p className="text-white font-black text-lg">1-3 Gün</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package size={14} className="text-orange-300" />
                                            <span className="text-white/60 text-xs font-medium">Ürün Çeşidi</span>
                                        </div>
                                        <p className="text-white font-black text-lg">2000+</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star size={14} className="text-orange-300" />
                                            <span className="text-white/60 text-xs font-medium">Memnuniyet</span>
                                        </div>
                                        <p className="text-white font-black text-lg">%98</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="p-8 lg:p-10 flex flex-col justify-center relative">
                            {/* Top accent bar */}
                            <div className="absolute top-0 right-0 left-0 lg:left-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500"></div>

                            {/* Logo */}
                            <div className="text-center mb-8">
                                <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:shadow-xl transition-all group-hover:scale-105">
                                        <Building2 className="text-white" size={26} />
                                    </div>
                                    <div>
                                        <span className="text-xl font-black text-gray-900">PatiDükkan</span>
                                        <span className="text-white text-[10px] font-black ml-2 bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 rounded-full uppercase tracking-wider">B2B</span>
                                    </div>
                                </Link>
                                <h1 className="text-2xl font-black text-gray-900">Bayi Girişi</h1>
                                <p className="text-gray-500 text-sm mt-1">Toptan alışveriş portalına hoş geldiniz</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-100">
                                        <AlertCircle size={16} /> {error}
                                    </div>
                                )}

                                {info && (
                                    <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-amber-100">
                                        <Clock size={16} /> {info}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresi</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="bayi@firma.com"
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50/50 text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Şifre</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50/50 text-gray-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                                            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200/50 disabled:opacity-70 hover:shadow-xl"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Giriş Yapılıyor...
                                        </span>
                                    ) : (
                                        <>Bayi Girişi <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>

                            {/* Catalog access */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="text-gray-800 font-bold text-sm">Kataloğumuzu inceleyin</p>
                                        <p className="text-gray-500 text-xs">Giriş yapmadan ürünlerimize göz atın</p>
                                    </div>
                                    <Link
                                        to="/bayi/katalog"
                                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:shadow-lg transition-all shadow-md whitespace-nowrap"
                                    >
                                        <ShoppingBag size={14} />
                                        Kataloğu Gör
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
                                <p className="text-gray-600">
                                    Bayi hesabınız yok mu?{' '}
                                    <Link to="/bayi/basvuru" className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition-colors">
                                        Bayi Başvurusu Yap
                                    </Link>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Bireysel müşteriyseniz{' '}
                                    <Link to="/giris" className="text-gray-500 hover:text-orange-500 transition-colors underline">
                                        buradan giriş yapın
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to main site */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-gray-400 hover:text-orange-500 text-sm transition-colors font-medium">
                        ← Ana Siteye Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default B2BLoginPage;
