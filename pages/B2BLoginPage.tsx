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
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900">
            {/* Left Side - Professional Blue/Dark Section */}
            <div className="lg:w-1/2 bg-[#0F172A] relative overflow-hidden flex flex-col items-center justify-center p-12 text-center text-white border-r border-slate-800">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="relative z-10 flex flex-col items-center max-w-lg">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 mb-8 backdrop-blur-sm">
                        <Building2 size={64} className="text-[#38BDF8]" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                        Kurumsal Bayi Portalı
                    </h1>
                    <p className="text-slate-400 text-lg font-medium mb-8 leading-relaxed">
                        Toptan alışverişin en karlı adresi. <br />
                        Bayilere özel fiyatlar, hızlı kargo ve geniş ürün yelpazesi.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                        {['%40 İskonto', 'Hızlı Teslimat', 'Toptan Fiyat', 'Özel Müşteri Tem.'].map((t, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                <Check size={16} className="text-[#38BDF8]" />
                                <span className="font-bold text-sm text-slate-200">{t}</span>
                            </div>
                        ))}
                    </div>

                    <Link to="/bayi/katalog" className="mt-8 flex items-center gap-2 text-[#38BDF8] font-bold hover:text-white transition-colors">
                        <Package size={20} />
                        Kataloğu Görüntüle
                    </Link>
                </div>
            </div>

            {/* Right Side - Form Section (Dark Mode) */}
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-[#1E293B] relative">
                <Link to="/" className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all">
                    <Home size={24} />
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Bayi Girişi</h2>
                        <p className="text-slate-400 mt-2 font-medium">Kurumsal hesap bilgilerinizi giriniz.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {statusMessage && <div className="bg-blue-500/10 text-blue-400 px-4 py-3 rounded-xl text-sm font-bold border border-blue-500/20">{statusMessage.text}</div>}
                        {error && <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm font-bold border border-red-500/20">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Bayi E-Posta</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#38BDF8] transition-colors" size={20} />
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-12 pr-4 py-4 bg-[#0F172A] border-2 border-slate-700 focus:border-[#38BDF8] rounded-xl outline-none font-bold text-white transition-all placeholder-slate-600" placeholder="bayi@patidukkan.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Şifre</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#38BDF8] transition-colors" size={20} />
                                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-12 pr-12 py-4 bg-[#0F172A] border-2 border-slate-700 focus:border-[#38BDF8] rounded-xl outline-none font-bold text-white transition-all placeholder-slate-600" placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-sky-900/40 hover:shadow-sky-900/60 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            {isSubmitting ? '...' : <>Giriş Yap <ArrowRight strokeWidth={3} size={20} /></>}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-6 border-t border-slate-800">
                        <Link to="/bayi/basvuru" className="text-[#38BDF8] hover:text-white text-sm font-bold hover:underline">Bayi Başvurusu Yap</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2BLoginPage;
