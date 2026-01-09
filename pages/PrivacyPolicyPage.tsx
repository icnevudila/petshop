
import React from 'react';
import { ShieldCheck, Lock, Eye } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="pt-32 pb-16 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <ShieldCheck size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-secondary mb-3">Gizlilik Politikası</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Kişisel verilerinizin güvenliği bizim için en önemli önceliktir.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto space-y-8 text-gray-600 leading-relaxed">
                    <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-secondary mb-2">Veri Güvenliği</h2>
                                <p className="text-sm">
                                    PatiDükkan olarak, müşterilerimize ait bilgilerin gizliliğini korumak amacıyla gelişmiş güvenlik önlemleri kullanmaktayız. Kredi kartı bilgileriniz 256-bit SSL sertifikası ile korunmakta olup, sistemlerimizde kesinlikle saklanmamaktadır.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-secondary mb-3">1. Toplanan Bilgiler</h3>
                        <p className="mb-4">
                            Sitemize üye olurken veya alışveriş yaparken adınız, adresiniz, telefon numaranız ve e-posta adresiniz gibi temel iletişim bilgileri toplanmaktadır. Bu bilgiler, siparişlerinizin teslimatı ve size daha iyi hizmet verebilmek amacıyla kullanılmaktadır.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-secondary mb-3">2. Çerez Politikası (Cookies)</h3>
                        <p className="mb-4">
                            Sitemizden en verimli şekilde faydalanabilmeniz için çerezler kullanılmaktadır. Çerezler, sitenin düzgün çalışması ve tercihlerinize uygun içerik sunulması için tarayıcınızda saklanan küçük metin dosyalarıdır. Dilerseniz tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-secondary mb-3">3. Üçüncü Taraflarla Paylaşım</h3>
                        <p className="mb-4">
                            Kişisel bilgileriniz, yasal zorunluluklar ve sipariş teslimatı için gerekli lojistik iş ortaklarımız dışında, izniniz olmaksızın üçüncü şahıs veya kurumlarla asla paylaşılmamaktadır.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-secondary mb-3">4. İletişim İzinleri</h3>
                        <p className="mb-4">
                            Tarafınıza gönderilen kampanya ve bilgilendirme e-postalarını dilediğiniz zaman üyeliğiniz üzerinden veya e-posta altındaki linkten iptal edebilirsiniz.
                        </p>
                    </section>

                    <div className="text-xs text-gray-400 mt-12 pt-8 border-t border-gray-100 text-center">
                        Son Güncelleme: 01.01.2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
