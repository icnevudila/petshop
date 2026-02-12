import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dealerService from '../services/dealerService';
import { Dealer } from '../types';
import {
    LayoutDashboard, Package, ShoppingCart, ClipboardList,
    User, LogOut, Menu, X, Building2, ChevronRight
} from 'lucide-react';

interface B2BLayoutProps {
    children: React.ReactNode;
}

const B2BLayout: React.FC<B2BLayoutProps> = ({ children }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const loadDealer = async () => {
            if (!currentUser) {
                navigate('/bayi/giris');
                return;
            }
            try {
                const d = await dealerService.getDealerByUserId(currentUser.id);
                if (!d) {
                    navigate('/bayi/giris');
                    return;
                }
                if (d.status !== 'approved') {
                    navigate('/bayi/giris');
                    return;
                }
                setDealer(d);
            } catch {
                navigate('/bayi/giris');
            } finally {
                setLoading(false);
            }
        };
        loadDealer();
    }, [currentUser, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/bayi/giris');
    };

    const navItems = [
        { path: '/bayi', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/bayi/katalog', label: 'Ürün Kataloğu', icon: Package },
        { path: '/bayi/sepet', label: 'Toptan Sepet', icon: ShoppingCart },
        { path: '/bayi/siparisler', label: 'Siparişlerim', icon: ClipboardList },
    ];

    const isActive = (path: string) => {
        if (path === '/bayi') return location.pathname === '/bayi';
        return location.pathname.startsWith(path);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-medium">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Top Header */}
            <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-all"
                        >
                            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <Link to="/bayi" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Building2 size={22} className="text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-white font-bold text-lg">PatiDükkan</span>
                                <span className="text-emerald-400 text-xs font-bold ml-2 bg-emerald-400/10 px-2 py-0.5 rounded-full">B2B</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {dealer && (
                            <div className="hidden md:flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-white text-sm font-semibold">{dealer.company_name}</p>
                                    <p className="text-emerald-400 text-xs">İskonto: %{dealer.discount_rate}</p>
                                </div>
                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                    <User size={18} className="text-slate-300" />
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700/50 transition-all"
                            title="Çıkış Yap"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50
          transform transition-transform duration-300 ease-in-out lg:transform-none pt-16 lg:pt-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <nav className="p-4 space-y-1">
                        {navItems.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive(path)
                                        ? 'bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/5'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                    }
                `}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                                {isActive(path) && <ChevronRight size={16} className="ml-auto" />}
                            </Link>
                        ))}
                    </nav>

                    {/* Dealer Info Card */}
                    {dealer && (
                        <div className="mx-4 mt-6 p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20">
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Bayi Bilgileri</p>
                            <p className="text-white text-sm font-semibold">{dealer.company_name}</p>
                            <p className="text-slate-400 text-xs mt-1">{dealer.city} / {dealer.district}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-slate-400 text-xs">İskonto</span>
                                <span className="text-emerald-400 font-bold text-sm">%{dealer.discount_rate}</span>
                            </div>
                        </div>
                    )}

                    {/* Back to main site */}
                    <div className="mx-4 mt-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-medium transition-all px-4 py-2"
                        >
                            ← Ana Siteye Dön
                        </Link>
                    </div>
                </aside>

                {/* Sidebar Overlay on mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default B2BLayout;
