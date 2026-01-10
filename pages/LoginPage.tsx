import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Cat, Dog } from 'lucide-react';

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
        <div className="min-h-screen bg-white pt-36 pb-12 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                            <Cat className="text-white" size={28} />
                        </div>
                        <span className="text-2xl font-black text-secondary">PatiDükkan</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-secondary mt-6">Hesabına Giriş Yap</h1>
                    <p className="text-gray-500 mt-2">Patili dostlarına en iyisini sunmak için hemen giriş yap!</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full bg-white border-2 border-gray-100 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3 mb-6"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Google ile Giriş Yap
                    </button>

                    <div className="relative flex items-center justify-center mb-6">
                        <span className="bg-white px-2 text-xs font-bold text-gray-400 z-10">VEYA E-POSTA İLE</span>
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
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
                                    placeholder="ornek@mail.com"
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="text-sm text-gray-600">Beni hatırla</span>
                            </label>
                            <Link to="/sifremi-unuttum" className="text-sm font-bold text-primary hover:underline">
                                Şifremi Unuttum
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500">
                            Hesabın yok mu?{' '}
                            <Link to="/kayit" className="font-bold text-primary hover:underline">
                                Ücretsiz Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer decorative elements */}
                <div className="mt-8 flex justify-center gap-4 opacity-30">
                    <Cat size={24} className="text-primary" />
                    <Dog size={24} className="text-primary" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
