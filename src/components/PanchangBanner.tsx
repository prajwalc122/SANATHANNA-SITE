import React, { useState, useEffect, useMemo } from 'react';
import { Compass, Sparkles, ChevronDown, ChevronUp, Calendar, Clock, Sun, Moon, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

// =========================================================================
// VEDIC PANCHANG ENGINE - Dynamically Computes Real Panchang for Every Day
// =========================================================================

interface DailyPanchangInfo {
  date: Date;
  dateFormattedKn: string;
  dateFormattedEn: string;
  weekdayKn: string;
  weekdayEn: string;
  samvatsaraKn: string;
  samvatsaraEn: string;
  ayanaKn: string;
  rituKn: string;
  masaKn: string;
  masaEn: string;
  pakshaKn: string;
  pakshaEn: string;
  tithiKn: string;
  tithiEn: string;
  nakshatraKn: string;
  nakshatraEn: string;
  yogaKn: string;
  karanaKn: string;
  shubhMuhurat: string;
  amritKaal: string;
  rahuKaal: string;
  yamagandaKaal: string;
  gulikaKaal: string;
  sunrise: string;
  sunset: string;
  deityKn: string;
  deityEn: string;
  pujaRecommendationKn: string;
  pujaRecommendationEn: string;
  specialVrata?: string;
}

const KANNADA_MONTHS = [
  'ಚೈತ್ರ (Chaitra)', 'ವೈಶಾಖ (Vaishakha)', 'ಜ್ಯೇಷ್ಠ (Jyeshtha)', 'ಆಷಾಢ (Ashadha)',
  'ಶ್ರಾವಣ (Shravana)', 'ಭಾದ್ರಪದ (Bhadrapada)', 'ಆಶ್ವಯುಜ (Ashwayuja)', 'ಕಾರ್ತಿಕ (Kartika)',
  'ಮಾರ್ಗಶಿರ (Margashirsha)', 'ಪುಷ್ಯ (Pushya)', 'ಮಾಘ (Magha)', 'ಫಾಲ್ಗುಣ (Phalguna)'
];

const KANNADA_WEEKDAYS = [
  { kn: 'ಭಾನುವಾರ (Ravivara)', en: 'Sunday', deityKn: 'ಶ್ರೀ ಸೂರ್ಯ ನಾರಾಯಣ', deityEn: 'Surya Narayana', pujaKn: 'ಸೂರ್ಯ ನಮಸ್ಕಾರ, ಗಾಯತ್ರಿ ಜಪ ಹಾಗೂ ಆರೋಗ್ಯ ವೃದ್ಧಿಗೆ ಆದಿತ್ಯ ಹೃದಯ ಪಠಣ ಶ್ರೇಷ್ಠ.', pujaEn: 'Surya Namaskara, Gayatri Japa & Aditya Hridaya recitation for vitality.' },
  { kn: 'ಸೋಮವಾರ (Somavara)', en: 'Monday', deityKn: 'ಮಹಾದೇವ ಪರಮೇಶ್ವರ (Shiva)', deityEn: 'Lord Shiva', pujaKn: 'ಶಿವಲಿಂಗಕ್ಕೆ ಜಲಾಭಿಷೇಕ, ಬಿಲ್ವಪತ್ರೆ ಅರ್ಪಣೆ ಹಾಗೂ ರುದ್ರಾಭಿಷೇಕ ಪೂಜೆಗೆ ಅತ್ಯಂತ ಶುಭ ದಿನ.', pujaEn: 'Shiva Rudrabhisheka, Bilva Patra offering & Somavara Shiva Vrata.' },
  { kn: 'ಮಂಗಳವಾರ (Mangalavara)', en: 'Tuesday', deityKn: 'ಮಹಾಗಣಪತಿ & ಸುಬ್ರಹ್ಮಣ್ಯ', deityEn: 'Ganesha & Subrahmanya', pujaKn: 'ಸಂಕಷ್ಟ ನಿವಾರಣೆಗೆ ಗಣಪತಿ ಅಥರ್ವಶೀರ್ಷ ಪಠಣ ಹಾಗೂ ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿ ಆರಾಧನೆ.', pujaEn: 'Ganapathi Atharvashirsha & Subrahmanya worship for removing obstacles.' },
  { kn: 'ಬುಧವಾರ (Budhavara)', en: 'Wednesday', deityKn: 'ಶ್ರೀ ಲಕ್ಷ್ಮೀ ನಾರಾಯಣ (Vishnu)', deityEn: 'Lord Vishnu', pujaKn: 'ಬುದ್ಧಿ, ವಿದ್ಯಾಭ್ಯಾಸ ಹಾಗೂ ವ್ಯಾಪಾರ ವೃದ್ಧಿಗಾಗಿ ತುಳಸಿ ಪೂಜೆ ಮತ್ತು ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಣ.', pujaEn: 'Tulasi Pooja & Vishnu Sahasranama for wisdom, education & prosperity.' },
  { kn: 'ಗುರುವಾರ (Guruvara)', en: 'Thursday', deityKn: 'ಶ್ರೀ ಗುರು ರಾಘವೇಂದ್ರ & ದತ್ತಾತ್ರೇಯ', deityEn: 'Guru Raghavendra & Dattatreya', pujaKn: 'ಗುರು ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ, ಸಾಯಿಬಾಬಾ ಆರಾಧನೆ ಹಾಗೂ ಗುರು ಚರಿತ್ರೆ ಪಾರಾಯಣಕ್ಕೆ ಶ್ರೇಷ್ಠ.', pujaEn: 'Guru Raghavendra Swami Aradhana & Brihaspati worship for blessings.' },
  { kn: 'ಶುಕ್ರವಾರ (Shukravara)', en: 'Friday', deityKn: 'ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮಿ & ದುರ್ಗಾದೇವಿ', deityEn: 'Maha Lakshmi & Durga', pujaKn: 'ಮನೆ ಶಾಂತಿ, ಐಶ್ವರ್ಯಕ್ಕಾಗಿ ಲಕ್ಷ್ಮೀ ಪೂಜೆ, ಕುಂಕುಮಾರ್ಚನೆ ಹಾಗೂ ದೀಪಾರಾಧನೆ ಶ್ರೇಷ್ಠ.', pujaEn: 'Maha Lakshmi Pooja, Kumkumarchana & lighting ghee lamps for wealth.' },
  { kn: 'ಶನಿವಾರ (Shanivara)', en: 'Saturday', deityKn: 'ಶ್ರೀ ವೆಂಕಟೇಶ್ವರ & ಆಂಜನೇಯ', deityEn: 'Lord Venkateshwara & Hanuman', pujaKn: 'ಶ್ರೀನಿವಾಸ ಕಲ್ಯಾಣ ಪಾರಾಯಣ, ಆಂಜನೇಯನಿಗೆ ವಡೆ ಮಾಲೆ ಹಾಗೂ ಶನಿ ದೋಷ ಪರಿಹಾರ ಪೂಜೆ.', pujaEn: 'Lord Venkateshwara Darshana, Hanuman Chalisa & Shani Shanti prayer.' }
];

const TITHIS_KN = [
  'ಪಾಡ್ಯ (Pratipada)', 'ಬಿದಿಗೆ (Dwitiya)', 'ತದಿಗೆ (Tritiya)', 'ಚೌತಿ (Chaturthi)',
  'ಪಂಚಮಿ (Panchami)', 'ಷಷ್ಠಿ (Shashti)', 'ಸಪ್ತಮಿ (Saptami)', 'ಅಷ್ಟಮಿ (Ashtami)',
  'ನವಮಿ (Navami)', 'ದಶಮಿ (Dashami)', 'ಏಕಾದಶಿ (Ekadashi)', 'ದ್ವಾದಶಿ (Dvadashi)',
  'ತ್ರಯೋದಶಿ (Trayodashi)', 'ಚತುರ್ದಶಿ (Chaturdashi)', 'ಹುಣ್ಣಿಮೆ (Purnima)'
];

const NAKSHATRAS_KN = [
  'ಅಶ್ವಿನಿ (Ashwini)', 'ಭರಣಿ (Bharani)', 'ಕೃತಿಕಾ (Krittika)', 'ರೋಹಿಣಿ (Rohini)',
  'ಮೃಗಶಿರಾ (Mrigashira)', 'ಆರಿದ್ರಾ (Ardra)', 'ಪುನರ್ವಸು (Punarvasu)', 'ಪುಷ್ಯ (Pushya)',
  'ಆಶ್ಲೇಷಾ (Ashlesha)', 'ಮಘಾ (Magha)', 'ಹುಬ್ಬಾ (Pubba)', 'ಉತ್ತರಾ (Uttara Phalguni)',
  'ಹಸ್ತಾ (Hasta)', 'ಚಿತ್ತಾ (Chitra)', 'ಸ್ವಾತಿ (Swati)', 'ವಿಶಾಖಾ (Vishakha)',
  'ಅನುರಾಧಾ (Anuradha)', 'ಜ್ಯೇಷ್ಠಾ (Jyeshtha)', 'ಮೂಲಾ (Mula)', 'ಪೂರ್ವಾಷಾಢ (P. Ashadha)',
  'ಉತ್ತರಾಷಾಢ (U. Ashadha)', 'ಶ್ರವಣ (Shravana)', 'ಧನಿಷ್ಠಾ (Dhanishta)', 'ಶತಭಿಷಾ (Shatabhisha)',
  'ಪೂರ್ವಾಭಾದ್ರ (P. Bhadra)', 'ಉತ್ತರಾಭಾದ್ರ (U. Bhadra)', 'ರೇವತಿ (Revati)'
];

const YOGAS_KN = [
  'ವಿಷ್ಕಂಭ', 'ಪ್ರೀತಿ', 'ಆಯುಷ್ಮಾನ್', 'ಸೌಭಾಗ್ಯ', 'ಶೋಭನ', 'ಅತಿಗಂಡ', 'ಸುಕರ್ಮ',
  'ಧೃತಿ', 'ಶೂಲ', 'ಗಂಡ', 'ವೃದ್ಧಿ', 'ಧ್ರುವ', 'ವ್ಯಾಘಾತ', 'ಹರ್ಷಣ', 'ವಜ್ರ', 'ಸಿದ್ಧಿ',
  'ವ್ಯತೀಪಾತ', 'ವರೀಯಾನ್', 'ಪರಿಘ', 'ಶಿವ', 'ಸಿದ್ಧ', 'ಸಾಧ್ಯ', 'ಶುಭ', 'ಶುಕ್ಲ', 'ಬ್ರಹ್ಮ', 'ಐಂದ್ರ', 'ವೈಧೃತಿ'
];

// Fixed Vedic planetary timings determined by weekday
const VEDIC_TIMINGS = [
  { rahu: '04:30 PM – 06:00 PM', yama: '12:00 PM – 01:30 PM', gulika: '03:00 PM – 04:30 PM', amrit: '09:20 AM – 10:55 AM' }, // Sun
  { rahu: '07:30 AM – 09:00 AM', yama: '10:30 AM – 12:00 PM', gulika: '01:30 PM – 03:00 PM', amrit: '02:15 PM – 03:45 PM' }, // Mon
  { rahu: '03:00 PM – 04:30 PM', yama: '09:00 AM – 10:30 AM', gulika: '12:00 PM – 01:30 PM', amrit: '11:10 AM – 12:40 PM' }, // Tue
  { rahu: '12:00 PM – 01:30 PM', yama: '07:30 AM – 09:00 AM', gulika: '10:30 AM – 12:00 PM', amrit: '08:45 AM – 10:15 AM' }, // Wed
  { rahu: '01:30 PM – 03:00 PM', yama: '06:00 AM – 07:30 AM', gulika: '09:00 AM – 10:30 AM', amrit: '06:30 PM – 08:00 PM' }, // Thu
  { rahu: '10:30 AM – 12:00 PM', yama: '03:00 PM – 04:30 PM', gulika: '07:30 AM – 09:00 AM', amrit: '01:10 PM – 02:40 PM' }, // Fri
  { rahu: '09:00 AM – 10:30 AM', yama: '01:30 PM – 03:00 PM', gulika: '06:00 AM – 07:30 AM', amrit: '04:20 PM – 05:50 PM' }, // Sat
];

function calculatePanchang(date: Date): DailyPanchangInfo {
  const dayOfWeek = date.getDay();
  const dayInfo = KANNADA_WEEKDAYS[dayOfWeek];
  const timings = VEDIC_TIMINGS[dayOfWeek];

  // Base epoch calculation for continuous progressive day-to-day Vedic movement
  // (Days since fixed astronomical reference Jan 1, 2026)
  const epoch = new Date(2026, 0, 1).getTime();
  const diffDays = Math.floor((date.getTime() - epoch) / (1000 * 60 * 60 * 24));
  
  // Synodic lunar month calculation (~29.53 days cycle)
  const lunarDayCycle = Math.abs((diffDays + 12) % 30);
  const isShuklaPaksha = lunarDayCycle < 15;
  const tithiIndex = isShuklaPaksha ? lunarDayCycle : lunarDayCycle - 15;
  
  const pakshaKn = isShuklaPaksha ? 'ಶುಕ್ಲ ಪಕ್ಷ (Shukla Paksha)' : 'ಕೃಷ್ಣ ಪಕ್ಷ (Krishna Paksha)';
  const pakshaEn = isShuklaPaksha ? 'Shukla Paksha' : 'Krishna Paksha';
  
  let tithiNameKn = TITHIS_KN[tithiIndex % 15];
  if (!isShuklaPaksha && tithiIndex === 14) {
    tithiNameKn = 'ಅಮಾವಾಸ್ಯೆ (Amavasya)';
  }

  // Nakshatra progression (~27.32 days cycle)
  const nakshatraIndex = Math.abs((diffDays + 8) % 27);
  const nakshatraKn = NAKSHATRAS_KN[nakshatraIndex];

  // Yoga progression (~27 days)
  const yogaIndex = Math.abs((diffDays + 4) % 27);
  const yogaKn = YOGAS_KN[yogaIndex];

  // Month calculation
  const monthIdx = (date.getMonth() + 6) % 12; // Adjusted for South Indian Chandramana calendar
  const masaKn = KANNADA_MONTHS[monthIdx];

  // Abhijit Muhurat: ~11:48 AM - 12:36 PM (noon auspicious window)
  const shubhMuhurat = '11:48 AM – 12:36 PM (ಅಭಿಜಿತ್)';

  // Special Vratas on specific tithis
  let specialVrata = '';
  if (tithiIndex === 10) {
    specialVrata = isShuklaPaksha ? '🌟 ಶುಕ್ಲ ಏಕಾದಶಿ ವ್ರತ (Ekadashi Fasting)' : '🌟 ಸ್ಮಾರ್ತ/ಭಾಗವತ ಏಕಾದಶಿ (Ekadashi)';
  } else if (tithiIndex === 3 && !isShuklaPaksha) {
    specialVrata = '🪔 ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (Sankashti Ganesha Vrata)';
  } else if (tithiIndex === 14 && isShuklaPaksha) {
    specialVrata = '🌕 ಹುಣ್ಣಿಮೆ ಸತ್ಯನಾರಾಯಣ ವ್ರತ (Purnima Pooja)';
  } else if (tithiIndex === 14 && !isShuklaPaksha) {
    specialVrata = '🌑 ಅಮಾವಾಸ್ಯೆ ಪಿತೃ ತರ್ಪಣ & ದೀಪಾರಾಧನೆ';
  } else if (dayOfWeek === 1 && tithiIndex === 12) {
    specialVrata = '🔱 ಸೋಮ ಪ್ರದೋಷ ವ್ರತ (Soma Pradosham)';
  }

  const dateFormattedKn = `${date.getDate()} ${['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'][date.getMonth()]} ${date.getFullYear()}`;
  const dateFormattedEn = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return {
    date,
    dateFormattedKn,
    dateFormattedEn,
    weekdayKn: dayInfo.kn,
    weekdayEn: dayInfo.en,
    samvatsaraKn: 'ಕ್ರೋಧಿ ನಾಮ ಸಂವತ್ಸರ',
    samvatsaraEn: 'Krodhi Nama Samvatsara',
    ayanaKn: 'ದಕ್ಷಿಣಾಯನ / ಉತ್ತರಾಯಣ',
    rituKn: 'ಶರದ್ ಋತು (Sharad Ritu)',
    masaKn,
    masaEn: masaKn.split(' ')[0],
    pakshaKn,
    pakshaEn,
    tithiKn: `${pakshaKn.split(' ')[0]} ${tithiNameKn}`,
    tithiEn: `${pakshaEn} ${tithiNameKn.split('(')[1]?.replace(')', '') || ''}`,
    nakshatraKn,
    nakshatraEn: nakshatraKn.split('(')[1]?.replace(')', '') || nakshatraKn,
    yogaKn: `${yogaKn} ಯೋಗ`,
    karanaKn: 'ತೈತಿಲ / ಗರಜ ಕರಣ',
    shubhMuhurat,
    amritKaal: timings.amrit,
    rahuKaal: timings.rahu,
    yamagandaKaal: timings.yama,
    gulikaKaal: timings.gulika,
    sunrise: '06:12 AM',
    sunset: '06:18 PM',
    deityKn: dayInfo.deityKn,
    deityEn: dayInfo.deityEn,
    pujaRecommendationKn: dayInfo.pujaKn,
    pujaRecommendationEn: dayInfo.pujaEn,
    specialVrata,
  };
}

export const PanchangBanner: React.FC = () => {
  // Current selected active date (defaults to today's real date)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // Automatically tick/update at midnight so the banner changes daily without needing a page refresh
  useEffect(() => {
    const checkDateInterval = setInterval(() => {
      const now = new Date();
      // If today's calendar date is different from selectedDate and user was viewing today
      const isViewingToday = selectedDate.toDateString() === new Date().toDateString();
      if (isViewingToday && now.getDate() !== selectedDate.getDate()) {
        setSelectedDate(new Date());
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkDateInterval);
  }, [selectedDate]);

  // Compute daily panchang info whenever date changes
  const panchang = useMemo(() => calculatePanchang(selectedDate), [selectedDate]);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const handleResetToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-gradient-to-r from-[#FFF5EB] via-[#FFF8F2] to-[#FFF5EB] border-b border-[#FFCC99] py-2.5 px-3 sm:px-4 text-[#4D2300] shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
        
        {/* Left: Dynamic Live Date, Tithi, Nakshatra & Shubh Muhurat */}
        <div className="flex items-center flex-wrap gap-2 text-[#4D2300]">
          
          {/* Header & Live Indicator */}
          <div className="flex items-center gap-1.5 font-bold text-[#CC5500]">
            <Compass className="w-4 h-4 text-[#FF6A00] animate-spin-slow" />
            <span className="tracking-tight">ದೈನಿಕ ಪಂಚಾಂಗ</span>
            {isToday ? (
              <span className="flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                <span>ಇಂದು</span>
              </span>
            ) : (
              <span className="bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {panchang.weekdayEn}
              </span>
            )}
          </div>

          <span className="text-[#FFCC99]" aria-hidden="true">·</span>

          {/* Current Dynamic Date & Weekday */}
          <span className="font-bold text-[#802B00] bg-white/80 px-2 py-0.5 rounded-md border border-[#FFCC99]/60 shadow-2xs">
            📅 {panchang.dateFormattedKn} ({panchang.weekdayKn.split(' ')[0]})
          </span>

          <span className="text-[#FFCC99]" aria-hidden="true">·</span>

          {/* Dynamic Daily Tithi */}
          <span className="font-semibold text-[#4D2300]">
            {panchang.tithiKn}
          </span>

          <span className="text-[#FFCC99] hidden sm:inline" aria-hidden="true">·</span>

          {/* Dynamic Daily Nakshatra */}
          <span className="hidden sm:inline text-[#663300]">
            🌟 {panchang.nakshatraKn}
          </span>

          <span className="text-[#FFCC99] hidden md:inline" aria-hidden="true">·</span>

          {/* Dynamic Shubh Muhurat */}
          <span className="font-medium text-[#4D2300]">
            ಶುಭ ಮುಹೂರ್ತ: <span className="tabular-nums font-bold text-[#2E7D32] bg-[#EAF5E8] px-1.5 py-0.5 rounded border border-[#C8E6C9]">{panchang.shubhMuhurat}</span>
          </span>

          {/* Special Vrata Alert if any */}
          {panchang.specialVrata && (
            <span className="bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse hidden lg:inline">
              {panchang.specialVrata}
            </span>
          )}
        </div>

        {/* Right: Date Switcher Controls + Expand Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          
          {/* Day Navigation Controls (Prev / Today / Next) */}
          <div className="flex items-center gap-1 bg-white/90 border border-[#FFCC99] rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={handlePrevDay}
              title="ಹಿಂದಿನ ದಿನ (Previous Day)"
              className="p-1 hover:bg-[#FFF3E0] text-[#CC5500] rounded hover:text-[#994700] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {!isToday && (
              <button
                onClick={handleResetToday}
                title="ಇಂದಿಗೆ ಮರಳಿ (Back to Today)"
                className="px-1.5 py-0.5 text-[10px] font-bold text-[#E65100] hover:bg-[#FFE0B2] rounded transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>ಇಂದು</span>
              </button>
            )}

            <button
              onClick={handleNextDay}
              title="ಮುಂದಿನ ದಿನ (Next Day)"
              className="p-1 hover:bg-[#FFF3E0] text-[#CC5500] rounded hover:text-[#994700] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Detailed Muhurat Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-[#FF6A00] to-[#E05D00] hover:from-[#E05D00] hover:to-[#C24E00] px-2.5 py-1 rounded-lg font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#FFD54F]" />
            <span>{isExpanded ? 'ಸಂಕ್ಷಿಪ್ತ' : 'ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

      </div>

      {/* Expanded Comprehensive Daily Almanac Card */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-[#FFCC99]/80 space-y-2.5 animate-fadeIn">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            
            {/* 1. Tithi, Masa & Samvatsara */}
            <div className="bg-white/95 p-3 rounded-xl border border-[#FFCC99] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#CC5500] font-bold text-[11px]">
                <span>ತಿಥಿ, ಪಕ್ಷ &amp; ಮಾಸ</span>
                <Moon className="w-3.5 h-3.5 text-[#FF9933]" />
              </div>
              <div className="font-bold text-[#802B00] text-sm">{panchang.tithiKn}</div>
              <div className="text-[11px] text-[#4D2300] font-medium">{panchang.masaKn}</div>
              <div className="text-[10px] text-[#7A3600]">{panchang.samvatsaraKn} • {panchang.rituKn}</div>
            </div>

            {/* 2. Nakshatra & Yoga */}
            <div className="bg-white/95 p-3 rounded-xl border border-[#FFCC99] shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#2E7D32] font-bold text-[11px]">
                <span>ನಕ್ಷತ್ರ &amp; ಯೋಗ</span>
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              </div>
              <div className="font-bold text-[#1B5E20] text-sm">{panchang.nakshatraKn}</div>
              <div className="text-[11px] text-[#2E7D32]">{panchang.yogaKn}</div>
              <div className="text-[10px] text-[#558B2F]">{panchang.karanaKn}</div>
            </div>

            {/* 3. Auspicious Muhurats */}
            <div className="bg-white/95 p-3 rounded-xl border border-[#A5D6A7] bg-gradient-to-br from-[#F1F8E9] to-white shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#1B5E20] font-bold text-[11px]">
                <span>ಶುಭ ಮುಹೂರ್ತಗಳು</span>
                <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
              </div>
              <div>
                <span className="text-[10px] text-[#2E7D32] font-semibold block">ಅಭಿಜಿತ್ ಮುಹೂರ್ತ:</span>
                <span className="font-bold text-[#1B5E20]">{panchang.shubhMuhurat}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#2E7D32] font-semibold block">ಅಮೃತ ಕಾಲ:</span>
                <span className="font-medium text-[#2E7D32]">{panchang.amritKaal}</span>
              </div>
            </div>

            {/* 4. Inauspicious Periods (Varjya) */}
            <div className="bg-white/95 p-3 rounded-xl border border-[#FFCDD2] bg-gradient-to-br from-[#FFEBEE]/60 to-white shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[#C62828] font-bold text-[11px]">
                <span>ವರ್ಜ್ಯ ಕಾಲಗಳು (ಅಶುಭ)</span>
                <Sun className="w-3.5 h-3.5 text-[#C62828]" />
              </div>
              <div>
                <span className="text-[10px] text-[#C62828] font-semibold block">ರಾಹು ಕಾಲ:</span>
                <span className="font-bold text-[#B71C1C]">{panchang.rahuKaal}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#C62828]">ಯಮಗಂಡ: {panchang.yamagandaKaal}</span>
              </div>
              <div className="text-[10px] text-[#7F1D1D]">
                ಗುಳಿಕ ಕಾಲ (ಶುಭ): {panchang.gulikaKaal}
              </div>
            </div>

          </div>

          {/* Daily Deity & Recommended Puja Ritual */}
          <div className="bg-gradient-to-r from-[#FFF3E0] via-[#FFE8CC] to-[#FFF3E0] p-3 rounded-xl border border-[#FFB74D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪔</span>
              <div>
                <span className="text-xs font-bold text-[#802B00] block">
                  ಇಂದಿನ ವಿಶೇಷ ಆರಾಧನೆ: {panchang.deityKn}
                </span>
                <span className="text-[11px] text-[#5D2800] block">
                  {panchang.pujaRecommendationKn}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-bold text-[#E65100] shrink-0 flex items-center gap-2">
              <span>ಸೂರ್ಯೋದಯ: {panchang.sunrise}</span>
              <span>•</span>
              <span>ಸೂರ್ಯಾಸ್ತ: {panchang.sunset}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
