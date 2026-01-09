
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronRight, CornerDownRight, Smile, Briefcase, HelpCircle, User, Truck, CreditCard, ShoppingBag, HeartPulse, Search, Sparkles, AlertTriangle, Fish, Bird, Rat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
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

type ConversationState =
    | 'IDLE'
    | 'WAITING_ORDER_ID'
    | 'RECOMMEND_START'
    | 'RECOMMEND_CAT_AGE'
    | 'RECOMMEND_DOG_SIZE'
    | 'RECOMMEND_BIRD_TYPE'
    | 'NAME_GENERATOR_TYPE'
    | 'BMI_CALC_WEIGHT'
    | 'BMI_CALC_TYPE';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Merhaba! Ben PatiBot 🧠\nPetShop dünyasının en kapsamlı yapay zeka asistanıyım. \n\n🦸‍♂️ **Neler Yapabilirim?**\n• En uygun mamayı seçebilirim.\n• Siparişini saniyeler içinde bulabilirim.\n• Minik dostuna isim bulabilirim.\n• Sağlık ve bakım tavsiyeleri verebilirim.\n\nNasıl yardımcı olmamı istersin?',
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

    // --- UBER KNOWLEDGE BASE (ENCYCLOPEDIA) ---
    const knowledgeBase = [
        // --- KEDİ (CATS) ---
        { keywords: ['kedi maması', 'kedi yemi'], response: 'Kediniz için en lezzetli mamalar bizde! 🐱 <a href="/kategori/kedi" class="underline font-bold">Kedi Kategorisine Git</a>' },
        { keywords: ['kısır kedi', 'sterilised'], response: 'Kısırlaştırılmış kediler kilo almaya meyillidir. Yağ oranı düşük, L-karnitin içeren mamalar öneriyoruz. 🏥 <a href="/kategori/kedi?q=kisir" class="underline font-bold">Kısır Kedi Mamaları</a>' },
        { keywords: ['tüy döküyor', 'tüy dökülmesi', 'dökülme'], response: 'Mevsimsel geçişlerde normaldir ancak aşırıysa Biotin ve Çinko eksikliği olabilir. "Derma" içeren mamalar veya somon yağı takviyesi kullanmanızı öneririm. Ayrıca furminator taraklarımız harikadır! 🧶' },
        { keywords: ['malt', 'kusma', 'tüy yumağı'], response: 'Kediniz tüy yutuyorsa mutlaka Malt Macunu kullanmalısınız. Haftada 2-3 kez nohut büyüklüğünde vermeniz sindirimi rahatlatır.' },
        { keywords: ['kedi kumu', 'bentonit', 'silika', 'pelet'], response: 'Kum seçimi önemlidir! 🚽\n• **Bentonit:** Topaklaşır, kokuyu hapseder.\n• **Silika:** Uzun ömürlüdür, emicidir.\n• **Pelet:** %100 doğaldır, toz yapmaz.' },
        { keywords: ['kedi otu', 'catnip'], response: 'Kediniz stresliyse veya oyuna ilgisizse Kedi Otu (Catnip) harika bir çözüm! Oyuncakların üzerine sıkabilir veya serpebilirsiniz. 🌿' },

        // --- KÖPEK (DOGS) ---
        { keywords: ['köpek maması', 'proplan', 'acana', 'royal canin'], response: 'Sadık dostlarımız için premium markalarımız var: Acana, Orijen, ProPlan, Royal Canin, N&D. Hepsi taze, hepsi orijinal! 🐶 <a href="/kategori/kopek" class="underline font-bold">Mamaları Gör</a>' },
        { keywords: ['yavru köpek', 'puppy'], response: 'Yavru köpekler (0-12 ay) için protein ve yağ oranı yüksek "Puppy" mamalar şarttır. Kemik gelişimi için Glukozamin destekli olanları tercih edebilirsiniz. 🍼' },
        { keywords: ['tahılsız', 'grain free', 'alerji'], response: 'Dostunuz sürekli kaşınıyorsa tahıl alerjisi olabilir. Tahılsız (Somonlu veya Kuzulu) mamalarımızı denemenizi şiddetle öneririm. 🥩' },
        { keywords: ['ödül', 'kemik', 'bisküvi'], response: 'Eğitimde başarının sırrı lezzetli ödüllerde! 🍖 Diş temizliği için pres kemikler, eğitim için küçük yumuşak ödüller tercih edin.' },
        { keywords: ['tasma', 'gezdirme'], response: 'Otomatik (flexi) tasmalar mı yoksa göğüs tasmaları mı? Çekiştiren köpekler için göğüs tasması daha sağlıklıdır, boyun zedelenmesini önler. 🐕‍🦺' },

        // --- KUŞ (BIRDS) ---
        { keywords: ['kuş', 'muhabbet', 'papağan', 'kanarya'], response: 'Kanatlı dostlarımız için vitamin destekli yemler ve geniş kafesler önemli. 🦜 <a href="/kategori/kus" class="underline font-bold">Kuş Ürünleri</a>' },
        { keywords: ['konuşturma', 'konuşur'], response: 'Kuşunuzu konuşturmak istiyorsanız sabırlı olmalısınız! "Konuşturma Yemi" olarak satılan ballı krakerler enerji verir ve ilgisini artırır. Ayrıca ayna kullanmak bazen dikkati dağıtabilir, dikkat!' },
        { keywords: ['gaga taşı', 'kalamar'], response: 'Kuşların gaga gelişimi ve kalsiyum ihtiyacı için Kafeslerinde mutlaka Gaga Taşı veya Kalamar Kemiği bulundurmalısınız.' },

        // --- BALIK (FISH) ---
        { keywords: ['balık', 'yem', 'akvaryum'], response: 'Sualtı dünyası için filtreler, ısıtıcılar ve özel yemler burada! 🐠 <a href="/kategori/balik" class="underline font-bold">Akvaryum Dünyası</a>' },
        { keywords: ['suyum bulanık', 'bulanıklık'], response: 'Akvaryum suyu bulanıksa bakteri dengesi oturmamış olabilir. Suyu %20 değiştirin ve "Bakteri Kültürü" ekleyin. Filtreyi musluk suyunda DEĞİL, akvaryumdan aldığınız suda yıkayın.' },
        { keywords: ['beyaz benek', 'hastalık'], response: 'Balığınızın üzerinde tuz tanesi gibi beyaz noktalar varsa "Beyaz Benek" parazitidir. Isıyı kademeli 28-30 dereceye çıkarıp, Metilen Mavisi ilacı kullanmalısınız. 🌡️' },

        // --- GENEL SAĞLIK ---
        { keywords: ['pire', 'kene', 'bit'], response: 'Dış parazitler çok can sıkıcıdır! Ense damlası en etkili çözümdür. Ayrıca koruyucu tasmalar ve spreyler de mevcuttur. Evi de süpürmeyi unutmayın! 🦠' },
        { keywords: ['aşı', 'veteriner'], response: 'Biz sadece bakım ürünleri satıyoruz. Aşı ve tıbbi müdahaleler için mutlaka Veteriner Hekiminize başvurmalısınız. Sağlık şakaya gelmez! ⚕️' },
        { keywords: ['vitamin', 'takviye'], response: 'Bağışıklık güçlendirici Multivitaminler, eklem için Glukozamin, tüy için Biotin... Hepsi mağazamızda mevcut. Özellikle mevsim geçişlerinde önerilir. 💊' },

        // --- MAĞAZA & KARGO ---
        { keywords: ['kargo ücreti', 'kargo ne kadar'], response: '📦 **Kargo Politikamız:**\n500 TL üzeri alışverişler **ÜCRETSİZ!**\n500 TL altı için sabit ücret **50 TL**\'dir.' },
        { keywords: ['iade', 'değişim'], response: 'Memnun kalmazsanız **14 gün** içinde ücretsiz iade hakkınız var. Ürün açılmamış olmalı. Hesabım panelinden kod alıp Yurtiçi Kargo\'ya verebilirsiniz. 🔄' },
        { keywords: ['kapıda ödeme', 'nakit'], response: 'Maalesef kapıda ödeme seçeneğimiz yoktur. Kredi kartı, Banka kartı veya Havale/EFT ile %100 güvenli ödeme yapabilirsiniz. 💳' },
        { keywords: ['yeriniz', 'adres', 'konum'], response: 'Bursa İnegöl\'deyiz! 📍\nAdres: Ertuğrulgazi Mah. Kozluca Bulvarı No:29 (Şımarık AVM Yanı). Çayımızı içmeye bekleriz! ☕' },

        // --- EĞLENCE & EXTRA ---
        { keywords: ['teşekkür', 'sağol', 'tşk', 'adamsın'], response: 'Rica ederim! 🧡 Minik dostunuza benden bir pati selamı iletin! 🐾 Harika bir gün dilerim.' },
        { keywords: ['sen kimsin', 'nesin', 'bot musun'], response: 'Ben PatiBot! 🤖 Kodlarım sevgi ve mama ile yazıldı. 7/24 hizmetinizdeyim, hiç uyumam (belki sunucu bakımı hariç 😴).' },
        { keywords: ['şaka', 'fikra', 'komik'], response: 'İki kedi konuşuyormuş. Biri diğerine "Miyav" demiş. Diğeri de "Miyav miyav" demiş. İlki şaşırmış: "Oooo, sen İngilizce de mi biliyordun?" 😹 (Bot mizahı bu kadar oluyor, idare edin!)' }
    ];

    // --- MENUS ---
    const menus: Record<string, QuickAction[]> = {
        main: [
            { label: '📦 Sipariş Durumu', action: 'start_tracking', icon: <Search size={14} /> },
            { label: '🍖 Mama Uzmanı', action: 'start_recommendation', icon: <Bot size={14} /> },
            { label: '✨ İsim Bulucu', action: 'start_name_generator', icon: <Sparkles size={14} /> },
            { label: '🚚 Kargo & İade', action: 'menu_kargo', icon: <Truck size={14} /> },
            { label: '📍 İletişim', action: 'info_adres', icon: <Briefcase size={14} /> }
        ],
        menu_kargo: [
            { label: 'Ücretler', action: 'info_kargo_ucret' },
            { label: 'İade Koşulları', action: 'info_iade' },
            { label: 'Ödeme Yöntemleri', action: 'info_odeme' },
            { label: '🔙 Ana Menü', action: 'menu_main', icon: <CornerDownRight size={14} /> }
        ]
    };

    // --- LOGIC HANDLERS ---
    const handleAction = (action: string) => {
        if (menus[action]) {
            setCurrentMenu(action);
            return;
        }
        if (action === 'menu_main') {
            setCurrentMenu('main');
            setConversationState('IDLE');
            return;
        }

        // --- Complex Utilities Handlers ---
        if (action === 'start_tracking') {
            setConversationState('WAITING_ORDER_ID');
            addMessage('user', 'Siparişimi sorgulamak istiyorum.');
            simulateTyping('Lütfen 10 haneli sipariş numaranızı yazar mısınız? 📄');
            return;
        }

        if (action === 'start_recommendation') {
            setConversationState('RECOMMEND_START');
            addMessage('user', 'Mama tavsiyesi istiyorum.');
            simulateTyping('Tabii ki! Hangi dostumuz için mama bakıyoruz? 🐾\n(Lütfen yazın: "Kedi", "Köpek", "Kuş"...)');
            return;
        }

        if (action === 'start_name_generator') {
            setConversationState('NAME_GENERATOR_TYPE');
            addMessage('user', 'Evcil hayvanıma isim arıyorum.');
            simulateTyping('Çok heyecanlı! 🎉 İsim babası/annesi olmak isterim. Dostumuzun türü ve cinsiyeti ne? (Örn: "Erkek Kedi", "Dişi Köpek", "Kuş")');
            return;
        }

        // --- Static Info Handlers ---
        let response = '';
        let userMsg = '';

        switch (action) {
            case 'info_kargo_ucret':
                userMsg = 'Kargo ücretleri nedir?';
                response = '📦 **Kargo Bilgisi**\n• 500 TL Üzeri: **BEDAVA**\n• 500 TL Altı: **50 TL**\n• Firma: Yurtiçi Kargo\n• Süre: Genelde 24 saat içinde kargoda.';
                break;
            case 'info_iade':
                userMsg = 'İade koşulları?';
                response = '🛡️ **İade Garantisi**\n14 gün içinde, ambalajı açılmamış ürünleri ücretsiz iade edebilirsiniz. Hesabım sayfasından kolayca iade kodu oluşturabilirsiniz.';
                break;
            case 'info_odeme':
                userMsg = 'Nasıl ödeyebilirim?';
                response = '💳 **Ödeme Yöntemleri**\n• Kredi Kartı (12 Taksit)\n• Banka Kartı\n• Havale / EFT\n⚠️ Kapıda ödeme yoktur.';
                break;
            case 'info_adres':
                userMsg = 'Adresiniz nerede?';
                response = '📍 **Mağaza Konumu**\nErtuğrulgazi Mah. Kozluca Bulvarı No:29 İnegöl/BURSA.\n⏰ 09:00 - 22:00 (Her gün)';
                break;
        }

        if (userMsg) addMessage('user', userMsg);
        if (response) simulateBotResponse(response);
    };

    const processConversationState = (text: string) => {
        const lower = text.toLowerCase();

        // --- ORDER TRACKING ---
        if (conversationState === 'WAITING_ORDER_ID') {
            if (text.length >= 5 && !isNaN(Number(text.replace(/\D/g, '')))) {
                simulateBotResponse(`🔍 **#${text}** numaralı siparişin durumu:\n\n🚀 **TRANSFER MERKEZİNDE**\n📅 Tahmini Teslim: Yarın\n📦 Kargo: Yurtiçi Kargo\n\nKargonuz yola çıkmış, sabırsızlıkla sizi bekliyor!`);
                setConversationState('IDLE');
            } else {
                simulateBotResponse('Hmm, bu numara sistemimizde görünmüyor. Lütfen sipariş numaranızı kontrol edip tekrar yazar mısınız? Harf girmeden sadece rakam.');
            }
            return;
        }

        // --- RECOMMENDATION ENGINE ---
        if (conversationState === 'RECOMMEND_START') {
            if (lower.includes('kedi')) {
                setConversationState('RECOMMEND_CAT_AGE');
                simulateBotResponse('Süper! 😺 Peki bu minik kaplan kaç yaşında?\n1. Yavru (0-12 ay)\n2. Yetişkin (1-7 yaş)\n3. Yaşlı (7+ yaş)');
            } else if (lower.includes('köpek')) {
                setConversationState('RECOMMEND_DOG_SIZE');
                simulateBotResponse('Harika! 🐶 Peki bu yakışıklının/güzelin boyutu nedir?\n1. Küçük Irk (Small)\n2. Orta Irk (Medium)\n3. Büyük Irk (Large)');
            } else if (lower.includes('kuş')) {
                simulateBotResponse('Kanatlı dostlarımız çok hassastır. 🦜\nMuhabbet kuşu için: **Gold Wings Premium**\nPapağan için: **Versele Laga**\nKanarya için: **Vitakraft** öneririm. <a href="/kategori/kus" class="underline font-bold">Kuş Yemleri</a>');
                setConversationState('IDLE');
            } else {
                simulateBotResponse('Lütfen kedi, köpek veya kuş olduğunu belirtir misiniz?');
            }
            return;
        }

        if (conversationState === 'RECOMMEND_CAT_AGE') {
            if (lower.includes('yavru') || lower.includes('bebek')) {
                simulateBotResponse('🍼 **Yavru Kedi Tavsiyesi:**\nYüksek protein şart! **Royal Canin Mother & Babycat** veya **ProPlan Kitten** mükemmel tercihlerdir. Bağışıklık sistemi için harikalar yaratır.');
            } else if (lower.includes('kısır') || lower.includes('steril')) {
                simulateBotResponse('✂️ **Kısır Kedi Tavsiyesi:**\nKilo kontrolü önemli. **N&D Balkabaklı Kısır** veya **La Vital Sterilised** en çok satanlarımızdan. Hem lezzetli hem dengeli!');
            } else {
                simulateBotResponse('🍗 **Yetişkin Kedi Tavsiyesi:**\nGurme kediler için **Acana Grasslands** veya **Felicia Somonlu** mamaları kedilerin favorisidir. Tüy sağlığına da iyi gelir.');
            }
            setConversationState('IDLE');
            return;
        }

        if (conversationState === 'RECOMMEND_DOG_SIZE') {
            simulateBotResponse('🐕 **Köpek Maması Tavsiyem:**\n\nSeçtiğiniz boyuta özel taneli mamalar kullanmanız diş sağlığı için önemlidir. **ProPlan Duo Delight** veya **Acana Heritage** serisine göz atmanızı öneririm. İçeriğinde Glukozamin olmasına dikkat ediyoruz!\n\n<a href="/kategori/kopek" class="font-bold underline">Önerilen Ürünleri İncele</a>');
            setConversationState('IDLE');
            return;
        }

        // --- NAME GENERATOR ---
        if (conversationState === 'NAME_GENERATOR_TYPE') {
            const names: any = {
                cat_male: ['Duman', 'Şerbet', 'Pati', 'Gölge', 'Mars', 'Zeus', 'Lokum', 'Paşa'],
                cat_female: ['Pamuk', 'Luna', 'Mia', 'Prenses', 'Boncuk', 'Tarçın', 'Maya'],
                dog_male: ['Max', 'Rocky', 'Thor', 'Odin', 'Barney', 'Cooper', 'Hektor'],
                dog_female: ['Bella', 'Daisy', 'Lola', 'Karamel', 'Zeytin', 'Fıstık']
            };

            let suggested = [];

            if (lower.includes('kedi')) {
                suggested = lower.includes('dişi') || lower.includes('kız') ? names.cat_female : names.cat_male;
            } else if (lower.includes('köpek')) {
                suggested = lower.includes('dişi') || lower.includes('kız') ? names.dog_female : names.dog_male;
            } else {
                suggested = ['Boncuk', 'Maviş', 'Limon', 'Fıstık', 'Çiko', 'Pamuk']; // Birds/General
            }

            // Pick 3 random
            const shuffled = suggested.sort(() => 0.5 - Math.random()).slice(0, 3);

            simulateBotResponse(`✨ Nasıl fikirler:\n\n1. **${shuffled[0]}**\n2. **${shuffled[1]}**\n3. **${shuffled[2]}**\n\nBeğendin mi? Yoksa "tekrar" yazarsan yenilerini bulabilirim!`);

            if (!lower.includes('tekrar')) {
                setConversationState('IDLE');
            }
            return;
        }

        // --- GENERAL FALLBACK SEARCH ---
        const found = knowledgeBase.find(kb => kb.keywords.some(k => lower.includes(k)));
        if (found) {
            simulateBotResponse(found.response);
            return;
        }

        // Final Generic Fallback
        simulateBotResponse('Bunu tam anlamadım 🥺 Daha basit sorabilir misin? Mesela "Kedi maması öner", "Kargo ne kadar" veya "İade nasıl yapılır" gibi.');
    };

    const addMessage = (sender: 'user' | 'bot', text: string | React.ReactNode) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date()
        }]);
    };

    const simulateTyping = (responseText: string) => {
        simulateBotResponse(responseText);
    }

    const simulateBotResponse = (responseText: string) => {
        setIsTyping(true);
        const delay = Math.random() * 800 + 800; // Realistic delay

        setTimeout(() => {
            setIsTyping(false);
            // Link Parser
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        addMessage('user', inputText);

        if (conversationState !== 'IDLE') {
            processConversationState(inputText);
        } else {
            // Direct KB Search
            const lower = inputText.toLowerCase();
            const found = knowledgeBase.find(kb => kb.keywords.some(k => lower.includes(k)));

            if (found) {
                simulateBotResponse(found.response);
            } else {
                // Check State Triggers
                if (lower.includes('isim')) {
                    setConversationState('NAME_GENERATOR_TYPE');
                    simulateBotResponse('İsim mi arıyoruz? Süper! Kedi mi köpek mi, cinsiyeti ne?');
                } else if (lower.includes('sorgula') || lower.includes('takip')) {
                    setConversationState('WAITING_ORDER_ID');
                    simulateBotResponse('Lütfen sipariş numaranızı giriniz:');
                } else {
                    processConversationState(inputText); // Fallback to process which handles default
                }
            }
        }
        setInputText('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-white text-gray-500 rotate-90 ring-2 ring-gray-100' : 'bg-gradient-to-tr from-orange-500 to-red-500 text-white animate-bounce-subtle'}`}
            >
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageCircle size={32} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-400 border-2 border-orange-500"></span>
                        </span>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-4 md:right-8 w-[92vw] md:w-[400px] h-[700px] max-h-[80vh] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-slide-up origin-bottom-right font-sans ring-1 ring-black/5">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-5 pt-6 flex items-center gap-4 text-white shadow-lg relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                            <Bot size={28} className="text-orange-400" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-black text-xl tracking-tight text-white">PatiBot <span className="text-orange-400">Pro</span></h3>
                            <div className="flex items-center gap-1.5 opacity-80">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                                <p className="text-[10px] uppercase tracking-widest font-bold">Canlı & Hazır</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f8fafc] scroll-smooth">

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in items-end gap-3 group px-1`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 mb-6 shadow-sm border border-orange-200">
                                        <Bot size={16} />
                                    </div>
                                )}

                                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm relative transition-all duration-200 hover:shadow-md ${msg.sender === 'user'
                                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                    <div className={`text-[10px] mt-2 text-right font-medium ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-300'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start items-center gap-3 pl-2">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <span className="animate-pulse">...</span>
                                </div>
                                <div className="text-xs text-gray-400 font-medium">Yanıt yazılıyor...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Smart Menu (Chips) */}
                    <div className="bg-white/80 backdrop-blur-md p-3 border-t border-gray-100 z-10">
                        <div className="flex gap-2 overflow-x-auto pb-1 px-1 no-scrollbar mask-linear-fade">
                            {menus[currentMenu]?.map((btn, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAction(btn.action)}
                                    className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-500 hover:text-orange-600 text-gray-600 text-[11px] font-bold rounded-xl transition-all active:scale-95 shrink-0 shadow-sm"
                                >
                                    {btn.icon} {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-50 flex gap-2 items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Mesajınızı buraya yazın..."
                            className="flex-1 pl-5 pr-4 py-3.5 bg-gray-50 rounded-2xl border-none focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all outline-none text-sm placeholder-gray-400 font-medium text-gray-700"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="w-12 h-12 bg-gray-900 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
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
