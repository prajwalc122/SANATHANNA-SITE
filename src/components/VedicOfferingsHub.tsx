import React, { useState } from 'react';
import { Language, PageRoute } from '../types';
import { CONTACT_INFO } from '../data/poojaData';
import { 
  Flame, BookOpen, Shirt, Compass, Sun, 
  Sparkles, CheckCircle2, ArrowRight, Phone, MapPin, User, Check, Send
} from 'lucide-react';

interface VedicOfferingsHubProps {
  lang: Language;
  onNavigate: (page: PageRoute) => void;
  onOpenBooking: (serviceName?: string) => void;
}

interface OfferingItem {
  id: string;
  titleKn: string;
  titleEn: string;
  subtitleKn: string;
  subtitleEn: string;
  category: 'primary' | 'ritual' | 'store' | 'consultation';
  badgeKn?: string;
  badgeEn?: string;
  actionType: 'booking' | 'materials' | 'catalog' | 'services';
  icon: string;
  image?: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    iconBg: string;
  };
}

export const VedicOfferingsHub: React.FC<VedicOfferingsHubProps> = ({
  lang,
  onNavigate,
  onOpenBooking,
}) => {
  // Quick contact form state from the user's handwritten note: Name, Ph, Place
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');
  const [selectedService, setSelectedService] = useState('ಪುರೋಹಿತರ ಬುಕಿಂಗ್');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const offerings: OfferingItem[] = [
    {
      id: 'purohit_booking',
      titleKn: 'ಪುರೋಹಿತರ ಬುಕಿಂಗ್',
      titleEn: 'Purohitara Booking',
      subtitleKn: 'ವೇದ ವಿಜ್ಞಾನಿ & ಅನುಭವಿ ಪುರೋಹಿತರಿಂದ ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜೆ',
      subtitleEn: 'Authentic rituals by certified & experienced Vedic scholars',
      category: 'primary',
      badgeKn: 'ಅತಿ ಮುಖ್ಯ',
      badgeEn: 'Essential',
      actionType: 'booking',
      icon: '🪔',
      image: '/src/assets/images/purohit_booking_banner.svg',
      colorScheme: {
        bg: 'from-[#FFF5EB] to-[#FFE8D1]',
        border: 'border-[#FF9933]',
        text: 'text-[#802B00]',
        accent: 'bg-[#FF6A00]',
        iconBg: 'bg-[#FFD9B3]',
      },
    },
    {
      id: 'pooja_samagri',
      titleKn: 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು',
      titleEn: 'Pooja Samagri',
      subtitleKn: '100% ಶುದ್ಧ, ಕಲಬೆರಕೆ ರಹಿತ ವೈದಿಕ ಸಾಮಗ್ರಿಗಳ ಕಿಟ್',
      subtitleEn: '100% unadulterated, certified pure Vedic pooja materials',
      category: 'primary',
      badgeKn: 'ಸಂಪೂರ್ಣ ಕಿಟ್',
      badgeEn: 'Full Kit',
      actionType: 'materials',
      icon: '🌿',
      image: '/src/assets/images/pooja_materials_kit_1790748675502.jpg',
      colorScheme: {
        bg: 'from-[#F3F9F1] to-[#E5F4E0]',
        border: 'border-[#7CB342]',
        text: 'text-[#1E4620]',
        accent: 'bg-[#2E7D32]',
        iconBg: 'bg-[#C8E6C9]',
      },
    },
    {
      id: 'homas',
      titleKn: 'ಹೋಮಗಳು (Homas)',
      titleEn: 'Sacred Homas',
      subtitleKn: 'ಗಣಪತಿ, ನವಗ್ರಹ, ರುದ್ರ, ಚಂಡಿ, ಸುದರ್ಶನ, ಆಯುಷ್ಯ ಹೋಮ',
      subtitleEn: 'Ganapathi, Navagraha, Rudra, Chandi, Sudarshana & Ayushya Homa',
      category: 'ritual',
      badgeKn: 'ಹವನ ಸಾಮಗ್ರಿ ಸಹಿತ',
      badgeEn: 'With Samithu',
      actionType: 'services',
      icon: '🔥',
      image: '/src/assets/images/sacred_homa_fire.svg',
      colorScheme: {
        bg: 'from-[#FFF0F0] to-[#FFE0E0]',
        border: 'border-[#E57373]',
        text: 'text-[#7F1D1D]',
        accent: 'bg-[#D32F2F]',
        iconBg: 'bg-[#FFCDD2]',
      },
    },
    {
      id: 'vratagalu',
      titleKn: 'ವ್ರತಗಳು (Vratagalu)',
      titleEn: 'Sacred Vratas',
      subtitleKn: 'ಸತ್ಯನಾರಾಯಣ ವ್ರತ, ವರಮಹಾಲಕ್ಷ್ಮಿ, ಅನಂತಪದ್ಮನಾಭ, ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ',
      subtitleEn: 'Sri Satyanarayana, Varalakshmi, Ananthapadmanabha & Sankashti',
      category: 'ritual',
      badgeKn: 'ಶಾಸ್ತ್ರೋಕ್ತ',
      badgeEn: 'Vedic',
      actionType: 'booking',
      icon: '🌺',
      image: '/src/assets/images/service_satyanarayana_1790406768280.jpg',
      colorScheme: {
        bg: 'from-[#FFF9E6] to-[#FFF0B3]',
        border: 'border-[#FFD54F]',
        text: 'text-[#6D4C00]',
        accent: 'bg-[#F57F17]',
        iconBg: 'bg-[#FFE082]',
      },
    },
    {
      id: 'pooja_vastragalu',
      titleKn: 'ಪೂಜಾ ವಸ್ತ್ರಗಳು',
      titleEn: 'Pooja Vastragalu',
      subtitleKn: 'ಶುದ್ಧ ಹತ್ತಿ ಧೋತಿ, ಶಲ್ಯ, ರೇಷ್ಮೆ ಅಂಗವಸ್ತ್ರ, ದೇವತಾ ಸೀರೆ & ಪಂಚೆ',
      subtitleEn: 'Pure cotton dhotis, sacred shawls, silk vastras & deity fabrics',
      category: 'store',
      badgeKn: 'ಮಡಿ ವಸ್ತ್ರ',
      badgeEn: 'Pure Handloom',
      actionType: 'catalog',
      icon: '🧣',
      image: '/src/assets/images/sacred_vastra_dhoti_1790747822955.jpg',
      colorScheme: {
        bg: 'from-[#FDF4FF] to-[#FAE8FF]',
        border: 'border-[#E879F9]',
        text: 'text-[#701A75]',
        accent: 'bg-[#A21CAF]',
        iconBg: 'bg-[#F5D0FE]',
      },
    },
    {
      id: 'sraddadi_apara',
      titleKn: 'ಶ್ರಾದ್ಧಾದಿ / ಅಪರ ಸಾಮಗ್ರಿಗಳು',
      titleEn: 'Sraddadi / Apara Samagrigalu',
      subtitleKn: 'ತಿಲ, ದರ್ಭೆ, ಪಿಂಡಪ್ರದಾನ ಸಾಮಗ್ರಿಗಳು, ಅಪರ ಕರ್ಮ ಸಂಪೂರ್ಣ ವ್ಯವಸ್ಥೆ',
      subtitleEn: 'Til, sacred darbha grass, pinda offerings & complete apara samagri',
      category: 'ritual',
      badgeKn: 'ವಿಶೇಷ ಸೇವೆ',
      badgeEn: 'Special Care',
      actionType: 'materials',
      icon: '🌾',
      image: '/src/assets/images/sacred_tarpana_til_1790747840025.jpg',
      colorScheme: {
        bg: 'from-[#F5F5F4] to-[#E7E5E4]',
        border: 'border-[#A8A29E]',
        text: 'text-[#292524]',
        accent: 'bg-[#57534E]',
        iconBg: 'bg-[#D6D3D1]',
      },
    },
    {
      id: 'vaastu',
      titleKn: 'ವಾಸ್ತು [ಮನೆ & ದೇವಾಲಯಗಳು]',
      titleEn: 'Vaastu [Home & Temples]',
      subtitleKn: 'ಗೃಹ ವಾಸ್ತು, ದೇವಸ್ಥಾನ ಜೀರ್ಣೋದ್ಧಾರ, ಗೃಹ ಪ್ರವೇಶ ವಾಸ್ತು ಪರಿಹಾರ',
      subtitleEn: 'Residential Vaastu, temple sanctum alignment & remedies',
      category: 'consultation',
      badgeKn: 'ತಜ್ಞರ ಸಲಹೆ',
      badgeEn: 'Expert Guidance',
      actionType: 'booking',
      icon: '🧭',
      image: '/src/assets/images/vaastu_plan_chart.svg',
      colorScheme: {
        bg: 'from-[#EFF6FF] to-[#DBEAFE]',
        border: 'border-[#93C5FD]',
        text: 'text-[#1E3A8A]',
        accent: 'bg-[#2563EB]',
        iconBg: 'bg-[#BFDBFE]',
      },
    },
    {
      id: 'jyotishya',
      titleKn: 'ಜ್ಯೋತಿಷ್ಯ (Jyotishya)',
      titleEn: 'Vedic Astrology',
      subtitleKn: 'ಜಾತಕ ಪರಿಶೀಲನೆ, ಶುಭ ಮುಹೂರ್ತ, ಗ್ರಹ ಶಾಂತಿ & ದೋಷ ಪರಿಹಾರ',
      subtitleEn: 'Horoscope reading, auspicious muhurat, graha shanti & remedies',
      category: 'consultation',
      badgeKn: 'ಶಾಸ್ತ್ರ ಸಮ್ಮತ',
      badgeEn: 'Astrology',
      actionType: 'booking',
      icon: '☀️',
      image: '/src/assets/images/vedic_astrology_chart.svg',
      colorScheme: {
        bg: 'from-[#FEF3C7] to-[#FDE68A]',
        border: 'border-[#FCD34D]',
        text: 'text-[#78350F]',
        accent: 'bg-[#D97706]',
        iconBg: 'bg-[#FDE047]',
      },
    },
    {
      id: 'brass_copper',
      titleKn: 'ಹಿತ್ತಾಳೆ & ತಾಮ್ರ (Brass and Copper)',
      titleEn: 'Brass and Copper',
      subtitleKn: 'ಹಿತ್ತಾಳೆಯ ಗಂಟೆ, ಕಾಮಾಕ್ಷಿ ದೀಪ, ತಾಮ್ರದ ಕಲಶ, ಪಂಚಪಾತ್ರೆ & ಆರತಿ ತಟ್ಟೆ',
      subtitleEn: 'Virgin brass temple bells, Kamakshi deepams, copper kalash & thalis',
      category: 'store',
      badgeKn: '320+ ಸಾಮಗ್ರಿ',
      badgeEn: '320+ Items',
      actionType: 'catalog',
      icon: '🔔',
      image: '/src/assets/images/cat_brass_thali_1790590678582.jpg',
      colorScheme: {
        bg: 'from-[#FFFBEB] to-[#FEF3C7]',
        border: 'border-[#F59E0B]',
        text: 'text-[#78350F]',
        accent: 'bg-[#B45309]',
        iconBg: 'bg-[#FDE68A]',
      },
    },
  ];

  const getServiceOptionValue = (item: OfferingItem) => {
    switch (item.id) {
      case 'purohit_booking': return 'ಪುರೋಹಿತರ ಬುಕಿಂಗ್';
      case 'pooja_samagri': return 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು';
      case 'homas': return 'ಹೋಮಗಳು';
      case 'vratagalu': return 'ವ್ರತಗಳು';
      case 'pooja_vastragalu': return 'ಪೂಜಾ ವಸ್ತ್ರಗಳು';
      case 'sraddadi_apara': return 'ಶ್ರಾದ್ಧಾದಿ / ಅಪರ ಸಾಮಗ್ರಿಗಳು';
      case 'vaastu': return 'ವಾಸ್ತು [ಮನೆ & ದೇವಾಲಯಗಳು]';
      case 'jyotishya': return 'ಜ್ಯೋತಿಷ್ಯ';
      case 'brass_copper': return 'ಹಿತ್ತಾಳೆ & ತಾಮ್ರ ಸಾಮಗ್ರಿಗಳು';
      default: return item.titleKn;
    }
  };

  const handleCardClick = (item: OfferingItem) => {
    const serviceVal = getServiceOptionValue(item);
    setSelectedService(serviceVal);
    
    // Smoothly scroll to the Quick Request form on mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.getElementById('quick-request-box');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    if (item.actionType === 'catalog') {
      onNavigate('catalog');
    } else if (item.actionType === 'materials') {
      onNavigate('materials');
    } else if (item.actionType === 'services') {
      onNavigate('services');
    } else {
      onOpenBooking(serviceVal);
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Send via WhatsApp directly
    const msg = `*ಹೊಸ ಸೇವಾ ವಿಚಾರಣೆ / Quick Enquiry:*
• ಹೆಸರು: ${name}
• ಫೋನ್: ${phone}
• ಸ್ಥಳ / Place: ${place || 'Shivamogga'}
• ಆಯ್ದ ಸೇವೆ: ${selectedService}`;

    const encoded = encodeURIComponent(msg);
    const cleanPhone = CONTACT_INFO.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    
    setIsSubmitted(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 400);
  };

  return (
    <section id="offerings" className="relative py-12 sm:py-16 bg-gradient-to-b from-[#FFFDF9] via-[#FFF5E6] to-[#FFFDF9] border-y-2 border-[#FF9933]/40 shadow-sm overflow-hidden">
      {/* Decorative Traditional Vedic Aura Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#FF6A00_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Highlighted Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#4D2300] tracking-tight leading-tight">
            {lang === 'kn' ? (
              <>
                ಪುರೋಹಿತರು & ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು —{' '}
                <span className="text-[#FF6A00] underline decoration-[#FFCC99]">ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ</span>
              </>
            ) : (
              <>
                Purohits & Sacred Samagri —{' '}
                <span className="text-[#FF6A00] underline decoration-[#FFCC99]">All In One Place</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#7A3600] font-medium max-w-2xl mx-auto">
            {lang === 'kn'
              ? 'ಹೋಮ, ವ್ರತ, ಪೂಜಾ ವಸ್ತ್ರಗಳು, ಅಪರ ಕಾರ್ಯಗಳು, ವಾಸ್ತು ಮತ್ತು ಜ್ಯೋತಿಷ್ಯದ ಸಂಪೂರ್ಣ ಪರಿಹಾರ.'
              : 'End-to-end arrangements for Homas, Vratas, Vastras, Apara Karma, Vaastu, Jyotishya & Brass/Copper vessels.'}
          </p>
        </div>

        {/* 2-Column Layout: Grid of Offerings (Left 8 cols) + Instant Name/Ph/Place Box (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: 9 Offerings Grid from User Sketch */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {offerings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className={`group relative rounded-2xl bg-gradient-to-br ${item.colorScheme.bg} border-2 ${item.colorScheme.border} p-3.5 sm:p-4 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 flex flex-col justify-between`}
                >
                  <div>
                    {/* Unobstructed, Perfectly Visible Image */}
                    {item.image && (
                      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3 border border-[#000000]/10 shadow-xs bg-[#FFFDF9]">
                        <img
                          src={item.image}
                          alt={lang === 'kn' ? item.titleKn : item.titleEn}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Card Title */}
                    <h3 className={`font-serif text-base sm:text-lg font-bold ${item.colorScheme.text} group-hover:text-[#FF6A00] transition-colors leading-snug line-clamp-1`}>
                      {lang === 'kn' ? item.titleKn : item.titleEn}
                    </h3>

                    {/* Subtitle / Ritual details */}
                    <p className="text-xs text-[#663000]/80 mt-1 line-clamp-2 leading-relaxed">
                      {lang === 'kn' ? item.subtitleKn : item.subtitleEn}
                    </p>
                  </div>

                  {/* Card Bottom Action Link */}
                  <div className="mt-3.5 pt-2.5 border-t border-[#000000]/10 flex items-center justify-between text-xs font-bold text-[#FF6A00] group-hover:text-[#E05D00]">
                    <span>
                      {item.actionType === 'catalog'
                        ? (lang === 'kn' ? 'ಕ್ಯಾಟಲಾಗ್ ನೋಡಿ' : 'View Catalog')
                        : item.actionType === 'materials'
                        ? (lang === 'kn' ? 'ಸಾಮಗ್ರಿ ನೋಡಿ' : 'View Materials')
                        : item.actionType === 'services'
                        ? (item.id === 'homas'
                            ? (lang === 'kn' ? 'ಹೋಮಗಳನ್ನು ನೋಡಿ' : 'View Sacred Homas')
                            : (lang === 'kn' ? 'ಸೇವೆಗಳನ್ನು ನೋಡಿ' : 'View Services'))
                        : (lang === 'kn' ? 'ಬುಕ್ ಮಾಡಿ' : 'Book Now')}
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Quick Request Box (Name, Ph, Place) as drawn on top-right of the user's sketch */}
          <div id="quick-request-box" className="lg:col-span-4 bg-gradient-to-b from-[#FFF9F2] to-[#FFF0E0] rounded-2xl border-2 border-[#FF6A00] p-6 shadow-xl space-y-5 sticky top-24">
            
            {/* Header */}
            <div className="border-b border-[#FFCC99] pb-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF6A00] tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ತ್ವರಿತ ಸಂಪರ್ಕ & ಬುಕಿಂಗ್' : 'Quick Booking & Enquiry'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#4D2300]">
                {lang === 'kn' ? 'ನೇರ ಸಂಪರ್ಕಕ್ಕೆ ಮಾಹಿತಿ ನೀಡಿ' : 'Leave Details for Instant Callback'}
              </h3>
              <p className="text-xs text-[#803800] mt-1">
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಊರನ್ನು ನಮೂದಿಸಿ. ತಕ್ಷಣವೇ ಸಂಪರ್ಕಿಸಲಾಗುವುದು.'
                  : 'Enter your Name, Phone and Place. We will assist you immediately.'}
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-[#EAF5E8] border border-[#A5D6A7] rounded-xl p-5 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto" />
                <h4 className="font-bold text-sm text-[#1B5E20]">
                  {lang === 'kn' ? 'ಧನ್ಯವಾದಗಳು!' : 'Thank you!'}
                </h4>
                <p className="text-xs text-[#2E7D32]">
                  {lang === 'kn'
                    ? 'ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಾವು ಶೀಘ್ರವೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.'
                    : 'We have received your request and will call you back shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs text-[#1B5E20] underline font-bold cursor-pointer"
                >
                  {lang === 'kn' ? 'ಮತ್ತೊಂದು ವಿಚಾರಣೆ ಕಳುಹಿಸಿ' : 'Send another query'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-3.5">
                
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-bold text-[#4D2300] mb-1">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು (Enter your name) *' : 'Enter your name (ನಿಮ್ಮ ಹೆಸರು) *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#FF9933] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ (Enter your name)' : 'Enter your name (ನಿಮ್ಮ ಹೆಸರು)'}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#FFCC99] rounded-xl text-xs sm:text-sm text-[#4D2300] placeholder:text-[#B37440] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                    />
                  </div>
                </div>

                {/* 2. Phone (Ph) */}
                <div>
                  <label className="block text-xs font-bold text-[#4D2300] mb-1">
                    {lang === 'kn' ? 'ಫೋನ್ ಸಂಖ್ಯೆ (Phone) *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#FF9933] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98800 00000"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#FFCC99] rounded-xl text-xs sm:text-sm text-[#4D2300] placeholder:text-[#B37440] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                    />
                  </div>
                </div>

                {/* 3. Place */}
                <div>
                  <label className="block text-xs font-bold text-[#4D2300] mb-1">
                    {lang === 'kn' ? 'ಸ್ಥಳ / ಊರು (Place) *' : 'Place / Location *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#FF9933] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಶಿವಮೊಗ್ಗ, ಬೆಂಗಳೂರು, ಇತ್ಯಾದಿ' : 'Shivamogga, Bengaluru, etc.'}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#FFCC99] rounded-xl text-xs sm:text-sm text-[#4D2300] placeholder:text-[#B37440] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                    />
                  </div>
                </div>

                {/* 4. Service Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#4D2300] mb-1">
                    {lang === 'kn' ? 'ಆಯ್ಕೆಯ ಸೇವೆ' : 'Select Service'}
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#FFCC99] rounded-xl text-xs sm:text-sm text-[#4D2300] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="ಪುರೋಹಿತರ ಬುಕಿಂಗ್">ಪುರೋಹಿತರ ಬುಕಿಂಗ್ (Purohit Booking)</option>
                    <option value="ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು">ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು (Pooja Samagri)</option>
                    <option value="ಹೋಮಗಳು">ಹೋಮಗಳು (Homas)</option>
                    <option value="ವ್ರತಗಳು">ವ್ರತಗಳು (Vratagalu)</option>
                    <option value="ಪೂಜಾ ವಸ್ತ್ರಗಳು">ಪೂಜಾ ವಸ್ತ್ರಗಳು (Pooja Vastragalu)</option>
                    <option value="ಶ್ರಾದ್ಧಾದಿ / ಅಪರ ಸಾಮಗ್ರಿಗಳು">ಶ್ರಾದ್ಧಾದಿ / ಅಪರ ಸಾಮಗ್ರಿಗಳು (Apara Samagri)</option>
                    <option value="ವಾಸ್ತು [ಮನೆ & ದೇವಾಲಯಗಳು]">ವಾಸ್ತು [ಮನೆ & ದೇವಾಲಯಗಳು] (Vaastu)</option>
                    <option value="ಜ್ಯೋತಿಷ್ಯ">ಜ್ಯೋತಿಷ್ಯ (Jyotishya)</option>
                    <option value="ಹಿತ್ತಾಳೆ & ತಾಮ್ರ ಸಾಮಗ್ರಿಗಳು">ಹಿತ್ತಾಳೆ & ತಾಮ್ರ (Brass & Copper)</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#FF6A00] to-[#E05D00] hover:from-[#E05D00] hover:to-[#C24E00] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ತಕ್ಷಣ ವಿನಂತಿ ಕಳುಹಿಸಿ' : 'Send Instant Request'}</span>
                </button>
              </form>
            )}

            {/* Direct Phone / WhatsApp Quick Contact */}
            <div className="pt-3 border-t border-[#FFCC99] flex items-center justify-between text-xs text-[#803800]">
              <span className="font-medium">{lang === 'kn' ? 'ನೇರ ಕರೆ:' : 'Direct Call:'}</span>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="font-bold text-[#FF6A00] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{CONTACT_INFO.phone}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
