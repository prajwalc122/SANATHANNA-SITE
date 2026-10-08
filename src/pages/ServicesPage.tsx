import React, { useState, useEffect } from 'react';
import { Language, PoojaService } from '../types';
import { POOJA_SERVICES } from '../data/poojaData';
import { Sparkles, Check, ArrowRight, Flame } from 'lucide-react';

interface ServicesPageProps {
  lang: Language;
  onBookService: (service: PoojaService) => void;
  onAddServiceToBag: (service: PoojaService) => void;
  services?: PoojaService[];
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  lang,
  onBookService,
  onAddServiceToBag,
  services = POOJA_SERVICES,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'homa' | 'pooja' | 'vrata'>('all');

  // Check if URL hash indicates homas
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('homa')) {
      setActiveFilter('homa');
    }
  }, []);

  const filteredServices = services.filter((service) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'homa') {
      return (
        service.iconType === 'homa' ||
        service.nameKn.includes('ಹೋಮ') ||
        service.nameEn.toLowerCase().includes('homa')
      );
    }
    if (activeFilter === 'vrata') {
      return (
        service.iconType === 'narayana' ||
        service.iconType === 'home' ||
        service.nameKn.includes('ವ್ರತ') ||
        service.nameKn.includes('ಗೃಹಪ್ರವೇಶ')
      );
    }
    if (activeFilter === 'pooja') {
      return (
        service.iconType === 'ganesha' ||
        service.iconType === 'lakshmi' ||
        service.iconType === 'shiva' ||
        (!service.nameKn.includes('ಹೋಮ') && !service.nameKn.includes('ವ್ರತ'))
      );
    }
    return true;
  });

  return (
    <section id="services" className="py-12 sm:py-16 bg-transparent min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6A00] bg-white/80 px-3 py-1 rounded-full border border-[#FFCC99] backdrop-blur-sm shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜಾ & ಹೋಮ ಸೇವೆಗಳು' : 'Vedic Pooja & Homa Services'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4D2300]">
            {lang === 'kn' ? 'ನಿಮಗೆ ಲಭ್ಯವಿರುವ ಪೂಜಾ & ಹೋಮ ಸೇವೆಗಳು' : 'Our Authentic Pooja & Homa Services'}
          </h1>

          <p className="text-sm text-[#994700] leading-relaxed">
            {lang === 'kn'
              ? 'ಅನುಭವಿ ವೇದ ವಿದ್ವಾಂಸರು ಮತ್ತು ಆಯ್ದ ಶುದ್ಧ ಪೂಜಾ ದ್ರವ್ಯಗಳೊಂದಿಗೆ ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ನಡೆಸಿಕೊಡಲಾಗುವ ಹೋಮ-ಹವನಗಳು ಮತ್ತು ಪೂಜೆಗಳು.'
              : 'Conducted strictly in accordance with Agamic traditions by verified Vedic scholars with complete samagri bundles.'}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#FF6A00] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4D2300] border border-[#FFCC99]'
            }`}
          >
            <span>{lang === 'kn' ? 'ಎಲ್ಲಾ ಸೇವೆಗಳು' : 'All Services'}</span>
            <span className="ml-1.5 opacity-80">({services.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('homa')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'homa'
                ? 'bg-[#D32F2F] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#7F1D1D] border border-[#E57373]'
            }`}
          >
            <Flame className="w-4 h-4 text-[#FF5252]" />
            <span>{lang === 'kn' ? 'ಪವಿತ್ರ ಹೋಮಗಳು (Sacred Homas)' : 'Sacred Homas'}</span>
            <span className="ml-1 opacity-80">
              ({services.filter((s) => s.nameKn.includes('ಹೋಮ') || s.nameEn.toLowerCase().includes('homa')).length})
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('pooja')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'pooja'
                ? 'bg-[#FF6A00] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4D2300] border border-[#FFCC99]'
            }`}
          >
            <span>🪔 {lang === 'kn' ? 'ದೇವತಾ ಪೂಜೆಗಳು' : 'Deity Poojas'}</span>
          </button>

          <button
            onClick={() => setActiveFilter('vrata')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeFilter === 'vrata'
                ? 'bg-[#FF6A00] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4D2300] border border-[#FFCC99]'
            }`}
          >
            <span>🌺 {lang === 'kn' ? 'ವ್ರತಗಳು & ಗೃಹಪ್ರವೇಶ' : 'Vratas & Ceremonies'}</span>
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#FFCC99] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Media image */}
              <div className="aspect-[16/10] bg-[#FFF0E0] overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {service.nameKn.includes('ಹೋಮ') && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE0E0] text-[#D32F2F] border border-[#E57373]">
                        🔥 {lang === 'kn' ? 'ಹೋಮ / ಹವನ' : 'Sacred Homa'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#4D2300]">
                    {lang === 'kn' ? service.nameKn : service.nameEn}
                  </h3>
                  <p className="text-xs text-[#8C4700] leading-relaxed">
                    {lang === 'kn' ? service.descKn : service.descEn}
                  </p>

                  {/* Included list */}
                  <div className="bg-[#FFF8F2] p-3.5 rounded-xl border border-[#FFE5CC] space-y-2 text-xs">
                    <span className="font-bold text-[#4D2300] block text-[10px] uppercase tracking-wider">
                      {lang === 'kn' ? 'ಒಳಗೊಂಡಿರುವ ಪ್ರಮುಖ ಸಾಮಗ್ರಿಗಳು:' : 'Includes Certified Materials:'}
                    </span>
                    <ul className="space-y-1 text-[#663000]">
                      {service.includedMaterials.map((mat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer price & CTA */}
                <div className="pt-4 border-t border-[#FFE5CC] flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-[#994700] font-semibold">
                      {lang === 'kn' ? 'ಸೇವಾ ದಕ್ಷಿಣಾ' : 'Dakshina Fee'}
                    </span>
                    <span className="font-serif text-xl font-bold text-[#CC5500] tabular-nums">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAddServiceToBag(service)}
                      className="px-3 py-2 bg-[#FFF0E0] hover:bg-[#FFE5CC] text-[#994700] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'kn' ? '+ ಕಿಟ್ ಸೇರಿಸಿ' : '+ Add Kit'}
                    </button>

                    <button
                      onClick={() => onBookService(service)}
                      className="px-4 py-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>{lang === 'kn' ? 'ಬುಕ್ ಮಾಡಿ' : 'Book Purohit'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Banner */}
        <div className="bg-[#FFF0E0] border border-[#FFCC99] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#FF6A00] font-bold block">
              {lang === 'kn' ? 'ವಿಶೇಷ ಸಂಕಲ್ಪ ಸೇವೆಗಳು' : 'Custom Vedic Rituals & Homas'}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ನಿರ್ದಿಷ್ಟ ಪೂಜೆ ಅಥವಾ ನಕ್ಷತ್ರ ಶಾಂತಿ ಬೇಕೇ?' : 'Need a Specific Custom Homa or Vidhi?'}
            </h3>
            <p className="text-xs text-[#8C4700]">
              {lang === 'kn'
                ? 'ರುದ್ರ ಹೋಮ, ಚಂಡಿಕಾ ಪಾರಾಯಣ, ಆಯುಷ್ಯ ಹೋಮ ಹಾಗೂ ಮದುವೆ ಮುಹೂರ್ತ ಪೂಜೆಗಳಿಗೂ ಪುರೋಹಿತರನ್ನು ನಿಗದಿಪಡಿಸಲಾಗುತ್ತದೆ.'
                : 'We arrange experienced scholars for Rudra Homa, Ayushya Homa, Vivaha, and special planetary remedies.'}
            </p>
          </div>

          <button
            onClick={() => {
              const homaService = services.find((s) => s.id === 'srv-navagraha' || s.nameKn.includes('ಹೋಮ')) || services[0];
              onBookService(homaService);
            }}
            className="px-6 py-3 bg-[#4D2300] hover:bg-[#331700] text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-xs cursor-pointer"
          >
            {lang === 'kn' ? 'ವಿಶೇಷ ಹೋಮ / ಪೂಜೆಗಾಗಿ ವಿನಂತಿ ಸಲ್ಲಿಸಿ' : 'Request Custom Homa / Pooja'}
          </button>
        </div>
      </div>
    </section>
  );
};
