export type Language = 'kn' | 'en';
export type PageRoute = 'home' | 'services' | 'catalog' | 'materials' | 'booking' | 'process' | 'contact' | 'admin';

export type RMSCategory = 
  | 'all'
  | 'plates'
  | 'bells'
  | 'samai'
  | 'aarti'
  | 'deepams'
  | 'kalash_utensils'
  | 'kund_patra'
  | 'idols'
  | 'kansa'
  | 'bajot_jhula'
  | 'trishul_symbols';

export interface RMSCatalogItem {
  code: string;
  nameEn: string;
  nameKn: string;
  category: RMSCategory;
  categoryNameEn: string;
  categoryNameKn: string;
  sizes: string;
  material: 'Brass' | 'Copper' | 'Kansa (Bronze)' | 'Silver Plated / Antique' | 'Gold Plated' | 'Stainless Steel' | 'Mixed Sacred Metals';
  materialKn: string;
  pageNumber: number;
  image?: string;
  priceEstimate?: number;
  popular?: boolean;
  descriptionEn: string;
  descriptionKn: string;
  features?: string[];
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
}

export type ProductCategory = 
  | 'all'
  | 'brass-diya'
  | 'puja-kits'
  | 'dhoop-fragrance'
  | 'malas-accessories'
  | 'idols-murti';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  origin: string;
  material: string;
  dimensions: string;
  weight: string;
  sacredSignificance: string;
  includedItems: string[];
  description: string;
  image: string;
  badge?: string;
  mantra?: string;
  deity?: string;
}

export type MaterialCategory = 
  | 'all'
  | 'mangala'
  | 'herbs'
  | 'samithu'
  | 'panchagavya'
  | 'navadhanya'
  | 'dryfruits'
  | 'fruits'
  | 'flowers'
  | 'others';

export interface PoojaService {
  id: string;
  nameKn: string;
  nameEn: string;
  descKn: string;
  descEn: string;
  price: number;
  duration?: string;
  includedMaterials: string[];
  iconType: string;
  image?: string;
}

export interface MaterialItem {
  id: string;
  nameKn: string;
  nameEn: string;
  category: MaterialCategory;
  categoryLabelKn: string;
  categoryLabelEn: string;
  price: number;
  unitKn: string;
  unitEn: string;
  essential: boolean;
  image?: string;
  descriptionKn?: string;
  descriptionEn?: string;
}

export interface CartItem {
  item: MaterialItem | PoojaService;
  type: 'material' | 'service';
  quantity: number;
}

export type PaymentMethodType = 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  blessingNote?: string;
  giftPackaging?: boolean;
  poojaDate?: string;
  poojaTime?: string;
}

export interface PaymentDetails {
  method: PaymentMethodType;
  gateway?: 'razorpay' | 'phonepe' | 'paytm' | 'bhim_upi';
  transactionId: string;
  utrNumber?: string;
  amount: number;
  upiHandle?: string;
  maskedCard?: string;
  bankName?: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customer: CustomerDetails;
  payment: PaymentDetails;
  status: 'confirmed' | 'sanctified' | 'dispatched' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface PurohitBookingRequest {
  id: string;
  name: string;
  phone: string;
  poojaType: string;
  date: string;
  time: string;
  location: string;
  message: string;
  status: 'confirmed' | 'assigned';
  purohitName?: string;
  amount?: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  gotra?: string;
  nakshatra?: string;
  preferredDeity?: string;
  notes?: string;
  totalBookings: number;
  totalOrders: number;
  totalSpend: number;
  status: 'active' | 'inactive' | 'vip';
  createdAt: string;
  updatedAt: string;
}

