import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home, PawPrint } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { signInWithGoogle, login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (currentUser) navigate('/');
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }
        setIsSubmitting(true);
        try {
            await login(formData.email, formData.password);
        } catch (err: any) {
            setError('Giriş başarısız. Bilgilerinizi kontrol edin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Side - Brand Section */}
            <div className="lg:w-1/2 bg-[#FF7A30] relative overflow-hidden flex flex-col items-center justify-center p-12 text-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 transform rotate-12"><PawPrint size={100} color="white" /></div>
                    <div className="absolute bottom-20 right-10 transform -rotate-12"><PawPrint size={150} color="white" /></div>
                    <div className="absolute top-1/2 left-1/4 transform rotate-45"><PawPrint size={60} color="white" /></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <img src="/logo_animated.svg" alt="Logo" className="h-24 md:h-32 mb-8 brightness-0 invert drop-shadow-lg" />
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Aramıza Hoşgeldin!
                    </h1>
                    <p className="text-orange-100 text-lg md:text-xl font-medium max-w-md leading-relaxed">
                        Minik dostun için aradığın her şey burada. <br />Güvenli, hızlı ve sevgi dolu alışveriş.
                    </p>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                <Link to="/" className="absolute top-8 right-8 p-3 text-gray-400 hover:text-[#FF7A30] hover:bg-orange-50 rounded-full transition-all">
                    <Home size={24} />
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Giriş Yap</h2>
                        <p className="text-gray-500 mt-2 font-medium">Hesabınıza erişmek için bilgilerinizi girin.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">E-Posta</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-2xl outline-none font-bold text-gray-900 transition-all placeholder-gray-400"
                                    placeholder="ornek@mail.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-gray-700">Şifre</label>
                                <Link to="/sifremi-unuttum" className="text-sm font-bold text-[#FF7A30] hover:underline">
                                    Unuttum?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30] transition-colors" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-2xl outline-none font-bold text-gray-900 transition-all placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#FF7A30] hover:bg-[#E6621F] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? '...' : <>Giriş Yap <ArrowRight strokeWidth={3} size={20} /></>}
                        </button>
                    </form>

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">veya</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    <button
                        onClick={() => signInWithGoogle()}
                        type="button"
                        className="w-full bg-white border-2 border-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold text-base hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Google ile Devam Et
                    </button>

                    <p className="text-center text-gray-500 font-medium">
                        Hesabın yok mu?{' '}
                        <Link to="/kayit" className="text-[#FF7A30] font-black hover:underline">
                            Hemen Kayıt Ol
                        </Link>
                    </p>

                    <div className="text-center mt-6">
                        <Link to="/bayi/giris" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 hover:text-[#FF7A30] hover:bg-orange-50 transition-all">
                            <PawPrint size={14} />
                            Kurumsal / Bayi Girişi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
