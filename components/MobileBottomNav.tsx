import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
    cartCount: number;
    wishlistCount: number;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ cartCount, wishlistCount }) => {
    const location = useLocation();
    const { currentUser } = useAuth();
    const isProductPage = location.pathname.startsWith('/urun/');

    if (isProductPage) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[9999] safe-area-bottom">
            <div className="flex justify-around items-center h-16 pb-safe">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <Home size={22} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Anasayfa</span>
                </NavLink>

                <NavLink
                    to="/kategori/kedi"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`
                    }
                    onClick={(e) => {
                        // Optional: If you want this to open the generic categories page or menu
                        // For now pointing to 'kedi' as a starter or a general categories page if one exists
                    }}
                >
                    <Grid size={22} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Kategoriler</span>
                </NavLink>

                <NavLink
                    to="/favoriler"
                    className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <div className="relative">
                        <Heart size={22} strokeWidth={2.5} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white">
                                {wishlistCount > 9 ? '9+' : wishlistCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold">Favorilerim</span>
                </NavLink>

                <NavLink
                    to="/sepet"
                    className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <div className="relative">
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold">Sepetim</span>
                </NavLink>

                <NavLink
                    to={currentUser ? "/hesabim" : "/giris"}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <User size={22} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Hesabım</span>
                </NavLink>
            </div>
        </div>
    );
};

export default MobileBottomNav;
