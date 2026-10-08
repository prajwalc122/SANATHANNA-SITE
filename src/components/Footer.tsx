import React from 'react';
import { Language, PageRoute } from '../types';
import { CONTACT_INFO, SOUTH_INDIAN_CULTURE_BG, DEITY_LOGO } from '../data/poojaData';
import { ArrowUp, Phone, MapPin, ShieldCheck, Heart, Mail, User } from 'lucide-react';
import { scrollToSection } from '../utils/scrollUtils';

interface FooterProps {
  lang: Language;
  onNavigate?: (page: PageRoute) => void;
  onOpenAdmin?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate, onOpenAdmin, onOpenPrivacy, onOpenTerms }) => {
  const scrollToTop = () => {
    scrollToSection('top');
  };

  const handleLinkClick = (page: PageRoute) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page;
      scrollToSection(page);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#381900] text-[#FFE5CC] pt-16 pb-8 border-t border-[#542600]">
      {/* Background South Indian Cultural Heritage Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src={SOUTH_INDIAN_CULTURE_BG}
          alt="South Indian cultural heritage"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#381900] via-[#381900]/90 to-[#381900]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-[#FFD1A4]/90">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#FF9933]/50 shrink-0 bg-[#2D1000] ring-1 ring-[#FF9933]/40">
                <img
                  src={DEITY_LOGO}
                  alt="Divine Deity Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                {lang === 'kn' ? 'ಸನಾತನ' : 'Sanaatana'}
              </span>
            </div>
            <p className="leading-relaxed text-[#FFCC99]">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ಪೂಜೆಗೆ ಬೇಕಾದ ಸೇವೆಗಳು ಮತ್ತು ಸಾಮಗ್ರಿಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಪಡೆಯಿರಿ.'
                : 'Get all required services and authentic materials for your poojas in one reliable place.'}
            </p>
          </div>

          {/* Pooja Services Links */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಳು' : 'Services'}
            </span>
            <ul className="space-y-1.5">
              <li><a href="#services" onClick={handleLinkClick('services')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಗಣೇಶ ಪೂಜೆ' : 'Ganesha Pooja'}</a></li>
              <li><a href="#services" onClick={handleLinkClick('services')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಲಕ್ಷ್ಮೀ ಪೂಜೆ' : 'Lakshmi Pooja'}</a></li>
              <li><a href="#services" onClick={handleLinkClick('services')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಶಿವ ಪೂಜೆ & ಅಭಿಷೇಕ' : 'Shiva Pooja'}</a></li>
              <li><a href="#services" onClick={handleLinkClick('services')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಗೃಹಪ್ರವೇಶ ಮಹಾಪೂಜೆ' : 'Gruhapravesha'}</a></li>
              <li><a href="#services" onClick={handleLinkClick('services')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಸತ್ಯನಾರಾಯಣ ವ್ರತ' : 'Satyanarayana Vrata'}</a></li>
            </ul>
          </div>

          {/* Materials & Process */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              {lang === 'kn' ? 'ನಮ್ಮ ಸೇವೆಗಳು' : 'Quick Links'}
            </span>
            <ul className="space-y-1.5">
              <li><a href="#materials" onClick={handleLinkClick('materials')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು' : 'Pooja Materials'}</a></li>
              <li><a href="#catalog" onClick={handleLinkClick('catalog')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಕ್ಯಾಟಲಾಗ್' : 'Catalog'}</a></li>
              <li><a href="#home" onClick={handleLinkClick('home')} className="hover:text-white transition-colors">{lang === 'kn' ? 'ಪುರೋಹಿತರ ಸೇವೆ' : 'Purohit Network'}</a></li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-white transition-colors text-[#FFB366] font-bold flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFB366]" />
                    <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರವೇಶ (Admin Portal)' : 'Admin Portal'}</span>
                  </button>
                </li>
              )}
              {onOpenPrivacy && (
                <li>
                  <button
                    onClick={onOpenPrivacy}
                    className="hover:text-white transition-colors text-xs cursor-pointer"
                  >
                    {lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ (Privacy Policy)' : 'Privacy Policy'}
                  </button>
                </li>
              )}
              {onOpenTerms && (
                <li>
                  <button
                    onClick={onOpenTerms}
                    className="hover:text-white transition-colors text-xs cursor-pointer"
                  >
                    {lang === 'kn' ? 'ಸೇವಾ ನಿಯಮಗಳು (Terms)' : 'Terms of Service'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              {lang === 'kn' ? 'ಸಂಪರ್ಕ & ವಿಳಾಸ' : 'Contact & Sanctuary'}
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-[#FFE5CC] font-bold">
                <User className="w-3.5 h-3.5 text-[#FFB366] shrink-0" />
                <span>{lang === 'kn' ? 'ರಾಮಚಂದ್ರ ಎಂ' : 'Ramachandra M'}</span>
              </li>
              <li className="flex items-center gap-2 text-white font-bold">
                <Phone className="w-3.5 h-3.5 text-[#FFB366] shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-[#FFB366] transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#FFCC99]">
                <Mail className="w-3.5 h-3.5 text-[#FFB366] shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors break-all">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#FFCC99]">
                <MapPin className="w-3.5 h-3.5 text-[#FFB366] shrink-0 mt-0.5" />
                <span>{lang === 'kn' ? CONTACT_INFO.locationKn : CONTACT_INFO.locationEn}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-[#663000] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FFCC99]/80">
          <div className="flex items-center flex-wrap gap-2">
            <span>© 2026 {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆ. ನಿಮ್ಮ ಪೂಜೆ • ನಮ್ಮ ಜವಾಬ್ದಾರಿ.' : 'Pooja Seve. Devotion • Faith • Dedication.'}</span>
            {onOpenPrivacy && (
              <button
                onClick={onOpenPrivacy}
                className="text-[#FFD1A4] hover:text-white underline text-[10px] cursor-pointer"
              >
                {lang === 'kn' ? 'ಗೌಪ್ಯತೆ' : 'Privacy'}
              </button>
            )}
            <span>•</span>
            {onOpenTerms && (
              <button
                onClick={onOpenTerms}
                className="text-[#FFD1A4] hover:text-white underline text-[10px] cursor-pointer"
              >
                {lang === 'kn' ? 'ನಿಯಮಗಳು' : 'Terms'}
              </button>
            )}
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-[#FFB366] hover:text-white underline text-[10px] cursor-pointer"
                  title="Admin Control Center"
                >
                  [{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್' : 'Admin Login'}]
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-1.5 bg-[#663000] hover:bg-[#803C00] text-[#FFD1A4] rounded-md transition-colors cursor-pointer"
              title="Return to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
