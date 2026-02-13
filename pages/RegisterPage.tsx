import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Check, Home, PawPrint } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, signInWithGoogle } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation...
        if (!formData.name || !formData.email || !formData.password) { setError('Lütfen zorunlu alanları doldurun'); setLoading(false); return; }
        if (formData.password !== formData.confirmPassword) { setError('Şifreler eşleşmiyor'); setLoading(false); return; }
        if (!formData.acceptTerms) { setError('Koşulları kabul etmelisiniz'); setLoading(false); return; }

        try {
            await signup(formData.email, formData.password, formData.name);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Side - Brand Section */}
            <div className="lg:w-1/2 bg-[#FF7A30] relative overflow-hidden flex flex-col items-center justify-center p-12 text-center text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-10 transform rotate-12"><PawPrint size={120} color="white" /></div>
                    <div className="absolute bottom-20 left-10 transform -rotate-12"><PawPrint size={180} color="white" /></div>
                </div>

                <div className="relative z-10 flex flex-col items-center max-w-lg">
                    <img src="/logo_animated.svg" alt="Logo" className="h-20 md:h-28 mb-8 brightness-0 invert drop-shadow-md" />
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                        Ailemize Katılın
                    </h1>
                    <p className="text-orange-100 text-lg font-medium mb-8 leading-relaxed">
                        Patili dostlarınız için en iyi ürünlere, özel indirimlere ve veteriner desteğine anında ulaşın.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left w-full max-w-sm">
                        {['Hızlı Kargo', 'Orijinal Ürün', '%100 Güvenli', '7/24 Destek'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
                                <Check size={16} className="text-white" />
                                <span className="font-bold text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative">
                <Link to="/" className="absolute top-8 right-8 p-3 text-gray-400 hover:text-[#FF7A30] hover:bg-orange-50 rounded-full transition-all">
                    <Home size={24} />
                </Link>

                <div className="w-full max-w-lg space-y-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Kayıt Ol</h2>
                        <p className="text-gray-500 mt-1 font-medium">Hemen ücretsiz hesap oluşturun.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ad Soyad</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" />
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900" placeholder="Adınız Soyadınız" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-Posta</label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" />
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900" placeholder="mail@ornek.com" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Telefon</label>
                                <div className="relative group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" />
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900" placeholder="05XX..." />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Şifre</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" />
                                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900" placeholder="Min 6 karakter" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Şifre Tekrar</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" />
                                    <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900" placeholder="Tekrar" />
                                </div>
                            </div>
                        </div>

                        <div className="py-2">
                            <label className="flex items-start gap-3 cursor-pointer group select-none">
                                <div className={`w-5 h-5 min-w-[1.25rem] rounded-md border-2 flex items-center justify-center transition-all ${formData.acceptTerms ? 'bg-[#FF7A30] border-[#FF7A30]' : 'border-gray-300 group-hover:border-orange-400'}`}>
                                    {formData.acceptTerms && <Check size={14} className="text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={formData.acceptTerms} onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })} />
                                <span className="text-xs text-gray-500 font-bold pt-0.5"><Link to="#" className="text-[#FF7A30] hover:underline">Şartları</Link> kabul ediyorum.</span>
                            </label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#FF7A30] hover:bg-[#E6621F] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                            {loading ? '...' : <>Kayıt Ol <ArrowRight strokeWidth={3} size={20} /></>}
                        </button>
                    </form>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="mx-4 text-gray-400 text-xs font-bold uppercase">veya</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>
                    <button onClick={() => signInWithGoogle()} className="w-full bg-white border-2 border-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                        <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5" /> Google ile Kaydol
                    </button>

                    <p className="text-center text-gray-500 text-sm font-medium">Zaten üye misiniz? <Link to="/giris" className="text-[#FF7A30] font-black hover:underline">Giriş Yapın</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
