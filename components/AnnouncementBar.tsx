
import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, Gift, Smartphone } from 'lucide-react';

const ANNOUNCEMENTS = [
    { icon: Gift, text: "İlk Siparişinize %15 İndirim • Kod: PATİ15" },
    { icon: Truck, text: "1500 TL Üzeri Siparişlerde Kargo Bedava" },
    { icon: Sparkles, text: "Tüm Kategorilerde Özel Fırsatlar" },
    { icon: Sparkles, text: "Premium Markalarda %30'a Varan İndirimler" },
];

const AnnouncementBar: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const CurrentIcon = ANNOUNCEMENTS[currentIndex].icon;

    return (
        <div className="bg-secondary/95 backdrop-blur-sm text-white text-[12px] font-semibold py-2 relative z-[1002]">
            <div className="container flex justify-center items-center">
                <div className="flex items-center gap-3 transition-all duration-500">
                    <CurrentIcon size={14} className="text-primary" />
                    <span className="tracking-wide">
                        {ANNOUNCEMENTS[currentIndex].text}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBar;
