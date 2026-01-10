
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden hover:border-primary/20 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 bg-white text-left"
            >
                <span className="font-bold text-secondary">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="p-5 pt-0 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                    {answer}
                </div>
            )}
        </div>
    );
};

const FAQPage: React.FC = () => {
    const faqs = [
        {
            q: "Siparişlerim ne zaman kargoya verilir?",
            a: "Hafta içi saat 16:00'a kadar verilen tüm siparişler aynı gün kargoya teslim edilir. Cumartesi günleri ise saat 12:00'a kadar olan siparişler aynı gün gönderilir."
        },
        {
            q: "Hangi kargo firmaları ile çalışıyorsunuz?",
            a: "Anlaşmalı kargo firmamız Yurtiçi Kargo'dur. Tüm gönderimler sigortalı olarak yapılmaktadır."
        },
        {
            q: "Kapıda ödeme seçeneği var mı?",
            a: "Şu an için yalnızca Kredi Kartı (Bonus, World, Axess taksit imkanı) ve Havale/EFT ile ödeme kabul etmekteyiz. Kapıda ödeme seçeneğimiz bulunmamaktadır."
        },
        {
            q: "Ürünlerin son kullanma tarihi nedir?",
            a: "PatiDükkan olarak raf ömrü 6 aydan kısa olan ürünleri asla göndermiyoruz. Mama paketlerimizin SKT'si genellikle 1 yıl ve üzeridir."
        },
        {
            q: "İade işleminde kargo ücreti öder miyim?",
            a: "Hayır, anlaşmalı kargo kodumuzu kullanarak yapacağınız iade gönderimleri tamamen ücretsizdir."
        },
        {
            q: "Üye olmadan sipariş verebilir miyim?",
            a: "Evet, 'Misafir Alışverişi' seçeneği ile üye olmadan hızlıca sipariş oluşturabilirsiniz. Ancak sipariş takibi yapabilmek için üye olmanızı öneririz."
        },
    ];

    return (
        <div className="pt-36 pb-16 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <HelpCircle size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-secondary mb-3">Sıkça Sorulan Sorular</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-2xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.q} answer={faq.a} />
                    ))}
                </div>

                <div className="text-center mt-12 bg-gray-50 p-8 rounded-3xl max-w-2xl mx-auto">
                    <p className="font-bold text-secondary mb-2">Başka sorunuz mu var?</p>
                    <p className="text-sm text-gray-500 mb-6">Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar.</p>
                    <a href="/iletisim" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors inline-block shadow-lg shadow-primary/20">
                        Bize Ulaşın
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
