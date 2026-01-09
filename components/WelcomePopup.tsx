import React, { useState, useEffect } from 'react';
import { X, Gift, Mail, ArrowRight } from 'lucide-react';

const WelcomePopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Show popup after 3 seconds if not previously closed/submitted
        const hasSeenPopup = localStorage.getItem('pati_welcome_popup_seen');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('pati_welcome_popup_seen', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the email to your backend
        setIsSubmitted(true);
        setTimeout(() => {
            handleClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                {/* Left Side - Image */}
                <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-[500px]">
                    <img
                        src="/welcome-popup-2.png"
                        alt="Welcome Gift"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if image not found to a nice gradient or pattern
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('bg-orange-100');
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                        <div className="text-white">
                            <h3 className="text-2xl font-black mb-2">Pati Dostu Ailesi</h3>
                            <p className="opacity-90 font-medium">Binlerce mutlu dostumuzun arasına katılın.</p>
                        </div>
                    </div>

                    {/* Fallback pattern/content if image fails or for styling */}
                    <div className="absolute inset-0 -z-10 bg-[#FFF5EB] flex items-center justify-center">
                        <span className="text-9xl opacity-10">🐾</span>
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center text-center md:text-left bg-white relative">
                    {/* Confetti Decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
                        <span className="text-4xl">🎉</span>
                    </div>

                    {!isSubmitted ? (
                        <>
                            <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-4 text-primary font-bold uppercase tracking-widest text-xs">
                                <Gift size={16} />
                                <span>Özel Fırsat</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-secondary leading-tight mb-4">
                                Hoş Geldin <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Hediyesi!</span>
                            </h2>

                            <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                                İlk alışverişine özel <strong className="text-secondary">%15 İndirim</strong> kazanmak ister misin? E-posta adresini bırak, kodunu hemen gönderelim.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="E-posta adresiniz"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 pl-12 text-sm font-bold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    İndirim Kodumu Gönder
                                </button>
                            </form>

                            <p className="mt-6 text-xs text-gray-400 text-center">
                                *İstediğiniz zaman abonelikten çıkabilirsiniz.
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in fade-in duration-500">
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Gift size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-secondary mb-2">Harika! 🎉</h3>
                            <p className="text-gray-500 font-medium">
                                İndirim kodun e-posta adresine gönderildi. İyi alışverişler!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup;
