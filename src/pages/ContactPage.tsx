import React, { useState } from 'react';
import { Language } from '../types';
import { CONTACT_INFO } from '../data/poojaData';
import { Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, AlertCircle, Mail, User } from 'lucide-react';
import { templeAudio } from '../utils/audioChant';
import { contactApi } from '../services/api';

interface ContactPageProps {
  lang: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');
  const [hpField, setHpField] = useState(''); // Anti-bot honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !query.trim()) return;

    // Client-side phone format verification (10-15 digits)
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setErrorMsg(
        lang === 'kn'
          ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await contactApi.submitInquiry({
        name: name.trim().slice(0, 100),
        phone: phone.trim().slice(0, 20),
        query: query.trim().slice(0, 1000),
        hp_field: hpField,
      });

      if (res.success) {
        templeAudio.playTempleBell();
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || (lang === 'kn' ? 'ಸಂದೇಶ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ' : 'Failed to send inquiry'));
      }
    } catch {
      setErrorMsg(lang === 'kn' ? 'ಸರ್ವರ್ ಸಂಪರ್ಕ ದೋಷ' : 'Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="py-12 sm:py-16 bg-[#FFFDF9] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A00] block">
            {lang === 'kn' ? 'ನೇರ ಸಂಪರ್ಕ & ಕೇಂದ್ರ' : 'Contact & Sanctuary Center'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4D2300]">
            {lang === 'kn' ? 'ಸನಾತನ ಸೇವೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ' : 'Get in Touch with Sanaatana'}
          </h1>
          <p className="text-sm text-[#994700]">
            {lang === 'kn'
              ? 'ಧಾರ್ಮಿಕ ಕಾರ್ಯಗಳಿಗೆ ಪುರೋಹಿತರು ಮತ್ತು ಪೂಜಾ ಸಾಮಾಗ್ರಿಗಳಿಗೆ ಇಂದೇ ಸಂಪರ್ಕಿಸಿ.'
              : 'Reach out for reliable purohits, consecrated samagri kits, and muhurat guidance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FFF8F2] p-6 rounded-2xl border border-[#FFCC99] space-y-4">
              {/* Contact Person */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ / ನಿರ್ವಾಹಕರು' : 'Contact Person / Coordinator'}
                  </strong>
                  <span className="font-serif text-xl font-bold text-[#4D2300] block my-0.5">
                    {lang === 'kn' ? 'ರಾಮಚಂದ್ರ ಎಂ' : 'Ramachandra M'}
                  </span>
                  <span className="text-xs text-[#8C4700]">
                    {lang === 'kn' ? 'ಶ್ರೀ ಆಂಜನೇಯ ದೇವಾಲಯ, ಅರಕೆರೆ' : 'Anjaneya Temple, Arakere'}
                  </span>
                </div>
              </div>

              {/* Direct Helpline */}
              <div className="pt-4 border-t border-[#FFE5CC] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ನೇರ ಸಹಾಯವಾಣಿ / ಮೊಬೈಲ್' : 'Direct Helpline / Mobile'}
                  </strong>
                  <a
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="font-serif text-2xl font-bold text-[#CC5500] hover:text-[#994700] tracking-wide block my-1 transition-colors"
                  >
                    {CONTACT_INFO.displayPhone}
                  </a>
                  <span className="text-xs text-[#8C4700]">
                    {lang === 'kn' ? 'ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ ರಾತ್ರಿ 9:00 ವರೆಗೆ' : 'Available Daily: 6:00 AM – 9:00 PM IST'}
                  </span>
                </div>
              </div>

              {/* Email Address */}
              <div className="pt-4 border-t border-[#FFE5CC] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ಅಧಿಕೃತ ಇಮೇಲ್' : 'Official Email'}
                  </strong>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-sm font-bold text-[#CC5500] hover:text-[#994700] break-all block mt-1 transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              {/* Temple Address */}
              <div className="pt-4 border-t border-[#FFE5CC] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ವಿಳಾಸ & ದೇವಸ್ಥಾನ' : 'Temple Address & Location'}
                  </strong>
                  <p className="text-xs text-[#663000] mt-1 leading-relaxed font-medium">
                    {lang === 'kn'
                      ? 'ಶ್ರೀ ಆಂಜನೇಯ ದೇವಾಲಯ, ಅರಕೆರೆ, ಶಿವಮೊಗ್ಗ, ಕರ್ನಾಟಕ'
                      : 'Anjaneya Temple, Arakere, Shivamogga, Karnataka, India'}
                  </p>
                </div>
              </div>

              {/* Coverage Area */}
              <div className="pt-4 border-t border-[#FFE5CC] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ಸೇವೆ ವ್ಯಾಪ್ತಿ' : 'Coverage Area'}
                  </strong>
                  <p className="text-xs text-[#663000] mt-1">
                    {lang === 'kn'
                      ? 'ಶಿವಮೊಗ್ಗ, ಅರಕೆರೆ, ಭದ್ರಾವತಿ, ತೀರ್ಥಹಳ್ಳಿ, ಸಾಗರ ಹಾಗೂ ಕರ್ನಾಟಕದಾದ್ಯಂತ.'
                      : 'Shivamogga, Arakere, Bhadravati, Thirthahalli, Sagara, and across Karnataka.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#FFCC99] shadow-xs">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#FF6A00] font-bold block mb-1">
                    {lang === 'kn' ? 'ತ್ವರಿತ ವಿಚಾರಣೆ' : 'Quick Inquiry'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ' : 'Send us a Message'}
                  </h3>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Anti-spam honeypot (hidden from human users, catches spam bots) */}
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
                      {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಉದಾ: ನಂದನ್' : 'e.g. Nandan'}
                      className="w-full px-3 py-2 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#663000] font-semibold mb-1">
                      {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#663000] font-semibold mb-1">
                      {lang === 'kn' ? 'ನಿಮ್ಮ ವಿಚಾರಣೆ / ಸಂದೇಶ *' : 'Your Inquiry or Requirement *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      maxLength={1000}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಯಾವ ಪೂಜೆ, ದಿನಾಂಕ ಅಥವಾ ಸಾಮಗ್ರಿಯ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು?' : 'Which pooja, date, or materials do you need assistance with?'}
                      className="w-full p-3 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#FF6A00] hover:bg-[#CC5500] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (lang === 'kn' ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'Sending...')
                      : (lang === 'kn' ? 'ಸಂದೇಶ ಕಳುಹಿಸಿ' : 'Send Message')}
                  </span>
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#E8F2E6] text-[#2D5A27] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#4D2300]">
                  {lang === 'kn' ? 'ಸಂದೇಶ ತಲುಪಿದೆ!' : 'Message Received!'}
                </h3>
                <p className="text-xs text-[#8C4700] max-w-sm mx-auto">
                  {lang === 'kn'
                    ? `ಧನ್ಯವಾದಗಳು ${name}! ನಮ್ಮ ಪ್ರತಿನಿಧಿಗಳು ಶೀಘ್ರವೇ ನಿಮ್ಮನ್ನು ${phone} ಸಂಖ್ಯೆಯಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.`
                    : `Thank you ${name}! Our temple coordinator will get back to you shortly at ${phone}.`}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 bg-[#FFE5CC] text-[#4D2300] text-xs font-bold rounded-lg cursor-pointer"
                >
                  {lang === 'kn' ? 'ಇನ್ನೊಂದು ಸಂದೇಶ ಕಳುಹಿಸಿ' : 'Send Another Inquiry'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
