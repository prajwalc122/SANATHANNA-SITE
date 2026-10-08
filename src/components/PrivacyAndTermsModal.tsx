import React, { useState } from 'react';
import { Language } from '../types';
import { X, Shield, Lock, FileText, CheckCircle2, HeartHandshake } from 'lucide-react';

interface PrivacyAndTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'privacy' | 'terms';
}

export const PrivacyAndTermsModal: React.FC<PrivacyAndTermsModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#FFCC99] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FFF8F2] border-b border-[#FFE5CC] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE5CC] flex items-center justify-center text-[#FF6A00]">
              {activeTab === 'privacy' ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#4D2300]">
                {activeTab === 'privacy'
                  ? (lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ & ಡೇಟಾ ಭದ್ರತೆ' : 'Privacy Policy & Data Security')
                  : (lang === 'kn' ? 'ಸೇವಾ ನಿಯಮಗಳು & ಷರತ್ತುಗಳು' : 'Terms of Service & Ritual Guidelines')}
              </h2>
              <span className="text-[11px] text-[#994700]">
                {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆ • ಭಕ್ತಿ, ವಿಶ್ವಾಸ ಹಾಗೂ ಸುರಕ್ಷತೆ' : 'Pooja Seve • Devotion, Trust & Protection'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-[#FFE5CC] p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activeTab === 'privacy' ? 'bg-[#FF6A00] text-white shadow-xs' : 'text-[#663000] hover:text-[#4D2300]'
                }`}
              >
                {lang === 'kn' ? 'ಗೌಪ್ಯತೆ' : 'Privacy'}
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activeTab === 'terms' ? 'bg-[#FF6A00] text-white shadow-xs' : 'text-[#663000] hover:text-[#4D2300]'
                }`}
              >
                {lang === 'kn' ? 'ನಿಯಮಗಳು' : 'Terms'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#994700] hover:text-[#4D2300] hover:bg-[#FFE5CC] rounded-lg transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#4D2300] leading-relaxed">
          {activeTab === 'privacy' ? (
            <div className="space-y-5">
              <div className="bg-[#E8F2E6] border border-[#BDE0B8] p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#2D5A27] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#2D5A27] text-sm">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳ ಪೂರ್ಣ ರಕ್ಷಣೆ' : 'Strict Confidentiality of Devotee Data'}
                  </h3>
                  <p className="text-[#3F6638] text-[11px] mt-0.5">
                    {lang === 'kn'
                      ? 'ನಿಮ್ಮ ಹೆಸರು, ದೂರವಾಣಿ, ಗೋತ್ರ ಮತ್ತು ವಿಳಾಸದ ಮಾಹಿತಿಯನ್ನು ಕೇವಲ ಪೂಜಾ ಸಂಕಲ್ಪ ಮತ್ತು ಸಾಮಗ್ರಿ ವಿತರಣೆಗಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಮಾರಾಟ ಮಾಡಲಾಗುವುದಿಲ್ಲ.'
                      : 'We only collect essential details (Name, Phone, Gotra, Delivery Location) strictly for ritual sankalpa and timely samagri delivery. We never share or sell customer data.'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#803C00]">
                  {lang === 'kn' ? '1. ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ' : '1. Information We Collect'}
                </h4>
                <p>
                  {lang === 'kn'
                    ? 'ಭಕ್ತರು ಪೂಜೆ ನಿಗದಿಪಡಿಸುವಾಗ ಅಥವಾ ಸಾಮಗ್ರಿ ಆರ್ಡರ್ ಮಾಡುವಾಗ ನೀಡುವ ಹೆಸರು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ಮುಹೂರ್ತ ದಿನಾಂಕ, ವಿಳಾಸ ಮತ್ತು ಸಂಕಲ್ಪದ ಗೋತ್ರ/ನಕ್ಷತ್ರ ವಿವರಗಳನ್ನು ಮಾತ್ರ ದಾಖಲಿಸಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.'
                    : 'We collect your name, mobile contact, delivery address, preferred muhurat date/time, and sacred sankalpa details (such as Gotra or Nakshatra when provided) solely to fulfill your spiritual rituals.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#803C00]">
                  {lang === 'kn' ? '2. ಸುರಕ್ಷಿತ ಪಾವತಿ & ವಹಿವಾಟುಗಳು' : '2. Secure Transactions & Payments'}
                </h4>
                <p>
                  {lang === 'kn'
                    ? 'ಎಲ್ಲಾ ಆನ್‌ಲೈನ್ ಪಾವತಿಗಳು ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ (RBI) ಅನುಮೋದಿತ 256-ಬಿಟ್ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಆದ ಪಾವತಿ ಗೇಟ್‌ವೇ (Razorpay / UPI Intent) ಮೂಲಕ ನಡೆಯುತ್ತವೆ. ನಿಮ್ಮ ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಅಥವಾ ಯುಪಿಐ ಪಿನ್ ನಮ್ಮ ಸರ್ವರ್‌ನಲ್ಲಿ ಎಂದಿಗೂ ಶೇಖರವಾಗುವುದಿಲ್ಲ.'
                    : 'All electronic payments are processed through secure 256-bit encrypted channels (Razorpay and direct UPI). We never store your card numbers, CVVs, or UPI PINs on our servers.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#803C00]">
                  {lang === 'kn' ? '3. ಸರ್ವರ್ ಹಾಗೂ ಡೇಟಾಬೇಸ್ ಭದ್ರತೆ' : '3. Server & Database Security'}
                </h4>
                <p>
                  {lang === 'kn'
                    ? 'ವೆಬ್‌ಸೈಟ್ HTTPS ಎನ್‌ಕ್ರಿಪ್ಶನ್, ಕಠಿಣ ಭದ್ರತಾ ಹೆಡರ್‌ಗಳು (CSP, HSTS, X-Content-Type-Options), ಮತ್ತು ದರ ನಿರ್ಬಂಧ (Rate Limiting) ಹೊಂದಿರುತ್ತದೆ. ಅನಧಿಕೃತ ವ್ಯಕ್ತಿಗಳು ಭಕ್ತರ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸದಂತೆ ರಕ್ಷಿಸಲಾಗಿದೆ.'
                    : 'Our architecture enforces enterprise-grade security including HTTP Strict Transport Security (HSTS), Content Security Policy, strict role-based admin authorization, and multi-tier rate limiting to prevent unauthorized access and data harvesting.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#803C00]">
                  {lang === 'kn' ? '4. ನಿಮ್ಮ ಹಕ್ಕುಗಳು' : '4. Devotee Rights & Data Removal'}
                </h4>
                <p>
                  {lang === 'kn'
                    ? 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಅಥವಾ ಡೇಟಾಬೇಸ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲು ಬಯಸಿದರೆ ನಮ್ಮ ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ನಿರ್ವಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು.'
                    : 'You have the right to inspect, update, or request the deletion of your booking contact record at any time by contacting our sanctuary administration directly.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-[#FFF8F2] border border-[#FFCC99] p-4 rounded-xl flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-[#FF6A00] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#803C00] text-sm">
                    {lang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಸೇವಾ ಬದ್ಧತೆ' : 'Authentic Vedic Service Commitment'}
                  </h3>
                  <p className="text-[#994700] text-[11px] mt-0.5">
                    {lang === 'kn'
                      ? 'ನಮ್ಮ ಎಲ್ಲಾ ಪುರೋಹಿತರು ಶಾಸ್ತ್ರಾಧ್ಯಯನ ಮಾಡಿದ ಅನುಭವಿಗಳಾಗಿದ್ದು, ಶುದ್ಧ ಸಾತ್ವಿಕ ಸಾಮಗ್ರಿಗಳನ್ನು ಮಾತ್ರ ಒದಗಿಸಲಾಗುತ್ತದೆ.'
                      : 'All purohits registered in our network are knowledgeable practitioners versed in traditional rituals, and all samagri kits are curated with purity.'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#803C00]">
                  {lang === 'kn' ? '1. ಬುಕಿಂಗ್ ಹಾಗೂ ಮುಹೂರ್ತ ಸಮಯ' : '1. Booking & Muhurat Punctuality'}
                </h4>
                <p>
                  {lang === 'kn'
                    ? 'ಪೂಜಾ ಮುಹೂರ್ತಕ್ಕೆ ಕನಿಷ್ಠ 24 ಗಂಟೆ ಮುಂಚಿತವಾಗಿ ಬುಕಿಂಗ್ ಮಾಡುವುದು ಸೂಕ್ತ. ಅನಿವಾರ್ಯ ಕಾರಣಗಳಿಂದ ದಿನಾಂಕ ಬದಲಾವಣೆ ಮಾಡಬೇಕಿದ್ದಲ್ಲಿ ಮುಂಚಿತವಾಗಿ ನಮ್ಮ ಸಹಾಯವಾಣಿಗೆ ತಿಳಿಸಬೇಕು.'
                    : 'Bookings should ideally be placed at least 24 hours in advance to ensure purohit allocation and fresh garland preparation. Muhurat rescheduling should be coordinated with our helpline.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#803C00]">
                  {lang === 'kn' ? '2. ಸಾಮಗ್ರಿಗಳ ವಿತರಣೆ ಮತ್ತು ಪರಿಶುದ್ಧತೆ' : '2. Samagri Quality & Delivery'}
                </h4>
                <p>
                  {lang === 'kn'
                    ? 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು ಶುದ್ಧ ಹಾಗೂ ಸಾತ್ವಿಕ ಗುಣಮಟ್ಟವನ್ನು ಹೊಂದಿರುತ್ತವೆ. ಪ್ಯಾಕೇಜ್ ತೆರೆಯುವ ಮುನ್ನ ಹಾನಿಗೊಳಗಾಗಿದ್ದರೆ ತಕ್ಷಣವೇ ಬದಲಿಸಿಕೊಡಲಾಗುತ್ತದೆ.'
                    : 'All ritual kits are packed under hygienic, consecrated conditions. Any damaged brass item or defective product reported upon delivery will be promptly replaced.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#803C00]">
                  {lang === 'kn' ? '3. ಶುಲ್ಕ & ದಕ್ಷಿಣೆ ಪಾವತಿ' : '3. Fees & Dakshina Guidelines'}
                </h4>
                <p>
                  {lang === 'kn'
                    ? 'ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನಮೂದಿಸಲಾದ ಸೇವಾ ಶುಲ್ಕವು ಪೂಜಾ ನಿರ್ವಹಣೆ ಮತ್ತು ನಿಗದಿತ ಸಾಮಗ್ರಿಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ. ಹೆಚ್ಚುವರಿ ಸ್ವಯಂಪ್ರೇರಿತ ದಕ್ಷಿಣೆಯನ್ನು ಭಕ್ತರು ತಮ್ಮ ಇಚ್ಛೆಯಂತೆ ಅರ್ಪಿಸಬಹುದು.'
                    : 'The fee listed covers the ritual conduction and bundled materials. Any voluntary dakshina is at the personal discretion of the devotee family.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FFF8F2] border-t border-[#FFE5CC] px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-[#803C00]">
            <Lock className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>{lang === 'kn' ? '256-ಬಿಟ್ SSL ಸುರಕ್ಷಿತ ಸಂರಕ್ಷಣೆ' : '256-bit SSL Certified & Protected'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
