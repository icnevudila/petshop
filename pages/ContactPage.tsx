import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { sendContactMessage } from '../services/contactService';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendContactMessage({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });
            alert("Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin veya telefon ile ulaşın.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-[290px] md:pt-[360px] pb-20">
            <SEO
                title="İletişim"
                description="PatiDükkan iletişim bilgileri. Adres, telefon, e-posta ve iletişim formu ile bize ulaşın."
            />

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6">
                        Bize Ulaşın
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-secondary leading-tight mb-6">
                        Size Nasıl Yardımcı <br /> <span className="text-primary">Olabiliriz?</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        Sorularınız, önerileriniz veya sadece merhaba demek için buradayız.
                        Ekibimiz size en kısa sürede dönüş yapacaktır.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {/* Contact Info Cards */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Phone size={28} />
                            </div>
                            <h3 className="text-xl font-black text-secondary mb-2">Telefon</h3>
                            <p className="text-gray-500 mb-4">Hafta içi 09:00 - 18:00</p>
                            <a href="tel:+905551234567" className="text-lg font-bold text-primary hover:text-orange-700 transition-colors">
                                +90 (555) 123 45 67
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Mail size={28} />
                            </div>
                            <h3 className="text-xl font-black text-secondary mb-2">E-posta</h3>
                            <p className="text-gray-500 mb-4">7/24 Bize yazabilirsiniz</p>
                            <a href="mailto:info@patidukkan.com" className="text-lg font-bold text-primary hover:text-orange-700 transition-colors">
                                info@patidukkan.com
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={28} />
                            </div>
                            <h3 className="text-xl font-black text-secondary mb-2">Ofisimiz</h3>
                            <p className="text-gray-500 font-medium">
                                Ertuğrulgazi mahallesi Kozluca Bulvarı<br /> No:29 (Şımarık AVM yanı) <br /> İnegöl / BURSA
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-secondary">Mesaj Gönderin</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Adınız Soyadınız</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-secondary focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">E-posta Adresiniz</label>
                                        <input
                                            type="email"
                                            placeholder="ornek@email.com"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-secondary focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Konu</label>
                                    <input
                                        type="text"
                                        placeholder="Mesajınızın konusu..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-secondary focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mesajınız</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Bize ne sormak istersiniz?"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-secondary focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        disabled={loading}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-secondary text-white font-black py-5 rounded-2xl shadow-xl hover:bg-primary hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>Gönderiliyor... <Loader2 size={20} className="animate-spin" /></>
                                    ) : (
                                        <>Mesajı Gönder <Send size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section or Additional Info */}
                <div className="mt-20">
                    <div className="bg-gray-200 rounded-[3rem] h-[400px] w-full overflow-hidden shadow-inner grayscale hover:grayscale-0 transition-all duration-700">
                        {/* Placeholder for map */}
                        <iframe
                            src="https://maps.google.com/maps?q=Ertu%C4%9Frulgazi%20mahallesi%20Kozluca%20Bulvar%C4%B1%20No:29%20%C4%B0neg%C3%B6l%20Bursa&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            loading="lazy"
                            className="border-0"
                            title="map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ContactPage;
