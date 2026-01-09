
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Merhaba! Ben PatiBot 🐾 Size nasıl yardımcı olabilirim?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    constmessagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        constmessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const generateResponse = (text: string) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('kargo') || lowerText.includes('teslimat') || lowerText.includes('kaç gün')) {
            return 'Siparişleriniz hafta içi saat 16:00\'a kadar aynı gün kargoya verilir. Teslimat süresi genellikle 1-3 iş günüdür. 🚚';
        }
        if (lowerText.includes('iade') || lowerText.includes('değişim') || lowerText.includes('geri')) {
            return 'Memnun kalmadığınız ürünleri 14 gün içinde koşulsuz iade edebilirsiniz. İade kargo kodumuz için "İade Politikası" sayfamızı ziyaret edebilirsiniz. 🔄';
        }
        if (lowerText.includes('stok') || lowerText.includes('var mı')) {
            return 'Sitemizdeki stok durumları anlık olarak güncellenmektedir. "Tükendi" yazmayan tüm ürünlerimiz stoklarımızda mevcuttur. 📦';
        }
        if (lowerText.includes('mama') || lowerText.includes('en iyi') || lowerText.includes('tavsiye')) {
            return 'Tüm mama markalarımız orijinal ve tazedir. Kediniz/Köpeğiniz için en uygun mamayı seçmek isterseniz "Canlı Destek" hattımızdan veteriner hekimimize danışabilirsiniz. 🍖';
        }
        if (lowerText.includes('iletişim') || lowerText.includes('telefon') || lowerText.includes('adres')) {
            return 'Müşteri hizmetlerimize 0850 123 45 67 numarasından ulaşabilirsiniz. Adresimiz: Kozluca Bulvarı No:29 İnegöl/Bursa. 📞';
        }
        if (lowerText.includes('merhaba') || lowerText.includes('selam')) {
            return 'Merhaba! Hoş geldiniz, size nasıl yardımcı olabilirim? 😺';
        }

        return 'Bunu tam anlayamadım ama her zaman öğreniyorum! Daha detaylı bilgi için "İletişim" sayfamızdan bize ulaşabilir veya 0850 123 45 67 numarasını arayabilirsiniz. 🐾';
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate bot thinking delay
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: generateResponse(userMsg.text),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50 hover:scale-110 ${isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-secondary text-white hover:bg-secondary-hover'}`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-40 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-slide-up origin-bottom-right" style={{ height: '500px', maxHeight: '80vh' }}>

                    {/* Header */}
                    <div className="bg-secondary p-4 flex items-center gap-3 text-white">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">PatiBot</h3>
                            <p className="text-xs text-secondary-100 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Çevrimiçi
                            </p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-700 shadow-sm rounded-bl-none border border-gray-100'
                                    }`}>
                                    {msg.text}
                                    <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Mesajınızı yazın..."
                            className="flex-1 px-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        />
                        <button
                            type="submit"
                            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 shrink-0"
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
