import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home, Building2, FileText, CheckCircle } from 'lucide-react';
import * as dealerService from '../services/dealerService';

const B2BLoginPage: React.FC = () => {
    const { login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState<{ type: 'info' | 'error' | 'success', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkDealerStatus = async () => {
            if (currentUser) {
                try {
                    const dealer = await dealerService.getDealerByUserId(currentUser.id);
                    if (dealer) {
                        if (dealer.status === 'approved') {
                            navigate('/bayi');
                        } else if (dealer.status === 'pending') {
                            setStatusMessage({
                                type: 'info',
                                text: 'Bayi başvurunuz değerlendirme aşamasındadır. Onaylandığında bilgilendirileceksiniz.'
                            });
                        } else if (dealer.status === 'rejected') {
                            setStatusMessage({
                                type: 'error',
                                text: 'Bayi başvurunuz onaylanmadı. Detaylı bilgi için bizimle iletişime geçebilirsiniz.'
                            });
                        }
                    } else {
                        // User exists but not a dealer
                        setStatusMessage({
                            type: 'info',
                            text: 'Bu hesap bir bayi hesabı değildir.'
                        });
                    }
                } catch (error) {
                    console.error('Error checking dealer status:', error);
                }
            }
        };

        checkDealerStatus();
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatusMessage(null);

        if (!formData.email || !formData.password) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }

        setIsSubmitting(true);
        try {
            await login(formData.email, formData.password);
            // Navigation handled by useEffect
        } catch (err: any) {
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('E-posta veya şifre hatalı.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
            } else {
                setError('Giriş başarısız oldu: ' + (err.message || 'Lütfen tekrar deneyin.'));
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
            {/* Animated Background Blobs - Darker mood for B2B */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF7A30]/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#38BDF8]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s' }}></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#FFF 1px, transparent 1px), linear-gradient(90deg, #FFF 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6">

                {/* Left Side: Dealer Benefits / Hero */}
                <div className="text-center lg:text-left max-w-lg">
                    <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6">
                        <Building2 className="text-[#FF7A30]" size={20} />
                        <span className="text-white/90 font-bold text-sm tracking-wide">KURUMSAL BAYİ PORTALI</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                        İşinizi Büyütün <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A30] to-[#FFB347]">Karlı Alışveriş</span>
                    </h1>

                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        PatiDükkan bayisi olun, %40'a varan toptan indirimlerden,
                        ertesi gün kargo avantajından ve özel kampanyalardan yararlanın.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link to="/bayi/katalog" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold transition-all border border-white/10 backdrop-blur-sm group">
                            <FileText size={20} className="text-[#FF7A30] group-hover:scale-110 transition-transform" />
                            Kataloğu İncele
                        </Link>
                        <Link to="/bayi/basvuru" className="flex items-center justify-center gap-2 bg-[#FF7A30] hover:bg-[#ff6b1a] text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-orange-900/30 transition-all">
                            Bayi Başvurusu Yap <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle size={18} className="text-emerald-500" /> Binlerce Ürün
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle size={18} className="text-emerald-500" /> Hızlı Kargo
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle size={18} className="text-emerald-500" /> 7/24 Destek
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle size={18} className="text-emerald-500" /> Kolay Ödeme
                        </div>
                    </div>
                </div>

                {/* Right Side: Glass Login Card */}
                <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 lg:p-10 w-full max-w-md border border-white/5 relative">
                    {/* Decorative Top Border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A30] to-[#FFB347]"></div>

                    <div className="flex justify-center mb-8">
                        <img src="/logo_animated.svg" alt="PatiDükkan Logo" className="h-12 w-auto brightness-200 contrast-0 grayscale opacity-80" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1 text-center">Bayi Girişi</h2>
                    <p className="text-slate-400 text-sm text-center mb-8">Kurumsal hesabınıza giriş yapın</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {statusMessage && (
                            <div className={`px-4 py-3 rounded-xl text-sm font-bold text-center border ${statusMessage.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {statusMessage.text}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm font-bold text-center border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">E-Posta</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF7A30] transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-4 bg-[#0F172A] border-2 border-slate-700/50 focus:border-[#FF7A30] rounded-xl outline-none font-medium text-white transition-all placeholder-slate-600"
                                    placeholder="bayi@patidukkan.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Şifre</label>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FF7A30] transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-11 py-4 bg-[#0F172A] border-2 border-slate-700/50 focus:border-[#FF7A30] rounded-xl outline-none font-medium text-white transition-all placeholder-slate-600"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#FF7A30] to-[#FF5500] hover:from-[#e66a26] hover:to-[#e64d00] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-900/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {isSubmitting ? 'Giriş Yapılıyor...' : <>Giriş Yap <ArrowRight strokeWidth={3} size={20} /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                            ← Ana Siteye Dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2BLoginPage;
