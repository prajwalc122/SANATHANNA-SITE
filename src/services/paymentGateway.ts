export interface PaymentGatewayConfig {
  provider: 'razorpay' | 'phonepe' | 'paytm' | 'bhim_upi';
  merchantName: string;
  merchantUpi: string;
  razorpayKeyId: string;
  isTestMode: boolean;
  autoCapture: boolean;
}

export const DEFAULT_GATEWAY_CONFIG: PaymentGatewayConfig = {
  provider: 'razorpay',
  merchantName: 'Pooja Seve Samsthe (ಶ್ರೀ ಮಹಾಗಣಪತಿ ವೈದಿಕ ಸೇವೆ)',
  merchantUpi: 'pavitrampooja@upi',
  razorpayKeyId: 'rzp_live_pooja894372',
  isTestMode: false,
  autoCapture: true,
};

export const getPaymentGatewayConfig = (): PaymentGatewayConfig => {
  const saved = localStorage.getItem('pooja_gateway_config');
  if (saved) {
    try {
      return { ...DEFAULT_GATEWAY_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      // fallback
    }
  }
  return DEFAULT_GATEWAY_CONFIG;
};

export const savePaymentGatewayConfig = (config: PaymentGatewayConfig): void => {
  localStorage.setItem('pooja_gateway_config', JSON.stringify(config));
};

export const generateUpiIntentUri = (
  amount: number,
  orderId: string,
  merchantUpi = DEFAULT_GATEWAY_CONFIG.merchantUpi,
  merchantName = DEFAULT_GATEWAY_CONFIG.merchantName
): string => {
  const cleanMerchant = merchantUpi.trim();
  const cleanName = encodeURIComponent(merchantName.trim());
  const note = encodeURIComponent(`Pooja Seve ${orderId}`);
  return `upi://pay?pa=${cleanMerchant}&pn=${cleanName}&am=${amount.toFixed(2)}&cu=INR&tn=${note}`;
};
