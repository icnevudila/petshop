import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

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
            // After login, the useEffect will check dealer status
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                            <Building2 className="text-white" size={32} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white">PatiDükkan</span>
                            <span className="text-emerald-400 text-xs font-bold ml-2 bg-emerald-400/10 px-2 py-1 rounded-full">B2B</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-white mt-8">Bayi Girişi</h1>
                    <p className="text-slate-400 mt-2">Toptan alışveriş portalına hoş geldiniz</p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-8 border border-slate-700/50">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {info && (
                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                <Clock size={16} /> {info}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">E-posta Adresi</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="bayi@firma.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Şifre</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Giriş Yapılıyor...' : 'Bayi Girişi'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-700/50 text-center space-y-3">
                        <p className="text-slate-400 text-sm">
                            Bayi hesabınız yok mu?{' '}
                            <Link to="/bayi/basvuru" className="font-bold text-emerald-400 hover:text-emerald-300 transition-all">
                                Bayi Başvurusu Yap
                            </Link>
                        </p>
                        <p className="text-slate-500 text-xs">
                            Bireysel müşteriyseniz{' '}
                            <Link to="/giris" className="text-slate-400 hover:text-white transition-all underline">
                                buradan giriş yapın
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition-all">
                        ← Ana Siteye Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default B2BLoginPage;
