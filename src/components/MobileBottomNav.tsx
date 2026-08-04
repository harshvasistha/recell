import React from 'react';
import { Home, Smartphone, ShoppingBag, Wrench, ShieldCheck, User, Grid } from 'lucide-react';
import { TabType } from './Header';

interface MobileBottomNavProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  cartCount: number;
  openCart: () => void;
  onOpenMegaMenu: () => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  user: { name: string; phone: string; role: string } | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  openCart,
  onOpenMegaMenu,
  onOpenAuth,
  onOpenProfile,
  user
}) => {
  const navItems = [
    {
      id: 'landing' as TabType,
      label: 'Home',
      icon: Home,
      badge: null,
      color: 'text-[#0052FF]'
    },
    {
      id: 'sell' as TabType,
      label: 'Sell Phone',
      icon: Smartphone,
      badge: '60s Quote',
      color: 'text-emerald-600'
    },
    {
      id: 'buy' as TabType,
      label: 'Buy CPO',
      icon: ShoppingBag,
      badge: cartCount > 0 ? `${cartCount}` : null,
      color: 'text-indigo-600'
    },
    {
      id: 'repair' as TabType,
      label: 'Repair',
      icon: Wrench,
      badge: '₹0 Pickup',
      color: 'text-amber-600'
    },
    {
      id: user ? ('profile' as any) : ('track' as TabType),
      label: user ? 'Account' : 'Track/More',
      icon: user ? User : ShieldCheck,
      badge: user ? user.name.split(' ')[0] : null,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-1.5 font-sans">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if ((item.id as string) === 'profile') {
                  if (onOpenProfile) onOpenProfile();
                  else onOpenAuth();
                } else if (item.id === 'buy' && cartCount > 0 && isActive) {
                  openCart();
                } else {
                  setCurrentTab(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer min-h-[48px] ${
                isActive
                  ? 'text-[#0052FF] font-extrabold scale-105'
                  : 'text-slate-500 font-medium hover:text-slate-900'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 bg-[#0052FF] rounded-full shadow-xs animate-fadeIn"></span>
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-2'
                  }`}
                />

                {/* Badge if present */}
                {item.badge && (
                  <span
                    className={`absolute -top-2 -right-3 text-[9px] font-black font-mono px-1.5 py-0.2 rounded-full border shadow-2xs ${
                      item.id === 'buy' && cartCount > 0
                        ? 'bg-[#0052FF] text-white border-blue-400 animate-bounce'
                        : item.id === 'sell'
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-amber-500 text-slate-950 border-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-full font-heading ${
                isActive ? 'font-black text-[#0052FF]' : 'font-semibold text-slate-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
