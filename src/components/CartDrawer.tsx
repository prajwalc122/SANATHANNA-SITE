import React, { useState } from 'react';
import { CartItem, Language } from '../types';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Sparkles, Gift } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  lang,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [includeGiftPackaging, setIncludeGiftPackaging] = useState(true);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  const freeShippingThreshold = 500;
  const isFreeShipping = subtotal >= freeShippingThreshold || items.length === 0;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = isFreeShipping ? 0 : 50;
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FFF8F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#FFCC99]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#FFCC99] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF6A00]" />
            <h2 className="font-serif text-lg font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಚೀಲ' : 'Pooja Materials Bag'}
            </h2>
            <span className="text-xs text-[#994700] font-semibold">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#994700] hover:text-[#4D2300] hover:bg-[#FFE5CC] rounded-lg transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-[#FFE5CC]/60 px-4 py-2.5 border-b border-[#FFCC99] text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-1.5 text-[#2D5A27] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>
                {lang === 'kn' ? 'ಉಚಿತ ವಿತರಣೆಗೆ ನಿಮ್ಮ ಆರ್ಡರ್ ಅರ್ಹವಾಗಿದೆ!' : 'Your sacred order qualifies for Free Delivery!'}
              </span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-[#663000] mb-1">
                <span>
                  {lang === 'kn'
                    ? `ಇನ್ನೂ ₹${amountToFreeShipping} ಸೇರಿಸಿ ಉಚಿತ ಡೆಲಿವರಿ ಪಡೆಯಿರಿ`
                    : `Add ₹${amountToFreeShipping} more for Free Delivery`}
                </span>
                <span className="tabular-nums font-semibold">
                  {Math.round((subtotal / freeShippingThreshold) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#FFCC99] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF6A00] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FFE5CC] border border-[#FFCC99] flex items-center justify-center text-[#FF6A00]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#4D2300]">
                {lang === 'kn' ? 'ನಿಮ್ಮ ಚೀಲ ಖಾಲಿಯಾಗಿದೆ' : 'Your Bag is Empty'}
              </h3>
              <p className="text-xs text-[#994700] max-w-xs">
                {lang === 'kn'
                  ? 'ಮಂಗಳ ದ್ರವ್ಯ, ನವಧಾನ್ಯ, ಫಲ ಪುಷ್ಪ ಅಥವಾ ಪೂಜಾ ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.'
                  : 'Select essential materials, samithu woods, fruits, or pooja kits.'}
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' : 'Discover Items'}
              </button>
            </div>
          ) : (
            items.map(({ item, type, quantity }) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#FFCC99] shadow-2xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-[#FFE5CC] text-[#994700] font-bold px-1.5 py-0.5 rounded">
                      {type === 'service' ? (lang === 'kn' ? 'ಸೇವೆ' : 'Service') : (lang === 'kn' ? 'ಸಾಮಗ್ರಿ' : 'Material')}
                    </span>
                    <h4 className="text-xs font-bold text-[#4D2300] line-clamp-1">
                      {lang === 'kn' ? item.nameKn : item.nameEn}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#994700] block mt-0.5">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#FFCC99] rounded-lg bg-[#FFF8F2] overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="px-2 py-0.5 text-xs text-[#4D2300] hover:bg-[#FFE5CC] font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-0.5 text-xs font-bold tabular-nums text-[#4D2300]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="px-2 py-0.5 text-xs text-[#4D2300] hover:bg-[#FFE5CC] font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#B37A4C] hover:text-[#CC5500] p-1 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Complimentary Sanctification Packaging */}
          {items.length > 0 && (
            <div className="bg-[#FFF0E0] border border-[#FFCC99] p-3 rounded-xl flex items-start gap-2.5">
              <Gift className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ಪವಿತ್ರ ತುಳಸಿ & ಗಂಗಾಜಲ ಸಂಪ್ರೋಕ್ಷಣೆ' : 'Sanctified Blessing Wrapping'}
                  </span>
                  <input
                    type="checkbox"
                    checked={includeGiftPackaging}
                    onChange={(e) => setIncludeGiftPackaging(e.target.checked)}
                    className="accent-[#FF6A00] w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#8C4700] mt-0.5">
                  {lang === 'kn'
                    ? 'ಪ್ರತಿ ಸಾಮಗ್ರಿಯೂ ಶುದ್ಧತೆಯಿಂದ ಪರೀಕ್ಷಿಸಲ್ಪಟ್ಟು ಭದ್ರವಾಗಿ ಪ್ಯಾಕ್ ಆಗಿರುತ್ತದೆ.'
                    : 'All items are sanctified, verified for Vedic authenticity, and securely packaged.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer / Proceed */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#FFCC99] space-y-3">
            <div className="space-y-1.5 text-xs text-[#663000]">
              <div className="flex justify-between">
                <span>{lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳ ಮೊತ್ತ' : 'Subtotal'}</span>
                <span className="font-bold text-[#4D2300] tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'kn' ? 'ವಿತರಣಾ ಶುಲ್ಕ' : 'Delivery Charges'}</span>
                <span className="font-semibold tabular-nums">
                  {shippingFee === 0 ? <span className="text-[#2D5A27]">{lang === 'kn' ? 'ಉಚಿತ' : 'FREE'}</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#FFE5CC] text-sm font-bold text-[#4D2300]">
                <span>{lang === 'kn' ? 'ಒಟ್ಟು ಪಾವತಿ ಮೊತ್ತ' : 'Total Payable'}</span>
                <span className="font-serif text-lg text-[#CC5500] tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{lang === 'kn' ? 'ಸುರಕ್ಷಿತ ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ' : 'Proceed to Secure Payment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#994700]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span>{lang === 'kn' ? '256-ಬಿಟ್ ಬ್ಯಾಂಕ್ ಗ್ರೇಡ್ ಗೇಟ್‌ವೇ' : '256-Bit Bank-Grade Payment Gateway'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
