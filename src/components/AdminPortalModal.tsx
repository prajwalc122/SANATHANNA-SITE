import React, { useState, useEffect } from 'react';
import { 
  Order, PurohitBookingRequest, MaterialItem, PoojaService, Language, Client 
} from '../types';
import { 
  X, ShieldCheck, Lock, User, KeyRound, Eye, EyeOff, 
  Package, Calendar, DollarSign, Sparkles, CheckCircle2, 
  Truck, Clock, Phone, MapPin, Search, Plus, Trash2, Edit2, 
  ExternalLink, LogOut, Check, ArrowRight, RefreshCw, AlertCircle,
  Users, FileDown, MessageSquare, Mail, Award, BookOpen,
  UserCircle, BadgeCheck, Building, QrCode, Shield, Copy, CheckCircle,
  Zap, CreditCard, Database, Server, Send, Inbox, AtSign
} from 'lucide-react';
import { templeAudio } from '../utils/audioChant';
import { CATEGORY_INFO } from '../data/poojaData';
import { clientApi, databaseApi, authApi } from '../services/api';
import { getPaymentGatewayConfig, savePaymentGatewayConfig, PaymentGatewayConfig } from '../services/paymentGateway';

export interface AdminProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  organization: string;
  registrationId: string;
  location: string;
  address: string;
  tradition: string;
  upiId: string;
  hours: string;
  bio: string;
}

