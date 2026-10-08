import React from 'react';
import { Language } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onOpenBooking: () => void;
  onExploreServices: () => void;
  onExploreMaterials: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onOpenBooking,
  onExploreServices: _onExploreServices,
  onExploreMaterials,
}) => {
  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#FFCC99]/60">
      {/* Background Layer: Golden Vedic aura overlay for seamless full-page temple integration */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9]/90 via-[#FFFDF9]/70 to-[#FFFDF9]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFFDF9]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#4D2300] leading-[1.18]">
            {lang === 'kn' ? (
              <>
                ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಪೂಜಾ ವಿಧಿ ವಿಧಾನಗಳನ್ನು{' '}
                <span className="text-[#FF6A00] underline decoration-[#FFCC99]">ನಡೆಸಿಕೊಡಲಾಗುತ್ತದೆ</span>
              </>
            ) : (
              <>
                Authentic & Traditional Pooja{' '}
                <span className="text-[#FF6A00] underline decoration-[#FFCC99]">Services & Arrangements</span>
              </>
            )}
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[#663000] leading-relaxed max-w-2xl mx-auto font-medium">
            {lang === 'kn'
              ? 'ಎಲ್ಲಾ ಶುಭಕಾರ್ಯಗಳು ಹಾಗೂ ಶ್ರಾದ್ಧಾದಿ (ಅಪರ) ಕಾರ್ಯಗಳಿಗೆ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು ಮತ್ತು ಪುರೋಹಿತರನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಕಲ್ಪಿಸಿಕೊಡಲಾಗುತ್ತದೆ.'
              : 'Pooja materials and experienced purohits arranged at one place for all auspicious ceremonies and ancestral (Apara / Shraddha) rituals.'}
          </p>

          {/* Hero Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white rounded-xl text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ' : 'Book a Pooja Service'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreMaterials}
              className="px-5 py-3.5 bg-white text-[#4D2300] hover:bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-sm font-bold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FF6A00]" />
              <span>{lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳು ಖರೀದಿಸಿ' : 'Order Materials'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
