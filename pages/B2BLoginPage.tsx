import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Package, Check, Home } from 'lucide-react';
import * as dealerService from '../services/dealerService';

const B2BLoginPage: React.FC = () => {
    const { login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState<{ type: string, text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const check = async () => {
            if (currentUser) {
                const d = await dealerService.getDealerByUserId(currentUser.id);
                if (d?.status === 'approved') navigate('/bayi');
                else if (d) setStatusMessage({ type: 'info', text: 'Başvurunuz inceleniyor.' });
                else setStatusMessage({ type: 'info', text: 'Bayi kaydınız bulunamadı.' });
            }
        };
        check();
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password) { setError('Lütfen tüm alanları doldurun'); return; }
        setIsSubmitting(true);
        try { await login(formData.email, formData.password); }
        catch (err: any) { setError('Giriş başarısız.'); }
        finally { setIsSubmitting(false); }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Side - Brand Section (Orange) */}
            <div className="lg:w-1/2 bg-[#FF7A30] relative overflow-hidden flex flex-col items-center justify-center p-12 text-center text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 transform rotate-12"><Building2 size={100} color="white" /></div>
                    <div className="absolute bottom-20 right-10 transform -rotate-12"><Package size={150} color="white" /></div>
                    <div className="absolute top-1/2 left-1/4 transform rotate-45"><Check size={60} color="white" /></div>
                </div>

                <div className="relative z-10 flex flex-col items-center max-w-lg">
                    <img src="/logo_animated.svg" alt="PatiDükkan B2B" className="h-24 md:h-32 mb-8 brightness-0 invert drop-shadow-lg" />

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                        Kurumsal Giriş
                    </h1>
                    <p className="text-orange-100 text-lg font-medium mb-8 leading-relaxed">
                        Toptan alışverişin en karlı adresi. <br />
                        Bayilere özel fiyatlar, hızlı kargo ve geniş ürün yelpazesi.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                        {['%40 İskonto', 'Hızlı Teslimat', 'Toptan Fiyat', 'Özel Müşteri Tem.'].map((t, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                                <Check size={16} className="text-white" />
                                <span className="font-bold text-sm text-white">{t}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Force navigation using window location for HashRouter
                            window.location.hash = '#/bayi/katalog';
                        }}
                        className="mt-8 flex items-center gap-2 text-white font-bold hover:text-orange-100 transition-colors bg-white/10 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 cursor-pointer z-50 relative pointer-events-auto"
                    >
                        <Package size={20} />
                        Kataloğu Görüntüle
                    </button>
                </div>
            </div>

            {/* Right Side - Form Section (White) */}
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
                <div className="absolute top-8 left-8 lg:hidden">
                    <span className="font-black text-xl text-[#FF7A30]">PatiDükkan</span>
                </div>
                <Link to="/" className="absolute top-8 right-8 p-3 text-gray-400 hover:text-[#FF7A30] hover:bg-orange-50 rounded-full transition-all">
                    <Home size={24} />
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bayi Girişi</h2>
                        <p className="text-gray-500 mt-2 font-medium">Kurumsal hesap bilgilerinizi giriniz.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {statusMessage && <div className="bg-blue-50 text-blue-600 px-4 py-3 rounded-xl text-sm font-bold border border-blue-100">{statusMessage.text}</div>}
                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Bayi E-Posta</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" size={20} />
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-2xl outline-none font-bold text-gray-900 transition-all placeholder-gray-400" placeholder="bayi@patidukkan.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Şifre</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" size={20} />
                                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-2xl outline-none font-bold text-gray-900 transition-all placeholder-gray-400" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#FF7A30] hover:bg-[#E6621F] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            {isSubmitting ? '...' : <>Giriş Yap <ArrowRight strokeWidth={3} size={20} /></>}
                        </button>
                    </form>

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">veya</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    <div className="text-center">
                        <Link to="/bayi/basvuru" className="w-full inline-block bg-white border-2 border-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold text-base hover:bg-gray-50 hover:border-gray-300 transition-all">
                            Bayi Başvurusu Yap
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2BLoginPage;
