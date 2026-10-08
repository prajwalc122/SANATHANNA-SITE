import React, { useState } from 'react';
import { Language, PoojaService, PurohitBookingRequest } from '../types';
import { POOJA_SERVICES, CONTACT_INFO, INDIAN_CULTURE_BG } from '../data/poojaData';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle2, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { templeAudio } from '../utils/audioChant';

interface BookingPageProps {
  lang: Language;
  onBookingSubmitted: (booking: PurohitBookingRequest, proceedToPay?: boolean) => void;
  initialService?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({ lang, onBookingSubmitted, initialService }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [poojaType, setPoojaType] = useState(
    initialService || (lang === 'kn' ? 'ನವಗ್ರಹ ಶಾಂತಿ ಹೋಮ / Navagraha Shanti Homa' : 'Navagraha Shanti Homa / ನವಗ್ರಹ ಶಾಂತಿ ಹೋಮ')
  );
  const [date, setDate] = useState('2026-10-02');
  const [time, setTime] = useState('09:30');
  const [location, setLocation] = useState('Shivamogga / ಶಿವಮೊಗ್ಗ');
  const [message, setMessage] = useState('');
  const [includeMaterialsKit, setIncludeMaterialsKit] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<PurohitBookingRequest | null>(null);
  const [hpField, setHpField] = useState(''); // Anti-bot honeypot
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date) return;

    // Check honeypot
    if (hpField) {
      return;
    }

