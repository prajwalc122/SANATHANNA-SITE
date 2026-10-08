import React, { useState } from 'react';
import { MaterialItem, Language } from '../types';
import { X, Check, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { templeAudio } from '../utils/audioChant';

interface MaterialDetailModalProps {
  item: MaterialItem | null;
  lang: Language;
  onClose: () => void;
  onAddToCart: (item: MaterialItem, quantity: number) => void;
}

export const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  item,
  lang,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity);
    setAdded(true);
    templeAudio.playTempleBell();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#FFCC99] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#4D2300] border border-[#FFCC99] flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-[#FFF8F2] p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[#FFCC99]">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-inner border border-[#FFCC99]">
            {item.image ? (
              <img
                src={item.image}
                alt={item.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFE5CC] text-[#FF6A00]">
                <Sparkles className="w-12 h-12 mb-2" />
                <span className="font-bold text-xs">{item.nameEn}</span>
              </div>
            )}
          </div>

          <div className="mt-4 w-full bg-white/80 p-3 rounded-xl border border-[#FFCC99] text-xs space-y-1 text-[#663000]">
            <div className="flex justify-between">
              <span className="text-[#994700]">{lang === 'kn' ? 'ವಿಭಾಗ:' : 'Category:'}</span>
              <span className="font-bold text-[#4D2300]">
                {lang === 'kn' ? item.categoryLabelKn : item.categoryLabelEn}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#994700]">{lang === 'kn' ? 'ಪ್ರಮಾಣ:' : 'Portion:'}</span>
              <span className="font-bold text-[#4D2300]">{lang === 'kn' ? item.unitKn : item.unitEn}</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase */}
        <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-3.5">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#FF6A00] font-bold block">
                {lang === 'kn' ? item.categoryLabelKn : item.categoryLabelEn}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#4D2300] mt-0.5">
                {lang === 'kn' ? item.nameKn : item.nameEn}
              </h2>
              {lang === 'kn' && (
                <span className="text-xs text-[#994700] block mt-0.5 font-medium">
                  {item.nameEn}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1 border-b border-[#FFE5CC] pb-3">
              <span className="font-serif text-3xl font-bold text-[#CC5500] tabular-nums">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#994700]">
                / {lang === 'kn' ? item.unitKn : item.unitEn}
              </span>
            </div>

            {/* Description */}
            <div className="bg-[#FFF8F2] p-3.5 rounded-xl border border-[#FFE5CC]">
              <span className="text-[11px] font-bold text-[#4D2300] uppercase tracking-wider block mb-1">
                {lang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವಿವರ & ಪಾವಿತ್ರ್ಯ:' : 'Sacred Agamic Significance:'}
              </span>
              <p className="text-xs text-[#663000] leading-relaxed">
                {lang === 'kn' ? item.descriptionKn : item.descriptionEn}
              </p>
            </div>

            {/* Purity Guarantee */}
            <div className="flex items-center gap-2 text-xs text-[#2D5A27] bg-[#E8F2E6] p-2.5 rounded-xl border border-[#BDE0B8]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-[11px]">
                {lang === 'kn'
                  ? '100% ಸಾತ್ವಿಕ ಶುದ್ಧತೆ, ಕಲಬೆರಕೆ ರಹಿತ & ವೇದೋಕ್ತ ಪ್ರಮಾಣೀಕೃತ'
                  : '100% Pure, Sattvic, and verified for traditional ritual use'}
              </span>
            </div>
          </div>

          {/* Stepper & Action */}
          <div className="pt-3 border-t border-[#FFE5CC] space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#FFCC99] rounded-xl bg-[#FFF8F2] overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-[#4D2300] hover:bg-[#FFE5CC] text-sm font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold tabular-nums text-[#4D2300]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-[#4D2300] hover:bg-[#FFE5CC] text-sm font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  added
                    ? 'bg-[#2D5A27] text-white'
                    : 'bg-[#FF6A00] hover:bg-[#CC5500] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಚೀಲಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ!' : 'Added to Sacred Bag!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {lang === 'kn'
                        ? `ಚೀಲಕ್ಕೆ ಸೇರಿಸಿ · ₹${(item.price * quantity).toLocaleString('en-IN')}`
                        : `Add to Bag · ₹${(item.price * quantity).toLocaleString('en-IN')}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
