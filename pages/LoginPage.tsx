import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { signInWithGoogle, login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
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
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('E-posta veya şifre hatalı.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
            } else {
                setError('Giriş başarısız oldu: ' + (err.message || 'Lütfen tekrar deneyin.'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            setError('Google ile giriş başarısız oldu.');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF7A30] via-[#FFB347] to-[#FFCC33]">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>

            {/* Decorative Patterns */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FFF 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">

                {/* Hero Logo Section - Centered and Big */}
                <div className="mb-8 transform hover:scale-105 transition-transform duration-500 flex flex-col items-center">
                    <div className="bg-white/90 p-6 rounded-3xl shadow-2xl shadow-orange-900/20 backdrop-blur-sm">
                        <img src="/logo_animated.svg" alt="PatiDükkan" className="h-24 w-auto" />
                    </div>
                    <h1 className="text-white font-black text-4xl mt-6 tracking-tight drop-shadow-md text-center">
                        Hoşgeldin! 👋
                    </h1>
                    <p className="text-white/90 text-lg font-medium mt-2 max-w-md text-center">
                        Patili dostların için en iyi ürünlere tek tıkla ulaş.
                    </p>
                </div>

                {/* Glassmorphism Login Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 w-full max-w-md relative overflow-hidden border border-white/50">
                    {/* Top shine effect */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"></div>

                    <Link to="/" className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-500 transition-colors bg-gray-50 rounded-full">
                        <Home size={20} />
                    </Link>

                    <h2 className="text-2xl font-black text-gray-800 mb-8 text-center">Giriş Yap</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-Posta</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-orange-400 rounded-xl outline-none font-bold text-gray-700 transition-all placeholder-gray-400"
                                    placeholder="ornek@mail.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Şifre</label>
                                <Link to="/sifremi-unuttum" className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline">
                                    Unuttum?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-11 py-4 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-orange-400 rounded-xl outline-none font-bold text-gray-700 transition-all placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#FF7A30] to-[#FF5500] hover:from-[#e66a26] hover:to-[#e64d00] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-orange-300/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isSubmitting ? 'Giriş Yapılıyor...' : <>Giriş Yap <ArrowRight strokeWidth={3} size={20} /></>}
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
                        Google ile Devam Et
                    </button>

                    <p className="mt-6 text-center text-gray-500 font-medium text-sm">
                        Hesabın yok mu?{' '}
                        <Link to="/kayit" className="text-[#FF7A30] font-black hover:underline">
                            Hemen Kayıt Ol
                        </Link>
                    </p>

                    <div className="mt-6 pt-6 border-t border-dashed border-gray-200 text-center">
                        <Link to="/bayi/giris" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#FF7A30] transition-colors group">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#FF7A30] transition-colors"></span>
                            Bayi Girişi için tıklayın
                        </Link>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-white/60 text-xs font-medium">
                    &copy; {new Date().getFullYear()} PatiDükkan. Tüm hakları saklıdır.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
