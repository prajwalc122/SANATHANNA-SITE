import React from 'react';
import { Language } from '../types';
import { TRUST_PILLARS, WORK_PROCESS, CONTACT_INFO, INDIAN_CULTURE_BG } from '../data/poojaData';
import { ShieldCheck, Clock, HeartHandshake, CheckCircle2, Phone, Sparkles, ArrowRight } from 'lucide-react';

interface ProcessAndTrustSectionProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const ProcessAndTrustSection: React.FC<ProcessAndTrustSectionProps> = ({
  lang,
  onOpenBooking,
}) => {
  return (
    <div>
      {/* 1. Trust Pillars Strip */}
      <section className="bg-white border-y border-[#FFCC99]/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {TRUST_PILLARS.map((pillar, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0">
                  {idx === 0 && <ShieldCheck className="w-5 h-5" />}
                  {idx === 1 && <Clock className="w-5 h-5" />}
                  {idx === 2 && <HeartHandshake className="w-5 h-5" />}
                  {idx === 3 && <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <strong className="block text-xs sm:text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? pillar.titleKn : pillar.titleEn}
                  </strong>
                  <span className="text-[11px] text-[#994700]">
                    {lang === 'kn' ? pillar.subKn : pillar.subEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Simple Process / How It Works */}
      <section id="process" className="py-14 sm:py-20 bg-[#FFF8F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'ಸರಳ ವಿಧಾನ' : 'Simple Process'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?' : 'How It Works?'}
            </h2>

            <p className="text-xs sm:text-sm text-[#994700]">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ಪೂಜಾ ಸೇವೆಯನ್ನು ಪಡೆಯುವುದು ತುಂಬಾ ಸರಳ.'
                : 'Getting your pooja services organized is very simple and seamless.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORK_PROCESS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-[#FFCC99] p-6 relative hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-serif font-black text-[#FF6A00]/25 mb-2">
                  {item.step}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#4D2300] mb-1.5">
                  {lang === 'kn' ? item.titleKn : item.titleEn}
                </h3>

                <p className="text-xs text-[#8C4700] leading-relaxed">
                  {lang === 'kn' ? item.descKn : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA Contact Section with Indian Cultural Heritage Background */}
      <section id="contact" className="relative overflow-hidden py-16 bg-[#993D00] text-white">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <img
            src={INDIAN_CULTURE_BG}
            alt="Indian cultural heritage"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#993D00] via-[#993D00]/75 to-[#CC5500]/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs uppercase tracking-widest text-[#FFE5CC] font-bold block">
            {lang === 'kn' ? 'ನೇರ ಸಂಪರ್ಕ & ಸಹಾಯವಾಣಿ' : 'Direct Helpline & Inquiries'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
            {lang === 'kn'
              ? 'ಪೂಜಾ ಸೇವೆಗಾಗಿ ಇಂದೇ ಸಂಪರ್ಕಿಸಿ'
              : 'Contact Us Today for Pooja Services'}
          </h2>

          <p className="text-sm text-[#FFF0E0] max-w-xl mx-auto">
            {lang === 'kn'
              ? 'ಧಾರ್ಮಿಕ ಕಾರ್ಯಗಳಿಗೆ ಪುರೋಹಿತರು ಮತ್ತು ಪೂಜಾ ಸಾಮಗ್ರಿಗಳಿಗೆ ಸಂಪರ್ಕಿಸಿ.'
              : 'Reach out for reliable purohits and all authentic religious materials.'}
          </p>

          <div className="font-serif text-3xl sm:text-4xl font-black text-white tracking-wider my-3 flex items-center justify-center gap-2">
            <Phone className="w-7 h-7 text-[#FFE5CC]" />
            <span>{CONTACT_INFO.displayPhone}</span>
          </div>

          <p className="text-xs text-[#FFE5CC]">
            📍 {lang === 'kn' ? CONTACT_INFO.locationKn : CONTACT_INFO.locationEn}
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 bg-white text-[#CC5500] hover:bg-[#FFF8F2] text-sm font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
            >
              <span>{lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ →' : 'Book Pooja Service →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
