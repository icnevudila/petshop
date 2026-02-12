import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import {
    Building2, User, Mail, Lock, Eye, EyeOff, Phone, MapPin,
    FileText, ArrowRight, CheckCircle2, AlertCircle, Cat, Dog
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
            <div className="min-h-screen bg-white pt-36 pb-12 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary mb-4">Başvurunuz Alındı!</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Bayi başvurunuz başarıyla oluşturuldu. Başvurunuz en kısa sürede
                        incelenecek ve onaylandığında e-posta ile bilgilendirileceksiniz.
                    </p>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                        <div className="space-y-3 text-left">
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Firma</span>
                                <span className="text-secondary text-sm font-medium">{formData.company_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Vergi No</span>
                                <span className="text-secondary text-sm font-medium">{formData.tax_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Durum</span>
                                <span className="text-amber-500 text-sm font-medium">İnceleniyor</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        to="/bayi/giris"
                        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                    >
                        Bayi Girişine Dön <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-36 pb-12 flex items-center justify-center px-4">
            <div className="w-full max-w-lg">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                            <Building2 className="text-white" size={28} />
                        </div>
                        <span className="text-2xl font-black text-secondary">PatiDükkan</span>
                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-full">B2B</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-secondary mt-6">Bayi Başvurusu</h1>
                    <p className="text-gray-500 mt-2">Toptan satış ağımıza katılın</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                        <span className="text-sm font-medium hidden sm:block">Kişisel Bilgiler</span>
                    </div>
                    <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                        <span className="text-sm font-medium hidden sm:block">Firma Bilgileri</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-6">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad *</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => updateField('fullName', e.target.value)}
                                            placeholder="Adınız Soyadınız"
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">E-posta Adresi *</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="bayi@firma.com"
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Şifre *</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            placeholder="En az 6 karakter"
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

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefon *</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="0555 555 55 55"
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    Devam Et <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Firma Adı *</label>
                                    <div className="relative">
                                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            onChange={(e) => updateField('company_name', e.target.value)}
                                            placeholder="Firma Ünvanı"
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Vergi No *</label>
                                        <div className="relative">
                                            <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.tax_number}
                                                onChange={(e) => updateField('tax_number', e.target.value)}
                                                placeholder="1234567890"
                                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Vergi Dairesi *</label>
                                        <input
                                            type="text"
                                            value={formData.tax_office}
                                            onChange={(e) => updateField('tax_office', e.target.value)}
                                            placeholder="Vergi Dairesi"
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">İl *</label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                            aria-label="İl seçimi"
                                        >
                                            <option value="">İl Seçin</option>
                                            {CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">İlçe</label>
                                        <input
                                            type="text"
                                            value={formData.district}
                                            onChange={(e) => updateField('district', e.target.value)}
                                            placeholder="İlçe"
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Firma Adresi *</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                                        <textarea
                                            value={formData.company_address}
                                            onChange={(e) => updateField('company_address', e.target.value)}
                                            placeholder="Tam adres"
                                            rows={3}
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Firma Telefonu</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.company_phone}
                                            onChange={(e) => updateField('company_phone', e.target.value)}
                                            placeholder="0212 555 55 55"
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setStep(1); setError(''); }}
                                        className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                                    >
                                        ← Geri
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Başvuru Yapılıyor...' : 'Başvuruyu Gönder'} <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm">
                            Zaten bayi misiniz?{' '}
                            <Link to="/bayi/giris" className="font-bold text-primary hover:underline">
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to main site */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm transition-all">
                        ← Ana Siteye Dön
                    </Link>
                </div>

                {/* Footer decorative elements */}
                <div className="mt-8 flex justify-center gap-4 opacity-30">
                    <Building2 size={24} className="text-primary" />
                    <Cat size={24} className="text-primary" />
                    <Dog size={24} className="text-primary" />
                </div>
            </div>
        </div>
    );
};

export default B2BRegisterPage;
