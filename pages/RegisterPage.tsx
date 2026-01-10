import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Check, Heart, Shield } from 'lucide-react';

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
        <div className="min-h-screen flex bg-white">
            {/* LEFT SIDE - VISUAL & BRANDING */}
            <div className="hidden lg:flex w-1/2 relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-purple-900/50"></div>

                <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-3">
                            <img src="/logopng.png" alt="Logo" className="h-16 brightness-0 invert drop-shadow-md" />
                        </Link>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="inline-block bg-white/20 backdrop-blur border border-white/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Ailemize Katılın</span>
                            <h1 className="text-5xl font-black leading-tight font-display">
                                Patili Dostunuz İçin <br />
                                <span className="text-yellow-300">Harika Bir Başlangıç</span> Yapın
                            </h1>
                            <p className="text-lg text-white/90 max-w-md font-medium leading-relaxed">
                                Özel indirimler, veteriner tavsiyeleri ve kişiselleştirilmiş ürün önerileri için hemen üye olun.
                            </p>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                            {[
                                { t: 'Hoşgeldin İndirimi', i: Heart },
                                { t: '7/24 Destek', i: Shield },
                                { t: 'Orijinal Ürünler', i: Check },
                                { t: 'Aynı Gün Kargo', i: ArrowRight }
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                                    <f.i size={18} className="text-yellow-300" />
                                    <span className="font-bold text-sm">{f.t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm font-medium text-white/60">
                        © 2024 PatiDükkan. Tüm hakları saklıdır.
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white relative overflow-y-auto">
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="w-full max-w-[520px] space-y-8 animate-fade-in-up py-10">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="lg:hidden inline-block mb-8">
                            <img src="/logopng.png" alt="Logo" className="h-12 mx-auto" />
                        </Link>
                        <h2 className="text-3xl font-black text-secondary tracking-tight">Hesap Oluştur 🚀</h2>
                        <p className="text-gray-500 mt-2 font-medium">Formu doldurun ve avantajlar dünyasına adım atın.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-4 rounded-xl flex items-center gap-3 animate-shake">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full bg-white border-2 border-gray-100 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Google ile Kayıt Ol
                    </button>

                    <div className="relative flex items-center justify-center">
                        <span className="bg-white px-2 text-xs font-bold text-gray-400 z-10">VEYA E-POSTA İLE</span>
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2 group">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-wider group-focus-within:text-primary transition-colors">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 placeholder-gray-400 transition-all outline-none"
                                    placeholder="Adınız Soyadınız"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 group">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-wider group-focus-within:text-primary transition-colors">E-posta</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="email"
                                        className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 placeholder-gray-400 transition-all outline-none"
                                        placeholder="ornek@email.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-wider group-focus-within:text-primary transition-colors">Telefon</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 placeholder-gray-400 transition-all outline-none"
                                        placeholder="5XX XXX XX XX"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-wider group-focus-within:text-primary transition-colors">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-12 font-bold text-gray-700 placeholder-gray-400 transition-all outline-none"
                                    placeholder="En az 6 karakter"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-wider group-focus-within:text-primary transition-colors">Şifre Tekrar</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-12 font-bold text-gray-700 placeholder-gray-400 transition-all outline-none"
                                    placeholder="Şifrenizi doğrulayın"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="pt-2">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.acceptTerms ? 'bg-primary border-primary' : 'border-gray-200 group-hover:border-primary'}`}>
                                    {formData.acceptTerms && <Check size={14} className="text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={formData.acceptTerms} onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })} />
                                <span className="text-sm text-gray-500 font-medium leading-tight">
                                    <Link to="/kullanim-kosullari" className="text-primary font-bold hover:underline">Kullanım Koşulları</Link> ve <Link to="/gizlilik-politikasi" className="text-primary font-bold hover:underline">Gizlilik Politikası</Link>'nı okudum, onaylıyorum.
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Kayıt Ol <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 font-medium pt-4 border-t border-gray-100 mt-8">
                        Zaten üye misiniz?{' '}
                        <Link to="/giris" className="text-primary font-black hover:underline decoration-2 underline-offset-4">
                            Giriş Yapın
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
