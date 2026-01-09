
import React from 'react';
import { RefreshCw, Truck, CheckCircle, AlertCircle } from 'lucide-react';

const ReturnPolicyPage: React.FC = () => {
    return (
        <div className="pt-32 pb-16 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <RefreshCw size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-secondary mb-3">İade ve Değişim Politikası</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Memnuniyetiniz bizim için önemli. Sorunsuz bir iade süreci için bilmeniz gerekenler.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto space-y-8 text-gray-600 leading-relaxed">

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start gap-4">
                            <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-green-800 mb-1">Koşulsuz İade</h4>
                                <p className="text-xs text-green-700">14 gün içinde açılmamış ürünleri sorgusuz sualsiz iade edebilirsiniz.</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                            <Truck className="text-blue-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-blue-800 mb-1">Ücretsiz Kargo</h4>
                                <p className="text-xs text-blue-700">Anlaşmalı kargo firmamız (Yurtiçi Kargo) ile gönderimler ücretsizdir.</p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h3 className="text-lg font-bold text-secondary mb-3">1. İade Koşulları</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Ürün <strong>orijinal ambalajında</strong> ve <strong>kullanılmamış</strong> olmalıdır.</li>
                            <li>Faturası ile birlikte gönderilmelidir.</li>
                            <li>Mama ve gıda ürünlerinde, ambalajı açılmış ürünlerin iadesi hijyen kuralları gereği kabul edilmemektedir.</li>
                            <li>Aksesuarlarda etiketi koparılmış veya denenmiş (tüy/koku sinmiş) ürünler iade alınmaz.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-secondary mb-3">2. Hasarlı / Kusurlu Ürün</h3>
                        <p className="mb-4">
                            Kargo teslimatı sırasında paketin hasarlı olduğunu fark ederseniz, lütfen <strong>Tutanak Tutturunuz</strong> ve paketi teslim almayınız. Paketi teslim aldıktan sonra fark edilen hasarlarda, ürünün fotoğrafını çekerek <a href="/iletisim" className="text-primary font-bold">İletişim</a> sayfamızdan bize bildiriniz. En kısa sürede değişim işlemi başlatılacaktır.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-secondary mb-3">3. İade Süreci Nasıl İşler?</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Hesabım &gt; Siparişlerim sayfasına gidin.</li>
                            <li>İlgili sipariş için "İade Talebi Oluştur" butonuna tıklayın.</li>
                            <li>Size verilen <strong>Kargo İade Kodu</strong> ile ürünü Yurtiçi Kargo şubesine teslim edin. (Ek ücret ödemezsiniz.)</li>
                            <li>Ürün depomuza ulaşıp kontrol edildikten sonra (ortalama 1-3 iş günü), ücret iadesi bankanıza yapılır.</li>
                        </ol>
                    </section>

                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 text-sm text-yellow-800 mt-8">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>Banka süreçlerine bağlı olarak iade edilen tutarın kartınıza yansıması 3-7 iş günü sürebilir.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReturnPolicyPage;
