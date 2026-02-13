import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Check, Home } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, signInWithGoogle } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            setError('Google ile kayıt başarısız oldu.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Lütfen zorunlu alanları doldurun');
            setLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            setLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalı');
            setLoading(false);
            return;
        }
        if (!formData.acceptTerms) {
            setError('Kullanım koşullarını kabul etmelisiniz');
            setLoading(false);
            return;
        }

        try {
            await signup(formData.email, formData.password, formData.name);
            setLoading(false);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Bu e-posta adresi zaten kullanımda');
            } else if (err.code === 'auth/weak-password') {
                setError('Şifre çok zayıf');
            } else {
                setError('Kayıt başarısız oldu: ' + err.message);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF7A30] via-[#FFB347] to-[#FFCC33] py-10">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>

            {/* Decorative Patterns */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FFF 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center px-4">

                {/* Hero Logo Section - Centered */}
                <div className="mb-8 transform hover:scale-105 transition-transform duration-500 flex flex-col items-center text-center">
                    <div className="bg-white/90 p-4 rounded-3xl shadow-2xl shadow-orange-900/20 backdrop-blur-sm mb-4">
                        <img src="/logo_animated.svg" alt="PatiDükkan" className="h-16 w-auto" />
                    </div>
                    <h1 className="text-white font-black text-3xl md:text-4xl tracking-tight drop-shadow-md">
                        Ailemize Katılın! 🚀
                    </h1>
                    <p className="text-white/90 text-lg font-medium mt-1 max-w-md">
                        Patili dostunuz için harika bir başlangıç yapın.
                    </p>
                </div>

                {/* Glassmorphism Register Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 md:p-10 w-full max-w-lg relative overflow-hidden border border-white/50">
                    {/* Top shine effect */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>

                    <Link to="/" className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-500 transition-colors bg-gray-50 rounded-full">
                        <Home size={20} />
                    </Link>

                    <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">Hesap Oluştur</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ad Soyad</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-orange-400 rounded-xl outline-none font-bold text-gray-700 transition-all placeholder-gray-400"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-Posta</label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-orange-400 rounded-xl outline-none font-bold text-gray-700 transition-all placeholder-gray-400"
                                        placeholder="ornek@mail.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Telefon</label>
                                <div className="relative group">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-orange-400 rounded-xl outline-none font-bold text-gray-700 transition-all placeholder-gray-400"
                                        placeholder="5XX XXX XX XX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Şifre</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-orange-400 rounded-xl outline-none font-bold text-gray-700 transition-all placeholder-gray-400"
                                        placeholder="En az 6 karakter"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Şifre Tekrar</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-orange-400 rounded-xl outline-none font-bold text-gray-700 transition-all placeholder-gray-400"
                                        placeholder="Doğrulayın"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="py-2">
                            <label className="flex items-start gap-3 cursor-pointer group select-none">
                                <div className={`w-5 h-5 min-w-[1.25rem] rounded-lg border-2 flex items-center justify-center transition-all ${formData.acceptTerms ? 'bg-orange-500 border-orange-500' : 'border-gray-300 group-hover:border-orange-400 bg-white'}`}>
                                    {formData.acceptTerms && <Check size={12} className="text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={formData.acceptTerms} onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })} />
                                <span className="text-xs text-gray-500 font-bold leading-tight pt-0.5">
                                    <Link to="/kullanim-kosullari" className="text-orange-500 hover:underline">Kullanım Koşulları</Link> ve <Link to="/gizlilik-politikasi" className="text-orange-500 hover:underline">Gizlilik Politikası</Link>'nı okudum, onaylıyorum.
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FF7A30] to-[#FF5500] hover:from-[#e66a26] hover:to-[#e64d00] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-orange-300/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? 'Kayıt Yapılıyor...' : <>Kayıt Ol <ArrowRight strokeWidth={3} size={20} /></>}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 font-bold text-xs uppercase">veya</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full bg-white border-2 border-gray-100 text-gray-700 py-3 rounded-xl font-bold text-base hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Google ile Kayıt Ol
                    </button>

                    <p className="mt-6 text-center text-gray-500 font-medium text-sm">
                        Zaten üyemiz misiniz?{' '}
                        <Link to="/giris" className="text-[#FF7A30] font-black hover:underline">
                            Giriş Yapın
                        </Link>
                    </p>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-white/60 text-xs font-medium">
                    &copy; {new Date().getFullYear()} PatiDükkan. Tüm hakları saklıdır.
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
