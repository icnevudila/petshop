import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Optimized duration: 0.8s (Quick but visible)
        // This ensures the app doesn't feel sluggish
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                onFinish();
            }, 300); // Transition time
            return () => clearTimeout(timer);
        }
    }, [isExiting, onFinish]);

    // Walking path steps (optimized for speed)
    const steps = [
        { left: '10%', bottom: '10%', rotate: 45, delay: '0s' },
        { left: '30%', bottom: '25%', rotate: 30, delay: '0.1s' },
        { left: '50%', bottom: '15%', rotate: 60, delay: '0.2s' },
        { left: '70%', bottom: '35%', rotate: 45, delay: '0.3s' },
        { left: '90%', bottom: '20%', rotate: 20, delay: '0.4s' },
    ];

    return (
        <div
            className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#FCFBFA] transition-opacity duration-300 ease-out ${isExiting ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
                {/* Walking Paws Animation - Faster */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="absolute text-brand opacity-0 animate-paw-step"
                        style={{
                            left: step.left,
                            bottom: step.bottom,
                            transform: `rotate(${step.rotate}deg)`,
                            animationDelay: step.delay,
                            fontSize: '3rem',
                            color: '#ea580c',
                            zIndex: 0
                        }}
                    >
                        🐾
                    </div>
                ))}

                {/* Main Logo Container */}
                <div className="relative z-10 animate-quick-scale">
                    {/* Subtle Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-100 rounded-full animate-premium-pulse -z-10 blur-xl opacity-50"></div>
                    <img
                        src="/logo_animated.svg"
                        alt="PatiDükkan"
                        className="h-32 w-auto drop-shadow-2xl"
                    />
                </div>
            </div>

            <style>{`
                @keyframes paw-step {
                    0% { transform: scale(0.5) rotate(var(--rotate)); opacity: 0; }
                    20% { transform: scale(1.2) rotate(var(--rotate)); opacity: 0.8; }
                    100% { transform: scale(1) rotate(var(--rotate)); opacity: 0; }
                }
                
                .animate-paw-step {
                    animation: paw-step 0.5s ease-out forwards;
                }

                @keyframes quick-scale {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .animate-quick-scale {
                    animation: quick-scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                @keyframes premium-pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
                }

                .animate-premium-pulse {
                    animation: premium-pulse 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