    const cleanPhoneDigits = phone.replace(/\D/g, '');
    if (cleanPhoneDigits.length < 10 || cleanPhoneDigits.length > 15) {
      setValidationError(
        lang === 'kn'
          ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    setValidationError('');
    setIsSubmitting(true);
    templeAudio.playTempleBell();

    const booking: PurohitBookingRequest = {
      id: `BK-PUR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 20),
      poojaType: poojaType.slice(0, 120),
      date: date.slice(0, 30),
      time: time.slice(0, 20),
      location: location.trim().slice(0, 200),
      message: (message.trim().slice(0, 1000) + (includeMaterialsKit ? ' [Includes Full Verified Materials Kit]' : '')).slice(0, 1000),
      status: 'confirmed',
      purohitName: 'Pt. Vidyadhar Shastri (Rigveda Purohit)'
    };

    setSubmittedBooking(booking);
    setIsSuccess(true);
    setIsSubmitting(false);
    onBookingSubmitted(booking, false);
  };

  return (
    <div id="booking" className="relative py-12 sm:py-16 bg-[#FFFDF9] min-h-[80vh] overflow-hidden">
      {/* Background Indian Cultural Heritage Layer */}
      <div className="absolute top-0 inset-x-0 h-96 pointer-events-none opacity-20">
        <img
          src={INDIAN_CULTURE_BG}
          alt="Indian cultural heritage"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/40 via-[#FFFDF9]/80 to-[#FFFDF9]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4D2300]">
            {lang === 'kn' ? 'ಪುರೋಹಿತರನ್ನು ನಿಗದಿ ಮಾಡಿ' : 'Book an Experienced Purohit'}
          </h1>

          <p className="text-sm text-[#994700] max-w-xl mx-auto">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಶುಭ ದಿನಾಂಕ, ಮುಹೂರ್ತ ಹಾಗೂ ಸ್ಥಳಕ್ಕೆ ಸರಿಯಾಗಿ ಶಾಸ್ತ್ರಜ್ಞರನ್ನು ಸುಲಭವಾಗಿ ಕಾಯ್ದಿರಿಸಿ.'
              : 'Book knowledgeable, verified Vedic purohits for your auspicious muhurat across Karnataka.'}
          </p>
        </div>

        {!isSuccess ? (
          <div className="bg-white rounded-3xl border-2 border-[#FFCC99] p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <span>{validationError}</span>
                </div>
              )}

              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="website_url_hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={hpField}
                onChange={(e) => setHpField(e.target.value)}
                className="hidden opacity-0 absolute -z-10 pointer-events-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು *' : 'Devotee Full Name *'}
                  </label>
                  <div className="flex items-center bg-[#FFF8F2] border border-[#FFCC99] rounded-xl px-3 py-2.5">
                    <User className="w-4 h-4 text-[#994700] mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nandan Sharma"
                      className="w-full bg-transparent outline-none text-[#4D2300]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'Mobile Number *'}
                  </label>
                  <div className="flex items-center bg-[#FFF8F2] border border-[#FFCC99] rounded-xl px-3 py-2.5">
                    <Phone className="w-4 h-4 text-[#994700] mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-transparent outline-none text-[#4D2300]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಪೂಜೆಯ ಪ್ರಕಾರ ಆಯ್ಕೆ ಮಾಡಿ *' : 'Select Pooja Service *'}
                  </label>
                  <select
                    value={poojaType}
                    onChange={(e) => setPoojaType(e.target.value)}
                    className="w-full bg-[#FFF8F2] border border-[#FFCC99] rounded-xl px-3 py-2.5 text-xs text-[#4D2300] outline-none"
                  >
                    {POOJA_SERVICES.map((s) => (
                      <option key={s.id} value={`${s.nameKn} / ${s.nameEn}`}>
                        {lang === 'kn' ? `${s.nameKn} - ₹${s.price}` : `${s.nameEn} - ₹${s.price}`}
                      </option>
                    ))}
                    <option value="ಇತರೆ ವಿಶೇಷ ಪೂಜೆ / Other Custom Ritual">
                      {lang === 'kn' ? 'ಇತರೆ ವಿಶೇಷ ಪೂಜೆ / ಹೋಮ' : 'Other Custom Ritual / Homa'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ದಿನಾಂಕ *' : 'Pooja Date *'}
                  </label>
                  <div className="flex items-center bg-[#FFF8F2] border border-[#FFCC99] rounded-xl px-3 py-2.5">
                    <Calendar className="w-4 h-4 text-[#994700] mr-2 shrink-0" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent outline-none text-[#4D2300]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಮುಹೂರ್ತ ಸಮಯ *' : 'Muhurat Time *'}
                  </label>
                  <div className="flex items-center bg-[#FFF8F2] border border-[#FFCC99] rounded-xl px-3 py-2.5">
                    <Clock className="w-4 h-4 text-[#994700] mr-2 shrink-0" />
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-transparent outline-none text-[#4D2300]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಸ್ಥಳ & ನಗರ *' : 'Venue Address & City *'}
                  </label>
                  <div className="flex items-center bg-[#FFF8F2] border border-[#FFCC99] rounded-xl px-3 py-2.5">
                    <MapPin className="w-4 h-4 text-[#994700] mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      maxLength={200}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಶಿವಮೊಗ್ಗ, ವಿನೋಬನಗರ' : 'Shivamogga, Vinobha Nagara'}
                      className="w-full bg-transparent outline-none text-[#4D2300]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ವಿಶೇಷ ಸಂಕಲ್ಪ ಅಥವಾ ಸಂದೇಶ' : 'Special Sankalpa Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === 'kn' ? 'ಕುಟುಂಬದ ಗೋತ್ರ, ನಕ್ಷತ್ರ ಅಥವಾ ಇತರ ವಿವರ...' : 'Gotra, nakshatra, or specific prayer intention...'}
                    className="w-full bg-[#FFF8F2] border border-[#FFCC99] rounded-xl p-3 text-xs text-[#4D2300] outline-none"
                  />
                </div>
              </div>

              {/* Materials Kit Checkbox */}
              <div className="bg-[#FFF0E0] border border-[#FFCC99] p-4 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="includeMaterialsPage"
                  checked={includeMaterialsKit}
                  onChange={(e) => setIncludeMaterialsKit(e.target.checked)}
                  className="accent-[#FF6A00] w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label htmlFor="includeMaterialsPage" className="text-xs text-[#4D2300] cursor-pointer">
                  <strong className="block font-bold">
                    {lang === 'kn' ? 'ಸಂಪೂರ್ಣ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಕಿಟ್ ಸೇರಿಸಿ' : 'Include Complete Essential Materials Kit'}
                  </strong>
                  <span className="text-[11px] text-[#8C4700]">
                    {lang === 'kn'
                      ? 'ಮಂಗಳ ದ್ರವ್ಯ, ಸಮಿತ್ತು, ಪುಷ್ಪ, ನವಧಾನ್ಯ ಹಾಗೂ ಪಾತ್ರೆಗಳನ್ನು ಪುರೋಹಿತರೊಂದಿಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.'
                      : 'All required woods, grains, flower garlands, and holy waters will be brought by the scholar.'}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#FF6A00] hover:bg-[#CC5500] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (lang === 'kn' ? 'ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Registering...')
                    : (lang === 'kn' ? 'ವಿನಂತಿ ಸಲ್ಲಿಸಿ & ಬುಕಿಂಗ್ ಕಾಯ್ದಿರಿಸಿ' : 'Confirm Purohit Booking')}
                </span>
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-[#FFCC99] p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E8F2E6] text-[#2D5A27] mx-auto flex items-center justify-center border border-[#BDE0B8]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#FF6A00]">
                BOOKING ID: {submittedBooking?.id}
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#4D2300]">
                {lang === 'kn' ? 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!' : 'Purohit Booking Confirmed!'}
              </h2>
              <p className="text-xs text-[#8C4700] max-w-md mx-auto">
                {lang === 'kn'
                  ? `ಧನ್ಯವಾದಗಳು ${submittedBooking?.name}! ನಿಮ್ಮ ಪೂಜಾ ವಿನಂತಿಯನ್ನು ನಿಗದಿಪಡಿಸಲಾಗಿದೆ. ಪುರೋಹಿತರು ${submittedBooking?.phone} ಗೆ ಕರೆ ಮಾಡಿ ಮುಹೂರ್ತವನ್ನು ಸಂಯೋಜಿಸುತ್ತಾರೆ.`
                  : `Thank you ${submittedBooking?.name}! Your request has been confirmed. The designated scholar will coordinate with you at ${submittedBooking?.phone}.`}
              </p>
            </div>

            <div className="max-w-md mx-auto bg-[#FFF8F2] p-4 rounded-2xl border border-[#FFCC99] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#994700]">Pooja Type:</span>
                <span className="font-bold text-[#4D2300]">{submittedBooking?.poojaType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#994700]">Date & Time:</span>
                <span className="font-bold text-[#4D2300]">{submittedBooking?.date} at {submittedBooking?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#994700]">Designated Scholar:</span>
                <span className="font-bold text-[#2D5A27]">{submittedBooking?.purohitName}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 bg-[#FFE5CC] hover:bg-[#FFD1A4] text-[#4D2300] text-xs font-bold rounded-xl cursor-pointer"
              >
                {lang === 'kn' ? 'ಹೊಸ ಬುಕಿಂಗ್ ಮಾಡಿ' : 'Book Another Pooja'}
              </button>

              <button
                onClick={() => onBookingSubmitted(submittedBooking!, true)}
                className="px-6 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ದಕ್ಷಿಣಾ ಮುಂಗಡ ಪಾವತಿಸಿ' : 'Pay via Secure Gateway'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
