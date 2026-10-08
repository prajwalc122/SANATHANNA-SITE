import React from 'react';
import { Order, Language } from '../types';
import { X, Package, CheckCircle, ExternalLink } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  orders,
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#FFCC99] flex flex-col p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#FFE5CC] pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FF6A00]" />
            <h3 className="font-serif text-xl font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ನನ್ನ ಪೂಜಾ ಆರ್ಡರ್‌ಗಳು & ಟ್ರ್ಯಾಕಿಂಗ್' : 'My Sacred Orders & Delivery Tracking'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#994700] hover:text-[#4D2300] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FFF0E0] border border-[#FFCC99] flex items-center justify-center text-[#FF6A00] mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#4D2300]">
              {lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಆರ್ಡರ್ ಇಲ್ಲ' : 'No Orders Placed Yet'}
            </h4>
            <p className="text-xs text-[#994700] max-w-xs mx-auto">
              {lang === 'kn'
                ? 'ನೀವು ಪೂಜಾ ಸಾಮಗ್ರಿಗಳನ್ನು ಆರ್ಡರ್ ಮಾಡಿದ ನಂತರ, ಅವುಗಳ ಸ್ಥಿತಿ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.'
                : 'When you purchase pooja materials or book services, your tracking details will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-[#FFF8F2] p-4 rounded-xl border border-[#FFCC99] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#4D2300] block">{order.id}</span>
                    <span className="text-[11px] text-[#994700]">Placed on {order.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-[#E8F2E6] text-[#2D5A27] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{lang === 'kn' ? 'ಪಾವತಿ ಯಶಸ್ವಿ' : 'Paid'}</span>
                    </span>
                    <span className="font-serif font-bold text-[#CC5500] text-sm tabular-nums">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {order.items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center gap-1.5 shrink-0 bg-white px-2 py-1 rounded-md border border-[#FFCC99]">
                      <span className="text-[11px] font-semibold text-[#4D2300] max-w-[140px] truncate">
                        {lang === 'kn' ? item.nameKn : item.nameEn}
                      </span>
                      <span className="text-[10px] text-[#994700]">x{quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#FFE5CC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#663000]">
                    Tracking: <strong className="font-mono text-[#4D2300]">{order.trackingNumber}</strong>
                  </span>
                  <button
                    onClick={() => {
                      onSelectOrder(order);
                      onClose();
                    }}
                    className="text-[#FF6A00] hover:text-[#CC5500] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'kn' ? 'ರಸೀದಿ ನೋಡಿ' : 'View Receipt'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
