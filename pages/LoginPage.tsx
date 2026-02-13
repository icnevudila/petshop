import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart, ShieldCheck, Truck } from 'lucide-react';

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
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('E-posta veya şifre hatalı.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
            } else if (err.message && (err.message.includes('Email not confirmed') || err.message.includes('not verified'))) {
                setError('Giriş yapabilmek için lütfen e-posta adresinizi doğrulayın.');
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-orange-300/20 to-yellow-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100/60 overflow-hidden border border-orange-100/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">

                        {/* Left Side - Image */}
                        <div className="hidden lg:block relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=1000&fit=crop&crop=faces"
                                alt="Sevimli kedi ve köpek"
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>

                            {/* Content overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="mb-4">
                                    <span className="inline-block bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">PATİDÜKKAN</span>
                                    <h2 className="text-3xl font-black text-white leading-tight mb-2">Patili Dostlarına<br />En İyisini Sun</h2>
                                    <p className="text-white/80 text-sm max-w-xs">Premium pet ürünleri, özel indirimler ve hızlı teslimat avantajları seni bekliyor.</p>
                                </div>

                                {/* Feature badges */}
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                                        <Truck size={14} className="text-orange-300" />
                                        <span className="text-xs font-bold text-white/90">Ücretsiz Kargo</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                                        <ShieldCheck size={14} className="text-orange-300" />
                                        <span className="text-xs font-bold text-white/90">Güvenli Alışveriş</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
                                        <Heart size={14} className="text-orange-300" />
                                        <span className="text-xs font-bold text-white/90">%100 Orijinal</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="p-8 lg:p-10 flex flex-col justify-center relative">
                            {/* Top accent bar */}
                            <div className="absolute top-0 right-0 left-0 lg:left-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500"></div>

                            {/* Logo */}
                            <div className="text-center mb-8">
                                <Link to="/" className="inline-flex items-center gap-2 mb-6">
                                    <img src="/logo_animated.svg" alt="PatiDükkan" className="h-12 w-auto" />
                                </Link>
                                <h1 className="text-2xl font-black text-gray-900">Giriş Yap</h1>
                                <p className="text-gray-500 text-sm mt-1">Hesabına giriş yap ve alışverişe başla</p>
                            </div>

                            {/* Google Login */}
                            <button
                                onClick={handleGoogleSignIn}
                                type="button"
                                className="w-full bg-white border-2 border-gray-100 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-200 hover:shadow-md transition-all flex items-center justify-center gap-3 mb-6"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google ile Giriş Yap
                            </button>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center mb-6">
                                <span className="bg-white px-3 text-xs font-bold text-gray-400 z-10 uppercase tracking-wider">veya</span>
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="ornek@mail.com"
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50/50 text-gray-900"
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
                                            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50/50 text-gray-900"
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

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                        <span className="text-sm text-gray-600">Beni hatırla</span>
                                    </label>
                                    <Link to="/sifremi-unuttum" className="text-sm font-bold text-orange-500 hover:text-orange-600 hover:underline transition-colors">
                                        Şifremi Unuttum
                                    </Link>
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
                                        <>Giriş Yap <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
                                <p className="text-gray-600">
                                    Hesabın yok mu?{' '}
                                    <Link to="/kayit" className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition-colors">
                                        Ücretsiz Kayıt Ol
                                    </Link>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Bayi misiniz?{' '}
                                    <Link to="/bayi/giris" className="text-gray-500 hover:text-orange-500 transition-colors underline">
                                        Bayi girişi için tıklayın
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to home */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-gray-400 hover:text-orange-500 text-sm transition-colors font-medium">
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
