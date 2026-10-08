import React from 'react';
import { Order, Language } from '../types';
import { 
  CheckCircle2, Printer, ArrowRight, MapPin 
} from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  lang: Language;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  lang,
  onClose,
  onContinueShopping,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#FFCC99] flex flex-col p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#E8F2E6] border border-[#BDE0B8] text-[#2D5A27] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#FF6A00] font-bold block pt-1">
            {lang === 'kn' ? 'ಶುಭಮಸ್ತು · ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ' : 'Shubhamastu · Payment Verified Successfully'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4D2300]">
            {lang === 'kn' ? 'ಪೂಜಾ ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Pooja Order Confirmed'}
          </h2>
          <p className="text-xs text-[#663000] max-w-md mx-auto">
            {lang === 'kn'
              ? `ನಿಮ್ಮ ಆರ್ಡರ್ ${order.id} ಅನ್ನು ಶಿವಮೊಗ್ಗದ ಮುಖ್ಯ ಕೇಂದ್ರದಲ್ಲಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ವಿವರಗಳನ್ನು ${order.customer.email} ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.`
              : `Order ${order.id} has been registered. Receipt and tracking info dispatched to ${order.customer.email}.`}
          </p>
        </div>

        {/* Live Delivery Status Stepper */}
        <div className="bg-[#FFF8F2] p-4 rounded-xl border border-[#FFCC99] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ಆರ್ಡರ್ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕರ್' : 'Order Status Tracker'}
            </span>
            <span className="text-[11px] text-[#994700] font-mono">AWB: {order.trackingNumber}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#2D5A27] text-white flex items-center justify-center mx-auto font-bold">
                ✓
              </div>
              <span className="font-semibold text-[#2D5A27] block">
                {lang === 'kn' ? 'ಪಾವತಿ ಪರಿಶೀಲನೆ' : 'Payment Verified'}
              </span>
              <span className="text-[#994700]">{order.payment.timestamp}</span>
            </div>

            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#FF6A00] text-white flex items-center justify-center mx-auto font-bold animate-pulse">
                2
              </div>
              <span className="font-semibold text-[#FF6A00] block">
                {lang === 'kn' ? 'ಸಾಮಗ್ರಿ ಸಿದ್ಧತೆ' : 'Sanctification'}
              </span>
              <span className="text-[#994700]">In Progress</span>
            </div>

            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#FFE5CC] text-[#994700] flex items-center justify-center mx-auto font-bold">
                3
              </div>
              <span className="text-[#994700] block">
                {lang === 'kn' ? 'ರವಾನೆ' : 'Dispatched'}
              </span>
              <span className="text-[#994700]">Shivamogga Exp</span>
            </div>

            <div className="space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#FFE5CC] text-[#994700] flex items-center justify-center mx-auto font-bold">
                4
              </div>
              <span className="text-[#994700] block">
                {lang === 'kn' ? 'ಬಾಗಿಲಿಗೆ ತಲುಪಿತು' : 'Delivered'}
              </span>
              <span className="text-[#994700]">Doorstep</span>
            </div>
          </div>
        </div>

        {/* Itemized Summary */}
        <div className="border border-[#FFCC99] rounded-xl overflow-hidden text-xs">
          <div className="bg-[#FFE5CC]/50 px-4 py-2.5 font-bold text-[#4D2300] border-b border-[#FFCC99] flex flex-wrap items-center justify-between gap-2">
            <span>{lang === 'kn' ? 'ಖರೀದಿಸಿದ ಸಾಮಗ್ರಿಗಳು' : 'Itemized Summary'}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#0082FB]/10 text-[#0082FB] font-bold px-2 py-0.5 rounded border border-[#0082FB]/20">
                {order.payment.gateway === 'razorpay' ? 'RAZORPAY GATEWAY' : 'NPCI UPI GATEWAY'}
              </span>
              <span className="text-[11px] text-[#994700] font-mono">ID: {order.payment.transactionId}</span>
            </div>
          </div>

          {order.payment.utrNumber && (
            <div className="bg-[#E8F2E6] px-4 py-1.5 border-b border-[#BDE0B8] flex items-center justify-between text-[11px] text-[#2D5A27] font-mono">
              <span>{lang === 'kn' ? 'ಬ್ಯಾಂಕ್ UTR ರೆಫರೆನ್ಸ್:' : 'Bank UTR Ref:'} <strong>{order.payment.utrNumber}</strong></span>
              <span className="font-bold">STATUS: 200 OK SUCCESS</span>
            </div>
          )}

          <div className="p-4 divide-y divide-[#FFE5CC] space-y-3">
            {order.items.map(({ item, quantity }) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-[#4D2300]">
                    {lang === 'kn' ? item.nameKn : item.nameEn}
                  </h5>
                  <span className="text-[10px] text-[#994700]">
                    Qty: {quantity} × ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="font-serif font-bold text-[#CC5500] tabular-nums">
                  ₹{(item.price * quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#FFF8F2] px-4 py-3 border-t border-[#FFCC99] space-y-1 text-xs">
            <div className="flex justify-between text-[#663000]">
              <span>{lang === 'kn' ? 'ಒಟ್ಟು ಸಾಮಗ್ರಿಗಳ ಮೊತ್ತ' : 'Subtotal'}</span>
              <span className="font-semibold tabular-nums">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#663000]">
              <span>{lang === 'kn' ? 'ಡೆಲಿವರಿ ಶುಲ್ಕ' : 'Delivery Fee'}</span>
              <span className="font-semibold tabular-nums">
                {order.shipping === 0 ? <span className="text-[#2D5A27]">FREE</span> : `₹${order.shipping}`}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#FFE5CC] font-bold text-[#4D2300] text-sm">
              <span>{lang === 'kn' ? 'ಪಾವತಿಸಿದ ಮೊತ್ತ' : 'Amount Paid'}</span>
              <span className="font-serif text-[#CC5500] text-base tabular-nums">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Sanctum Info */}
        <div className="bg-[#FFF8F2] p-4 rounded-xl border border-[#FFCC99] text-xs space-y-1 text-[#663000]">
          <div className="flex items-center gap-1.5 font-bold text-[#4D2300]">
            <MapPin className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>{lang === 'kn' ? 'ತಲುಪಿಸುವ ವಿಳಾಸ:' : 'Delivery Address:'}</span>
          </div>
          <p className="font-bold text-[#4D2300]">{order.customer.fullName} · +91 {order.customer.phone}</p>
          <p>{order.customer.addressLine}, {order.customer.city} - {order.customer.pincode}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white border border-[#FFCC99] hover:bg-[#FFE5CC] text-[#4D2300] text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#994700]" />
            <span>{lang === 'kn' ? 'ರಸೀದಿ ಮುದ್ರಿಸಿ' : 'Print Tax Invoice'}</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="px-6 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{lang === 'kn' ? 'ಮುಂದುವರಿಯಿರಿ' : 'Continue Shopping'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
