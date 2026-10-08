import React, { useState } from 'react';
import { Language, PageRoute } from '../types';
import { ShoppingBag, Globe, Menu, X, ShieldCheck } from 'lucide-react';
import { DEITY_LOGO } from '../data/poojaData';
import { scrollToSection } from '../utils/scrollUtils';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  ordersCount: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenOrders,
  ordersCount,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { page: PageRoute; labelKn: string; labelEn: string; badge?: string }[] = [
    { page: 'home', labelKn: 'ಮುಖಪುಟ', labelEn: 'Home' },
    { page: 'catalog', labelKn: 'ಕ್ಯಾಟಲಾಗ್', labelEn: 'Catalog', badge: '320+' },
    { page: 'services', labelKn: 'ಪೂಜಾ ಸೇವೆಗಳು', labelEn: 'Services' },
    { page: 'materials', labelKn: 'ಸಾಮಗ್ರಿಗಳು', labelEn: 'Materials Store' },
    { page: 'booking', labelKn: 'ಪುರೋಹಿತರ ಬುಕಿಂಗ್', labelEn: 'Book Purohit' },
    { page: 'contact', labelKn: 'ಸಂಪರ್ಕ', labelEn: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#FFCC99] transition-colors">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#CC5500] to-[#FF6A00] text-white text-xs py-1 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-3">
        <span>
          {lang === 'kn'
            ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜಾ ಸೇವೆಗಳು & ಶುದ್ಧ ಸಾಮಗ್ರಿಗಳು — ಶಿವಮೊಗ್ಗ & ಕರ್ನಾಟಕ'
            : 'Authentic Traditional Pooja Services & Materials — Shivamogga & Across Karnataka'}
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onNavigate('home');
              scrollToSection('home');
            }}
            className="flex items-center gap-2.5 text-decoration-none group cursor-pointer text-left"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-[#FF9933]/60 shadow-md shrink-0 bg-[#3D1200] ring-2 ring-[#FF9933]/40">
              <img
                src={DEITY_LOGO}
                alt="Divine Deity Emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#4D2300] group-hover:text-[#CC5500] transition-colors">
                {lang === 'kn' ? 'ಸನಾತನ' : 'Sanaatana'}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#994700] font-bold -mt-0.5">
                {lang === 'kn' ? 'ಭಕ್ತಿ • ಶ್ರದ್ಧೆ • ಸಮರ್ಪಣೆ' : 'Devotion • Faith • Dedication'}
              </span>
            </div>
          </button>
        </div>

        {/* Clean Nav Links with Active Indicator */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                }}
                className={`relative px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#FFE5CC] text-[#CC5500] shadow-2xs'
                    : 'text-[#4D2300] hover:text-[#FF6A00] hover:bg-[#FFF0E0]'
                }`}
              >
                <span>{lang === 'kn' ? item.labelKn : item.labelEn}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 bg-[#CC5500] text-white text-[9px] font-mono font-black rounded-full shadow-2xs animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone: Language Toggle, Bell, Orders, Cart, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFE5CC] hover:bg-[#FFD9B3] text-[#4D2300] rounded-xl border border-[#FFCC99] text-xs font-bold transition-colors cursor-pointer"
            title="Switch Language (ಕನ್ನಡ / English)"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>{lang === 'kn' ? 'EN' : 'ಕನ್ನಡ'}</span>
          </button>

          {/* Admin Portal Button */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#994700] hover:text-[#CC5500] hover:bg-[#FFE5CC] rounded-xl transition-colors cursor-pointer relative"
              title={lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರವೇಶ / Admin Portal' : 'Admin Portal & Control Center'}
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-[#CC5500]" />
            </button>
          )}

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#4D2300] text-white hover:bg-[#331700] rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#FFB366]" />
            <span className="tabular-nums font-bold text-[#FFB366]">{cartCount}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#4D2300] hover:bg-[#FFE5CC] rounded-xl lg:hidden transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#FFCC99] px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setTimeout(() => {
                  onNavigate(item.page);
                }, 50);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentPage === item.page
                  ? 'bg-[#FFE5CC] text-[#CC5500]'
                  : 'text-[#4D2300] hover:bg-[#FFF0E0]'
              }`}
            >
              {lang === 'kn' ? item.labelKn : item.labelEn}
            </button>
          ))}

          {onOpenAdmin && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#CC5500] hover:bg-[#FFE5CC] transition-colors cursor-pointer flex items-center gap-2 border-t border-[#FFE5CC] mt-2 pt-2.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರವೇಶ (Admin Portal)' : 'Admin Portal'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
