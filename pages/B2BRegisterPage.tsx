import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import {
    Building2, User, Mail, Lock, Eye, EyeOff, Phone, MapPin,
    FileText, ArrowRight, CheckCircle2, AlertCircle, Check, Home, Package
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
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', phone: '',
        company_name: '', tax_number: '', tax_office: '', company_address: '',
        company_phone: '', city: '', district: '',
    });

    const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

    const validateStep1 = () => {
        if (!formData.fullName || !formData.email || !formData.password || !formData.phone) { setError('Lütfen tüm kişisel bilgileri doldurun'); return false; }
        if (formData.password.length < 6) { setError('Şifre en az 6 karakter olmalıdır'); return false; }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.company_name || !formData.tax_number || !formData.tax_office || !formData.company_address || !formData.city) { setError('Lütfen tüm firma bilgilerini doldurun'); return false; }
        if (formData.tax_number.length < 10) { setError('Vergi numarası en az 10 karakter olmalıdır'); return false; }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (step === 1 && validateStep1()) setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validateStep2()) return;
        setIsSubmitting(true);
        try {
            const authData = await signup(formData.email, formData.password, formData.fullName);
            if (!authData?.user) throw new Error('Kullanıcı oluşturulamadı');
            const user = authData.user;
            await dealerService.applyAsDealer(user.id, {
                company_name: formData.company_name, tax_number: formData.tax_number, tax_office: formData.tax_office,
                company_address: formData.company_address, company_phone: formData.company_phone || formData.phone,
                city: formData.city, district: formData.district,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message?.includes('already') ? 'Bu e-posta zaten kayıtlı.' : 'Başvuru hatası: ' + err.message);
        } finally { setIsSubmitting(false); }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
                <div className="bg-[#1E293B] w-full max-w-lg p-8 rounded-3xl text-center shadow-2xl border border-slate-700">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4">Başvurunuz Alındı!</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Bayi başvurunuz başarıyla oluşturuldu. En kısa sürede incelenip tarafınıza dönüş yapılacaktır.
                    </p>
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8 text-left">
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="text-slate-500 text-sm font-bold">Firma</span><span className="text-white text-sm font-bold">{formData.company_name}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500 text-sm font-bold">Vergi No</span><span className="text-white text-sm font-bold">{formData.tax_number}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500 text-sm font-bold">Durum</span><span className="text-amber-500 text-sm font-bold">İnceleniyor</span></div>
                        </div>
                    </div>
                    <Link to="/bayi/giris" className="inline-flex items-center gap-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-900/40">
                        Bayi Girişine Dön <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Side - Blue/Dark Section */}
            <div className="lg:w-[45%] bg-[#FF7A30] relative overflow-hidden flex flex-col items-center justify-center p-12 text-center text-white">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 transform rotate-12"><Building2 size={100} color="white" /></div>
                    <div className="absolute bottom-20 right-10 transform -rotate-12"><Package size={150} color="white" /></div>
                </div>
                <div className="relative z-10 flex flex-col items-center max-w-lg">
                    <div className="bg-white/20 p-4 rounded-2xl border border-white/30 mb-8 backdrop-blur-sm">
                        <Building2 size={64} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4 text-white">Bayi Başvurusu</h1>
                    <p className="text-orange-100 text-lg font-medium mb-8 leading-relaxed">
                        PatiDükkan toptan satış ailesine katılın, avantajlı fiyatlardan yararlanın.
                    </p>
                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                        {['Kurumsal Fatura', 'Toplu Sipariş', 'Özel İskonto', 'Premium Destek'].map((t, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20">
                                <Check size={16} className="text-white" />
                                <span className="font-bold text-sm text-white">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section (Light Mode) */}
            <div className="lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white relative overflow-y-auto">
                <Link to="/" className="absolute top-8 right-8 p-3 text-gray-400 hover:text-[#FF7A30] hover:bg-orange-50 rounded-full transition-all z-20">
                    <Home size={24} />
                </Link>

                <div className="w-full max-w-xl space-y-8">
                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#FF7A30]' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? 'border-[#FF7A30] bg-[#FF7A30] text-white' : 'border-gray-300 text-gray-500'}`}>1</div>
                            <span className="text-sm font-bold hidden sm:block">Yetkili Kişi</span>
                        </div>
                        <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-[#FF7A30]' : 'bg-gray-200'}`} />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#FF7A30]' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 2 ? 'border-[#FF7A30] bg-[#FF7A30] text-white' : 'border-gray-300 text-gray-500'}`}>2</div>
                            <span className="text-sm font-bold hidden sm:block">Firma Bilgileri</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && <div className="bg-red-50 text-red-600 px-4 py-4 rounded-xl text-sm font-bold border border-red-100 flex gap-2"><AlertCircle size={18} /> {error}</div>}

                        {step === 1 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Ad Soyad</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30]" size={18} />
                                        <input type="text" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" placeholder="Adınız Soyadınız" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">E-Posta</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30]" size={18} />
                                        <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" placeholder="bayi@firma.com" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Şifre</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30]" size={18} />
                                        <input type="text" value={formData.password} onChange={(e) => updateField('password', e.target.value)} className="w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" placeholder="Min 6 karakter" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Telefon</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30]" size={18} />
                                        <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" placeholder="05XX..." />
                                    </div>
                                </div>
                                <button type="button" onClick={handleNext} className="w-full bg-[#FF7A30] hover:bg-[#E6621F] text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-orange-200 flex items-center justify-center gap-2 mt-4 transition-all">Devam Et <ArrowRight size={20} /></button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Firma Adı</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30]" size={18} />
                                        <input type="text" value={formData.company_name} onChange={(e) => updateField('company_name', e.target.value)} className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" placeholder="Firma Ünvanı" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Vergi No</label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7A30]" size={18} />
                                            <input type="text" value={formData.tax_number} onChange={(e) => updateField('tax_number', e.target.value)} className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Vergi Dairesi</label>
                                        <input type="text" value={formData.tax_office} onChange={(e) => updateField('tax_office', e.target.value)} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" placeholder="V. Dairesi" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">İl</label>
                                        <select value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 appearance-none transition-all">
                                            <option value="">Seçiniz</option>
                                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">İlçe</label>
                                        <input type="text" value={formData.district} onChange={(e) => updateField('district', e.target.value)} className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Firma Adresi</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#FF7A30]" size={18} />
                                        <textarea value={formData.company_address} onChange={(e) => updateField('company_address', e.target.value)} rows={2} className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF7A30] rounded-xl outline-none font-bold text-gray-900 placeholder-gray-400 resize-none transition-all" placeholder="Açık adres" />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all">Geri</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-[2] bg-[#FF7A30] hover:bg-[#E6621F] text-white py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2">
                                        {isSubmitting ? '...' : 'Başvuruyu Tamamla'} <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="text-center mt-6 pt-6 border-t border-gray-100">
                        <Link to="/bayi/giris" className="text-gray-500 hover:text-[#FF7A30] text-sm font-bold hover:underline">Zaten bayimiz misiniz? Giriş Yap</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2BRegisterPage;
