import React, { useState, useEffect } from 'react';
import { Language, PoojaService, PurohitBookingRequest } from '../types';
import { POOJA_SERVICES, CONTACT_INFO } from '../data/poojaData';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { templeAudio } from '../utils/audioChant';

interface PurohitBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  preselectedService?: PoojaService | null;
  onBookingSubmitted: (booking: PurohitBookingRequest, proceedToPay?: boolean) => void;
}

export const PurohitBookingModal: React.FC<PurohitBookingModalProps> = ({
  isOpen,
  onClose,
  lang,
  preselectedService,
  onBookingSubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [poojaType, setPoojaType] = useState(
    preselectedService ? (lang === 'kn' ? preselectedService.nameKn : preselectedService.nameEn) : (lang === 'kn' ? 'ನವಗ್ರಹ ಶಾಂತಿ ಹೋಮ' : 'Navagraha Shanti Homa')
  );

  useEffect(() => {
    if (preselectedService) {
      setPoojaType(lang === 'kn' ? preselectedService.nameKn : preselectedService.nameEn);
    }
  }, [preselectedService, lang]);
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

  if (!isOpen) return null;

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
      message: (message.trim().slice(0, 1000) + (includeMaterialsKit ? ' [Includes Full Recommended Materials Kit]' : '')).slice(0, 1000),
      status: 'confirmed',
      purohitName: 'Pt. Vidyadhar Shastri (Rigveda Purohit)'
    };

    setSubmittedBooking(booking);
    setIsSuccess(true);
    setIsSubmitting(false);
    onBookingSubmitted(booking, false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DFD6C7] flex flex-col p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#EFECE6] text-[#241F1A] border border-[#DDD4C5] flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="space-y-1 mb-6 border-b border-[#EAE3D6] pb-4">
              <span className="text-[11px] font-bold text-[#FF6A00] uppercase tracking-wider block">
                {lang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಪುರೋಹಿತರ ಸೇವೆ' : 'Authentic Vedic Purohit Booking'}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#241F1A]">
                {lang === 'kn' ? 'ಪುರೋಹಿತರನ್ನು ನಿಗದಿ ಮಾಡಿ' : 'Book an Experienced Purohit'}
              </h2>
              <p className="text-xs text-[#6B5E50]">
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ಶುಭ ದಿನಾಂಕ ಮತ್ತು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ವೇದ ಪಂಡಿತರನ್ನು ಕಾಯ್ದಿರಿಸಿ.'
                  : 'Schedule verified, knowledgeable Vedic purohits for your home rituals.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {validationError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                  {validationError}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#5C5248] font-semibold mb-1">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು / Full Name *' : 'Full Name *'}
                  </label>
                  <div className="flex items-center bg-[#FAF7F2] border border-[#D5CBBC] rounded-lg px-2.5 py-2">
                    <User className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಉದಾ: ನಂದನ್' : 'e.g. Nandan Sharma'}
                      className="w-full bg-transparent outline-none text-[#241F1A] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5C5248] font-semibold mb-1">
                    {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ / Mobile *' : 'Mobile Number *'}
                  </label>
                  <div className="flex items-center bg-[#FAF7F2] border border-[#D5CBBC] rounded-lg px-2.5 py-2">
                    <Phone className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-transparent outline-none text-[#241F1A] text-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#5C5248] font-semibold mb-1">
                    {lang === 'kn' ? 'ಪೂಜೆಯ ಹೆಸರು / Select Pooja Type *' : 'Select Pooja Type *'}
                  </label>
                  <select
                    value={poojaType}
                    onChange={(e) => setPoojaType(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D5CBBC] rounded-lg px-3 py-2 text-xs text-[#241F1A] outline-none"
                  >
                    {POOJA_SERVICES.map((s) => (
                      <option key={s.id} value={`${s.nameKn} / ${s.nameEn}`}>
                        {lang === 'kn' ? `${s.nameKn} - ₹${s.price}` : `${s.nameEn} - ₹${s.price}`}
                      </option>
                    ))}
                    <option value="ಇತರೆ ವಿಶೇಷ ಪೂಜೆ / Other Special Ritual">
                      {lang === 'kn' ? 'ಇತರೆ ವಿಶೇಷ ಪೂಜೆ / ಹೋಮ' : 'Other Custom Pooja / Homa'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5C5248] font-semibold mb-1">
                    {lang === 'kn' ? 'ದಿನಾಂಕ / Date *' : 'Date *'}
                  </label>
                  <div className="flex items-center bg-[#FAF7F2] border border-[#D5CBBC] rounded-lg px-2.5 py-2">
                    <Calendar className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent outline-none text-[#241F1A] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5C5248] font-semibold mb-1">
                    {lang === 'kn' ? 'ಸಮಯ / Muhurat Time *' : 'Muhurat Time *'}
                  </label>
                  <div className="flex items-center bg-[#FAF7F2] border border-[#D5CBBC] rounded-lg px-2.5 py-2">
                    <Clock className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-transparent outline-none text-[#241F1A] text-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#5C5248] font-semibold mb-1">
                    {lang === 'kn' ? 'ಸ್ಥಳ & ನಗರ / Location *' : 'Location & City *'}
                  </label>
                  <div className="flex items-center bg-[#FAF7F2] border border-[#D5CBBC] rounded-lg px-2.5 py-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      maxLength={200}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಶಿವಮೊಗ್ಗ, ಬೆಂಗಳೂರು ಇತ್ಯಾದಿ' : 'Shivamogga, Bengaluru, etc.'}
                      className="w-full bg-transparent outline-none text-[#241F1A] text-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#5C5248] font-semibold mb-1">
                    {lang === 'kn' ? 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ / Additional Requirement' : 'Additional Info or Special Request'}
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === 'kn' ? 'ಗೋತ್ರ, ನಕ್ಷತ್ರ ಅಥವಾ ನಿರ್ದಿಷ್ಟ ಸಂಕಲ್ಪ...' : 'Gotra, nakshatra, or specific sankalpa notes...'}
                    className="w-full bg-[#FAF7F2] border border-[#D5CBBC] rounded-lg p-2.5 text-xs text-[#241F1A] outline-none"
                  />
                </div>
              </div>

              {/* Bundle Materials Kit Checkbox */}
              <div className="bg-[#FFF4E8] border border-[#FFD1A4] p-3 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="includeMaterials"
                  checked={includeMaterialsKit}
                  onChange={(e) => setIncludeMaterialsKit(e.target.checked)}
                  className="accent-[#FF6A00] w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label htmlFor="includeMaterials" className="text-xs text-[#4D2300] cursor-pointer">
                  <strong className="block font-semibold">
                    {lang === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಸಂಪೂರ್ಣ ಕಿಟ್ ಸೇರಿಸಿ' : 'Include Complete Verified Pooja Materials Kit'}
                  </strong>
                  <span className="text-[11px] text-[#8C4700]">
                    {lang === 'kn'
                      ? 'ಮಂಗಳ ದ್ರವ್ಯ, ನವಧಾನ್ಯ, ಸಮಿತ್ತು ಮತ್ತು ಪವಿತ್ರ ವಸ್ತುಗಳನ್ನು ಪುರೋಹಿತರೊಂದಿಗೆ ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.'
                      : 'All required samagri, woods, flowers, and holy water will be arranged and verified by the purohit.'}
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#FF6A00] hover:bg-[#CC5500] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (lang === 'kn' ? 'ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Registering...')
                      : (lang === 'kn' ? 'ವಿನಂತಿ ಸಲ್ಲಿಸಿ & ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಿ' : 'Submit Request & Confirm Booking')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F2E6] text-[#2D5A27] mx-auto flex items-center justify-center border border-[#BDE0B8]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-[#FF6A00] block">
                BOOKING ID: {submittedBooking?.id}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#241F1A]">
                {lang === 'kn' ? 'ವಿನಂತಿ ದಾಖಲಿಸಲಾಗಿದೆ!' : 'Purohit Request Registered!'}
              </h3>
              <p className="text-xs text-[#5C5248] max-w-sm mx-auto">
                {lang === 'kn'
                  ? `ಧನ್ಯವಾದಗಳು ${submittedBooking?.name}! ನಿಮ್ಮ ಪೂಜಾ ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ಪುರೋಹಿತರು ಶೀಘ್ರವೇ ${submittedBooking?.phone} ಗೆ ಕರೆ ಮಾಡಿ ಮುಹೂರ್ತವನ್ನು ಖಚಿತಪಡಿಸುತ್ತಾರೆ.`
                  : `Thank you ${submittedBooking?.name}! Your request has been confirmed. Our Vedic scholar will connect at ${submittedBooking?.phone} shortly to coordinate final details.`}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DFD6C7] text-left text-xs space-y-1.5 text-[#4D2300]">
              <div className="flex justify-between">
                <span className="text-[#8C827A]">Pooja Type:</span>
                <span className="font-semibold">{submittedBooking?.poojaType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C827A]">Date & Time:</span>
                <span className="font-semibold">{submittedBooking?.date} at {submittedBooking?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C827A]">Assigned Scholar:</span>
                <span className="font-semibold text-[#2D5A27]">{submittedBooking?.purohitName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C827A]">Contact Helpline:</span>
                <span className="font-semibold text-[#FF6A00]">{CONTACT_INFO.phone}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-[#FAF7F2] hover:bg-[#EFECE6] border border-[#D5CBBC] text-[#241F1A] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
              </button>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                  onBookingSubmitted(submittedBooking!, true); // Proceed to secure gateway for advance/full payment
                }}
                className="flex-1 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಮುಂಗಡ ಪಾವತಿಸಿ' : 'Pay via Gateway'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
