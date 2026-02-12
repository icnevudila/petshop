import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import {
    Building2, User, Mail, Lock, Eye, EyeOff, Phone, MapPin,
    FileText, ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';

const CITIES = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne',
    'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane',
    'Hakkari', 'Hatay', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük',
    'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
    'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin',
    'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya',
    'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat',
    'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const B2BRegisterPage: React.FC = () => {
    const { signup, currentUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        // Personal
        fullName: '',
        email: '',
        password: '',
        phone: '',
        // Company
        company_name: '',
        tax_number: '',
        tax_office: '',
        company_address: '',
        company_phone: '',
        city: '',
        district: '',
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep1 = () => {
        if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
            setError('Lütfen tüm kişisel bilgileri doldurun');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.company_name || !formData.tax_number || !formData.tax_office || !formData.company_address || !formData.city) {
            setError('Lütfen tüm firma bilgilerini doldurun');
            return false;
        }
        if (formData.tax_number.length < 10) {
            setError('Vergi numarası en az 10 karakter olmalıdır');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateStep2()) return;

        setIsSubmitting(true);
        try {
            // 1. Create user account
            await signup(formData.email, formData.password, formData.fullName);

            // Wait briefly for the user to be created
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 2. Get the created user (they're now logged in via auth state change)
            const { data: { user } } = await (await import('../supabaseClient')).supabase.auth.getUser();

            if (!user) throw new Error('Kullanıcı oluşturulamadı');

            // 3. Apply as dealer
            await dealerService.applyAsDealer(user.id, {
                company_name: formData.company_name,
                tax_number: formData.tax_number,
                tax_office: formData.tax_office,
                company_address: formData.company_address,
                company_phone: formData.company_phone || formData.phone,
                city: formData.city,
                district: formData.district,
            });

            setSuccess(true);
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
                setError('Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.');
            } else {
                setError('Başvuru sırasında hata oluştu: ' + (err.message || 'Lütfen tekrar deneyin.'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Başvurunuz Alındı!</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Bayi başvurunuz başarıyla oluşturuldu. Başvurunuz en kısa sürede
                        incelenecek ve onaylandığında e-posta ile bilgilendirileceksiniz.
                    </p>
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
                        <div className="space-y-3 text-left">
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Firma</span>
                                <span className="text-white text-sm font-medium">{formData.company_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Vergi No</span>
                                <span className="text-white text-sm font-medium">{formData.tax_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Durum</span>
                                <span className="text-amber-400 text-sm font-medium">İnceleniyor</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/bayi/giris"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                        Bayi Girişine Dön <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                            <Building2 className="text-white" size={32} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white">PatiDükkan</span>
                            <span className="text-emerald-400 text-xs font-bold ml-2 bg-emerald-400/10 px-2 py-1 rounded-full">B2B</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-white mt-8">Bayi Başvurusu</h1>
                    <p className="text-slate-400 mt-2">Toptan satış ağımıza katılın</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>1</div>
                        <span className="text-sm font-medium hidden sm:block">Kişisel Bilgiler</span>
                    </div>
                    <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>2</div>
                        <span className="text-sm font-medium hidden sm:block">Firma Bilgileri</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-8 border border-slate-700/50">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-6">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Ad Soyad *</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => updateField('fullName', e.target.value)}
                                            placeholder="Adınız Soyadınız"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">E-posta Adresi *</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="bayi@firma.com"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Şifre *</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            placeholder="En az 6 karakter"
                                            className="w-full pl-12 pr-12 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Telefon *</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="0555 555 55 55"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                >
                                    Devam Et <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Firma Adı *</label>
                                    <div className="relative">
                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            onChange={(e) => updateField('company_name', e.target.value)}
                                            placeholder="Firma Ünvanı"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Vergi No *</label>
                                        <div className="relative">
                                            <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                value={formData.tax_number}
                                                onChange={(e) => updateField('tax_number', e.target.value)}
                                                placeholder="1234567890"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Vergi Dairesi *</label>
                                        <input
                                            type="text"
                                            value={formData.tax_office}
                                            onChange={(e) => updateField('tax_office', e.target.value)}
                                            placeholder="Vergi Dairesi"
                                            className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">İl *</label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                            className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all appearance-none"
                                        >
                                            <option value="">İl Seçin</option>
                                            {CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">İlçe</label>
                                        <input
                                            type="text"
                                            value={formData.district}
                                            onChange={(e) => updateField('district', e.target.value)}
                                            placeholder="İlçe"
                                            className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Firma Adresi *</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-4 text-slate-500" />
                                        <textarea
                                            value={formData.company_address}
                                            onChange={(e) => updateField('company_address', e.target.value)}
                                            placeholder="Tam adres"
                                            rows={3}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Firma Telefonu</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="tel"
                                            value={formData.company_phone}
                                            onChange={(e) => updateField('company_phone', e.target.value)}
                                            placeholder="0212 555 55 55"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setError(''); }}
                                        className="flex-1 bg-slate-700/50 text-slate-300 py-4 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all"
                                    >
                                        ← Geri
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Başvuru Yapılıyor...' : 'Başvuruyu Gönder'} <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
                        <p className="text-slate-400 text-sm">
                            Zaten bayi misiniz?{' '}
                            <Link to="/bayi/giris" className="font-bold text-emerald-400 hover:text-emerald-300 transition-all">
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition-all">
                        ← Ana Siteye Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default B2BRegisterPage;
