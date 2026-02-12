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

    const benefits = [
        { icon: Percent, title: 'Toptan Fiyatlar', desc: '%15-40 arası indirimli toptan fiyatlar', color: 'from-orange-500 to-amber-500' },
        { icon: Truck, title: 'Hızlı Teslimat', desc: '1-3 iş günü içinde kapınızda', color: 'from-blue-500 to-cyan-500' },
        { icon: Shield, title: 'Güvenli Alışveriş', desc: 'Orijinal ürün garantisi', color: 'from-green-500 to-emerald-500' },
        { icon: Star, title: 'Özel Destek', desc: 'Bayilere özel müşteri temsilcisi', color: 'from-purple-500 to-violet-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden">

            {/* Animated Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-amber-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-orange-300/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
                <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-orange-100/50 to-transparent rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }}></div>
                {/* Floating icons */}
                <div className="absolute top-[15%] right-[10%] opacity-10 animate-float">
                    <Package size={60} className="text-orange-500" />
                </div>
                <div className="absolute top-[60%] left-[5%] opacity-10 animate-float" style={{ animationDelay: '1s' }}>
                    <ShoppingBag size={50} className="text-orange-400" />
                </div>
                <div className="absolute bottom-[20%] right-[15%] opacity-10 animate-float" style={{ animationDelay: '2s' }}>
                    <TrendingUp size={45} className="text-amber-500" />
                </div>
            </div>

            <div className="relative z-10 pt-28 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Side - Hero/Info */}
                        <div className="text-center lg:text-left">
                            {/* Logo */}
                            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:shadow-xl group-hover:shadow-orange-300 transition-all group-hover:scale-105">
                                    <Building2 className="text-white" size={30} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black text-gray-900">PatiDükkan</span>
                                        <span className="text-white text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">B2B</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Bayi Toptan Satış Portalı</p>
                                </div>
                            </Link>

                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
                                Toptan Alışverişte
                                <br />
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                    Ayrıcalıklı Fiyatlar
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
                                Türkiye'nin en geniş pet ürünleri toptan ağına katılın. Bayilerimize özel fiyatlar ve hızlı teslimat avantajlarından yararlanın.
                            </p>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {benefits.map((benefit, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                                            <benefit.icon size={20} className="text-white" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm">{benefit.title}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{benefit.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Direct catalog access - without login */}
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 shadow-lg shadow-orange-200/50">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-white font-bold text-lg">Kataloğumuzu inceleyin</h3>
                                        <p className="text-white/80 text-sm">Giriş yapmadan ürünlerimize göz atabilirsiniz</p>
                                    </div>
                                    <Link
                                        to="/bayi/katalog"
                                        className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                                    >
                                        <ShoppingBag size={18} />
                                        Kataloğu Gör
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
                            <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100/50 p-8 border border-orange-100/50 relative overflow-hidden">
                                {/* Top accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>

                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-black text-gray-900">Bayi Girişi</h2>
                                    <p className="text-gray-500 text-sm mt-1">Toptan alışveriş portalına hoş geldiniz</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
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
                                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50/50 text-gray-900"
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
                                                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50/50 text-gray-900"
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

                            {/* Back to main site */}
                            <div className="mt-6 text-center">
                                <Link to="/" className="text-gray-400 hover:text-orange-500 text-sm transition-colors font-medium">
                                    ← Ana Siteye Dön
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for floating animation */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-15px) rotate(5deg); }
                    50% { transform: translateY(-5px) rotate(-3deg); }
                    75% { transform: translateY(-20px) rotate(3deg); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default B2BLoginPage;
