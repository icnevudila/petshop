
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronRight, CornerDownRight, Smile, Briefcase, HelpCircle, User, Truck, CreditCard, ShoppingBag, HeartPulse, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Message {
    id: string;
    text: React.ReactNode;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface QuickAction {
    label: string;
    action: string;
    icon?: React.ReactNode;
}

type ConversationState = 'IDLE' | 'WAITING_ORDER_ID' | 'RECOMMEND_START' | 'RECOMMEND_CAT_AGE' | 'RECOMMEND_DOG_SIZE';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Merhaba! Ben PatiBot 🧠\nPetShop dünyasının en bilgili asistanıyım. Size siparişler, ürün tavsiyeleri, sağlık ipuçları veya mağaza bilgileri hakkında ultra detaylı bilgi verebilirim. Nasıl başlayalım?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('main');
    const [conversationState, setConversationState] = useState<ConversationState>('IDLE');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // --- ULTRA KNOWLEDGE BASE ---
    const knowledgeBase = [
        // CATS
        {
            keywords: ['kedi', 'pisipisi', 'tekir'],
            response: 'Kediler hakkında ne bilmek istersiniz? 🐱\n- <a href="/kategori/kedi" class="text-secondary font-bold underline">Mama Çeşitleri</a>\n- <a href="/kategori/kedi" class="text-secondary font-bold underline">Kum ve Tuvalet</a>\n- <a href="/kategori/kedi" class="text-secondary font-bold underline">Oyuncaklar</a>\n\nSize özel mama tavsiyesi yapmamı ister misiniz? Menüden "Mama Tavsiyesi"ni seçebilirsiniz.',
        },
        {
            keywords: ['kısır', 'sterilised', 'kısırlaştırılmış'],
            response: 'Kısırlaştırılmış kedilerin metabolizması yavaşlar ve kilo almaya meyilli olurlar. Bu yüzden yağ oranı düşük, L-karnitin içeren "Sterilised" mamaları öneriyoruz. 🏥\n<a href="/kategori/kedi?filter=kisir" class="text-primary font-bold underline">Kısır Kediler İçin Mamaları Gör</a>',
        },
        {
            keywords: ['yavru kedi', 'kitten', 'bebek kedi'],
            response: 'Yavru kedilerin (0-12 ay) gelişimi çok hızlıdır! Yüksek protein ve kalsiyum içeren "Kitten" mamalarla beslenmeleri gerekir. Ayrıca bağışıklık için anne sütü tozu da önerilir. 🍼\n<a href="/kategori/kedi?filter=kitten" class="text-primary font-bold underline">Yavru Kedi Ürünleri</a>',
        },
        {
            keywords: ['tüy yumağı', 'hairball', 'kusma'],
            response: 'Kediniz çok tüy yutuyorsa "Hairball Control" özellikli mamalar veya Malt Macunu kullanmalısınız. Malt macunu, tüylerin sindirim sisteminden doğal yolla atılmasını sağlar. 🧶',
        },
        {
            keywords: ['idrar', 'böbrek', 'üriner', 'urinary'],
            response: 'Böbrek ve idrar yolu sağlığı (Urinary) kedilerde çok kritiktir. Magnezyum oranı dengelenmiş profesyonel mamalar kullanmanızı ve bol taze su bulundurmanızı öneririz. 💧\n<a href="/kategori/kedi" class="text-primary font-bold underline">Urinary Mamalar</a> (Hekim tavsiyesi gerekebilir)',
        },

        // DOGS
        {
            keywords: ['köpek', 'havhav'],
            response: 'Köpek dostlarımız için her şey düşünüldü! 🐶\nIrk boyutu ve yaşı çok önemlidir. Köpeğiniz hakkında daha detaylı bilgi verirseniz (örn: "Yavru Golden" veya "Yaşlı Terrier") nokta atışı ürün önerebilirim.',
        },
        {
            keywords: ['kuzu', 'somon', 'tahılsız', 'alerji'],
            response: 'Hassas sindirim sistemine sahip veya alerjik köpekler için **Tahılsız (Grain Free)**, **Kuzu Etli** veya **Somonlu** mamalar kurtarıcıdır. Deri ve tüy sağlığına da çok iyi gelir. 🐟🥩',
        },
        {
            keywords: ['oyuncak', 'kemirme', 'diş'],
            response: 'Köpeklerin diş sağlığı ve enerjilerini atmaları için dayanıklı kemirme oyuncakları şarttır! Kong veya halat oyuncaklar hem eğlendirir hem de tartar oluşumunu engeller. 🦴',
        },

        // GENERAL
        {
            keywords: ['mama saklama', 'taze', 'bayat'],
            response: 'Mamanın tazeliğini korumak için hava almayan kilitli kaplarda, serin ve kuru bir yerde saklamalısınız. Paketi her seferinde sıkıca kapatmayı unutmayın! 🥡',
        },
        {
            keywords: ['pire', 'kene', 'parazit'],
            response: 'Dış parazitler (pire/kene) ciddi hastalık taşıyabilir. Düzenli olarak damla/tasma kullanmalısınız. Mağazamızda bitkisel koruyucu tasmalar mevcuttur ancak kesin çözüm için veteriner hekiminize danışın. 🦠'
        }
    ];

    // --- MENUS ---
    const menus: Record<string, QuickAction[]> = {
        main: [
            { label: '🚚 Kargo ve Siparişler', action: 'menu_kargo', icon: <Truck size={14} /> },
            { label: '🍖 Mama Tavsiyesi Al', action: 'start_recommendation', icon: <HeartPulse size={14} /> },
            { label: '💳 İade ve Ödeme', action: 'menu_finans', icon: <CreditCard size={14} /> },
            { label: '📍 Mağaza Bilgisi', action: 'menu_magaza', icon: <ShoppingBag size={14} /> },
            { label: '🕵️ Sipariş Sorgula', action: 'start_tracking', icon: <Search size={14} /> }
        ],
        menu_kargo: [
            { label: 'Ücret Politikası', action: 'info_kargo_ucret' },
            { label: 'Teslimat Süresi', action: 'info_kargo_sure' },
            { label: 'Hangi Kargo?', action: 'info_kargo_firma' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ],
        menu_finans: [
            { label: 'İade Koşulları', action: 'info_iade' },
            { label: 'Taksit Seçenekleri', action: 'info_taksit' },
            { label: 'Havale Hesapları', action: 'info_havale' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ],
        menu_magaza: [
            { label: 'Adres & Konum', action: 'info_adres' },
            { label: 'Çalışma Saatleri', action: 'info_saat' },
            { label: 'Telefon', action: 'info_tel' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ]
    };

    // --- LOGIC ---

    const handleAction = (action: string) => {
        // Menu Navigation
        if (menus[action]) {
            setCurrentMenu(action);
            return;
        }
        if (action === 'menu_main') {
            setCurrentMenu('main');
            setConversationState('IDLE');
            return;
        }

        let userText = '';
        let reqResponse = '';

        // Specialized Logic Routes
        if (action === 'start_tracking') {
            setConversationState('WAITING_ORDER_ID');
            addMessage('user', 'Siparişimi sorgulamak istiyorum.');
            setTimeout(() => addMessage('bot', 'Lütfen 10 haneli sipariş numaranızı yazar mısınız? (Örn: 1234567890)'), 600);
            return;
        }

        if (action === 'start_recommendation') {
            setConversationState('RECOMMEND_START');
            addMessage('user', 'Mama tavsiyesi istiyorum.');
            setTimeout(() => {
                addMessage('bot', 'Harika! Size en uygun mamayı bulalım. Öncelikle, minik dostumuz bir **Kedi** mi yoksa **Köpek** mi?');
                // We could simulate buttons here by injecting them into chat or changing quick menu
                // For now, let's guide user to type or use basic text recognition
            }, 600);
            return;
        }

        // Static Information Responses
        switch (action) {
            case 'info_kargo_ucret':
                userText = 'Kargo ücreti ne kadar?';
                reqResponse = '📦 **Kargo Politikamız:**\n• 500 TL ve üzeri: **ÜCRETSİZ**\n• 500 TL altı: **50 TL** sabit ücret.\n• Kapıda ödeme yoktur.';
                break;
            case 'info_kargo_sure':
                userText = 'Ne zaman ulaşır?';
                reqResponse = 'Siparişleriniz Bursa depomuzdan çıkar.\n• Marmara Bölgesi: 1 İş Günü\n• Diğer Bölgeler: 1-3 İş Günü\nHafta içi 16:00\'a kadar verilen siparişler aynı gün kargodadır.';
                break;
            case 'info_kargo_firma':
                userText = 'Hangi firmayla çalışıyorsunuz?';
                reqResponse = 'Tüm gönderimlerimiz **Yurtiçi Kargo** güvencesiyle sigortalı olarak yapılmaktadır. Kırılacak ürünler (akvaryum vb.) özel straforlu kutularda gönderilir.';
                break;
            case 'info_iade':
                userText = 'İade koşulları nelerdir?';
                reqResponse = 'Memnuniyetiniz garantimiz altında! 🛡️\nÜrünü teslim aldıktan sonra **14 gün** içerisinde, ambalajı bozulmamış olmak kaydıyla sebep belirtmeksizin iade edebilirsiniz. İade kargo kodu için Hesabım panelini kullanabilirsiniz.';
                break;
            case 'info_taksit':
                userText = 'Taksit yapıyor musunuz?';
                reqResponse = 'Evet, anlaşmalı ödeme kuruluşumuz (Iyzico/PayTR) üzerinden Bonus, World, Axess, Maximum, CardFinans ve Paraf kartlarına **12 aya varan taksit** imkanı sunuyoruz.';
                break;
            case 'info_adres':
                userText = 'Mağaza nerede?';
                reqResponse = '📍 **Showroom:**\nErtuğrulgazi Mah. Kozluca Bulvarı No:29\nİnegöl / BURSA\n(Şımarık AVM Yanı, ana cadde üzerinde)';
                break;
        }

        if (userText) addMessage('user', userText);
        if (reqResponse) simulateBotResponse(reqResponse);
    };

    const processConversationState = (text: string) => {
        const lower = text.toLowerCase();

        // State: WAITING_ORDER_ID
        if (conversationState === 'WAITING_ORDER_ID') {
            if (text.length >= 5 && !isNaN(Number(text))) {
                simulateBotResponse(`🔍 **${text}** numaralı siparişiniz kontrol ediliyor...\n\n✅ **Durum:** Sipariş Hazırlanıyor\n📦 **Tahmini Kargolama:** Bugün 17:00\n\nDetaylı bilgi için SMS bildirimlerini takip edebilirsiniz.`);
                setConversationState('IDLE');
            } else {
                simulateBotResponse('Bu numara formatı hatalı görünüyor. Lütfen sadece rakamlardan oluşan sipariş numaranızı girin veya iptal etmek için "İptal" yazın.');
            }
            return;
        }

        // State: RECOMMEND_START (Cat or Dog?)
        if (conversationState === 'RECOMMEND_START') {
            if (lower.includes('kedi')) {
                setConversationState('RECOMMEND_CAT_AGE');
                simulateBotResponse('Miyav! 😺 Peki kediniz kaç yaşında?\n1. Yavru (0-12 ay)\n2. Yetişkin (1-7 yaş)\n3. Yaşlı (7+ yaş)');
            } else if (lower.includes('köpek')) {
                setConversationState('RECOMMEND_DOG_SIZE');
                simulateBotResponse('Hav hav! 🐶 Köpeğinizin ırk boyutu nedir?\n1. Küçük (Small)\n2. Orta (Medium)\n3. Büyük (Large)');
            } else {
                simulateBotResponse('Lütfen "Kedi" veya "Köpek" olarak belirtir misiniz?');
            }
            return;
        }

        // State: RECOMMEND_CAT_AGE
        if (conversationState === 'RECOMMEND_CAT_AGE') {
            if (lower.includes('yavru') || lower.includes('0') || lower.includes('bebek')) {
                simulateBotResponse('Yavru kedilerin yüksek enerjiye ihtiyacı vardır! 🍼\nÖnerim: **Royal Canin Kitten** veya **Proplan Junior**.\nBu mamalar kemik gelişimi için ekstra kalsiyum içerir. <a href="/kategori/kedi?q=kitten" class="underline font-bold">Ürünleri İncele</a>');
            } else if (lower.includes('yasli') || lower.includes('yaşlı') || lower.includes('7')) {
                simulateBotResponse('Kıdemli dostumuz için böbrek sağlığını destekleyen mamalar seçmeliyiz. 👴\nÖnerim: **Hill\'s Mature Adult 7+**.\n<a href="/kategori/kedi?q=mature" class="underline font-bold">Ürünleri İncele</a>');
            } else {
                simulateBotResponse('Yetişkin kediniz için **N&D Tahılsız** veya **La Vital Sterilised** (eğer kısırsa) harika seçeneklerdir. Lezzet garantilidir! 🍗\n<a href="/kategori/kedi" class="underline font-bold">Tüm Yetişkin Mamaları</a>');
            }
            setConversationState('IDLE');
            return;
        }

        // State: RECOMMEND_DOG_SIZE
        if (conversationState === 'RECOMMEND_DOG_SIZE') {
            simulateBotResponse('Anlaşıldı! 🐕 Seçtiğiniz boyuta uygun, eklem destekleyici (Glukozamin içeren) mamalarımıza buradan göz atabilirsiniz:\n<a href="/kategori/kopek" class="underline font-bold">Size Özel Köpek Mamaları</a>');
            setConversationState('IDLE');
            return;
        }

        // Fallback to normal keyword search
        const response = searchKnowledgeBase(text);
        simulateBotResponse(response);
    };

    const searchKnowledgeBase = (text: string): string => {
        const lower = text.toLowerCase();

        // Check predefined detailed knowledge base
        const found = knowledgeBase.find(kb => kb.keywords.some(k => lower.includes(k)));
        if (found) return found.response;

        // Small Talk
        if (['merhaba', 'selam'].some(w => lower.includes(w))) return 'Merhaba! Nasıl yardımcı olabilirim?';
        if (lower.includes('insan') || lower.includes('canlı')) return 'Müşteri temsilcilerimiz şu an yoğun. Ancak 0555 123 45 67 hattından bize ulaşabilirsiniz.';

        // Smart Fallback
        return 'Bu konuda henüz eğitilmedim ama öğreniyorum! 📚\nMenüyü kullanarak "Kargo", "İade" veya "Ürün Tavsiyesi" alabilirsiniz.';
    };

    const handleSend = (text: string) => {
        addMessage('user', text);

        // If inside a flow state, use processConversationState
        if (conversationState !== 'IDLE') {
            processConversationState(text);
        } else {
            // Normal processing
            const response = searchKnowledgeBase(text);
            simulateBotResponse(response);
        }
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
        const delay = Math.random() * 800 + 600;

        setTimeout(() => {
            setIsTyping(false);
            // Basic JSX Link Parser
            if (typeof responseText === 'string' && responseText.includes('<a href=')) {
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

    // UI Components
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-white text-gray-500 rotate-90' : 'bg-gradient-to-tr from-primary to-orange-400 text-white animate-bounce-subtle'}`}
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
                <div className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-[380px] h-[650px] max-h-[75vh] bg-white rounded-[2rem] shadow-2xl border border-gray-100/50 z-50 flex flex-col overflow-hidden animate-slide-up origin-bottom-right font-sans ring-1 ring-black/5 backdrop-blur-xl">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-orange-500 p-5 pt-6 flex items-center gap-4 text-white shadow-lg relative overflow-hidden">
                        {/* Decorative Circles */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute top-12 left-12 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner relative z-10">
                            <Bot size={28} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-black text-lg tracking-wide drop-shadow-sm">PatiBot</h3>
                            <div className="flex items-center gap-1.5 opacity-90">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                                <p className="text-xs font-medium">Asistan modunda</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] scroll-smooth">
                        <div className="text-center my-4">
                            <span className="text-[10px] text-gray-400 font-medium bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">Bugün</span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in items-end gap-2 group`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary shrink-0 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                        <Bot size={18} />
                                    </div>
                                )}

                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative ${msg.sender === 'user'
                                        ? 'bg-gradient-to-br from-[#2D3436] to-[#000000] text-white rounded-br-none'
                                        : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                    <div className={`text-[9px] mt-1.5 text-right font-medium ${msg.sender === 'user' ? 'text-white/50' : 'text-gray-300'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start items-center gap-2 pl-1">
                                <div className="w-8 h-8 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                                    <div className="flex gap-0.5">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Smart Menu (Chips) */}
                    <div className="bg-white p-3 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-10">
                        <div className="flex gap-2 overflow-x-auto pb-1 px-1 no-scrollbar mask-linear-fade">
                            {menus[currentMenu]?.map((btn, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAction(btn.action)}
                                    className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 hover:bg-black hover:text-white border border-gray-100 hover:border-black text-gray-600 text-[11px] font-bold rounded-xl transition-all active:scale-95 shrink-0"
                                >
                                    {btn.icon} {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(inputText); setInputText(''); }} className="p-3 bg-white border-t border-gray-50 flex gap-2 items-center bg-white/80 backdrop-blur-sm">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Bir şeyler yazın..."
                            className="flex-1 pl-4 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 transition-all outline-none text-sm placeholder-gray-400 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="w-12 h-12 bg-primary disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg hover:shadow-primary/30 active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </form>

                </div>
            )}
        </>
    );
};

export default ChatBot;
