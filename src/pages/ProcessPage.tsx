import React from 'react';
import { Language, PageRoute } from '../types';
import { WORK_PROCESS, TRUST_PILLARS, CONTACT_INFO } from '../data/poojaData';
import { Sparkles, ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProcessPageProps {
  lang: Language;
  onNavigate: (page: PageRoute) => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ lang, onNavigate }) => {
  return (
    <div id="process" className="py-12 sm:py-16 bg-[#FFFDF9] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಸರಳ & ಶಾಸ್ತ್ರೋಕ್ತ ವಿಧಾನ' : 'Simple Agamic Process'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4D2300]">
            {lang === 'kn' ? 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?' : 'How It Works?'}
          </h1>

          <p className="text-sm text-[#994700] leading-relaxed">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಮನೆಯಲ್ಲಿ ಶುಭ ಕಾರ್ಯಗಳನ್ನು ಸರಳವಾಗಿ ಮತ್ತು ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಆಯೋಜಿಸಲು 4 ಸುಲಭ ಹಂತಗಳು.'
              : 'Four transparent steps to organize seamless, sacred Hindu rituals at your doorstep.'}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORK_PROCESS.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl border-2 border-[#FFCC99] p-6 relative hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFE5CC] flex items-center justify-center font-serif text-xl font-black text-[#FF6A00]">
                {item.step}
              </div>

              <h3 className="font-serif text-xl font-bold text-[#4D2300]">
                {lang === 'kn' ? item.titleKn : item.titleEn}
              </h3>

              <p className="text-xs text-[#8C4700] leading-relaxed">
                {lang === 'kn' ? item.descKn : item.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* Preparation Guidelines for Devotees */}
        <div className="bg-[#FFF8F2] border border-[#FFCC99] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#FF6A00] uppercase tracking-wider">
              {lang === 'kn' ? 'ಪೂಜಾ ಪೂರ್ವ ಸಿದ್ಧತೆಗಳು' : 'Home Altar Preparation Guidelines'}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ಪೂಜೆಯ ದಿನ ಭಕ್ತರು ಮಾಡಬೇಕಾದ ಸಿದ್ಧತೆಗಳು' : 'What to Keep Ready on Pooja Day'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#663000]">
            <div className="bg-white p-4 rounded-xl border border-[#FFE5CC] space-y-2">
              <strong className="block font-bold text-[#4D2300]">1. Altar Direction & Cleanliness</strong>
              <p>Clean the puja area thoroughly. Keep the altar facing North or East direction as per Vastu Shastra.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#FFE5CC] space-y-2">
              <strong className="block font-bold text-[#4D2300]">2. Pure Water & Cloth</strong>
              <p>Keep a clean copper vessel with fresh drinking water, clean towels, and two wooden seats (mane/peetha).</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#FFE5CC] space-y-2">
              <strong className="block font-bold text-[#4D2300]">3. Naivedya & Flowers</strong>
              <p>Keep freshly prepared sweet naivedya (Payasa / Modaka), unbroken coconuts, and fresh betel leaves ready.</p>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('booking')}
            className="px-8 py-3.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>{lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ' : 'Schedule a Pooja Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
