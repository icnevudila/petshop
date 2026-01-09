
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronRight, CornerDownRight, Smile, Briefcase, HelpCircle, User, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Message {
    id: string;
    text: React.ReactNode; // Allow JSX for links
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface QuickAction {
    label: string;
    action: string;
    icon?: React.ReactNode;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Merhaba! Ben PatiBot 🤖\nSize nasıl yardımcı olabilirim? Aşağıdaki menüden seçim yapabilir veya sorunuzu yazabilirsiniz.',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('main'); // main, kargo, iade, urunler, iletisim
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // --- KNOWLEDGE BASE ---
    const knowledgeBase = [
        {
            keywords: ['kedi maması', 'kedi yemi', 'nd kedi', 'royal canin kedi'],
            response: 'Kediniz için en lezzetli mamalar bizde! 🐱 Kısırlaştırılmış, yavru veya yetişkin kediler için özel mamalarımızı incelemek için <a href="/#/kategori/kedi" class="text-secondary font-bold underline">Kedi Kategorisine</a> göz atabilirsiniz.',
            link: '/kategori/kedi'
        },
        {
            keywords: ['köpek maması', 'köpek yemi', 'proplan', 'acana'],
            response: 'Sadık dostunuz için en kaliteli mamalar raflarımızda! 🐶 Tahılsız, kuzu etli veya somonlu seçenekleri görmek için <a href="/#/kategori/kopek" class="text-secondary font-bold underline">Köpek Kategorisine</a> tıklayabilirsiniz.',
            link: '/kategori/kopek'
        },
        {
            keywords: ['balık', 'akvaryum', 'yem', 'filtre'],
            response: 'Sualtı dünyası için her şey burada! 🐠 Yemlerden filtrelere kadar tüm ihtiyaçlarınız için <a href="/#/kategori/balik" class="text-secondary font-bold underline">Balık Kategorisini</a> ziyaret edin.',
            link: '/kategori/balik'
        },
        {
            keywords: ['kuş', 'muhabbet', 'papağan', 'yem', 'kafes'],
            response: 'Kanatlı dostlarımız için en taze yemler ve geniş kafesler! 🦜 Hemen <a href="/#/kategori/kus" class="text-secondary font-bold underline">Kuş Kategorisine</a> ışınlanın.',
            link: '/kategori/kus'
        },
        {
            keywords: ['kargo ücreti', 'kargo ne kadar', 'ücretsiz kargo'],
            response: '📦 **Kargo Ücretleri:**\n- 500 TL ve üzeri siparişlerde **KARGO BEDAVA!** 🎉\n- 500 TL altı siparişlerde sabit **50 TL** gönderim ücreti alınmaktadır.'
        },
        {
            keywords: ['hangi kargo', 'kargo firması', 'gönderim'],
            response: 'Anlaşmalı olduğumuz kargo firması **Yurtiçi Kargo**dur. 🚛 Tüm Türkiye\'ye sigortalı ve hızlı gönderim yapıyoruz.'
        },
        {
            keywords: ['sipariş takibi', 'nerede', 'kargom'],
            response: 'Siparişinizin durumunu öğrenmek çok kolay! 🧐\n1. <a href="/#/siparis-takibi" class="text-secondary font-bold underline">Sipariş Takibi</a> sayfasını kullanabilirsiniz.\n2. Veya "Hesabım > Siparişlerim" menüsünden detayları görebilirsiniz.',
            link: '/siparis-takibi'
        },
        {
            keywords: ['iade', 'değişim', 'geri gönder'],
            response: 'Memnun kalmadığınız ürünleri **14 gün** içinde koşulsuz iade edebilirsiniz. 🔄\n- Ürün açılmamış olmalı.\n- İade kargo ücreti bize aittir.\nDetaylar için <a href="/#/iade-politikasi" class="text-secondary font-bold underline">İade Politikası</a> sayfamıza bakabilirsiniz.',
            link: '/iade-politikasi'
        },
        {
            keywords: ['ödeme', 'taksit', 'kredi kartı', 'havale'],
            response: '💳 **Ödeme Seçenekleri:**\n- Tüm Kredi Kartlarına 12 Taksit\n- Banka Kartı\n- Havale / EFT\n⚠️ Kapıda ödeme seçeneğimiz malesef bulunmamaktadır.'
        },
        {
            keywords: ['mağaza', 'adres', 'yeriniz', 'konum'],
            response: 'Bize kahve içmeye bekleriz! ☕\n📍 **Adres:** Ertuğrulgazi Mah. Kozluca Bulvarı No:29 (Şımarık AVM Yanı) İnegöl/BURSA.\nHaftanın her günü 09:00 - 22:00 arası açığız.'
        },
        {
            keywords: ['iletişim', 'telefon', 'mail', 'eposta'],
            response: 'Bize her zaman ulaşabilirsiniz! 📞\n📱 Tel: 0555 123 45 67\n📧 Mail: destek@patidukkan.com\n💬 Veya buradan yazmaya devam edebilirsiniz.'
        },
        {
            keywords: ['indirim', 'kupon', 'kampanya', 'promosyon'],
            response: 'Şu an aktif kampanyamız: **YAZ2025** kupon kodu ile sepette ekstra **%10 İndirim** kazanabilirsiniz! 🎁 Acele edin, süre sınırlı!'
        }
    ];

    // --- MENUS ---
    const menus: Record<string, QuickAction[]> = {
        main: [
            { label: '📦 Kargo & Teslimat', action: 'menu_kargo', icon: <Truck size={14} /> },
            { label: '🔄 İade İşlemleri', action: 'menu_iade', icon: <ShoppingBag size={14} /> },
            { label: '🦴 Ürünler & Stok', action: 'menu_urunler', icon: <Bot size={14} /> },
            { label: '💳 Ödeme & Fatura', action: 'menu_odeme', icon: <CreditCard size={14} /> },
            { label: '🎧 Canlı Destek', action: 'canli_destek', icon: <Headset size={14} /> }
        ],
        menu_kargo: [
            { label: '🚚 Kargo Ücreti Ne Kadar?', action: 'q_kargo_ucret' },
            { label: '⏱️ Ne Zaman Gelir?', action: 'q_teslimat_sure' },
            { label: '🔎 Kargom Nerede?', action: 'q_takip' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ],
        menu_iade: [
            { label: '❓ Nasıl İade Ederim?', action: 'q_iade_nasil' },
            { label: '💰 Para İadesi Ne Zaman?', action: 'q_para_iadesi' },
            { label: '📦 Değişim Var mı?', action: 'q_degisim' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ],
        menu_urunler: [
            { label: '🐈 Kedi Ürünleri', action: 'link_cat' },
            { label: '🐕 Köpek Ürünleri', action: 'link_dog' },
            { label: '🦜 Kuş Ürünleri', action: 'link_bird' },
            { label: '🐠 Balık Ürünleri', action: 'link_fish' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ],
        menu_odeme: [
            { label: '💳 Taksit Seçenekleri', action: 'q_taksit' },
            { label: '🚪 Kapıda Ödeme', action: 'q_kapida' },
            { label: '🧾 Havale Bilgileri', action: 'q_havale' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ]
    };

    const handleAction = (action: string) => {
        // Check if it's a menu switch
        if (menus[action]) {
            setCurrentMenu(action);
            return;
        }

        // Check for explicit back
        if (action === 'menu_main') {
            setCurrentMenu('main');
            return;
        }

        // Direct Answers
        let responseText = '';
        let userText = '';

        switch (action) {
            // Kargo
            case 'q_kargo_ucret':
                userText = 'Kargo ücreti ne kadar?';
                responseText = '500 TL altı siparişlerde kargo ücreti 50 TL\'dir. 500 TL üzeri siparişlerinizde kargo bizden! 🎁';
                break;
            case 'q_teslimat_sure':
                userText = 'Siparişim ne zaman gelir?';
                responseText = 'Siparişleriniz 24 saat içinde kargoya verilir ve genellikle 1-3 iş günü içinde size ulaşır. 🚀';
                break;
            case 'q_takip':
                userText = 'Kargom nerede?';
                responseText = 'Siparişinizi "Sipariş Takibi" sayfasından sorgulayabilirsiniz. Size gönderilen SMS\'teki takip kodunu kullanmayı unutmayın.';
                break;

            // İade
            case 'q_iade_nasil':
                userText = 'Nasıl iade ederim?';
                responseText = 'İade işlemi çok basit! Kargo şubesine gidip "123456789" numaralı müşteri kodumuzu söyleyerek ürünü ücretsiz gönderebilirsiniz.';
                break;
            case 'q_para_iadesi':
                userText = 'Para iadesi ne zaman yatar?';
                responseText = 'Ürün depomuza ulaştıktan sonra 24 saat içinde iade onayı verilir. Bankanıza bağlı olarak 3-7 gün içinde kartınıza yansır.';
                break;

            // Ödeme
            case 'q_kapida':
                userText = 'Kapıda ödeme var mı?';
                responseText = 'Güvenlik prosedürlerimiz gereği şu an için kapıda ödeme kabul edemiyoruz. Kredi kartı veya Havale ile güvenle alışveriş yapabilirsiniz.';
                break;

            // Kategori Linkleri (Special handling)
            case 'link_cat':
                navigate('/kategori/kedi');
                setIsOpen(false);
                return;
            case 'link_dog':
                navigate('/kategori/kopek');
                setIsOpen(false);
                return;

            case 'canli_destek':
                userText = 'Canlı desteğe bağlanmak istiyorum.';
                responseText = '📞 Müşteri Hizmetleri Numaramız: 0555 123 45 67\nMesai saatleri (09:00-18:00) içerisinde arayabilir veya WhatsApp hattımızdan yazabilirsiniz.';
                break;

            default:
                userText = 'Bilgi almak istiyorum.';
                responseText = 'Size nasıl yardımcı olabilirim?';
        }

        addMessage('user', userText);
        simulateBotResponse(responseText);
    };

    const processInput = (text: string) => {
        // Check Knowledge Base Logic
        const lower = text.toLowerCase();

        // Check Knowledge Base
        const found = knowledgeBase.find(kb => kb.keywords.some(k => lower.includes(k)));

        if (found) {
            return found.response;
        }

        // Greeting
        if (['selam', 'merhaba', 'günaydın'].some(w => lower.includes(w))) {
            return 'Selam! 👋 Hoş geldiniz. Size nasıl yardımcı olabilirim?';
        }

        if (['teşekkür', 'sağol'].some(w => lower.includes(w))) {
            return 'Rica ederim! 🧡 Başka bir sorunuz olursa buradayım.';
        }

        return 'Bunu tam anlayamadım 😔 Ama üzülmeyin, öğreniyorum! \nAşağıdaki menüden konuyu seçerseniz size daha doğru yardımcı olabilirim.';
    };

    const addMessage = (sender: 'user' | 'bot', text: string | React.ReactNode) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date()
        }]);
    };

    const simulateBotResponse = (responseText: string) => {
        setIsTyping(true);
        const delay = Math.random() * 800 + 800; // Natural delay

        setTimeout(() => {
            setIsTyping(false);
            // Process HTML links in response text appropriately
            if (responseText.includes('<a href=')) {
                // Basic parser for this specific use case to render JSX
                const parts = responseText.split(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/);
                if (parts.length > 1) {
                    addMessage('bot', (
                        <span>
                            {parts[0]}
                            <a href={parts[1]} className="text-secondary font-bold underline hover:text-primary transition-colors">{parts[2]}</a>
                            {parts[3]}
                        </span>
                    ));
                } else {
                    addMessage('bot', responseText);
                }
            } else {
                addMessage('bot', responseText);
            }
        }, delay);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        addMessage('user', inputText);
        const response = processInput(inputText);
        simulateBotResponse(response);
        setInputText('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-white text-gray-500 rotate-90' : 'bg-gradient-to-tr from-primary to-orange-400 text-white animate-bounce-subtle'}`}
            >
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageCircle size={32} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                        </span>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] md:w-[380px] h-[600px] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-slide-up origin-bottom-right font-sans ring-4 ring-black/5">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-orange-500 p-5 flex items-center gap-4 text-white shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Bot size={80} />
                        </div>

                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                            <Bot size={28} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg tracking-wide">PatiBot</h3>
                            <div className="flex items-center gap-1.5 opacity-90">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                                <p className="text-xs font-medium">Çevrimiçi</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80 scroll-smooth">
                        <div className="text-center">
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{new Date().toLocaleDateString()}</span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in items-end gap-2`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white shrink-0 mb-4 shadow-sm">
                                        <Bot size={14} />
                                    </div>
                                )}

                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-secondary text-white rounded-br-none'
                                        : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                    <div className={`text-[9px] mt-1.5 text-right font-medium ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <div className="text-xs text-gray-400 animate-pulse">Yazıyor...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Smart Menu (Chips) */}
                    <div className="bg-white p-2 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
                            {menus[currentMenu]?.map((btn, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAction(btn.action)}
                                    className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 hover:border-primary text-gray-600 text-xs font-bold rounded-xl transition-all active:scale-95 shrink-0"
                                >
                                    {btn.icon} {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Bir mesaj yazın..."
                            className="flex-1 pl-4 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="w-11 h-11 bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors shadow-lg active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </form>

                </div>
            )}
        </>
    );
};

export default ChatBot;