const DEFAULT_ADMIN_PROFILE: AdminProfileData = {
  name: 'ರಾಮಚಂದ್ರ ಎಂ (Ramachandra M)',
  role: 'ಮುಖ್ಯ ಆಡಳಿತಾಧಿಕಾರಿ & ನಿರ್ವಾಹಕರು (Chief Administrator & Manager)',
  email: 'shriramachandra1995@gmail.com',
  phone: '+91 87225 50479',
  organization: 'ಶ್ರೀ ಆಂಜನೇಯ ಸ್ವಾಮಿ ದೇವಸ್ಥಾನ (Anjaneya Temple, Arakere)',
  registrationId: 'KA-SMG-VEDIC-2024/902',
  location: 'ಅರಕೆರೆ, ಶಿವಮೊಗ್ಗ, ಕರ್ನಾಟಕ (Arakere, Shivamogga)',
  address: 'ಆಂಜನೇಯ ದೇವಾಲಯ, ಅರಕೆರೆ, ಶಿವಮೊಗ್ಗ - 577201 (Anjaneya Temple, Arakere, Shivamogga)',
  tradition: 'ಋಗ್ವೇದ & ಯಜುರ್ವೇದ ಪರಂಪರೆ (Rigveda & Yajurveda Agama)',
  upiId: 'shriramachandra1995@upi',
  hours: 'ಬೆಳಿಗ್ಗೆ 6:00 - ರಾತ್ರಿ 9:00 (ಪ್ರತಿದಿನ)',
  bio: 'ಶ್ರೀ ಆಂಜನೇಯ ದೇವಾಲಯ, ಅರಕೆರೆ, ಶಿವಮೊಗ್ಗ. ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜೆಗಳು ಮತ್ತು ಸಾತ್ವಿಕ ಸಾಮಗ್ರಿಗಳ ಸೇವೆ ಒದಗಿಸುವ ಅಧಿಕೃತ ಆಡಳಿತ ಕೇಂದ್ರ.',
};

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  bookings: PurohitBookingRequest[];
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'assigned', purohitName?: string) => void;
  onAddBooking: (booking: PurohitBookingRequest) => void;
  onDeleteBooking: (bookingId: string) => void;
  materials: MaterialItem[];
  onUpdateMaterialPrice: (materialId: string, newPrice: number) => void;
  onToggleMaterialEssential: (materialId: string) => void;
  onAddMaterial: (newMaterial: MaterialItem) => void;
  onDeleteMaterial: (materialId: string) => void;
  services: PoojaService[];
  onUpdateServicePrice: (serviceId: string, newPrice: number) => void;
  isAdminLoggedIn: boolean;
  onAdminAuthChange: (loggedIn: boolean) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  lang,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  bookings,
  onUpdateBookingStatus,
  onAddBooking,
  onDeleteBooking,
  materials,
  onUpdateMaterialPrice,
  onToggleMaterialEssential,
  onAddMaterial,
  onDeleteMaterial,
  services,
  onUpdateServicePrice,
  isAdminLoggedIn,
  onAdminAuthChange,
}) => {
  // Authentication Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showSecretHelp, setShowSecretHelp] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'clients' | 'orders' | 'bookings' | 'materials' | 'services' | 'credentials'>('overview');

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState<AdminProfileData>(() => {
    const saved = localStorage.getItem('pooja_admin_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_ADMIN_PROFILE;
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  const [profileFormData, setProfileFormData] = useState<AdminProfileData>(adminProfile);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminProfile(profileFormData);
    localStorage.setItem('pooja_admin_profile', JSON.stringify(profileFormData));
    setIsEditingProfile(false);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3500);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminProfile.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Payment Gateway Configuration State
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig>(() => getPaymentGatewayConfig());
  const [gatewaySavedMsg, setGatewaySavedMsg] = useState(false);

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentGatewayConfig(gatewayConfig);
    setGatewaySavedMsg(true);
    setTimeout(() => setGatewaySavedMsg(false), 3000);
  };

  // MongoDB Database State
  const [mongoStatus, setMongoStatus] = useState<any>({
    isConnected: false,
    uriConfigured: false,
    dbName: 'sanaatana_pooja_db',
    counts: { clients: 0, bookings: 0, orders: 0, payments: 0 },
  });
  const [mongoUriInput, setMongoUriInput] = useState('');
  const [isConnectingMongo, setIsConnectingMongo] = useState(false);
  const [mongoMsg, setMongoMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchDatabaseStatus = async () => {
    try {
      const status = await databaseApi.getStatus();
      setMongoStatus(status);
    } catch (e) {
      // fallback
    }
  };

  const handleConnectMongo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mongoUriInput.trim()) return;
    setIsConnectingMongo(true);
    setMongoMsg(null);
    try {
      const res = await databaseApi.connect(mongoUriInput.trim());
      if (res.success) {
        setMongoMsg({ text: res.message, type: 'success' });
        await fetchDatabaseStatus();
        loadClients();
      } else {
        setMongoMsg({ text: res.message || res.error || 'Connection failed', type: 'error' });
      }
    } catch (err: any) {
      setMongoMsg({ text: err?.message || 'Connection error', type: 'error' });
    } finally {
      setIsConnectingMongo(false);
    }
  };

  const handleSyncToMongo = async () => {
    try {
      const res = await databaseApi.sync();
      if (res.success) {
        setMongoMsg({ text: res.message, type: 'success' });
        await fetchDatabaseStatus();
      } else {
        setMongoMsg({ text: res.message || 'Sync failed', type: 'error' });
      }
    } catch (err: any) {
      setMongoMsg({ text: err?.message || 'Sync error', type: 'error' });
    }
  };

  // Clients Directory State
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientCityFilter, setClientCityFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientHistory, setClientHistory] = useState<{ bookings: any[]; orders: any[] }>({ bookings: [], orders: [] });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Client form states
  const [cFormName, setCFormName] = useState('');
  const [cFormPhone, setCFormPhone] = useState('');
  const [cFormEmail, setCFormEmail] = useState('');
  const [cFormCity, setCFormCity] = useState('');
  const [cFormAddress, setCFormAddress] = useState('');
  const [cFormGotra, setCFormGotra] = useState('');
  const [cFormNakshatra, setCFormNakshatra] = useState('');
  const [cFormDeity, setCFormDeity] = useState('');
  const [cFormNotes, setCFormNotes] = useState('');
  const [cFormStatus, setCFormStatus] = useState<'active' | 'vip' | 'inactive'>('active');

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState<string>('all');

  // New Material Form Modal
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMatNameKn, setNewMatNameKn] = useState('');
  const [newMatNameEn, setNewMatNameEn] = useState('');
  const [newMatCategory, setNewMatCategory] = useState<MaterialItem['category']>('mangala');
  const [newMatPrice, setNewMatPrice] = useState<number>(50);
  const [newMatUnitKn, setNewMatUnitKn] = useState('100 ಗ್ರಾಂ');
  const [newMatUnitEn, setNewMatUnitEn] = useState('100g');
  const [newMatEssential, setNewMatEssential] = useState(true);

  // New Booking Form Modal
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [newBkName, setNewBkName] = useState('');
  const [newBkPhone, setNewBkPhone] = useState('');
  const [newBkPooja, setNewBkPooja] = useState('ಗಣೇಶ ಪೂಜೆ (Ganesha Pooja)');
  const [newBkDate, setNewBkDate] = useState('');
  const [newBkTime, setNewBkTime] = useState('09:30 AM');
  const [newBkLocation, setNewBkLocation] = useState('ಶಿವಮೊಗ್ಗ (Shivamogga)');
  const [newBkMessage, setNewBkMessage] = useState('');

  // Custom password and session management
  const [adminUsername, setAdminUsername] = useState('admin');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  
  // 2FA Security states
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [needs2FA, setNeeds2FA] = useState(false);
  const [isTwoFactorActive, setIsTwoFactorActive] = useState(false);
  const [twoFactorPinConfig, setTwoFactorPinConfig] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [twoFactorSuccessMsg, setTwoFactorSuccessMsg] = useState('');

  // Session verification on mount / open
  useEffect(() => {
    if (isOpen && isAdminLoggedIn) {
      authApi.verifySession().then((res) => {
        if (res.success) {
          if (res.user) setAdminUsername(res.user);
          setIsTwoFactorActive(Boolean(res.twoFactorEnabled));
        } else {
          // Token expired or invalid
          onAdminAuthChange(false);
          localStorage.removeItem('pooja_seve_admin_auth');
        }
      });
    }
  }, [isOpen, isAdminLoggedIn]);

  // Automatic Inactivity Session Timeout (30 minutes)
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    let inactivityTimer: any;

    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        authApi.logout();
        onAdminAuthChange(false);
        localStorage.removeItem('pooja_seve_admin_auth');
      }, 30 * 60 * 1000); // 30 mins
    };

    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    resetInactivity();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
    };
  }, [isAdminLoggedIn]);

  // Handle Server-Side Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await authApi.login(username.trim(), password, needs2FA ? twoFactorCode.trim() : undefined);

      if (res.success && res.token) {
        onAdminAuthChange(true);
        localStorage.setItem('pooja_seve_admin_auth', 'true');
        setLoginError('');
        setNeeds2FA(false);
        setTwoFactorCode('');
        templeAudio.playTempleBell();
        loadClients();
        fetchDatabaseStatus();
      } else if (res.requires2FA) {
        setNeeds2FA(true);
        setLoginError(lang === 'kn' ? 'ದಯವಿಟ್ಟು 6-ಅಂಕಿಯ ಭದ್ರತಾ PIN ನಮೂದಿಸಿ' : 'Please enter your 6-digit Security PIN to continue');
      } else {
        setLoginError(res.error || (lang === 'kn' ? 'ತಪ್ಪಾದ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್' : 'Invalid username or password'));
      }
    } catch {
      setLoginError(lang === 'kn' ? 'ಸರ್ವರ್ ಸಂಪರ್ಕ ದೋಷ' : 'Server authentication error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Quick Fill Hint (Only in dev)
  const handleAutoFill = () => {
    setUsername('admin');
    setPassword('admin@123');
    setLoginError('');
  };

  // Handle Logout
  const handleLogout = async () => {
    await authApi.logout();
    onAdminAuthChange(false);
    localStorage.removeItem('pooja_seve_admin_auth');
    setNeeds2FA(false);
    setTwoFactorCode('');
  };

  // Handle Change Password on Server
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess(false);

    if (newPasswordInput.length < 8) {
      setPasswordChangeError(
        lang === 'kn'
          ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಿರಬೇಕು'
          : 'New password must be at least 8 characters long'
      );
      return;
    }

    try {
      const res = await authApi.changePassword(currentPasswordInput, newPasswordInput);
      if (res.success) {
        setPasswordChangeSuccess(true);
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setTimeout(() => setPasswordChangeSuccess(false), 4000);
      } else {
        setPasswordChangeError(res.error || 'Failed to update password');
      }
    } catch {
      setPasswordChangeError('Error connecting to server');
    }
  };

  // Handle 2FA Configuration
  const handleToggle2FA = async (enable: boolean) => {
    try {
      const res = await authApi.toggle2FA(enable, enable ? twoFactorPinConfig : undefined);
      if (res.success) {
        setIsTwoFactorActive(enable);
        setTwoFactorSuccessMsg(res.message || '2FA updated');
        setTimeout(() => setTwoFactorSuccessMsg(false as any), 3500);
      }
    } catch {}
  };

  // Calculations for Overview
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length;
  const dispatchedOrders = orders.filter((o) => o.status === 'dispatched').length;
  const pendingBookings = bookings.filter((b) => b.status === 'confirmed').length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      !orderSearch ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch) ||
      o.customer.city.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Materials
  const filteredMaterials = materials.filter((m) => {
    const matchesCategory = materialCategoryFilter === 'all' || m.category === materialCategoryFilter;
    const matchesSearch = 
      !materialSearch ||
      m.nameKn.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(materialSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Submit New Material
  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatNameKn || !newMatNameEn) return;

    const newMat: MaterialItem = {
      id: `m_custom_${Date.now()}`,
      nameKn: newMatNameKn,
      nameEn: newMatNameEn,
      category: newMatCategory,
      categoryLabelKn: CATEGORY_INFO[newMatCategory]?.kn || 'ಇತರೆ',
      categoryLabelEn: CATEGORY_INFO[newMatCategory]?.en || 'Others',
      price: Number(newMatPrice),
      unitKn: newMatUnitKn,
      unitEn: newMatUnitEn,
      essential: newMatEssential,
      image: CATEGORY_INFO[newMatCategory]?.image || '/src/assets/images/hero_sacred_altar_1790401695456.jpg',
      descriptionKn: 'ಅಡ್ಮಿನ್‌ನಿಂದ ಹೊಸದಾಗಿ ಸೇರಿಸಲಾದ ಶುದ್ಧ ಪೂಜಾ ಸಾಮಗ್ರಿ.',
      descriptionEn: 'Fresh consecrated puja material added by admin.'
    };

    onAddMaterial(newMat);
    setIsAddingMaterial(false);
    setNewMatNameKn('');
    setNewMatNameEn('');
    setNewMatPrice(50);
  };

  // Submit New Manual Booking
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBkName || !newBkPhone) return;

    const newBk: PurohitBookingRequest = {
      id: `bk_manual_${Date.now().toString().slice(-5)}`,
      name: newBkName,
      phone: newBkPhone,
      poojaType: newBkPooja,
      date: newBkDate || new Date().toISOString().split('T')[0],
      time: newBkTime,
      location: newBkLocation,
      message: newBkMessage || 'Admin manual direct booking entry',
      status: 'confirmed',
    };

    onAddBooking(newBk);
    setIsAddingBooking(false);
    setNewBkName('');
    setNewBkPhone('');
    setNewBkMessage('');
  };

  // Load clients from backend
  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const data = await clientApi.getClients(clientSearch, clientCityFilter === 'all' ? undefined : clientCityFilter);
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoadingClients(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdminLoggedIn) {
      loadClients();
      fetchDatabaseStatus();
    }
  }, [isOpen, isAdminLoggedIn, clientSearch, clientCityFilter]);

  // View Client Profile + history
  const handleOpenClientDetails = async (client: Client) => {
    setSelectedClient(client);
    setIsLoadingHistory(true);
    try {
      const profile = await clientApi.getClientById(client.id);
      if (profile) {
        setClientHistory({
          bookings: profile.bookings || [],
          orders: profile.orders || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Open Edit Client Modal
  const handleStartEditClient = (client: Client) => {
    setEditingClient(client);
    setCFormName(client.name);
    setCFormPhone(client.phone);
    setCFormEmail(client.email || '');
    setCFormCity(client.city || '');
    setCFormAddress(client.address || '');
    setCFormGotra(client.gotra || '');
    setCFormNakshatra(client.nakshatra || '');
    setCFormDeity(client.preferredDeity || '');
    setCFormNotes(client.notes || '');
    setCFormStatus(client.status || 'active');
  };

  // Reset Client Form for Adding
  const handleOpenAddClient = () => {
    setEditingClient(null);
    setCFormName('');
    setCFormPhone('');
    setCFormEmail('');
    setCFormCity('ಶಿವಮೊಗ್ಗ (Shivamogga)');
    setCFormAddress('');
    setCFormGotra('');
    setCFormNakshatra('');
    setCFormDeity('ಗಣೇಶ / ಸತ್ಯನಾರಾಯಣ');
    setCFormNotes('');
    setCFormStatus('active');
    setIsAddingClient(true);
  };

  // Submit Add or Edit Client
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cFormName.trim() || !cFormPhone.trim()) return;

    if (editingClient) {
      await clientApi.updateClient(editingClient.id, {
        name: cFormName.trim(),
        phone: cFormPhone.trim(),
        email: cFormEmail.trim(),
        city: cFormCity.trim(),
        address: cFormAddress.trim(),
        gotra: cFormGotra.trim(),
        nakshatra: cFormNakshatra.trim(),
        preferredDeity: cFormDeity.trim(),
        notes: cFormNotes.trim(),
        status: cFormStatus,
      });
      setEditingClient(null);
    } else {
      await clientApi.saveClient({
        name: cFormName.trim(),
        phone: cFormPhone.trim(),
        email: cFormEmail.trim(),
        city: cFormCity.trim(),
        address: cFormAddress.trim(),
        gotra: cFormGotra.trim(),
        nakshatra: cFormNakshatra.trim(),
        preferredDeity: cFormDeity.trim(),
        notes: cFormNotes.trim(),
        status: cFormStatus,
      });
      setIsAddingClient(false);
    }
    loadClients();
  };

  // Delete client
  const handleDeleteClient = async (id: string) => {
    if (confirm(lang === 'kn' ? 'ಈ ಗ್ರಾಹಕರ ವಿವರವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?' : 'Are you sure you want to delete this client record?')) {
      await clientApi.deleteClient(id);
      loadClients();
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FFFDF9] w-full max-w-6xl rounded-3xl shadow-2xl border-2 border-[#FF9933] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#4D2300] via-[#381900] to-[#4D2300] text-[#FFE5CC] px-6 py-4 flex items-center justify-between border-b border-[#663000] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6A00] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  {lang === 'kn' ? 'ಸನಾತನ — ಅಡ್ಮಿನ್ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ' : 'Sanaatana — Admin Control Center'}
                </h2>
                <span className="bg-[#2D5A27] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-green-400">
                  {isAdminLoggedIn ? (lang === 'kn' ? 'ಪ್ರಮಾಣೀಕರಿಸಲಾಗಿದೆ' : 'Authenticated') : (lang === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Locked')}
                </span>
              </div>
              <p className="text-[11px] text-[#FFB366]">
                {lang === 'kn' ? 'ಆರ್ಡರ್‌ಗಳು, ಪುರೋಹಿತರ ಬುಕಿಂಗ್ ಮತ್ತು ಸಾಮಗ್ರಿ ದರ ನಿರ್ವಹಣೆ' : 'Orders, Purohit Bookings & Material Inventory Management'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#FF6A00] border-[#FF9933] text-white shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-[#FFE5CC]'
                  }`}
                  title={lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ' : 'View Admin Profile'}
                >
                  <div className="w-6 h-6 rounded-lg bg-[#FFE5CC] text-[#4D2300] flex items-center justify-center font-bold text-xs shrink-0">
                    {adminProfile.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block text-[11px] font-bold leading-none text-white truncate max-w-[120px]">
                      {adminProfile.name}
                    </span>
                    <span className="block text-[9px] text-[#FFD1A4] leading-none mt-0.5">
                      {lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರೊಫೈಲ್' : 'Admin Profile'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#663000] hover:bg-[#803C00] text-xs font-bold text-[#FFE5CC] rounded-xl transition-colors cursor-pointer border border-[#803C00]"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span>{lang === 'kn' ? 'ಲಾಗ್‌ಔಟ್' : 'Logout'}</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Login Screen OR Dashboard */}
        {!isAdminLoggedIn ? (
          /* ================= LOGIN FORM ================= */
          <div className="p-6 sm:p-12 overflow-y-auto flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
            {/* Discreet Help for Owner */}
            {showSecretHelp ? (
              <div className="w-full bg-[#FFF0E0] border border-[#FFCC99] rounded-2xl p-4 mb-6 text-[#4D2300] shadow-sm animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#CC5500]">
                    <KeyRound className="w-4 h-4 text-[#FF6A00]" />
                    <span>{lang === 'kn' ? 'ಖಾಸಗಿ ರುಜುವಾತುಗಳ ಸೂಚನೆ (Credentials Info)' : 'Owner Credentials Info'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSecretHelp(false)}
                    className="text-[11px] text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-[#FFCC99] text-xs mb-3 space-y-1">
                  <p className="text-[11px] text-[#663000]">
                    {lang === 'kn'
                      ? 'ಪೂರ್ವನಿಯೋಜಿತ ಬಳಕೆದಾರ: admin. ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು .env ಅಥವಾ ಅಡ್ಮಿನ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಬದಲಾಯಿಸಬಹುದು.'
                      : 'Default username: admin. Password can be configured securely in .env or changed via Credentials tab.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleAutoFill();
                    setShowSecretHelp(false);
                  }}
                  className="w-full py-1.5 bg-[#FF6A00] hover:bg-[#E65C00] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? 'ಪೂರ್ವನಿಯೋಜಿತ ಬಳಕೆದಾರ ತುಂಬಿರಿ' : 'Fill Default Admin'}</span>
                </button>
              </div>
            ) : null}

            {/* Login Input Box */}
            <form onSubmit={handleLogin} className="w-full space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#FFCC99] shadow-md">
              <h3 className="font-serif text-xl font-bold text-[#4D2300] text-center">
                {lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಖಾತೆಗೆ ಪ್ರವೇಶಿಸಿ' : 'Sign in to Admin Dashboard'}
              </h3>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4D2300] mb-1">
                  {lang === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು (Username)' : 'Username'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#994700] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] font-mono outline-none focus:border-[#FF6A00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4D2300] mb-1">
                  {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#994700] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] font-mono outline-none focus:border-[#FF6A00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#994700] hover:text-[#FF6A00] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {needs2FA && (
                <div className="bg-[#FFF4E8] border border-[#FFB366] p-3.5 rounded-xl space-y-2 animate-fade-in">
                  <label className="block text-xs font-bold text-[#803C00] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#FF6A00]" />
                    <span>{lang === 'kn' ? '2FA ಭದ್ರತಾ PIN (Security PIN)' : 'Two-Factor Security PIN'}</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit PIN"
                    autoFocus
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#FFCC99] rounded-lg text-sm text-[#4D2300] font-mono text-center tracking-widest outline-none focus:border-[#FF6A00]"
                  />
                  <span className="text-[10px] text-[#994700] block text-center">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ನಿರ್ವಾಹಕ 6-ಅಂಕಿಯ PIN ಕೋಡ್ ನಮೂದಿಸಿ' : 'Enter your 6-digit administrative security PIN'}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#4D2300] hover:bg-[#381900] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
                <span>
                  {isLoggingIn
                    ? (lang === 'kn' ? 'ಪ್ರಮಾಣೀಕರಿಸಲಾಗುತ್ತಿದೆ...' : 'Verifying Credentials...')
                    : (lang === 'kn' ? 'ಸುರಕ್ಷಿತ ಲಾಗಿನ್ (Login to Admin)' : 'Secure Admin Login')}
                </span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowSecretHelp(!showSecretHelp)}
                  className="text-[10px] text-gray-400 hover:text-[#994700] transition-colors cursor-pointer"
                >
                  🔑 {lang === 'kn' ? 'ಖಾಸಗಿ ಸಹಾಯ' : 'Owner Hint'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED DASHBOARD ================= */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Dashboard Tabs Bar */}
            <div className="bg-[#FFE5CC]/50 border-b border-[#FFCC99] px-4 sm:px-6 flex items-center gap-2 sm:gap-4 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಅವಲೋಕನ (Overview)' : 'Overview'}</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`relative py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'profile'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <UserCircle className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರೊಫೈಲ್' : 'Admin Profile'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </button>

              <button
                onClick={() => setActiveTab('clients')}
                className={`relative py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'clients'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಗ್ರಾಹಕರ ವಿವರಗಳು (Clients)' : 'Clients Directory'}</span>
                <span className="bg-[#FF6A00] text-white text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                  {clients.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`relative py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಗ್ರಾಹಕರ ಆರ್ಡರ್‌ಗಳು' : 'Customer Orders'}</span>
                <span className="bg-[#4D2300] text-white text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`relative py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'bookings'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಪುರೋಹಿತರ ಬುಕಿಂಗ್' : 'Purohit Bookings'}</span>
                <span className="bg-[#CC5500] text-white text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                  {bookings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಸಾಮಗ್ರಿ & ಬೆಲೆ ನಿರ್ವಹಣೆ' : 'Materials & Prices'}</span>
                <span className="bg-amber-700 text-white text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                  {materials.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'services'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಪೂಜೆಗಳ ದಕ್ಷಿಣಾ' : 'Pooja Fees'}</span>
              </button>

              <button
                onClick={() => setActiveTab('credentials')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'credentials'
                    ? 'border-[#FF6A00] text-[#FF6A00]'
                    : 'border-transparent text-[#994700] hover:text-[#4D2300]'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಭದ್ರತೆ' : 'Security'}</span>
              </button>
            </div>

            {/* Tab Views Container */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#FFFDF9]">
              
              {/* --- 1. OVERVIEW TAB --- */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ಒಟ್ಟು ವ್ಯಾಪಾರ' : 'Total Revenue'}</span>
                        <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">₹</div>
                      </div>
                      <span className="font-serif text-2xl font-black text-[#2D5A27] tabular-nums">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {orders.length} {lang === 'kn' ? 'ಆರ್ಡರ್‌ಗಳಿಂದ' : 'orders received'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ಹೊಸ ಆರ್ಡರ್‌ಗಳು' : 'Active Orders'}</span>
                        <Package className="w-4 h-4 text-[#FF6A00]" />
                      </div>
                      <span className="font-serif text-2xl font-black text-[#4D2300] tabular-nums">
                        {confirmedOrders}
                      </span>
                      <span className="block text-[10px] text-[#FF6A00] mt-1 font-semibold">
                        {dispatchedOrders} {lang === 'kn' ? 'ರವಾನಿಸಲಾಗಿದೆ' : 'dispatched'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ಪುರೋಹಿತರ ಬುಕಿಂಗ್' : 'Purohit Bookings'}</span>
                        <Calendar className="w-4 h-4 text-[#CC5500]" />
                      </div>
                      <span className="font-serif text-2xl font-black text-[#CC5500] tabular-nums">
                        {bookings.length}
                      </span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {pendingBookings} {lang === 'kn' ? 'ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'confirmed'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳ ದಾಸ್ತಾನು' : 'Active Inventory'}</span>
                        <Edit2 className="w-4 h-4 text-amber-700" />
                      </div>
                      <span className="font-serif text-2xl font-black text-[#4D2300] tabular-nums">
                        {materials.length}
                      </span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {materials.filter(m => m.essential).length} {lang === 'kn' ? 'ಮುಖ್ಯ ಸಾಮಗ್ರಿಗಳು' : 'essential tagged'}
                      </span>
                    </div>
                  </div>

                  {/* Recent Activity Two-Column */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders Box */}
                    <div className="bg-white rounded-2xl border border-[#FFCC99] p-5 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-serif text-base font-bold text-[#4D2300] flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#FF6A00]" />
                            <span>{lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು' : 'Recent Customer Orders'}</span>
                          </h4>
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                          >
                            {lang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ →' : 'View all →'}
                          </button>
                        </div>

                        {orders.length === 0 ? (
                          <p className="text-xs text-gray-500 py-6 text-center">
                            {lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಆರ್ಡರ್ ಬಂದಿಲ್ಲ.' : 'No orders received yet.'}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {orders.slice(0, 3).map((order) => (
                              <div key={order.id} className="p-3 bg-[#FFF8F2] rounded-xl border border-[#FFE5CC] flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <strong className="text-xs font-bold text-[#4D2300]">{order.customer.fullName}</strong>
                                    <span className="text-[10px] text-gray-500 font-mono">#{order.id.slice(-6)}</span>
                                  </div>
                                  <span className="text-[11px] text-[#994700] block mt-0.5">
                                    {order.customer.city} • {order.items.length} {lang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳು' : 'items'}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-xs text-[#2D5A27] block tabular-nums">₹{order.total}</span>
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase">
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Purohit Bookings Box */}
                    <div className="bg-white rounded-2xl border border-[#FFCC99] p-5 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-serif text-base font-bold text-[#4D2300] flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#CC5500]" />
                            <span>{lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಪುರೋಹಿತರ ಬುಕಿಂಗ್' : 'Recent Purohit Requests'}</span>
                          </h4>
                          <button
                            onClick={() => setActiveTab('bookings')}
                            className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                          >
                            {lang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ →' : 'View all →'}
                          </button>
                        </div>

                        {bookings.length === 0 ? (
                          <p className="text-xs text-gray-500 py-6 text-center">
                            {lang === 'kn' ? 'ಯಾವುದೇ ಬುಕಿಂಗ್ ಬಾಕಿ ಇಲ್ಲ.' : 'No purohit bookings yet.'}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {bookings.slice(0, 3).map((bk) => (
                              <div key={bk.id} className="p-3 bg-[#FFF8F2] rounded-xl border border-[#FFE5CC] flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <strong className="text-xs font-bold text-[#4D2300]">{bk.name}</strong>
                                    <span className="text-[10px] text-[#FF6A00] font-bold">({bk.poojaType})</span>
                                  </div>
                                  <span className="text-[11px] text-[#994700] block mt-0.5">
                                    📅 {bk.date} at {bk.time} • 📍 {bk.location}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <a
                                    href={`tel:${bk.phone}`}
                                    className="px-2.5 py-1 bg-[#2D5A27] text-white text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>Call</span>
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 2. ADMIN PROFILE TAB --- */}
              {activeTab === 'profile' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Saved Alert Banner */}
                  {profileSavedMsg && (
                    <div className="bg-green-50 border-2 border-green-300 text-green-800 p-3.5 rounded-2xl flex items-center justify-between shadow-xs animate-fade-in">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರೊಫೈಲ್ ವಿವರಗಳು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Admin profile details saved successfully!'}</span>
                      </div>
                      <span className="text-[10px] bg-green-200 px-2 py-0.5 rounded font-mono">Updated</span>
                    </div>
                  )}

                  {/* Profile Hero Header Card */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-[#4D2300] via-[#5C2B00] to-[#381900] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#FF9933] shadow-lg">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                      {/* Avatar with Ring */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#FF6A00] to-[#FFCC99] p-1 shadow-md">
                          <div className="w-full h-full rounded-xl bg-[#381900] flex items-center justify-center text-3xl font-serif font-black text-[#FFE5CC] border border-[#FFCC99]/40">
                            {adminProfile.name.charAt(0)}
                          </div>
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-[#381900]" title="Online">
                          <BadgeCheck className="w-4 h-4" />
                        </span>
                      </div>

                      {/* Bio Strip */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <span className="bg-[#FF6A00] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                            {lang === 'kn' ? 'ಅಧಿಕೃತ ಮುಖ್ಯ ಆಡಳಿತಾಧಿಕಾರಿ' : 'Master Administrator'}
                          </span>
                          <span className="bg-white/10 text-[#FFD1A4] text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/15">
                            ID: {adminProfile.registrationId}
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF5EB]">
                          {adminProfile.name}
                        </h3>

                        <p className="text-xs text-[#FFCC99] font-medium max-w-xl">
                          {adminProfile.role} • {adminProfile.organization}
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#FFE5CC]/90 pt-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                            <span>{adminProfile.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#FF9933]" />
                            <span>{adminProfile.hours}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setProfileFormData(adminProfile);
                            setIsEditingProfile(!isEditingProfile);
                          }}
                          className="px-4 py-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{isEditingProfile ? (lang === 'kn' ? 'ವೀಕ್ಷಣೆ ಮೋಡ್' : 'View Mode') : (lang === 'kn' ? 'ವಿವರ ತಿದ್ದುಪಡಿ' : 'Edit Profile')}</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('credentials')}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#FFE5CC] text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#FF9933]" />
                          <span>{lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EDIT PROFILE FORM */}
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border-2 border-[#FFCC99] p-6 shadow-md space-y-4">
                      <div className="flex items-center justify-between border-b border-[#FFE5CC] pb-3">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-5 h-5 text-[#FF6A00]" />
                          <h4 className="font-serif text-lg font-bold text-[#4D2300]">
                            {lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ ನವೀಕರಿಸಿ' : 'Update Administrator Profile'}
                          </h4>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">Owner Settings</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ಆಡಳಿತಾಧಿಕಾರಿ ಹೆಸರು *' : 'Full Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileFormData.name}
                            onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ಹುದ್ದೆ / ಜವಾಬ್ದಾರಿ *' : 'Role / Designation *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileFormData.role}
                            onChange={(e) => setProfileFormData({ ...profileFormData, role: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ಸಂಪರ್ಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'Contact Mobile *'}
                          </label>
                          <input
                            type="tel"
                            required
                            value={profileFormData.phone}
                            onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ಅಧಿಕೃತ ಇಮೇಲ್ *' : 'Official Email *'}
                          </label>
                          <input
                            type="email"
                            required
                            value={profileFormData.email}
                            onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ಸಂಸ್ಥೆ / ಟ್ರಸ್ಟ್ ಹೆಸರು' : 'Organization / Trust Name'}
                          </label>
                          <input
                            type="text"
                            value={profileFormData.organization}
                            onChange={(e) => setProfileFormData({ ...profileFormData, organization: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ನೋಂದಣಿ ಸಂಖ್ಯೆ (Reg ID)' : 'Registration / ID'}
                          </label>
                          <input
                            type="text"
                            value={profileFormData.registrationId}
                            onChange={(e) => setProfileFormData({ ...profileFormData, registrationId: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ವಸಾಹತು UPI ID (ದಕ್ಷಿಣಾ ಸ್ವೀಕೃತಿ)' : 'Settlement UPI ID (for receiving payments)'}
                          </label>
                          <input
                            type="text"
                            value={profileFormData.upiId}
                            onChange={(e) => setProfileFormData({ ...profileFormData, upiId: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none font-mono focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ಸೇವಾ ಸಮಯ (Timings)' : 'Operating Hours'}
                          </label>
                          <input
                            type="text"
                            value={profileFormData.hours}
                            onChange={(e) => setProfileFormData({ ...profileFormData, hours: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ನಗರ / ಪ್ರದೇಶ' : 'City / Region'}
                          </label>
                          <input
                            type="text"
                            value={profileFormData.location}
                            onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#4D2300] font-bold mb-1">
                            {lang === 'kn' ? 'ವೈದಿಕ ಪರಂಪರೆ / ಶಾಖೆ' : 'Agama / Vedic Tradition'}
                          </label>
                          <input
                            type="text"
                            value={profileFormData.tradition}
                            onChange={(e) => setProfileFormData({ ...profileFormData, tradition: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                          />
                        </div>
                      </div>

                      <div className="text-xs">
                        <label className="block text-[#4D2300] font-bold mb-1">
                          {lang === 'kn' ? 'ಮುಖ್ಯ ಕಚೇರಿ / ಪೂರ್ಣ ವಿಳಾಸ' : 'Headquarters / Full Address'}
                        </label>
                        <input
                          type="text"
                          value={profileFormData.address}
                          onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                        />
                      </div>

                      <div className="text-xs">
                        <label className="block text-[#4D2300] font-bold mb-1">
                          {lang === 'kn' ? 'ಧ್ಯೇಯವಾಕ್ಯ / ಪರಿಚಯ (Bio)' : 'Mission Bio / Motto'}
                        </label>
                        <textarea
                          rows={2}
                          value={profileFormData.bio}
                          onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                        />
                      </div>

                      <div className="pt-3 border-t border-[#FFE5CC] flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-5 py-2 border border-[#FFCC99] text-[#994700] hover:bg-[#FFF0E0] rounded-xl text-xs font-bold cursor-pointer"
                        >
                          {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          {lang === 'kn' ? 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ' : 'Save Profile Changes'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* PROFILE DETAILS DISPLAY (3 GRID CARDS) */
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Card 1: Personal & Contact */}
                        <div className="bg-white p-5 rounded-2xl border border-[#FFCC99] shadow-2xs space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-[#FFE5CC] text-[#CC5500]">
                              <User className="w-4 h-4" />
                              <h4 className="font-serif text-sm font-bold text-[#4D2300]">
                                {lang === 'kn' ? 'ವೈಯಕ್ತಿಕ & ಸಂಪರ್ಕ' : 'Personal & Contact'}
                              </h4>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ಹೆಸರು' : 'Name'}</span>
                                <strong className="text-[#4D2300] text-sm block">{adminProfile.name}</strong>
                              </div>

                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Phone'}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <a href={`tel:${adminProfile.phone}`} className="font-bold text-[#4D2300] hover:text-[#FF6A00]">
                                    {adminProfile.phone}
                                  </a>
                                  <a
                                    href={`https://wa.me/91${adminProfile.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded border border-green-200"
                                  >
                                    WhatsApp
                                  </a>
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ಇಮೇಲ್' : 'Email'}</span>
                                <a href={`mailto:${adminProfile.email}`} className="text-gray-700 hover:text-[#FF6A00] truncate block font-medium">
                                  {adminProfile.email}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#FFE5CC]">
                            <span className="text-[10px] bg-[#E8F2E6] text-[#2D5A27] font-bold px-2 py-0.5 rounded-full inline-block">
                              ✓ Super Admin Authority
                            </span>
                          </div>
                        </div>

                        {/* Card 2: Organization & Vedic Heritage */}
                        <div className="bg-white p-5 rounded-2xl border border-[#FFCC99] shadow-2xs space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-[#FFE5CC] text-[#CC5500]">
                              <Building className="w-4 h-4" />
                              <h4 className="font-serif text-sm font-bold text-[#4D2300]">
                                {lang === 'kn' ? 'ಸಂಸ್ಥೆ & ಪರಂಪರೆ' : 'Organization & Heritage'}
                              </h4>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ಟ್ರಸ್ಟ್ / ಸಂಸ್ಥೆ' : 'Trust / Organization'}</span>
                                <strong className="text-[#4D2300] block">{adminProfile.organization}</strong>
                              </div>

                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ವೈದಿಕ ಪರಂಪರೆ' : 'Tradition'}</span>
                                <span className="text-[#663000] block">{adminProfile.tradition}</span>
                              </div>

                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ಕಚೇರಿ ವಿಳಾಸ' : 'Office Address'}</span>
                                <span className="text-gray-700 block text-[11px] leading-relaxed">{adminProfile.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#FFE5CC]">
                            <span className="text-[10px] text-[#994700] font-mono">
                              Reg: {adminProfile.registrationId}
                            </span>
                          </div>
                        </div>

                        {/* Card 3: Settlements & Banking */}
                        <div className="bg-white p-5 rounded-2xl border border-[#FFCC99] shadow-2xs space-y-3 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-[#FFE5CC] text-[#CC5500]">
                              <QrCode className="w-4 h-4" />
                              <h4 className="font-serif text-sm font-bold text-[#4D2300]">
                                {lang === 'kn' ? 'ಪಾವತಿ & ಕಾರ್ಯಾಚರಣೆ' : 'Settlement & Timings'}
                              </h4>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ದಕ್ಷಿಣಾ ಸ್ವೀಕೃತಿ UPI ID' : 'Settlement UPI ID'}</span>
                                <div className="flex items-center justify-between bg-[#FFFDF9] p-2 rounded-xl border border-[#FFCC99] mt-1 font-mono text-xs">
                                  <span className="text-[#4D2300] font-bold">{adminProfile.upiId}</span>
                                  <button
                                    onClick={handleCopyUpi}
                                    title="Copy UPI ID"
                                    className="p-1 hover:bg-[#FFE5CC] rounded text-[#FF6A00] cursor-pointer"
                                  >
                                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ದೈನಂದಿನ ಸೇವಾ ಸಮಯ' : 'Operating Hours'}</span>
                                <span className="text-[#4D2300] font-semibold block">{adminProfile.hours}</span>
                              </div>

                              <div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold block">{lang === 'kn' ? 'ಆಡಳಿತ ಕೇಂದ್ರ' : 'Hub Location'}</span>
                                <span className="text-[#663000] font-semibold block">{adminProfile.location}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#FFE5CC]">
                            <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full inline-block border border-amber-200">
                              ⚡ Instant Settlements
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Gateway Configuration Panel */}
                      <div className="bg-white rounded-3xl border-2 border-[#0082FB]/40 p-5 sm:p-6 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D0E5FF]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#0082FB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm sm:text-base font-bold text-[#0C2340]">
                                {lang === 'kn' ? 'ಪಾವತಿ ಗೇಟ್‌ವೇ ನಿಯಂತ್ರಣ (Payment Gateway Settings)' : 'Payment Gateway Engine & Merchant Settings'}
                              </h4>
                              <span className="text-[11px] text-[#0082FB] font-medium">
                                Razorpay · PhonePe · NPCI UPI 256-Bit Integrated
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-green-100 text-green-800 border border-green-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              {gatewayConfig.isTestMode ? 'Sandbox Mode' : 'Live Gateway Active'}
                            </span>
                          </div>
                        </div>

                        {gatewaySavedMsg && (
                          <div className="bg-green-50 border border-green-300 text-green-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>{lang === 'kn' ? 'ಪಾವತಿ ಗೇಟ್‌ವೇ ಸೆಟ್ಟಿಂಗ್ಸ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Payment Gateway configuration updated successfully!'}</span>
                          </div>
                        )}

                        <form onSubmit={handleSaveGateway} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[#0C2340] font-bold mb-1">
                                {lang === 'kn' ? 'ಪ್ರಾಥಮಿಕ ಗೇಟ್‌ವೇ (Primary Gateway)' : 'Primary Gateway Provider'}
                              </label>
                              <select
                                value={gatewayConfig.provider}
                                onChange={(e) => setGatewayConfig({ ...gatewayConfig, provider: e.target.value as any })}
                                className="w-full px-3 py-2 bg-[#F0F7FF] border border-[#D0E5FF] rounded-xl text-[#0C2340] font-bold outline-none"
                              >
                                <option value="razorpay">Razorpay Unified PG (Cards, UPI, NB)</option>
                                <option value="phonepe">PhonePe Switch Gateway</option>
                                <option value="paytm">Paytm Payment Gateway</option>
                                <option value="bhim_upi">Direct BHIM UPI Fast Gateway</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[#0C2340] font-bold mb-1">
                                {lang === 'kn' ? 'ಮರ್ಚೆಂಟ್ UPI ID (VPA)' : 'Merchant UPI ID (VPA)'}
                              </label>
                              <input
                                type="text"
                                value={gatewayConfig.merchantUpi}
                                onChange={(e) => setGatewayConfig({ ...gatewayConfig, merchantUpi: e.target.value })}
                                className="w-full px-3 py-2 bg-[#F0F7FF] border border-[#D0E5FF] rounded-xl font-mono text-[#0C2340] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[#0C2340] font-bold mb-1">
                                {lang === 'kn' ? 'ರೇಜರ್‌ಪೇ Key ID (Razorpay Key)' : 'Razorpay Key ID'}
                              </label>
                              <input
                                type="text"
                                value={gatewayConfig.razorpayKeyId}
                                onChange={(e) => setGatewayConfig({ ...gatewayConfig, razorpayKeyId: e.target.value })}
                                className="w-full px-3 py-2 bg-[#F0F7FF] border border-[#D0E5FF] rounded-xl font-mono text-[#0C2340] outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[#0C2340] font-bold mb-1">
                                {lang === 'kn' ? 'ಮರ್ಚೆಂಟ್ ವ್ಯಾಪಾರ ಹೆಸರು' : 'Registered Merchant Business Name'}
                              </label>
                              <input
                                type="text"
                                value={gatewayConfig.merchantName}
                                onChange={(e) => setGatewayConfig({ ...gatewayConfig, merchantName: e.target.value })}
                                className="w-full px-3 py-2 bg-[#F0F7FF] border border-[#D0E5FF] rounded-xl text-[#0C2340] outline-none"
                              />
                            </div>

                            <div className="flex items-center justify-between bg-[#F0F7FF] px-4 py-2 rounded-xl border border-[#D0E5FF]">
                              <div>
                                <span className="font-bold text-[#0C2340] block">
                                  {lang === 'kn' ? 'ಪಾವತಿ ಪರಿಸರ (Environment)' : 'Payment Mode'}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {gatewayConfig.isTestMode ? 'Demo Sandbox / Test' : 'Real Live Processing'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setGatewayConfig({ ...gatewayConfig, isTestMode: !gatewayConfig.isTestMode })}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                  gatewayConfig.isTestMode
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-[#2D5A27] text-white'
                                }`}
                              >
                                {gatewayConfig.isTestMode ? 'Test Mode' : 'Live Mode'}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] text-gray-500 font-mono">
                              Webhook: https://ais-dev.../api/payments/webhook
                            </span>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-[#0082FB] hover:bg-[#006ACC] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{lang === 'kn' ? 'ಗೇಟ್‌ವೇ ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ' : 'Save Gateway Settings'}</span>
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* MongoDB Database & Cloud Persistence Panel */}
                      <div className="bg-[#001E2B] text-white rounded-3xl border-2 border-[#13AA52] p-5 sm:p-6 shadow-md space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#0A3847]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#13AA52] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              <Database className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif text-sm sm:text-base font-bold text-[#E8F8F0]">
                                  {lang === 'kn' ? 'ಮಾಂಗೋ ಡಿಬಿ ಬ್ಯಾಕೆಂಡ್ ಡೇಟಾಬೇಸ್ (MongoDB Database)' : 'MongoDB Atlas & Backend Persistence Engine'}
                                </h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  mongoStatus.isConnected
                                    ? 'bg-[#13AA52]/20 text-[#00ED64] border border-[#13AA52]'
                                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${mongoStatus.isConnected ? 'bg-[#00ED64] animate-pulse' : 'bg-amber-400'}`} />
                                  {mongoStatus.isConnected ? `Connected: ${mongoStatus.dbName}` : 'Local Hybrid Store Active'}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#A6C4BA] font-mono">
                                Collections: clients · bookings · orders · payments (Enterprise Native Driver)
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleSyncToMongo}
                            disabled={!mongoStatus.isConnected}
                            className="self-start sm:self-auto px-3 py-1.5 bg-[#0A3847] hover:bg-[#114B5F] disabled:opacity-40 text-[#E8F8F0] text-xs font-bold rounded-xl border border-[#13AA52]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-[#00ED64]" />
                            <span>{lang === 'kn' ? 'ಡೇಟಾ ಸಿಂಕ್' : 'Sync to MongoDB'}</span>
                          </button>
                        </div>

                        {/* Collection Counts Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="bg-[#002B3D] p-3 rounded-2xl border border-[#0A3847]">
                            <span className="text-[10px] text-[#A6C4BA] uppercase font-bold block">Clients Collection</span>
                            <span className="text-xl font-bold font-mono text-[#00ED64] tabular-nums">
                              {mongoStatus.isConnected ? mongoStatus.counts?.clients || 0 : clients.length}
                            </span>
                            <span className="text-[9px] text-[#699E8F] block">Registered devotees</span>
                          </div>

                          <div className="bg-[#002B3D] p-3 rounded-2xl border border-[#0A3847]">
                            <span className="text-[10px] text-[#A6C4BA] uppercase font-bold block">Orders Collection</span>
                            <span className="text-xl font-bold font-mono text-[#00ED64] tabular-nums">
                              {mongoStatus.isConnected ? mongoStatus.counts?.orders || 0 : orders.length}
                            </span>
                            <span className="text-[9px] text-[#699E8F] block">Samagri kits placed</span>
                          </div>

                          <div className="bg-[#002B3D] p-3 rounded-2xl border border-[#0A3847]">
                            <span className="text-[10px] text-[#A6C4BA] uppercase font-bold block">Bookings Collection</span>
                            <span className="text-xl font-bold font-mono text-[#00ED64] tabular-nums">
                              {mongoStatus.isConnected ? mongoStatus.counts?.bookings || 0 : bookings.length}
                            </span>
                            <span className="text-[9px] text-[#699E8F] block">Purohit events booked</span>
                          </div>

                          <div className="bg-[#002B3D] p-3 rounded-2xl border border-[#0A3847]">
                            <span className="text-[10px] text-[#A6C4BA] uppercase font-bold block">Payments Collection</span>
                            <span className="text-xl font-bold font-mono text-[#00ED64] tabular-nums">
                              {mongoStatus.isConnected ? mongoStatus.counts?.payments || 0 : 'Active'}
                            </span>
                            <span className="text-[9px] text-[#699E8F] block">Verified settlements</span>
                          </div>
                        </div>

                        {/* Connection Message / Feedback */}
                        {mongoMsg && (
                          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            mongoMsg.type === 'success'
                              ? 'bg-[#13AA52]/20 border border-[#13AA52] text-[#00ED64]'
                              : 'bg-red-500/20 border border-red-500/40 text-red-300'
                          }`}>
                            {mongoMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
                            <span>{mongoMsg.text}</span>
                          </div>
                        )}

                        {/* MongoDB URI Input Box */}
                        <form onSubmit={handleConnectMongo} className="space-y-2 text-xs">
                          <label className="block text-[#A6C4BA] font-bold">
                            {lang === 'kn' ? 'ಮಾಂಗೋ ಡಿಬಿ ಕನೆಕ್ಷನ್ ಸ್ಟ್ರಿಂಗ್ (MongoDB Atlas URI):' : 'Configure MongoDB Atlas / Server Connection URI:'}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="password"
                              value={mongoUriInput}
                              onChange={(e) => setMongoUriInput(e.target.value)}
                              placeholder="mongodb+srv://<username>:<password>@cluster0.mongodb.net/sanaatana_pooja_db"
                              className="flex-1 px-3.5 py-2.5 bg-[#002B3D] border border-[#0A3847] rounded-xl font-mono text-xs text-[#E8F8F0] outline-none focus:border-[#13AA52]"
                            />
                            <button
                              type="submit"
                              disabled={isConnectingMongo || !mongoUriInput.trim()}
                              className="px-5 py-2.5 bg-[#13AA52] hover:bg-[#00ED64] hover:text-[#001E2B] disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              {isConnectingMongo ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>{lang === 'kn' ? 'ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...' : 'Connecting...'}</span>
                                </>
                              ) : (
                                <>
                                  <Server className="w-3.5 h-3.5" />
                                  <span>{lang === 'kn' ? 'MongoDB ಸಂಪರ್ಕಿಸಿ' : 'Connect & Sync'}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[10px] text-[#699E8F] leading-relaxed">
                            {lang === 'kn'
                              ? 'ಗಮನಿಸಿ: ನಿಮ್ಮ ಮಾಂಗೋ ಡಿಬಿ ಅಟ್ಲಾಸ್ ಅಥವಾ ಲೋಕಲ್ URI ಅನ್ನು ನಮೂದಿಸಿದಾಗ, ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಎಲ್ಲ ಗ್ರಾಹಕರು ಮತ್ತು ಆರ್ಡರ್‌ಗಳು ಆಟೋಮ್ಯಾಟಿಕ್ ಆಗಿ MongoDB ಗೆ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತವೆ.'
                              : 'Tip: Connecting your MongoDB Atlas cluster will automatically mirror and persist all existing orders, devotees, and transaction records to your cloud database.'}
                          </p>
                        </form>
                      </div>

                      {/* Mission Motto Card */}
                      <div className="bg-[#FFF8F2] p-5 rounded-2xl border border-[#FFCC99] flex items-start gap-3">
                        <Award className="w-6 h-6 text-[#FF6A00] shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                          <span className="font-bold text-[#4D2300] block">
                            {lang === 'kn' ? 'ಸಂಸ್ಥೆಯ ಧ್ಯೇಯವಾಕ್ಯ & ಸಂಕಲ್ಪ' : 'Mission & Vedic Creed'}
                          </span>
                          <p className="text-[#663000] italic leading-relaxed">
                            "{adminProfile.bio}"
                          </p>
                        </div>
                      </div>

                      {/* Quick Navigation Shortcuts */}
                      <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-gray-500 font-bold">
                          {lang === 'kn' ? 'ತ್ವರಿತ ನಿರ್ವಹಣಾ ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು:' : 'Admin Quick Actions:'}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setActiveTab('clients')}
                            className="px-3 py-1.5 bg-[#FFF0E0] hover:bg-[#FFE5CC] text-[#994700] rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ಗ್ರಾಹಕರ ಪಟ್ಟಿ' : 'Clients'}</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('orders')}
                            className="px-3 py-1.5 bg-[#FFF0E0] hover:bg-[#FFE5CC] text-[#994700] rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ಆರ್ಡರ್‌ಗಳು' : 'Orders'}</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('bookings')}
                            className="px-3 py-1.5 bg-[#FFF0E0] hover:bg-[#FFE5CC] text-[#994700] rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ಬುಕಿಂಗ್‌ಗಳು' : 'Bookings'}</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('credentials')}
                            className="px-3 py-1.5 bg-[#4D2300] text-white hover:bg-[#381900] rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-[#FFB366]" />
                            <span>{lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ' : 'Change Password'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- 3. CLIENTS DIRECTORY TAB --- */}
              {activeTab === 'clients' && (
                <div className="space-y-6">
                  {/* Top Clients Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ನೋಂದಾಯಿತ ಗ್ರಾಹಕರು' : 'Total Clients'}</span>
                        <Users className="w-4 h-4 text-[#FF6A00]" />
                      </div>
                      <span className="font-serif text-2xl font-black text-[#4D2300] tabular-nums">
                        {clients.length}
                      </span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {clients.filter(c => c.status === 'vip').length} {lang === 'kn' ? 'ವಿಶೇಷ ಭಕ್ತರು (VIP)' : 'VIP devotees'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ಒಟ್ಟು ಪೂಜಾ ಸೇವೆಗಳು' : 'Total Bookings'}</span>
                        <Calendar className="w-4 h-4 text-[#CC5500]" />
                      </div>
                      <span className="font-serif text-2xl font-black text-[#CC5500] tabular-nums">
                        {clients.reduce((acc, c) => acc + (c.totalBookings || 0), 0)}
                      </span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {lang === 'kn' ? 'ಗ್ರಾಹಕರಿಂದ ನೇರ ಬುಕಿಂಗ್' : 'Pooja rituals scheduled'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ಒಟ್ಟು ಗ್ರಾಹಕ ವಹಿವಾಟು' : 'Total Client Value'}</span>
                        <DollarSign className="w-4 h-4 text-[#2D5A27]" />
                      </div>
                      <span className="font-serif text-2xl font-black text-[#2D5A27] tabular-nums">
                        ₹{clients.reduce((acc, c) => acc + (c.totalSpend || 0), 0).toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {lang === 'kn' ? 'ಪೂಜೆ & ಸಾಮಗ್ರಿ ಮೌಲ್ಯ' : 'Rituals & materials'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs">
                      <div className="flex items-center justify-between text-[#994700] mb-2">
                        <span className="text-xs font-bold">{lang === 'kn' ? 'ಸಕ್ರಿಯ ನಗರಗಳು' : 'Active Cities'}</span>
                        <MapPin className="w-4 h-4 text-[#994700]" />
                      </div>
                      <span className="font-serif text-2xl font-black text-[#4D2300] tabular-nums">
                        {new Set(clients.map(c => c.city || 'Karnataka')).size}
                      </span>
                      <span className="block text-[10px] text-gray-500 mt-1">
                        {lang === 'kn' ? 'ಕರ್ನಾಟಕದಾದ್ಯಂತ' : 'Across Karnataka'}
                      </span>
                    </div>
                  </div>

                  {/* Search and Action Toolbar */}
                  <div className="bg-white p-4 rounded-2xl border border-[#FFCC99] shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                      {/* Search */}
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-[#994700] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                          placeholder={lang === 'kn' ? 'ಹೆಸರು, ಮೊಬೈಲ್, ಗೋತ್ರ ಅಥವಾ ನಗರ ಹುಡುಕಿ...' : 'Search by name, phone, gotra, or city...'}
                          className="w-full pl-10 pr-4 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6A00]"
                        />
                      </div>

                      {/* City Filter */}
                      <select
                        value={clientCityFilter}
                        onChange={(e) => setClientCityFilter(e.target.value)}
                        className="px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-[#FF6A00]"
                      >
                        <option value="all">{lang === 'kn' ? 'ಎಲ್ಲಾ ನಗರಗಳು / All Cities' : 'All Cities'}</option>
                        <option value="ಶಿವಮೊಗ್ಗ">ಶಿವಮೊಗ್ಗ (Shivamogga)</option>
                        <option value="ಬೆಂಗಳೂರು">ಬೆಂಗಳೂರು (Bengaluru)</option>
                        <option value="ಹುಬ್ಬಳ್ಳಿ">ಹುಬ್ಬಳ್ಳಿ (Hubballi)</option>
                        <option value="ಮೈಸೂರು">ಮೈಸೂರು (Mysuru)</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <button
                        onClick={loadClients}
                        title="Refresh Clients"
                        className="p-2 border border-[#FFCC99] bg-[#FFF8F2] hover:bg-[#FFE5CC] text-[#994700] rounded-xl transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingClients ? 'animate-spin' : ''}`} />
                      </button>

                      <a
                        href="/api/export/clients.csv"
                        download="clients-directory.csv"
                        className="px-3 py-2 bg-[#FFF8F2] hover:bg-[#FFE5CC] border border-[#FFCC99] text-xs font-bold text-[#994700] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5 text-[#FF6A00]" />
                        <span>{lang === 'kn' ? 'CSV ಡೌನ್‌ಲೋಡ್' : 'Export CSV'}</span>
                      </a>

                      <button
                        onClick={handleOpenAddClient}
                        className="px-4 py-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{lang === 'kn' ? 'ಹೊಸ ಗ್ರಾಹಕರ ಸೇರ್ಪಡೆ' : 'Add Client'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Clients List */}
                  {clients.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#FFCC99] p-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#FFF0E0] text-[#FF6A00] flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#4D2300]">
                        {lang === 'kn' ? 'ಯಾವುದೇ ಗ್ರಾಹಕರ ವಿವರಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No Clients Found'}
                      </h4>
                      <p className="text-xs text-[#994700] max-w-sm mx-auto">
                        {lang === 'kn'
                          ? 'ಹೊಸ ಗ್ರಾಹಕರ ವಿವರಗಳನ್ನು ಸೇರಿಸಲು ಮೇಲಿನ "ಹೊಸ ಗ್ರಾಹಕರ ಸೇರ್ಪಡೆ" ಬಟನ್ ಒತ್ತಿ.'
                          : 'Click "+ Add Client" above or submit a pooja booking to automatically create records.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clients.map((client) => (
                        <div
                          key={client.id}
                          className="bg-white rounded-2xl border border-[#FFCC99] p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                        >
                          <div>
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FFE5CC] text-[#FF6A00] flex items-center justify-center font-bold text-base font-serif shrink-0 border border-[#FFCC99]">
                                  {client.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-serif text-sm font-bold text-[#4D2300]">
                                      {client.name}
                                    </h4>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                      client.status === 'vip'
                                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                        : client.status === 'active'
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {client.status}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-gray-500 font-mono">
                                    ID: {client.id}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStartEditClient(client)}
                                  title="Edit Client"
                                  className="p-1.5 text-[#994700] hover:text-[#FF6A00] hover:bg-[#FFF0E0] rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClient(client.id)}
                                  title="Delete Client"
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Contact & Location Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#FFE5CC] text-xs">
                              <div className="flex items-center gap-2 text-[#4D2300]">
                                <Phone className="w-3.5 h-3.5 text-[#FF6A00] shrink-0" />
                                <a href={`tel:${client.phone}`} className="hover:underline font-semibold">
                                  {client.phone}
                                </a>
                                <a
                                  href={`https://wa.me/91${client.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Chat on WhatsApp"
                                  className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-bold border border-green-200 ml-1"
                                >
                                  WhatsApp
                                </a>
                              </div>

                              {client.email && (
                                <div className="flex items-center gap-2 text-gray-600 truncate">
                                  <Mail className="w-3.5 h-3.5 text-[#994700] shrink-0" />
                                  <span className="truncate">{client.email}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-[#4D2300] sm:col-span-2">
                                <MapPin className="w-3.5 h-3.5 text-[#FF6A00] shrink-0" />
                                <span className="text-[11px] truncate">
                                  {client.address || client.city || 'Karnataka'}
                                </span>
                              </div>
                            </div>

                            {/* Spiritual Details (Gotra, Nakshatra, Deity) */}
                            {(client.gotra || client.nakshatra || client.preferredDeity) && (
                              <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-[#FFF0E0]">
                                {client.gotra && (
                                  <span className="text-[10px] bg-[#FFF8F2] text-[#994700] px-2 py-0.5 rounded border border-[#FFCC99] font-medium">
                                    ಗೋತ್ರ: <strong>{client.gotra}</strong>
                                  </span>
                                )}
                                {client.nakshatra && (
                                  <span className="text-[10px] bg-[#FFF8F2] text-[#994700] px-2 py-0.5 rounded border border-[#FFCC99] font-medium">
                                    ನಕ್ಷತ್ರ: <strong>{client.nakshatra}</strong>
                                  </span>
                                )}
                                {client.preferredDeity && (
                                  <span className="text-[10px] bg-[#FFE5CC] text-[#4D2300] px-2 py-0.5 rounded font-medium">
                                    ಇಷ್ಟದೇವತೆ: <strong>{client.preferredDeity}</strong>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Client Notes */}
                            {client.notes && (
                              <p className="mt-2 text-[11px] text-[#663000] italic bg-[#FFFDF9] p-2 rounded-lg border border-[#FFE5CC]">
                                "{client.notes}"
                              </p>
                            )}
                          </div>

                          {/* Card Footer: Metrics and Details CTA */}
                          <div className="pt-3 border-t border-[#FFE5CC] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-bold text-[#CC5500]">
                                🕉️ {client.totalBookings || 0} {lang === 'kn' ? 'ಬುಕಿಂಗ್' : 'Bookings'}
                              </span>
                              <span className="text-[11px] font-bold text-[#2D5A27]">
                                ₹{(client.totalSpend || 0).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <button
                              onClick={() => handleOpenClientDetails(client)}
                              className="text-xs font-bold text-[#FF6A00] hover:text-[#E05D00] flex items-center gap-1 cursor-pointer"
                            >
                              <span>{lang === 'kn' ? 'ಪೂರ್ಣ ಇತಿಹಾಸ' : 'View History'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CLIENT HISTORY / DOSSIER MODAL */}
                  {selectedClient && (
                    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
                      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#FF9933] p-6 space-y-6 shadow-2xl">
                        <div className="flex items-start justify-between border-b border-[#FFE5CC] pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFE5CC] text-[#FF6A00] flex items-center justify-center text-xl font-serif font-bold border border-[#FFCC99]">
                              {selectedClient.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-serif text-lg font-bold text-[#4D2300]">
                                {selectedClient.name}
                              </h3>
                              <p className="text-xs text-[#994700]">
                                {selectedClient.phone} • {selectedClient.city}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedClient(null)}
                            className="w-8 h-8 rounded-full bg-[#FFF0E0] text-[#994700] hover:bg-[#FFE5CC] flex items-center justify-center cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Spiritual & Personal Overview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FFF8F2] p-3 rounded-2xl border border-[#FFE5CC] text-xs">
                          <div>
                            <span className="text-[10px] text-gray-500 block">ಗೋತ್ರ / Gotra</span>
                            <strong className="text-[#4D2300]">{selectedClient.gotra || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">ನಕ್ಷತ್ರ / Nakshatra</span>
                            <strong className="text-[#4D2300]">{selectedClient.nakshatra || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">ಒಟ್ಟು ಪೂಜೆಗಳು</span>
                            <strong className="text-[#CC5500]">{selectedClient.totalBookings || 0}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">ಒಟ್ಟು ಮೌಲ್ಯ</span>
                            <strong className="text-[#2D5A27]">₹{(selectedClient.totalSpend || 0).toLocaleString('en-IN')}</strong>
                          </div>
                        </div>

                        {selectedClient.address && (
                          <div className="text-xs">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">ವಿಳಾಸ / Full Address</span>
                            <p className="text-[#4D2300] bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                              {selectedClient.address}
                            </p>
                          </div>
                        )}

                        {/* Linked Pooja Bookings History */}
                        <div className="space-y-3">
                          <h4 className="font-serif text-sm font-bold text-[#4D2300] flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#FF6A00]" />
                            <span>{lang === 'kn' ? 'ಪೂಜಾ ಬುಕಿಂಗ್ ಇತಿಹಾಸ' : 'Pooja Bookings History'}</span>
                          </h4>

                          {isLoadingHistory ? (
                            <p className="text-xs text-gray-400 py-4 text-center">Loading client records...</p>
                          ) : clientHistory.bookings.length === 0 ? (
                            <p className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-xl">
                              {lang === 'kn' ? 'ಯಾವುದೇ ಪೂಜಾ ಬುಕಿಂಗ್ ದಾಖಲೆ ಇಲ್ಲ.' : 'No pooja bookings on record.'}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {clientHistory.bookings.map((b) => (
                                <div key={b.id} className="p-3 bg-[#FFFDF9] rounded-xl border border-[#FFE5CC] flex items-center justify-between text-xs">
                                  <div>
                                    <strong className="text-[#4D2300] block">{b.poojaType}</strong>
                                    <span className="text-[11px] text-[#994700]">
                                      📅 {b.date} at {b.time} • 📍 {b.location}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    {b.amount ? (
                                      <span className="font-bold text-[#2D5A27] block tabular-nums">₹{b.amount}</span>
                                    ) : null}
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase">
                                      {b.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Linked Material Kit Orders History */}
                        <div className="space-y-3">
                          <h4 className="font-serif text-sm font-bold text-[#4D2300] flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#FF6A00]" />
                            <span>{lang === 'kn' ? 'ಸಾಮಗ್ರಿ ಕಿಟ್ ಖರೀದಿಗಳು' : 'Materials Orders History'}</span>
                          </h4>

                          {clientHistory.orders.length === 0 ? (
                            <p className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-xl">
                              {lang === 'kn' ? 'ಯಾವುದೇ ಸಾಮಗ್ರಿ ಕಿಟ್ ಆರ್ಡರ್ ಇಲ್ಲ.' : 'No material orders on record.'}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {clientHistory.orders.map((o) => (
                                <div key={o.id} className="p-3 bg-[#FFFDF9] rounded-xl border border-[#FFE5CC] flex items-center justify-between text-xs">
                                  <div>
                                    <strong className="text-[#4D2300] block">Order #{o.id}</strong>
                                    <span className="text-[11px] text-gray-500">
                                      {new Date(o.createdAt).toLocaleDateString()} • {o.items?.length || 1} items
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-bold text-[#2D5A27] block tabular-nums">₹{o.total}</span>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 uppercase">
                                      {o.status || 'delivered'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-[#FFE5CC] flex justify-end">
                          <button
                            onClick={() => setSelectedClient(null)}
                            className="px-4 py-2 bg-[#4D2300] text-white text-xs font-bold rounded-xl hover:bg-[#381900] cursor-pointer"
                          >
                            {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADD / EDIT CLIENT MODAL */}
                  {(isAddingClient || editingClient) && (
                    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
                      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-[#FF9933] p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#FFE5CC] pb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#FF6A00]" />
                            <h3 className="font-serif text-lg font-bold text-[#4D2300]">
                              {editingClient
                                ? (lang === 'kn' ? 'ಗ್ರಾಹಕರ ವಿವರ ತಿದ್ದುಪಡಿ' : 'Edit Client Details')
                                : (lang === 'kn' ? 'ಹೊಸ ಗ್ರಾಹಕರ ನೋಂದಣಿ' : 'Register New Client')}
                            </h3>
                          </div>
                          <button
                            onClick={() => {
                              setIsAddingClient(false);
                              setEditingClient(null);
                            }}
                            className="w-7 h-7 rounded-full bg-[#FFF0E0] text-[#994700] flex items-center justify-center cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveClient} className="space-y-3.5 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[#4D2300] font-semibold mb-1">
                                {lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು *' : 'Full Name *'}
                              </label>
                              <input
                                type="text"
                                required
                                value={cFormName}
                                onChange={(e) => setCFormName(e.target.value)}
                                placeholder="e.g. Nandan Sharma"
                                className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                              />
                            </div>

                            <div>
                              <label className="block text-[#4D2300] font-semibold mb-1">
                                {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'Phone Number *'}
                              </label>
                              <input
                                type="tel"
                                required
                                value={cFormPhone}
                                onChange={(e) => setCFormPhone(e.target.value)}
                                placeholder="e.g. 9876543210"
                                className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[#4D2300] font-semibold mb-1">
                                {lang === 'kn' ? 'ಇಮೇಲ್ (ಐಚ್ಛಿಕ)' : 'Email (Optional)'}
                              </label>
                              <input
                                type="email"
                                value={cFormEmail}
                                onChange={(e) => setCFormEmail(e.target.value)}
                                placeholder="client@example.com"
                                className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                              />
                            </div>

                            <div>
                              <label className="block text-[#4D2300] font-semibold mb-1">
                                {lang === 'kn' ? 'ನಗರ / City' : 'City'}
                              </label>
                              <input
                                type="text"
                                value={cFormCity}
                                onChange={(e) => setCFormCity(e.target.value)}
                                placeholder="e.g. Shivamogga"
                                className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[#4D2300] font-semibold mb-1">
                              {lang === 'kn' ? 'ಪೂರ್ಣ ವಿಳಾಸ / Address' : 'Full Address'}
                            </label>
                            <textarea
                              rows={2}
                              value={cFormAddress}
                              onChange={(e) => setCFormAddress(e.target.value)}
                              placeholder="#Door, Street, Area, Pincode"
                              className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[#4D2300] font-semibold mb-1">
                                {lang === 'kn' ? 'ಗೋತ್ರ / Gotra' : 'Gotra'}
                              </label>
                              <input
                                type="text"
                                value={cFormGotra}
                                onChange={(e) => setCFormGotra(e.target.value)}
                                placeholder="e.g. Kashyapa"
                                className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                              />
                            </div>

                            <div>
                              <label className="block text-[#4D2300] font-semibold mb-1">
                                {lang === 'kn' ? 'ನಕ್ಷತ್ರ / Star' : 'Nakshatra'}
                              </label>
                              <input
                                type="text"
                                value={cFormNakshatra}
                                onChange={(e) => setCFormNakshatra(e.target.value)}
                                placeholder="e.g. Rohini"
                                className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                              />
                            </div>

                            <div>
                              <label className="block text-[#4D2300] font-semibold mb-1">
                                {lang === 'kn' ? 'ಸ್ಥಿತಿ / Status' : 'Status'}
                              </label>
                              <select
                                value={cFormStatus}
                                onChange={(e) => setCFormStatus(e.target.value as any)}
                                className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none font-semibold cursor-pointer"
                              >
                                <option value="active">Active / ಸಕ್ರಿಯ</option>
                                <option value="vip">VIP Devotee</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[#4D2300] font-semibold mb-1">
                              {lang === 'kn' ? 'ಇಷ್ಟದೇವತೆ / Preferred Deity' : 'Preferred Deity / Pooja'}
                            </label>
                            <input
                              type="text"
                              value={cFormDeity}
                              onChange={(e) => setCFormDeity(e.target.value)}
                              placeholder="e.g. Satyanarayana, Lakshmi, Ganesha"
                              className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#4D2300] font-semibold mb-1">
                              {lang === 'kn' ? 'ವಿಶೇಷ ಸೂಚನೆಗಳು / Notes' : 'Notes / Purohit Instructions'}
                            </label>
                            <textarea
                              rows={2}
                              value={cFormNotes}
                              onChange={(e) => setCFormNotes(e.target.value)}
                              placeholder="Special requirements, tradition preferences, or notes..."
                              className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl outline-none focus:ring-1 focus:ring-[#FF6A00]"
                            />
                          </div>

                          <div className="pt-3 border-t border-[#FFE5CC] flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingClient(false);
                                setEditingClient(null);
                              }}
                              className="px-4 py-2 border border-[#FFCC99] rounded-xl text-[#994700] hover:bg-[#FFF0E0] cursor-pointer"
                            >
                              {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                            >
                              {editingClient
                                ? (lang === 'kn' ? 'ಬದಲಾವಣೆ ಉಳಿಸಿ' : 'Save Changes')
                                : (lang === 'kn' ? 'ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ' : 'Save Client')}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- 3. CUSTOMER ORDERS TAB --- */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-[#994700] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder={lang === 'kn' ? 'ಹೆಸರು, ಮೊಬೈಲ್, ಆರ್ಡರ್ ಐಡಿ ಹುಡುಕಿ...' : 'Search customer, phone, order ID...'}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                        className="w-full sm:w-auto px-3 py-2 bg-white border border-[#FFCC99] rounded-xl text-xs font-bold text-[#4D2300] outline-none cursor-pointer"
                      >
                        <option value="all">{lang === 'kn' ? 'ಎಲ್ಲಾ ಹಂತಗಳು (All Status)' : 'All Statuses'}</option>
                        <option value="confirmed">{lang === 'kn' ? 'ದೃಢೀಕರಿಸಲಾಗಿದೆ (Confirmed)' : 'Confirmed'}</option>
                        <option value="sanctified">{lang === 'kn' ? 'ಮಂತ್ರ ಸಂಸ್ಕಾರವಾಗಿದೆ (Sanctified)' : 'Sanctified'}</option>
                        <option value="dispatched">{lang === 'kn' ? 'ರವಾನಿಸಲಾಗಿದೆ (Dispatched)' : 'Dispatched'}</option>
                        <option value="delivered">{lang === 'kn' ? 'ತಲುಪಿಸಲಾಗಿದೆ (Delivered)' : 'Delivered'}</option>
                      </select>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#FFCC99] p-10 text-center space-y-2">
                      <Package className="w-10 h-10 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500">
                        {lang === 'kn' ? 'ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No matching orders found.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-2xl border border-[#FFCC99] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FFE5CC]">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-xs bg-[#FFF0E0] text-[#CC5500] px-2.5 py-1 rounded-lg border border-[#FFCC99]">
                                #{order.id}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {new Date(order.createdAt).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </span>
                            </div>

                            {/* Status Change Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#994700]">Status:</span>
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer outline-none ${
                                  order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : order.status === 'dispatched'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'bg-orange-100 text-orange-800 border-orange-300'
                                }`}
                              >
                                <option value="confirmed">Confirmed / ದೃಢೀಕರಿಸಲಾಗಿದೆ</option>
                                <option value="sanctified">Sanctified / ಸಂಸ್ಕರಿಸಲಾಗಿದೆ</option>
                                <option value="dispatched">Dispatched / ರವಾನಿಸಲಾಗಿದೆ</option>
                                <option value="delivered">Delivered / ತಲುಪಿಸಲಾಗಿದೆ</option>
                              </select>

                              <button
                                onClick={() => onDeleteOrder(order.id)}
                                title="Delete Order"
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Customer & Delivery Information */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FFFDF9] p-3 rounded-xl border border-[#FFE5CC]">
                            <div>
                              <strong className="block text-[#4D2300] font-bold text-sm">
                                {order.customer.fullName}
                              </strong>
                              <a
                                href={`tel:${order.customer.phone}`}
                                className="text-[#FF6A00] font-semibold flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{order.customer.phone}</span>
                              </a>
                              {order.customer.email && (
                                <span className="text-gray-500 text-[10px] block mt-0.5">
                                  {order.customer.email}
                                </span>
                              )}
                            </div>

                            <div className="space-y-0.5">
                              <span className="block text-[10px] text-gray-400 uppercase font-bold">Delivery Address</span>
                              <p className="text-[11px] text-[#4D2300] leading-snug">
                                {order.customer.addressLine}, {order.customer.landmark ? `${order.customer.landmark}, ` : ''}
                                {order.customer.city}, {order.customer.state} — <strong>{order.customer.pincode}</strong>
                              </p>
                            </div>

                            <div className="space-y-0.5">
                              <span className="block text-[10px] text-gray-400 uppercase font-bold">Payment & Total</span>
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-base font-black text-[#2D5A27] tabular-nums">
                                  ₹{order.total}
                                </span>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                                  {order.payment.method.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono block">
                                Txn: {order.payment.transactionId}
                              </span>
                            </div>
                          </div>

                          {/* Items Ordered */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#994700]">
                              {lang === 'kn' ? 'ಆರ್ಡರ್ ಮಾಡಿದ ಸಾಮಗ್ರಿಗಳು' : 'Items Ordered'} ({order.items.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {order.items.map((ci, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] bg-white border border-[#FFCC99] px-2.5 py-1 rounded-lg text-[#4D2300] flex items-center gap-1.5 shadow-2xs"
                                >
                                  <strong>{ci.quantity}x</strong>
                                  <span>{lang === 'kn' ? (ci.item as any).nameKn : (ci.item as any).nameEn}</span>
                                  <span className="text-gray-400">|</span>
                                  <span className="text-[#CC5500] font-semibold tabular-nums">
                                    ₹{ci.item.price * ci.quantity}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- 3. PUROHIT BOOKINGS TAB --- */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#4D2300]">
                      {lang === 'kn' ? 'ಪುರೋಹಿತರ ಆಹ್ವಾನಗಳು & ನೇಮಕಾತಿ' : 'Purohit Booking Management'}
                    </h3>
                    <button
                      onClick={() => setIsAddingBooking(true)}
                      className="px-3 py-1.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'kn' ? '+ ಹೊಸ ಬುಕಿಂಗ್ ಸೇರಿಸಿ' : '+ Add Manual Booking'}</span>
                    </button>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#FFCC99] p-10 text-center space-y-2">
                      <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500">
                        {lang === 'kn' ? 'ಯಾವುದೇ ಪುರೋಹಿತರ ಬುಕಿಂಗ್ ಬಾಕಿ ಇಲ್ಲ.' : 'No purohit bookings yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookings.map((bk) => (
                        <div
                          key={bk.id}
                          className="bg-white rounded-2xl border border-[#FFCC99] p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-[#FFE5CC]">
                              <span className="font-bold text-xs text-[#FF6A00] uppercase tracking-wider">
                                {bk.poojaType}
                              </span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                bk.status === 'assigned'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {bk.status}
                              </span>
                            </div>

                            <div className="mt-3 space-y-1.5 text-xs text-[#4D2300]">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">{bk.name}</span>
                                <a
                                  href={`tel:${bk.phone}`}
                                  className="text-[#FF6A00] font-bold flex items-center gap-1"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>{bk.phone}</span>
                                </a>
                              </div>

                              <p className="text-[11px] text-[#994700] flex items-center gap-2">
                                <span>📅 {bk.date} ({bk.time})</span>
                                <span>•</span>
                                <span>📍 {bk.location}</span>
                              </p>

                              {bk.message && (
                                <p className="text-[11px] bg-[#FFF8F2] p-2 rounded-lg border border-[#FFE5CC] text-[#803C00] italic">
                                  "{bk.message}"
                                </p>
                              )}

                              {bk.purohitName && (
                                <div className="text-[11px] text-green-800 font-bold bg-green-50 p-2 rounded-lg border border-green-200">
                                  ✓ ನಿಯೋಜಿತ ಪುರೋಹಿತರು: {bk.purohitName}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#FFE5CC] flex items-center justify-between gap-2">
                            {bk.status !== 'assigned' ? (
                              <button
                                onClick={() => {
                                  const name = prompt(
                                    lang === 'kn' ? 'ಪುರೋಹಿತರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ:' : 'Enter Assigned Purohit Name:',
                                    'ವೇ. ಮೂ. ಶಾಸ್ತ್ರಿಗಳು'
                                  );
                                  if (name) {
                                    onUpdateBookingStatus(bk.id, 'assigned', name);
                                  }
                                }}
                                className="px-3 py-1.5 bg-[#2D5A27] hover:bg-green-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{lang === 'kn' ? 'ಪುರೋಹಿತರನ್ನು ನಿಗದಿಪಡಿಸಿ' : 'Assign Purohit'}</span>
                              </button>
                            ) : (
                              <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{lang === 'kn' ? 'ಸಂಪೂರ್ಣ ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Assigned & Confirmed'}</span>
                              </span>
                            )}

                            <button
                              onClick={() => onDeleteBooking(bk.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- 4. MATERIALS & PRICES TAB --- */}
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-[#994700] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={materialSearch}
                          onChange={(e) => setMaterialSearch(e.target.value)}
                          placeholder={lang === 'kn' ? 'ಸಾಮಗ್ರಿ ಹೆಸರು ಹುಡುಕಿ...' : 'Search material name...'}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] outline-none focus:border-[#FF6A00]"
                        />
                      </div>

                      <select
                        value={materialCategoryFilter}
                        onChange={(e) => setMaterialCategoryFilter(e.target.value)}
                        className="px-3 py-2 bg-white border border-[#FFCC99] rounded-xl text-xs font-bold text-[#4D2300] outline-none cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                          <option key={key} value={key}>
                            {info.icon} {lang === 'kn' ? info.kn : info.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setIsAddingMaterial(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'kn' ? '+ ಹೊಸ ಸಾಮಗ್ರಿ ಸೇರಿಸಿ' : '+ Add New Material'}</span>
                    </button>
                  </div>

                  {/* Materials Table */}
                  <div className="bg-white rounded-2xl border border-[#FFCC99] overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#4D2300]">
                        <thead className="bg-[#FFE5CC]/60 text-[#994700] font-bold border-b border-[#FFCC99]">
                          <tr>
                            <th className="p-3.5">Item Name (ಕನ್ನಡ / English)</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Unit (ಪ್ರಮಾಣ)</th>
                            <th className="p-3.5">Price (₹ ದರ)</th>
                            <th className="p-3.5">Essential Tag</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFE5CC]/70">
                          {filteredMaterials.map((item) => (
                            <tr key={item.id} className="hover:bg-[#FFF8F2]/60 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center gap-2.5">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.nameEn}
                                      className="w-8 h-8 rounded-lg object-cover border border-[#FFCC99] shrink-0"
                                    />
                                  )}
                                  <div>
                                    <strong className="block font-bold text-[#4D2300]">{item.nameKn}</strong>
                                    <span className="text-[11px] text-gray-500">{item.nameEn}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <span className="text-[11px] font-semibold text-[#CC5500]">
                                  {item.categoryLabelKn}
                                </span>
                              </td>

                              <td className="p-3.5">
                                <span className="font-semibold text-gray-700">
                                  {item.unitKn} ({item.unitEn})
                                </span>
                              </td>

                              {/* Editable Price Input */}
                              <td className="p-3.5">
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-[#2D5A27]">₹</span>
                                  <input
                                    type="number"
                                    defaultValue={item.price}
                                    onBlur={(e) => {
                                      const val = Number(e.target.value);
                                      if (val > 0 && val !== item.price) {
                                        onUpdateMaterialPrice(item.id, val);
                                      }
                                    }}
                                    className="w-20 px-2 py-1 bg-[#FFFDF9] border border-[#FFCC99] rounded-lg font-bold text-xs text-[#2D5A27] outline-none focus:border-[#FF6A00] tabular-nums"
                                  />
                                </div>
                              </td>

                              {/* Toggle Essential Badge */}
                              <td className="p-3.5">
                                <button
                                  onClick={() => onToggleMaterialEssential(item.id)}
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                                    item.essential
                                      ? 'bg-[#FF6A00] text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  {item.essential ? '✓ Essential (ಮುಖ್ಯ)' : 'Optional'}
                                </button>
                              </td>

                              {/* Delete Action */}
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete ${item.nameEn}?`)) {
                                      onDeleteMaterial(item.id);
                                    }
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 5. POOJA SERVICES TAB --- */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#4D2300]">
                    {lang === 'kn' ? 'ಪೂಜಾ ಸೇವೆಗಳು & ದಕ್ಷಿಣಾ ಶುಲ್ಕ ನಿರ್ವಹಣೆ' : 'Pooja Services & Dakshina Fee Management'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="bg-white rounded-2xl border border-[#FFCC99] p-5 shadow-2xs flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-[#FFE5CC]">
                            <h4 className="font-serif text-base font-bold text-[#4D2300]">
                              {srv.nameKn}
                            </h4>
                          </div>
                          <p className="text-xs text-[#803C00] mt-2">
                            {srv.descKn}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#FFE5CC] space-y-2">
                          <label className="block text-[10px] font-bold text-[#994700] uppercase">
                            {lang === 'kn' ? 'ದಕ್ಷಿಣಾ ಶುಲ್ಕ (₹ Dakshina)' : 'Dakshina Fee (₹)'}:
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-black text-xl text-[#2D5A27]">₹</span>
                            <input
                              type="number"
                              defaultValue={srv.price}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 && val !== srv.price) {
                                  onUpdateServicePrice(srv.id, val);
                                }
                              }}
                              className="w-full px-3 py-1.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl font-serif text-lg font-black text-[#2D5A27] outline-none focus:border-[#FF6A00] tabular-nums"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- 6. CREDENTIALS & SECURITY TAB --- */}
              {activeTab === 'credentials' && (
                <div className="max-w-xl mx-auto space-y-6">
                  {/* Current Active Credentials Display */}
                  <div className="bg-[#FFF0E0] rounded-2xl border-2 border-[#FF9933] p-5">
                    <h4 className="font-serif text-base font-bold text-[#4D2300] mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#FF6A00]" />
                      <span>{lang === 'kn' ? 'ಅಡ್ಮಿನ್ ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ & ಅಧಿವೇಶನ' : 'Active Admin Security & Session'}</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#FFCC99] font-mono text-xs my-3">
                      <div>
                        <span className="block text-[10px] text-[#994700] uppercase font-bold">Username:</span>
                        <strong className="text-sm text-[#4D2300]">{adminUsername}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#994700] uppercase font-bold">Session Security:</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          <span>HMAC Encrypted</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#803C00] flex items-center gap-1.5 pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF6A00]" />
                      <span>{lang === 'kn' ? 'ನಿಷ್ಕ್ರಿಯತೆಯ ನಂತರ 30 ನಿಮಿಷಗಳಲ್ಲಿ ಸ್ವಯಂ ಲಾಗ್‌ಔಟ್ ಆಗುತ್ತದೆ.' : 'Auto session invalidation after 30 minutes of inactivity.'}</span>
                    </div>
                  </div>

                  {/* Change Password Form (Server-Side) */}
                  <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-[#FFCC99] p-6 shadow-xs space-y-4">
                    <h4 className="font-serif text-base font-bold text-[#4D2300] flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#FF6A00]" />
                      <span>{lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ (Change Password)' : 'Update Admin Password'}</span>
                    </h4>

                    {passwordChangeSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಸರ್ವರ್‌ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಣಗೊಂಡಿದೆ!' : 'Password updated successfully on server!'}</span>
                      </div>
                    )}

                    {passwordChangeError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{passwordChangeError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#4D2300] mb-1">
                        {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ (Current Password)*' : 'Current Password*'}
                      </label>
                      <input
                        type="password"
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] font-mono outline-none focus:border-[#FF6A00]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4D2300] mb-1">
                        {lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ (ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು)*' : 'New Password (min 8 chars)*'}
                      </label>
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] font-mono outline-none focus:border-[#FF6A00]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ' : 'Save New Password'}</span>
                    </button>
                  </form>

                  {/* Two-Factor Authentication (2FA) */}
                  <div className="bg-white rounded-2xl border border-[#FFCC99] p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#FF6A00]" />
                        <h4 className="font-serif text-base font-bold text-[#4D2300]">
                          {lang === 'kn' ? 'ದ್ವಿ-ಹಂತದ ಭದ್ರತಾ PIN (Two-Factor PIN)' : 'Two-Factor Authentication (2FA PIN)'}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isTwoFactorActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isTwoFactorActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-xs text-[#663000]">
                      {lang === 'kn'
                        ? 'ಲಾಗಿನ್ ಸಮಯದಲ್ಲಿ ಪಾಸ್‌ವರ್ಡ್ ಜೊತೆಗೆ 6-ಅಂಕಿಯ ಭದ್ರತಾ PIN ಕೇಳುವ ಮೂಲಕ ಅಡ್ಮಿನ್ ಖಾತೆಗೆ ಹೆಚ್ಚುವರಿ ರಕ್ಷಣೆ ಒದಗಿಸಿ.'
                        : 'Require a 6-digit Security PIN alongside password during admin sign-in for additional protection.'}
                    </p>

                    {twoFactorSuccessMsg && (
                      <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{twoFactorSuccessMsg}</span>
                      </div>
                    )}

                    {!isTwoFactorActive ? (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-[#4D2300] mb-1">
                            {lang === 'kn' ? 'ಹೊಸ 6-ಅಂಕಿಯ PIN ಹೊಂದಿಸಿ' : 'Set 6-digit Security PIN'}
                          </label>
                          <input
                            type="password"
                            maxLength={6}
                            value={twoFactorPinConfig}
                            onChange={(e) => setTwoFactorPinConfig(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 789123"
                            className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#FFCC99] rounded-xl text-xs text-[#4D2300] font-mono outline-none focus:border-[#FF6A00]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggle2FA(true)}
                          disabled={twoFactorPinConfig.length !== 6}
                          className="px-4 py-2 bg-[#2D5A27] hover:bg-[#1E3F1A] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          {lang === 'kn' ? '2FA ಸಕ್ರಿಯಗೊಳಿಸಿ' : 'Enable 2FA PIN'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggle2FA(false)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        {lang === 'kn' ? '2FA ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ' : 'Disable 2FA PIN'}
                      </button>
                    )}
                  </div>

                  {/* Production Security Health Audit Box */}
                  <div className="bg-[#FFFDF9] rounded-2xl border border-[#FFCC99] p-5 shadow-xs space-y-3">
                    <h4 className="font-serif text-sm font-bold text-[#4D2300] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF6A00]" />
                      <span>{lang === 'kn' ? 'ಸಕ್ರಿಯ ಭದ್ರತಾ ನಿಯಂತ್ರಣಗಳು (Active Protections)' : 'Active System Security Audits'}</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#FFE5CC]">
                        <span className="text-[#663000] font-medium">HTTP Strict Transport Security (HSTS)</span>
                        <span className="text-green-700 font-bold text-[11px]">✓ Enforced</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#FFE5CC]">
                        <span className="text-[#663000] font-medium">Content Security Policy (CSP) & Frame Control</span>
                        <span className="text-green-700 font-bold text-[11px]">✓ Active</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#FFE5CC]">
                        <span className="text-[#663000] font-medium">Anti-Brute Force & Sliding-Window Rate Limiting</span>
                        <span className="text-green-700 font-bold text-[11px]">✓ Active</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#FFE5CC]">
                        <span className="text-[#663000] font-medium">Anti-Bot Honeypot Protection (Forms)</span>
                        <span className="text-green-700 font-bold text-[11px]">✓ Active</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#FFE5CC]">
                        <span className="text-[#663000] font-medium">Devotee Directory Access Control</span>
                        <span className="text-green-700 font-bold text-[11px]">✓ Admin Only</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#FFE5CC]">
                        <span className="text-[#663000] font-medium">XSS & NoSQL Operator Sanitization</span>
                        <span className="text-green-700 font-bold text-[11px]">✓ Sanitized</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Modal: Add New Material */}
        {isAddingMaterial && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#FF9933] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#FFE5CC]">
                <h4 className="font-serif text-lg font-bold text-[#4D2300]">
                  {lang === 'kn' ? 'ಹೊಸ ಸಾಮಗ್ರಿ ಸೇರಿಸಿ' : 'Add New Pooja Material'}
                </h4>
                <button onClick={() => setIsAddingMaterial(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMaterial} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#4D2300] mb-1">ಕನ್ನಡ ಹೆಸರು (Kannada Name)*</label>
                  <input
                    type="text"
                    required
                    value={newMatNameKn}
                    onChange={(e) => setNewMatNameKn(e.target.value)}
                    placeholder="ಉದಾ: ಶುದ್ಧ ಶ್ರೀಗಂಧದ ಎಣ್ಣೆ"
                    className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4D2300] mb-1">ಇಂಗ್ಲಿಷ್ ಹೆಸರು (English Name)*</label>
                  <input
                    type="text"
                    required
                    value={newMatNameEn}
                    onChange={(e) => setNewMatNameEn(e.target.value)}
                    placeholder="e.g. Pure Sandalwood Oil"
                    className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#4D2300] mb-1">ವಿಭಾಗ (Category)</label>
                    <select
                      value={newMatCategory}
                      onChange={(e) => setNewMatCategory(e.target.value as any)}
                      className="w-full px-2 py-2 border border-[#FFCC99] rounded-xl outline-none"
                    >
                      <option value="mangala">ಮಂಗಳ ದ್ರವ್ಯ</option>
                      <option value="herbs">ಗಿಡಮೂಲಿಕೆ</option>
                      <option value="samithu">ಸಮಿತ್ತು</option>
                      <option value="panchagavya">ಪಂಚಗವ್ಯ</option>
                      <option value="navadhanya">ನವಧಾನ್ಯ</option>
                      <option value="dryfruits">ಒಣ ಫಲ</option>
                      <option value="fruits">ಹಣ್ಣುಗಳು</option>
                      <option value="flowers">ಪುಷ್ಪಗಳು</option>
                      <option value="others">ಇತರೆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#4D2300] mb-1">ದರ (₹ Price)*</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newMatPrice}
                      onChange={(e) => setNewMatPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#4D2300] mb-1">ಪ್ರಮಾಣ (Unit Kn)</label>
                    <input
                      type="text"
                      value={newMatUnitKn}
                      onChange={(e) => setNewMatUnitKn(e.target.value)}
                      placeholder="100 ಗ್ರಾಂ"
                      className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#4D2300] mb-1">ಪ್ರಮಾಣ (Unit En)</label>
                    <input
                      type="text"
                      value={newMatUnitEn}
                      onChange={(e) => setNewMatUnitEn(e.target.value)}
                      placeholder="100g"
                      className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="newMatEssential"
                    checked={newMatEssential}
                    onChange={(e) => setNewMatEssential(e.target.checked)}
                    className="w-4 h-4 text-[#FF6A00] rounded cursor-pointer"
                  />
                  <label htmlFor="newMatEssential" className="text-xs font-bold text-[#4D2300] cursor-pointer">
                    ಮುಖ್ಯ ಸಾಮಗ್ರಿ (Mark as Essential)
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-bold rounded-xl"
                  >
                    ಸಾಮಗ್ರಿ ಸೇರಿಸಿ (Add Item)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingMaterial(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                  >
                    ರದ್ದು
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Manual Booking */}
        {isAddingBooking && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#FF9933] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#FFE5CC]">
                <h4 className="font-serif text-lg font-bold text-[#4D2300]">
                  {lang === 'kn' ? 'ಹೊಸ ಪುರೋಹಿತರ ಬುಕಿಂಗ್ ನೋಂದಣಿ' : 'Add Manual Purohit Booking'}
                </h4>
                <button onClick={() => setIsAddingBooking(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#4D2300] mb-1">ಯಜಮಾನರ ಹೆಸರು (Name)*</label>
                  <input
                    type="text"
                    required
                    value={newBkName}
                    onChange={(e) => setNewBkName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4D2300] mb-1">ಸಂಪರ್ಕ ಸಂಖ್ಯೆ (Phone)*</label>
                  <input
                    type="tel"
                    required
                    value={newBkPhone}
                    onChange={(e) => setNewBkPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4D2300] mb-1">ಪೂಜಾ ಸೇವೆ (Pooja Type)</label>
                  <select
                    value={newBkPooja}
                    onChange={(e) => setNewBkPooja(e.target.value)}
                    className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={`${s.nameKn} (${s.nameEn})`}>
                        {s.nameKn} ({s.nameEn})
                      </option>
                    ))}
                    <option value="ವಿಶೇಷ ಗೃಹಪ್ರವೇಶ ಪೂಜೆ">ವಿಶೇಷ ಗೃಹಪ್ರವೇಶ ಪೂಜೆ (Gruhapravesha)</option>
                    <option value="ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ">ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ (Satyanarayana Pooja)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#4D2300] mb-1">ದಿನಾಂಕ (Date)*</label>
                    <input
                      type="date"
                      required
                      value={newBkDate}
                      onChange={(e) => setNewBkDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#4D2300] mb-1">ಸಮಯ (Time)</label>
                    <input
                      type="text"
                      value={newBkTime}
                      onChange={(e) => setNewBkTime(e.target.value)}
                      placeholder="09:30 AM"
                      className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4D2300] mb-1">ಸ್ಥಳ (Location)</label>
                  <input
                    type="text"
                    value={newBkLocation}
                    onChange={(e) => setNewBkLocation(e.target.value)}
                    placeholder="ಶಿವಮೊಗ್ಗ / ಬೆಂಗಳೂರು"
                    className="w-full px-3 py-2 border border-[#FFCC99] rounded-xl outline-none"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-bold rounded-xl"
                  >
                    ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಿ (Save Booking)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingBooking(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                  >
                    ರದ್ದು
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
