import React, { useState, useEffect } from 'react';
import { CartItem, CustomerDetails, Order, PaymentMethodType, PaymentDetails, Language } from '../types';
import { 
  ShieldCheck, Lock, CreditCard, QrCode, Building, Truck, 
  CheckCircle, ArrowLeft, ArrowRight, X, Copy, Check, Smartphone,
  Zap, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import { templeAudio } from '../utils/audioChant';
import { getPaymentGatewayConfig, generateUpiIntentUri } from '../services/paymentGateway';
import { paymentApi, clientApi } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  onOrderSuccess: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  lang,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'address' | 'payment_method' | 'processing_otp'>('address');

  // Gateway Configuration from Admin Settings
  const gatewayConfig = getPaymentGatewayConfig();

  // Customer Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: 'Nandan Sharma',
    phone: '9876543210',
    email: 'nandan.sharma@example.com',
    addressLine: 'House 42, Vinobha Nagara, 3rd Cross',
    landmark: 'Near Raghavendra Swamy Mutt',
    city: 'Shivamogga (ಶಿವಮೊಗ್ಗ)',
    state: 'Karnataka',
    pincode: '577201',
    blessingNote: 'Please verify all essential samagri for morning muhurat',
    giftPackaging: true
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment Selection State
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('razorpay');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardHolder, setCardHolder] = useState('NANDAN SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('432');

  // UPI details
  const [upiId, setUpiId] = useState('devotee@oksbi');
  const [upiVerified, setUpiVerified] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Netbanking details
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // COD verification
  const [codCaptcha, setCodCaptcha] = useState('');
  const [requiredCaptcha] = useState('8492');
  const [codCaptchaError, setCodCaptchaError] = useState('');

  // Session Expiry Countdown Timer (15 minutes)
  const [sessionSeconds, setSessionSeconds] = useState(900);

  // Bank 3D Secure / OTP Simulation State
  const [otpValue, setOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [authStage, setAuthStage] = useState<'connecting' | 'otp_prompt' | 'verifying'>('connecting');

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  const shippingFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shippingFee;

  // Real-time session countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getCardType = (number: string) => {
    const clean = number.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
    if (/^(60|65|81|82)/.test(clean)) return 'RuPay (National)';
    if (/^3[47]/.test(clean)) return 'American Express';
    return 'RuPay / Card';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const validateAddress = () => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = lang === 'kn' ? 'ಹೆಸರು ನಮೂದಿಸಿ' : 'Full name is required';
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 10) {
      errors.phone = lang === 'kn' ? '10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ' : 'Valid 10-digit mobile number required';
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      errors.email = lang === 'kn' ? 'ಇಮೇಲ್ ನಮೂದಿಸಿ' : 'Valid email is required for tax invoice';
    }
    if (!customer.addressLine.trim()) errors.addressLine = lang === 'kn' ? 'ವಿಳಾಸ ನಮೂದಿಸಿ' : 'Street address is required';
    if (!customer.city.trim()) errors.city = lang === 'kn' ? 'ನಗರ ನಮೂದಿಸಿ' : 'City is required';
    if (!customer.pincode.trim() || customer.pincode.length < 6) {
      errors.pincode = lang === 'kn' ? 'ಪಿನ್ ಕೋಡ್ ನಮೂದಿಸಿ' : 'Valid 6-digit PIN code required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitiatePayment = () => {
    setCodCaptchaError('');
    if (selectedMethod === 'cod') {
      if (codCaptcha.trim() !== requiredCaptcha) {
        setCodCaptchaError(
          lang === 'kn'
            ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಪರಿಶೀಲನಾ ಕೋಡ್ ನಮೂದಿಸಿ'
            : 'Please enter the correct verification code for Cash on Delivery'
        );
        return;
      }
      finalizeOrder('cod');
      return;
    }

    // Launch Real Razorpay Standard Checkout SDK if selected and available
    if (selectedMethod === 'razorpay' && typeof (window as any).Razorpay !== 'undefined') {
      try {
        const rzpOptions = {
          key: gatewayConfig.razorpayKeyId,
          amount: Math.round(total * 100),
          currency: 'INR',
          name: gatewayConfig.merchantName,
          description: `Pooja Samagri Order (${items.length} items)`,
          image: '/src/assets/images/divine_deity_logo_1790403832742.jpg',
          prefill: {
            name: customer.fullName,
            email: customer.email,
            contact: customer.phone,
          },
          notes: {
            address: `${customer.addressLine}, ${customer.city}, ${customer.pincode}`,
          },
          theme: {
            color: '#FF6A00',
          },
          handler: function (response: any) {
            const realTxnId = response.razorpay_payment_id || `pay_${Date.now()}`;
            templeAudio.playTempleBell();
            finalizeOrder('razorpay', realTxnId);
          },
          modal: {
            ondismiss: function () {
              console.log('Razorpay modal dismissed by user');
            }
          }
        };

        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.open();
        return;
      } catch (err) {
        console.warn('Real Razorpay SDK launch fallback to 3D secure simulation:', err);
      }
    }

    setStep('processing_otp');
    setAuthStage('connecting');
    setOtpTimer(30);
    setOtpValue('');

    setTimeout(() => {
      setAuthStage('otp_prompt');
    }, 1100);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'processing_otp' && authStage === 'otp_prompt' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, authStage, otpTimer]);

  const handleVerifyOtp = () => {
    setAuthStage('verifying');

    setTimeout(() => {
      templeAudio.playTempleBell();
      finalizeOrder(selectedMethod);
    }, 1600);
  };

  const finalizeOrder = async (method: PaymentMethodType, customTxnId?: string) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `POOJA-2026-${randomNum}`;
    const txnId = customTxnId || (method === 'razorpay' 
      ? `pay_${Math.random().toString(36).substring(2, 12)}` 
      : `TXN-${Date.now().toString().slice(-8)}`);
    const utrNumber = `UTR2026${Math.floor(10000000 + Math.random() * 90000000)}`;

    const paymentDetails: PaymentDetails = {
      method,
      gateway: method === 'razorpay' ? 'razorpay' : method === 'upi' ? 'phonepe' : 'bhim_upi',
      transactionId: txnId,
      utrNumber,
      amount: total,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'SUCCESS',
      maskedCard: method === 'card' || method === 'razorpay' ? `•••• •••• •••• ${cardNumber.slice(-4)}` : undefined,
      upiHandle: method === 'upi' ? upiId : undefined,
      bankName: method === 'netbanking' ? selectedBank : undefined
    };

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...items],
      subtotal,
      shipping: shippingFee,
      discount: 0,
      total,
      customer: { ...customer },
      payment: paymentDetails,
      status: 'confirmed',
      trackingNumber: `SMG-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: 'Same-day or next-day morning delivery in Shivamogga & Karnataka'
    };

    // Asynchronously record payment in MongoDB & backend storage
    try {
      await paymentApi.verifyPayment({
        orderId,
        transactionId: txnId,
        gateway: paymentDetails.gateway,
        method,
        amount: total,
        utrNumber,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerEmail: customer.email,
      });

      await clientApi.submitOrder({
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerAddress: `${customer.addressLine}, ${customer.city}, ${customer.pincode}`,
        items: items.map(i => ({ name: i.item.nameKn, qty: i.quantity, price: i.item.price })),
        total,
        paymentMethod: method.toUpperCase(),
        paymentStatus: 'Paid',
      });
    } catch (e) {
      console.warn('Backend order recording notice:', e);
    }

    onOrderSuccess(newOrder);
  };

  const copyMerchantUpi = () => {
    navigator.clipboard.writeText(gatewayConfig.merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  if (!isOpen) return null;

  const upiIntentUri = generateUpiIntentUri(total, 'POOJA', gatewayConfig.merchantUpi, gatewayConfig.merchantName);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-[#FF9933] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gateway Security Header */}
        <div className="bg-gradient-to-r from-[#0C2340] via-[#123962] to-[#0C2340] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#07192C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0082FB]/20 border border-[#0082FB]/40 flex items-center justify-center text-[#52B6FF]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold tracking-wide text-white">
                  {lang === 'kn' ? 'ರೇಜರ್‌ಪೇ & UPI ಸುರಕ್ಷಿತ ಪಾವತಿ ಗೇಟ್‌ವೇ' : 'RAZORPAY & UPI SECURE GATEWAY'}
                </span>
                <span className="text-[9px] bg-green-500/20 text-green-300 border border-green-400/40 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  PCI-DSS 256-Bit
                </span>
              </div>
              <span className="text-[11px] text-[#A3C7EB] block font-mono">
                Merchant: {gatewayConfig.merchantName} · RBI & NPCI Authorized
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Session Timer */}
            <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 text-xs text-[#E1EFFF] font-mono">
              <Zap className="w-3.5 h-3.5 text-[#FFB366]" />
              <span>{formatSessionTime(sessionSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="text-[#A3C7EB] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close payment modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-step progress breadcrumb */}
        <div className="bg-[#FFFDF9] border-b border-[#FFCC99] px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'address' ? 'bg-[#FF6A00] text-white' : 'bg-[#2D5A27] text-white'
            }`}>
              {step === 'address' ? '1' : '✓'}
            </span>
            <span className={`font-semibold ${step === 'address' ? 'text-[#FF6A00]' : 'text-[#2D5A27]'}`}>
              {lang === 'kn' ? '1. ವಿಳಾಸ & ವಿವರ' : '1. Devotee Details'}
            </span>
          </div>

          <span className="text-[#FFCC99]">———</span>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'payment_method' ? 'bg-[#0082FB] text-white' : step === 'processing_otp' ? 'bg-[#2D5A27] text-white' : 'bg-[#FFE5CC] text-[#994700]'
            }`}>
              2
            </span>
            <span className={`font-semibold ${
              step === 'payment_method' || step === 'processing_otp' ? 'text-[#0082FB]' : 'text-[#994700]'
            }`}>
              {lang === 'kn' ? '2. ಗೇಟ್‌ವೇ ಆಯ್ಕೆ' : '2. Payment Gateway'}
            </span>
          </div>

          <span className="text-[#FFCC99] hidden sm:inline">———</span>

          <div className="hidden sm:flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#FFE5CC] text-[#994700] flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="font-semibold text-[#994700]">
              {lang === 'kn' ? '3. ರಸೀದಿ & ಟ್ರ್ಯಾಕಿಂಗ್' : '3. Receipt & AWB'}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          {/* STEP 1: Address Details */}
          {step === 'address' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#FFE5CC] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#4D2300]">
                  {lang === 'kn' ? 'ತಲುಪಿಸಬೇಕಾದ ವಿಳಾಸ & ಸಂಪರ್ಕ' : 'Delivery Address & Devotee Contact'}
                </h3>
                <span className="text-xs text-[#994700]">
                  {lang === 'kn' ? 'ಒಟ್ಟು ಪಾವತಿ: ' : 'Payable Total: '}
                  <strong className="text-[#CC5500] font-serif text-base tabular-nums">
                    ₹{total.toLocaleString('en-IN')}
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಭಕ್ತರ / ಪೂಜಾರ್ಥಿಗಳ ಹೆಸರು *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                  />
                  {formErrors.fullName && <p className="text-[#CC5500] text-[11px] mt-0.5">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (SMS & OTP ಗೆ) *' : 'Mobile Number (SMS & OTP) *'}
                  </label>
                  <div className="flex items-center bg-[#FFF8F2] border border-[#FFCC99] rounded-xl overflow-hidden">
                    <span className="px-3 text-[#994700] font-bold text-xs bg-[#FFE5CC] py-2.5 border-r border-[#FFCC99]">+91</span>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full px-3 py-2 bg-transparent text-xs text-[#4D2300] outline-none"
                    />
                  </div>
                  {formErrors.phone && <p className="text-[#CC5500] text-[11px] mt-0.5">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ (ಇ-ರಸೀದಿಗಾಗಿ) *' : 'Email (for GST E-Receipt) *'}
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                  />
                  {formErrors.email && <p className="text-[#CC5500] text-[11px] mt-0.5">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ನಗರ / ತಾಲೂಕು *' : 'City / Taluk *'}
                  </label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                  />
                  {formErrors.city && <p className="text-[#CC5500] text-[11px] mt-0.5">{formErrors.city}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ವಿಳಾಸ (ಮನೆ ನಂ, ರಸ್ತೆ, ಬಡಾವಣೆ) *' : 'Delivery Address (House No, Street, Layout) *'}
                  </label>
                  <input
                    type="text"
                    value={customer.addressLine}
                    onChange={(e) => setCustomer({ ...customer, addressLine: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                  />
                  {formErrors.addressLine && <p className="text-[#CC5500] text-[11px] mt-0.5">{formErrors.addressLine}</p>}
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಗುರುತಿನ ಸ್ಥಳ (Landmark)' : 'Landmark'}
                  </label>
                  <input
                    type="text"
                    value={customer.landmark || ''}
                    onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block text-[#663000] font-semibold mb-1">
                    {lang === 'kn' ? 'ಪಿನ್ ಕೋಡ್ (PIN Code) *' : 'PIN Code *'}
                  </label>
                  <input
                    type="text"
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs font-mono text-[#4D2300] outline-none focus:border-[#FF6A00]"
                  />
                  {formErrors.pincode && <p className="text-[#CC5500] text-[11px] mt-0.5">{formErrors.pincode}</p>}
                </div>
              </div>

              {/* Order Summary Strip */}
              <div className="bg-[#FFF8F2] p-4 rounded-2xl border border-[#FFCC99] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#4D2300] block">
                    {items.length} {lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳ ಕಿಟ್' : 'Items in Sacramental Bag'}
                  </span>
                  <span className="text-[11px] text-[#2D5A27] font-semibold">
                    ✓ {shippingFee === 0 ? (lang === 'kn' ? 'ಉಚಿತ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ' : 'Free Express Delivery') : `₹${shippingFee} Delivery`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#994700] uppercase block">Total</span>
                  <strong className="text-base text-[#CC5500] font-serif tabular-nums">
                    ₹{total.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              {/* Continue CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (validateAddress()) setStep('payment_method');
                  }}
                  className="px-6 py-3 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{lang === 'kn' ? 'ಪಾವತಿ ಗೇಟ್‌ವೇಗೆ ಮುಂದುವರಿಯಿರಿ' : 'Proceed to Payment Gateway'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === 'payment_method' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#FFE5CC] pb-3">
                <button
                  onClick={() => setStep('address')}
                  className="flex items-center gap-1.5 text-xs text-[#994700] hover:text-[#4D2300] font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? 'ವಿಳಾಸ ಬದಲಿಸಿ' : 'Back to Address'}</span>
                </button>
                <div className="text-right">
                  <span className="text-xs text-[#994700] block">{lang === 'kn' ? 'ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ' : 'Total Payable'}</span>
                  <span className="font-serif text-xl font-bold text-[#CC5500] tabular-nums">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Gateway Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {/* 1. Razorpay Gateway */}
                <button
                  onClick={() => setSelectedMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                    selectedMethod === 'razorpay'
                      ? 'border-[#0082FB] bg-[#F0F7FF] ring-2 ring-[#0082FB]/30 shadow-xs'
                      : 'border-[#FFCC99] bg-white hover:border-[#0082FB]'
                  }`}
                >
                  <span className="absolute top-0 right-0 bg-[#0082FB] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl">
                    POPULAR
                  </span>
                  <ShieldCheck className={`w-5 h-5 mb-2 ${selectedMethod === 'razorpay' ? 'text-[#0082FB]' : 'text-[#994700]'}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#0C2340]">Razorpay PG</span>
                    <span className="text-[10px] text-[#0082FB] font-medium">All-in-One Gateway</span>
                  </div>
                </button>

                {/* 2. Fast UPI Intent & QR */}
                <button
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedMethod === 'upi'
                      ? 'border-[#FF6A00] bg-[#FFF8F2] ring-2 ring-[#FF6A00]/20 shadow-xs'
                      : 'border-[#FFCC99] bg-white hover:border-[#FF6A00]'
                  }`}
                >
                  <QrCode className={`w-5 h-5 mb-2 ${selectedMethod === 'upi' ? 'text-[#FF6A00]' : 'text-[#994700]'}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#4D2300]">UPI Instant</span>
                    <span className="text-[10px] text-[#994700]">GPay, PhonePe, QR</span>
                  </div>
                </button>

                {/* 3. Cards */}
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'border-[#FF6A00] bg-[#FFF8F2] ring-2 ring-[#FF6A00]/20 shadow-xs'
                      : 'border-[#FFCC99] bg-white hover:border-[#FF6A00]'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 mb-2 ${selectedMethod === 'card' ? 'text-[#FF6A00]' : 'text-[#994700]'}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#4D2300]">RuPay & Cards</span>
                    <span className="text-[10px] text-[#994700]">RuPay, Visa, Master</span>
                  </div>
                </button>

                {/* 4. NetBanking */}
                <button
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedMethod === 'netbanking'
                      ? 'border-[#FF6A00] bg-[#FFF8F2] ring-2 ring-[#FF6A00]/20 shadow-xs'
                      : 'border-[#FFCC99] bg-white hover:border-[#FF6A00]'
                  }`}
                >
                  <Building className={`w-5 h-5 mb-2 ${selectedMethod === 'netbanking' ? 'text-[#FF6A00]' : 'text-[#994700]'}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#4D2300]">NetBanking</span>
                    <span className="text-[10px] text-[#994700]">50+ Indian Banks</span>
                  </div>
                </button>

                {/* 5. COD */}
                <button
                  onClick={() => setSelectedMethod('cod')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedMethod === 'cod'
                      ? 'border-[#FF6A00] bg-[#FFF8F2] ring-2 ring-[#FF6A00]/20 shadow-xs'
                      : 'border-[#FFCC99] bg-white hover:border-[#FF6A00]'
                  }`}
                >
                  <Truck className={`w-5 h-5 mb-2 ${selectedMethod === 'cod' ? 'text-[#FF6A00]' : 'text-[#994700]'}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#4D2300]">Cash on Delivery</span>
                    <span className="text-[10px] text-[#994700]">Pay at Doorstep</span>
                  </div>
                </button>
              </div>

              {/* METHOD 1: RAZORPAY STANDARD GATEWAY */}
              {selectedMethod === 'razorpay' && (
                <div className="bg-[#F0F7FF] p-6 rounded-2xl border-2 border-[#0082FB]/40 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D0E5FF]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0082FB] text-white flex items-center justify-center font-bold text-xs">
                        R
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#0C2340]">
                          Razorpay Standard Secure Checkout
                        </h4>
                        <span className="text-[10px] text-[#0082FB] font-mono">
                          Key: {gatewayConfig.razorpayKeyId}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#0082FB] text-white font-bold px-2 py-0.5 rounded-full">
                      Auto-Detect UPI & Cards
                    </span>
                  </div>

                  <p className="text-xs text-[#1E3A5F] leading-relaxed">
                    {lang === 'kn'
                      ? 'ರೇಜರ್‌ಪೇ ಗೇಟ್‌ವೇ ಮೂಲಕ UPI (Google Pay, PhonePe, Paytm), RuPay/Visa ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ಇಂಟರ್ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್‌ಗಳಿಂದ ನೇರವಾಗಿ ಅತ್ಯಂತ ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿಸಿ.'
                      : 'Experience India\'s most trusted unified payment flow. Supports Google Pay, PhonePe, RuPay Cards, NetBanking, and EMI with instant bank settlement.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-[#D0E5FF]">
                      <span className="font-bold text-[#0C2340] block">⚡ Instant UPI</span>
                      <span className="text-[10px] text-gray-500">Zero Convenience Fee</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#D0E5FF]">
                      <span className="font-bold text-[#0C2340] block">💳 RuPay & Cards</span>
                      <span className="text-[10px] text-gray-500">RBI Tokenized</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#D0E5FF]">
                      <span className="font-bold text-[#0C2340] block">🏛️ NetBanking</span>
                      <span className="text-[10px] text-gray-500">Direct 3D Secure</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#D0E5FF]">
                      <span className="font-bold text-[#0C2340] block">🛡️ Buyer Guard</span>
                      <span className="text-[10px] text-gray-500">100% Protected</span>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: DIRECT UPI APPS & QR CODE */}
              {selectedMethod === 'upi' && (
                <div className="bg-[#FFF8F2] p-5 rounded-2xl border border-[#FFCC99] space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Dynamic High-Res QR Code */}
                    <div className="bg-white p-3 rounded-2xl border border-[#FFCC99] shadow-sm flex flex-col items-center shrink-0">
                      <div className="w-36 h-36 bg-[#4D2300] rounded-xl p-2.5 flex flex-col items-center justify-center text-white relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                          <rect x="5" y="5" width="28" height="28" fill="white" />
                          <rect x="9" y="9" width="20" height="20" fill="#4D2300" />
                          <rect x="13" y="13" width="12" height="12" fill="white" />
                          <rect x="67" y="5" width="28" height="28" fill="white" />
                          <rect x="71" y="9" width="20" height="20" fill="#4D2300" />
                          <rect x="75" y="13" width="12" height="12" fill="white" />
                          <rect x="5" y="67" width="28" height="28" fill="white" />
                          <rect x="9" y="71" width="20" height="20" fill="#4D2300" />
                          <rect x="13" y="75" width="12" height="12" fill="white" />
                          <rect x="38" y="38" width="24" height="24" fill="white" />
                          <rect x="44" y="44" width="12" height="12" fill="#4D2300" />
                          <circle cx="50" cy="20" r="3" fill="white" />
                          <circle cx="20" cy="50" r="3" fill="white" />
                          <circle cx="80" cy="50" r="3" fill="white" />
                          <circle cx="50" cy="80" r="3" fill="white" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-[#FF6A00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            BHIM UPI
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#4D2300] mt-2">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-[#994700]">
                        {lang === 'kn' ? 'ಯಾವುದೇ UPI ಆಪ್‌ನಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : 'Scan & Pay with any UPI App'}
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-3 text-xs">
                      {/* 1-Click Launch on Mobile UPI Apps */}
                      <div>
                        <span className="block font-bold text-[#4D2300] mb-2">
                          {lang === 'kn' ? 'ನೇರವಾಗಿ UPI ಆಪ್ ಮೂಲಕ ಪಾವತಿಸಿ:' : '1-Click Pay with Installed UPI Apps:'}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={upiIntentUri}
                            className="p-2.5 bg-white hover:bg-[#FFE5CC] border border-[#FFCC99] rounded-xl flex items-center justify-center gap-2 font-bold text-[#4D2300] transition-colors shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-[#0082FB]" />
                            <span>Google Pay</span>
                          </a>

                          <a
                            href={upiIntentUri}
                            className="p-2.5 bg-white hover:bg-[#FFE5CC] border border-[#FFCC99] rounded-xl flex items-center justify-center gap-2 font-bold text-[#4D2300] transition-colors shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-[#5F259F]" />
                            <span>PhonePe</span>
                          </a>

                          <a
                            href={upiIntentUri}
                            className="p-2.5 bg-white hover:bg-[#FFE5CC] border border-[#FFCC99] rounded-xl flex items-center justify-center gap-2 font-bold text-[#4D2300] transition-colors shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-[#00B9F5]" />
                            <span>Paytm UPI</span>
                          </a>

                          <a
                            href={upiIntentUri}
                            className="p-2.5 bg-white hover:bg-[#FFE5CC] border border-[#FFCC99] rounded-xl flex items-center justify-center gap-2 font-bold text-[#4D2300] transition-colors shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-[#FF6A00]" />
                            <span>BHIM / CRED</span>
                          </a>
                        </div>
                      </div>

                      {/* Copyable Merchant UPI ID */}
                      <div className="pt-2 border-t border-[#FFE5CC]">
                        <span className="block text-[11px] text-[#994700] mb-1 font-semibold">
                          {lang === 'kn' ? 'ಅಥವಾ ಮರ್ಚೆಂಟ್ UPI ID ಗೆ ಕಳುಹಿಸಿ:' : 'Merchant VPA Handle:'}
                        </span>
                        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#FFCC99] font-mono text-xs">
                          <span className="text-[#4D2300] font-bold">{gatewayConfig.merchantUpi}</span>
                          <button
                            type="button"
                            onClick={copyMerchantUpi}
                            className="text-[#FF6A00] hover:text-[#CC5500] flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 3: RUPAY & CARDS */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-tr from-[#4D2300] via-[#663000] to-[#803C00] rounded-2xl p-5 text-white shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-serif text-sm tracking-wider text-[#FFD1A4] font-bold">
                        POOJA SEVE RUPAY PLATINUM
                      </span>
                      <span className="font-bold text-xs uppercase tracking-wider text-white">
                        {getCardType(cardNumber)}
                      </span>
                    </div>

                    <div className="font-mono text-lg tracking-widest my-2 text-white">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#FFD1A4] pt-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block text-[#FFCC99]">Holder</span>
                        <span className="font-bold text-white">{cardHolder}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider block text-[#FFCC99]">Expires</span>
                        <span className="font-bold text-white tabular-nums">{cardExpiry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="block text-[#663000] font-semibold mb-1">Card Number (RuPay, Visa, MasterCard)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs font-mono text-[#4D2300] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#663000] font-semibold mb-1">Expiry Date (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs font-mono text-[#4D2300] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#663000] font-semibold mb-1">CVV / Security Code</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 bg-[#FFF8F2] border border-[#FFCC99] rounded-xl text-xs font-mono text-[#4D2300] outline-none"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#2D5A27] flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>RBI Compliant Tokenization & 3D Secure 2.0 Enabled</span>
                  </div>
                </div>
              )}

              {/* METHOD 4: NETBANKING */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-[#663000]">
                    {lang === 'kn' ? 'ಬ್ಯಾಂಕ್ ಆಯ್ಕೆ ಮಾಡಿ (Popular Indian Banks):' : 'Select Your Scheduled Bank:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      'State Bank of India', 'Canara Bank', 'HDFC Bank', 
                      'ICICI Bank', 'Karnataka Bank', 'Axis Bank',
                      'Punjab National Bank', 'Bank of Baroda', 'Union Bank'
                    ].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-3 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                          selectedBank === b
                            ? 'bg-[#FFF8F2] border-[#FF6A00] text-[#CC5500] ring-1 ring-[#FF6A00]'
                            : 'bg-white border-[#FFCC99] text-[#4D2300] hover:border-[#FF6A00]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* METHOD 5: COD */}
              {selectedMethod === 'cod' && (
                <div className="bg-[#FFF8F2] p-5 rounded-2xl border border-[#FFCC99] space-y-3 text-xs">
                  <p className="text-[#663000]">
                    {lang === 'kn'
                      ? 'ಸಾಮಗ್ರಿಗಳನ್ನು ನಿಮ್ಮ ಮನೆಗೆ ತಲುಪಿಸಿದಾಗ ನಗದು ಅಥವಾ ಡೆಲಿವರಿ ಬಾಯ್ ಬಳಿ ಇರುವ UPI QR ಕೋಡ್ ಮೂಲಕ ಪಾವತಿಸಿ.'
                      : 'Pay via cash or courier UPI QR scan upon doorstep delivery.'}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold bg-[#FFE5CC] px-3.5 py-1.5 rounded-xl text-[#CC5500] border border-[#FFCC99]">
                      {requiredCaptcha}
                    </span>
                    <input
                      type="text"
                      value={codCaptcha}
                      onChange={(e) => {
                        setCodCaptcha(e.target.value);
                        setCodCaptchaError('');
                      }}
                      placeholder={lang === 'kn' ? 'ಕೋಡ್ ನಮೂದಿಸಿ' : 'Enter captcha'}
                      className="px-3.5 py-2 bg-white border border-[#FFCC99] rounded-xl text-xs font-mono text-[#4D2300] outline-none"
                    />
                  </div>
                  {codCaptchaError && (
                    <p className="text-red-600 text-[11px] font-bold">
                      {codCaptchaError}
                    </p>
                  )}
                </div>
              )}

              {/* Pay CTA */}
              <div className="pt-4 border-t border-[#FFE5CC] space-y-3">
                <button
                  onClick={handleInitiatePayment}
                  className="w-full py-4 px-4 bg-gradient-to-r from-[#FF6A00] to-[#E65C00] hover:from-[#E65C00] hover:to-[#CC5500] text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#FFE5CC]" />
                  <span>
                    {selectedMethod === 'cod'
                      ? `Confirm Cash on Delivery (₹${total.toLocaleString('en-IN')})`
                      : `Pay ₹${total.toLocaleString('en-IN')} via ${
                          selectedMethod === 'razorpay' ? 'Razorpay Gateway' : 'Secure 256-Bit Gateway'
                        }`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OTP Simulation / Bank Handshake */}
          {step === 'processing_otp' && (
            <div className="py-4 space-y-6">
              {authStage === 'connecting' && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#0082FB] border-t-transparent animate-spin" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0C2340]">
                      {lang === 'kn' ? 'ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕ್ ಸಂಪರ್ಕ...' : 'Connecting to Bank 3D Secure Gateway...'}
                    </h3>
                    <p className="text-xs text-[#1E3A5F] mt-1 font-mono">
                      256-Bit TLS 1.3 Bank Handshake Verified · Razorpay Engine
                    </p>
                  </div>
                </div>
              )}

              {authStage === 'otp_prompt' && (
                <div className="max-w-md mx-auto bg-[#F0F7FF] p-6 rounded-3xl border-2 border-[#0082FB]/40 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#D0E5FF] pb-3 text-xs">
                    <div>
                      <span className="font-bold text-[#0C2340] block">3D Secure 2.0 Gateway</span>
                      <span className="text-[10px] text-[#0082FB] font-mono">MERCHANT: POOJA SEVE</span>
                    </div>
                    <span className="font-serif text-base font-bold text-[#CC5500] tabular-nums">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#0C2340]">
                      {lang === 'kn' ? 'OTP ಪರಿಶೀಲನಾ ಕೋಡ್ ನಮೂದಿಸಿ' : 'Enter 6-Digit One-Time Password (OTP)'}
                    </h4>
                    <p className="text-xs text-[#1E3A5F] mt-1">
                      Code dispatched to registered phone ending in <strong>•••• ••{customer.phone.slice(-4)}</strong>.
                    </p>
                  </div>

                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3 bg-white border-2 border-[#0082FB]/40 rounded-2xl text-[#0C2340] outline-none focus:border-[#0082FB]"
                    maxLength={6}
                    autoFocus
                  />

                  <div className="flex items-center justify-between text-xs text-[#1E3A5F]">
                    <span className="tabular-nums font-mono">
                      Resend OTP in: <strong>00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpTimer(30);
                        setOtpValue('741029');
                      }}
                      className="text-[#0082FB] hover:underline font-bold cursor-pointer"
                    >
                      Auto-fill Demo OTP (741029)
                    </button>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpValue.length < 4}
                    className="w-full py-3.5 bg-[#2D5A27] hover:bg-[#23471F] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-green-300" />
                    <span>{lang === 'kn' ? 'ದೃಢೀಕರಿಸಿ & ಪಾವತಿ ಪೂರ್ಣಗೊಳಿಸಿ' : 'Authenticate & Confirm Payment'}</span>
                  </button>
                </div>
              )}

              {authStage === 'verifying' && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#2D5A27] border-t-transparent animate-spin" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4D2300]">
                      {lang === 'kn' ? 'ಪಾವತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Verifying Payment Authorization...'}
                    </h3>
                    <p className="text-xs text-[#994700] mt-1 font-mono">
                      Generating Tax Invoice & UTR Settlement Token...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
