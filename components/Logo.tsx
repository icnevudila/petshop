import React from 'react';

interface LogoProps {
    className?: string; // e.g. h-16
}

const Logo: React.FC<LogoProps> = ({ className = "h-20" }) => {
    return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
            <img
                src="/logopng.png"
                alt="PatiDükkan"
                className="h-full w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
        </div>
    );
};

export default Logo;
