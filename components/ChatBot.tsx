
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Headset, Smile, ChevronRight } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isQuickReply?: boolean;
}

interface QuickAction {
    label: string;
    action: string;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Merhaba! Ben PatiBot 🐾 Size yardımcı olmak için buradayım. Aşağıdaki konulardan birini seçebilir veya sorunuzu yazabilirsiniz.',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickActions: QuickAction[] = [
        { label: '🚚 Kargom Nerede?', action: 'kargo_durumu' },
        { label: '🔄 İade İşlemleri', action: 'iade_bilgi' },
        { label: '💳 Ödeme Seçenekleri', action: 'odeme_yontemleri' },
        { label: '🏢 Mağaza Adresi', action: 'adres_bilgi' },
        { label: '📞 Canlı Destek', action: 'canli_destek' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const generateResponse = (text: string): string => {
        const lowerText = text.toLowerCase();

        // Greeting
        if (['merhaba', 'selam', 'hey', 'hi', 'günaydın', 'iyi akşamlar'].some(w => lowerText.includes(w))) {
            return 'Merhaba! Hoş geldiniz. Size nasıl yardımcı olabilirim? 😺';
        }

        // Shipping & Delivery
        if (lowerText.includes('kargo') || lowerText.includes('teslimat') || lowerText.includes('kaç gün') || lowerText.includes('gelir')) {
            if (lowerText.includes('ücret') || lowerText.includes('bedava')) {
                return 'Tüm Türkiye\'ye kargo sabit 50 TL\'dir. 500 TL ve üzeri alışverişlerinizde kargo tamamen ücretsizdir! 🚚';
            }
            return 'Hafta içi saat 16:00\'a kadar verilen siparişler aynı gün kargoya teslim edilir. Teslimat süresi genellikle 1-3 iş günüdür. Yurtiçi Kargo ile çalışıyoruz. 📦';
        }

        // Returns
        if (lowerText.includes('iade') || lowerText.includes('değişim') || lowerText.includes('beğenmedim')) {
            return 'Memnun kalmadığınız ürünleri 14 gün içinde, ambalajı açılmamış ve kullanılmamış olmak şartıyla ücretsiz iade edebilirsiniz. Hesabım > Siparişlerim menüsünden iade kodu alabilirsiniz. 🔄';
        }

        // Payment
        if (lowerText.includes('ödeme') || lowerText.includes('taksit') || lowerText.includes('kart') || lowerText.includes('kapıda')) {
            if (lowerText.includes('kapıda')) {
                return 'Maalesef şu an için kapıda ödeme seçeneğimiz bulunmamaktadır. Kredi kartı veya Havale/EFT ile güvenle ödeme yapabilirsiniz.';
            }
            return 'Tüm banka kredi kartları ile 12 taksite kadar ödeme yapabilirsiniz. Ayrıca Havale/EFT seçeneğimiz de mevcuttur. Ödeme altyapımız 256-bit SSL ile korunmaktadır. 💳';
        }

        // Products & Stock
        if (lowerText.includes('stok') || lowerText.includes('var mı') || lowerText.includes('tükendi')) {
            return 'Sitemizdeki stok durumları anlık olarak güncellenmektedir. Eğer bir üründe "Sepete Ekle" butonu aktifse, o ürün stoklarımızda mevcuttur ve hemen gönderilebilir. 📦';
        }
        if (lowerText.includes('mama') || lowerText.includes('hangi') || lowerText.includes('öneri') || lowerText.includes('tavsiye')) {
            return 'Mama seçimi çok önemlidir! 🍖 Kediniz veya köpeğinizin yaşına, kısırlaştırma durumuna ve kilosuna göre seçim yapmalısınız. "Kedi Maması" veya "Köpek Maması" kategorilerimizde filtreleme yaparak en uygun mamayı bulabilirsiniz.';
        }

        // Contact & Location
        if (lowerText.includes('adres') || lowerText.includes('yeriniz') || lowerText.includes('konum')) {
            return 'Mağazamız Bursa İnegöl\'dedir. Adresimiz: Ertuğrulgazi Mah. Kozluca Bulvarı No:29 (Şımarık AVM Yanı). Bekleriz! 📍';
        }
        if (lowerText.includes('telefon') || lowerText.includes('numara') || lowerText.includes('ulaş')) {
            return 'Müşteri hizmetlerimize +90 (555) 123 45 67 numarasından, hafta içi 09:00 - 18:00 saatleri arasında ulaşabilirsiniz. 📞';
        }

        // Live Support Handover
        if (lowerText.includes('insan') || lowerText.includes('canlı') || lowerText.includes('temsilci') || lowerText.includes('yetkili')) {
            return 'Şu anda tüm müşteri temsilcilerimiz diğer patiseverlerle ilgileniyor. Dilerseniz telefon numaranızı bırakın, en kısa sürede sizi arayalım. Veya sorunuzu buraya detaylı yazarsanız size yardımcı olmaya çalışabilirim. 🎧';
        }

        // Miscellaneous
        if (lowerText.includes('indirim') || lowerText.includes('kupon') || lowerText.includes('kampanya')) {
            return 'Şu an "YAZ2025" kodu ile seçili ürünlerde %20 indirimimiz devam ediyor! Ayrıca üye olduğunuzda ilk siparişinize özel sürprizler sizi bekliyor. 🎉';
        }
        if (lowerText.includes('teşekkür') || lowerText.includes('sağol') || lowerText.includes('tşk')) {
            return 'Rica ederim! Her zaman buradayım. PatiDükkan keyifli alışverişler diler! 🧡';
        }

        // Fallback
        return 'Bunu tam olarak anlayamadım ama her geçen gün öğreniyorum. 🤔\nSormak istediğiniz konuyu daha basit kelimelerle yazabilir veya aşağıdaki menüden seçim yapabilirsiniz.';
    };

    const handleSend = (text: string = inputText) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate different thinking times for variety
        const delay = Math.random() * 1000 + 1000;

        setTimeout(() => {
            let responseText = '';

            // Check for quick actions
            switch (text) {
                case 'kargo_durumu':
                    responseText = 'Siparişiniz kargoya verildiğinde size SMS ve E-posta ile takip numarası gönderiyoruz. "Sipariş Takibi" sayfasından veya Hesabım panelinden durumunu sorgulayabilirsiniz. 🚚';
                    break;
                case 'iade_bilgi':
                    responseText = 'Ürünlerinizi 14 gün içinde anlaşmalı kargo kodumuz ile ücretsiz geri gönderebilirsiniz. Ödemeniz, ürün depomuza ulaştıktan sonra 3 iş günü içinde kartınıza iade edilir. 💸';
                    break;
                case 'odeme_yontemleri':
                    responseText = 'Kredi Kartı (12 Taksit), Banka Kartı ve Havale/EFT ile ödeme yapabilirsiniz. Kapıda ödeme seçeneğimiz bulunmamaktadır.';
                    break;
                case 'adres_bilgi':
                    responseText = 'Bursa İnegöl mağazamıza bekleriz! 📍 Kozluca Bulvarı No:29 adresindeyiz. Haftanın her günü 10:00 - 22:00 arası açığız.';
                    break;
                case 'canli_destek':
                    responseText = 'Müşteri temsilcisine bağlanılıyor... ⏳\n(Şaka yapıyorum, ben bir botum ama numaramız: 0555 123 45 67. Mesai saatlerinde aradığınızda gerçek bir insanla konuşabilirsiniz! 😄)';
                    break;
                default:
                    responseText = generateResponse(text);
            }

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, delay);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 right-5 md:right-8 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all z-50 hover:scale-110 duration-300 ${isOpen ? 'bg-white text-gray-500 rotate-90' : 'bg-gradient-to-r from-primary to-orange-600 text-white animate-bounce-slow'}`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 md:right-8 w-[90vw] md:w-[400px] h-[600px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-slide-up origin-bottom-right font-sans">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-orange-600 p-5 flex items-center justify-between text-white shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                                    <Bot size={28} />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg tracking-wide">PatiBot</h3>
                                <p className="text-xs text-orange-100 font-medium opacity-90">7/24 Akıllı Destek</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setMessages([])} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Sohbeti Temizle">
                                <span className="text-xs opacity-70">Temizle</span>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50 scroll-smooth">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm mt-10">Sohbet geçmişi temizlendi.</div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 self-end mb-1 shrink-0 text-primary">
                                        <Bot size={16} />
                                    </div>
                                )}
                                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm relative ${msg.sender === 'user'
                                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                    }`}>
                                    {msg.text}
                                    <div className={`text-[10px] mt-2 text-right opacity-60 font-medium`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-1.5">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions (Chips) */}
                    <div className="bg-gray-50 p-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-100">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(action.action)}
                                className="whitespace-nowrap px-4 py-2 bg-white border border-primary/20 text-primary text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-1 shrink-0"
                            >
                                {action.label} <ChevronRight size={12} />
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Bir şeyler yazın..."
                                className="w-full pl-4 pr-10 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                            />
                            <Smile size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-primary transition-colors" />
                        </div>

                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="w-12 h-12 bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center hover:bg-primary-hover transition-transform hover:scale-105 shadow-lg shadow-primary/20 shrink-0"
                        >
                            <Send size={20} className={inputText.trim() ? 'ml-0.5' : ''} />
                        </button>
                    </form>

                </div>
            )}
        </>
    );
};

export default ChatBot;
