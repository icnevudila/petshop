import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, MousePointer2 } from 'lucide-react';
import { Campaign } from '../types';

interface HeroProps {
    campaigns: Campaign[];
}

const Hero: React.FC<HeroProps> = ({ campaigns }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const heroCampaigns = campaigns.filter(c => c.location === 'slider');

    useEffect(() => {
        if (heroCampaigns.length > 0) {
            const img = new Image();
            img.src = heroCampaigns[0].image_url;
            img.onload = () => setLoaded(true);
        }
    }, [heroCampaigns]);

    useEffect(() => {
        if (heroCampaigns.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroCampaigns.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroCampaigns.length]);

    if (heroCampaigns.length === 0) return null;

    return (
        <section className="relative z-0 h-[50vh] min-h-[350px] md:h-screen md:min-h-[600px] md:max-h-[850px] md:mt-[100px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden group flex items-center justify-center">

            {/* Loading Spinner */}
            {!loaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
            )}

            {heroCampaigns.map((campaign, index) => (
                <Link
                    key={campaign.id}
                    to={campaign.target_url || '#'}
                    className={`absolute inset-0 cursor-pointer block transition-all duration-1000 ease-in-out ${currentSlide === index
                        ? 'opacity-100 scale-100 blur-0 z-10'
                        : 'opacity-0 scale-105 blur-sm z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={campaign.image_url}
                            alt={campaign.title}
                            className="w-full h-full object-cover md:object-cover object-center transition-transform duration-[2000ms] ease-out"
                            style={{ transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)' }}
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-end md:items-center pb-16 md:pb-0">
                        <div className="container mx-auto px-4 md:px-16">
                            <div className="max-w-2xl hero-content">
                                <span className="inline-block bg-primary/90 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-3 md:mb-6 animate-fade-in-up">
                                    {index === 0 ? 'Premium Köpek Serisi' : index === 1 ? 'Özel Bakım Serisi' : 'Günlük Rutin'}
                                </span>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-3 md:mb-6 font-display animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    {campaign.title}
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl font-medium mb-6 md:mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    {campaign.description || 'En sadık dostlarımız için en iyisi.'}
                                </p>
                                <div className="btn-smooth bg-primary hover:bg-orange-600 text-white px-8 py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-primary/30 flex items-center gap-2 w-max animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    Keşfet <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={() => setCurrentSlide(prev => (prev - 1 + heroCampaigns.length) % heroCampaigns.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 z-20"
            >
                <ChevronLeft size={28} />
            </button>
            <button
                onClick={() => setCurrentSlide(prev => (prev + 1) % heroCampaigns.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 z-20"
            >
                <ChevronRight size={28} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {heroCampaigns.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-12 bg-primary' : 'w-3 bg-white/40 hover:bg-white/70'}`}
                    />
                ))}
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 animate-bounce opacity-70">
                <span className="text-[10px] text-white font-bold uppercase tracking-widest writing-mode-vertical-rl rotate-180">Kaydır</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white to-transparent"></div>
            </div>
        </section>
    );
};

export default Hero;
