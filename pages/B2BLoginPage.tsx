import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, AlertCircle, Clock, Cat, Dog } from 'lucide-react';

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
        <div className="min-h-screen bg-white pt-36 pb-12 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                            <Building2 className="text-white" size={28} />
                        </div>
                        <span className="text-2xl font-black text-secondary">PatiDükkan</span>
                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-full">B2B</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-secondary mt-6">Bayi Girişi</h1>
                    <p className="text-gray-500 mt-2">Toptan alışveriş portalına hoş geldiniz</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {info && (
                            <div className="bg-amber-50 text-amber-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                <Clock size={16} /> {info}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresi</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="bayi@firma.com"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Şifre</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Giriş Yapılıyor...' : 'Bayi Girişi'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
                        <p className="text-gray-500">
                            Bayi hesabınız yok mu?{' '}
                            <Link to="/bayi/basvuru" className="font-bold text-primary hover:underline">
                                Bayi Başvurusu Yap
                            </Link>
                        </p>
                        <p className="text-gray-400 text-sm">
                            Bireysel müşteriyseniz{' '}
                            <Link to="/giris" className="text-gray-500 hover:text-secondary transition-all underline">
                                buradan giriş yapın
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to main site */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm transition-all">
                        ← Ana Siteye Dön
                    </Link>
                </div>

                {/* Footer decorative elements */}
                <div className="mt-8 flex justify-center gap-4 opacity-30">
                    <Building2 size={24} className="text-primary" />
                    <Cat size={24} className="text-primary" />
                    <Dog size={24} className="text-primary" />
                </div>
            </div>
        </div>
    );
};

export default B2BLoginPage;
