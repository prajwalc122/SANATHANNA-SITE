/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Language, PageRoute, CartItem, Order, MaterialItem, 
  PoojaService, PurohitBookingRequest 
} from './types';
import { POOJA_MATERIALS, POOJA_SERVICES, RANGANATHA_TEMPLE_BG } from './data/poojaData';
import { Header } from './components/Header';
import { PanchangBanner } from './components/PanchangBanner';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { CatalogPage } from './pages/CatalogPage';
import { MaterialsSection } from './components/MaterialsSection';
import { BookingPage } from './pages/BookingPage';
import { ProcessPage } from './pages/ProcessPage';
import { ContactPage } from './pages/ContactPage';
import { MaterialDetailModal } from './components/MaterialDetailModal';
import { PurohitBookingModal } from './components/PurohitBookingModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { PrivacyAndTermsModal } from './components/PrivacyAndTermsModal';
import { Footer } from './components/Footer';
import { templeAudio } from './utils/audioChant';
import { clientApi } from './services/api';
import { scrollToSection, updateHeaderHeightProperty } from './utils/scrollUtils';

const INITIAL_BOOKINGS: PurohitBookingRequest[] = [
  {
    id: 'bk-101',
    name: 'ವೆಂಕಟೇಶ್ ಪ್ರಸಾದ್ (Venkatesh Prasad)',
    phone: '+91 94481 23456',
    poojaType: 'ಗಣೇಶ ಪೂಜೆ (Ganesha Pooja)',
    date: '2026-10-02',
    time: '09:00 AM',
    location: 'ವಿನೋಬನಗರ, ಶಿವಮೊಗ್ಗ (Shivamogga)',
    message: 'ಮನೆ ಶಾಂತಿ ಮತ್ತು ವ್ಯಾಪಾರ ವೃದ್ಧಿಗಾಗಿ ವಿಶೇಷ ಗಣಪತಿ ಪೂಜೆ ಹಾಗೂ ಸಂಕಲ್ಪ ಬೇಕು.',
    status: 'confirmed',
  },
  {
    id: 'bk-102',
    name: 'ಸುಜಾತಾ ಕುಲಕರ್ಣಿ (Sujata Kulkarni)',
    phone: '+91 98450 78912',
    poojaType: 'ಲಕ್ಷ್ಮೀ ಪೂಜೆ (Lakshmi Pooja)',
    date: '2026-10-05',
    time: '10:30 AM',
    location: 'ಮಲ್ಲೇಶ್ವರಂ, ಬೆಂಗಳೂರು (Bengaluru)',
    message: 'ಹೊಸ ಗೃಹಪ್ರವೇಶ ಮತ್ತು ಅಷ್ಟಲಕ್ಷ್ಮೀ ಆರಾಧನೆ.',
    status: 'assigned',
    purohitName: 'ವೇ. ಮೂ. ಕೃಷ್ಣಮೂರ್ತಿ ಭಟ್',
  },
];

export default function App() {
  const [lang, setLang] = useState<Language>('kn');
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    const hash = window.location.hash.replace('#', '') as PageRoute;
    if (['home', 'services', 'catalog', 'materials', 'booking', 'process', 'contact'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Materials State (Dynamic & editable by Admin)
  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    try {
      const saved = localStorage.getItem('pooja_seve_materials');
      if (saved) return JSON.parse(saved);
    } catch {}
    return POOJA_MATERIALS;
  });

  // Pooja Services State (Dynamic & fee editable by Admin)
  const [services, setServices] = useState<PoojaService[]>(() => {
    try {
      const saved = localStorage.getItem('pooja_seve_services');
      if (saved) return JSON.parse(saved);
    } catch {}
    return POOJA_SERVICES;
  });

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pooja_seve_cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { item: POOJA_MATERIALS[0], type: 'material', quantity: 1 }, // Turmeric (ಅರಿಶಿನ)
      { item: POOJA_MATERIALS[1], type: 'material', quantity: 1 }, // Kumkuma (ಕುಂಕುಮ)
      { item: POOJA_MATERIALS[7], type: 'material', quantity: 1 }  // Desi Ghee (ಆಕಳ ತುಪ್ಪ)
    ];
  });

  // Orders State (Persisted in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('pooja_seve_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Purohit Bookings State (Persisted in localStorage)
  const [bookings, setBookings] = useState<PurohitBookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('pooja_seve_bookings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOOKINGS;
  });

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<PoojaService | null>(null);
  const [bookingInitialService, setBookingInitialService] = useState<string>('');
  const [selectedMaterialForDetail, setSelectedMaterialForDetail] = useState<MaterialItem | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacyInitialTab, setPrivacyInitialTab] = useState<'privacy' | 'terms'>('privacy');
  const [isAdminOpen, setIsAdminOpen] = useState(() => window.location.hash === '#admin');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pooja_seve_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Secret keyboard shortcut for owner/admin: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Automatically calculate navbar/header height and update CSS offset
  useEffect(() => {
    updateHeaderHeightProperty();

    const header = document.querySelector('header');
    let resizeObserver: ResizeObserver | null = null;
    if (header && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateHeaderHeightProperty();
      });
      resizeObserver.observe(header);
    }

    const handleResize = () => {
      updateHeaderHeightProperty();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Sync route with window hash and smoothly scroll to target section with header offset
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'admin') {
        setIsAdminOpen(true);
      } else if (['home', 'services', 'catalog', 'materials', 'booking', 'process', 'contact'].includes(hash)) {
        setCurrentPage(hash as PageRoute);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToSection(hash);
          });
        });
      } else if (hash) {
        scrollToSection(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle initial page load with hash (e.g. #services, #materials)
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && hash !== 'admin') {
      const timer = setTimeout(() => {
        scrollToSection(hash);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const navigateToPage = (page: PageRoute, initialService?: string) => {
    if (page === 'admin') {
      setIsAdminOpen(true);
      return;
    }

    if (initialService) {
      setBookingInitialService(initialService);
    }
    
    if (currentPage !== page) {
      setCurrentPage(page);
      window.location.hash = page;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSection(page);
        });
      });
    } else {
      // Already on page: smoothly scroll to top section of this page
      scrollToSection(page);
    }
  };

  // Global anchor click listener for internal #links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.replace(/^#/, '');
      if (!targetId) return;

      e.preventDefault();
      if (targetId === 'admin') {
        setIsAdminOpen(true);
        return;
      }

      if (['home', 'services', 'catalog', 'materials', 'booking', 'process', 'contact'].includes(targetId)) {
        navigateToPage(targetId as PageRoute);
      } else {
        scrollToSection(targetId);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [currentPage]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pooja_seve_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('pooja_seve_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('pooja_seve_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('pooja_seve_materials', JSON.stringify(materials));
    } catch {}
  }, [materials]);

  useEffect(() => {
    try {
      localStorage.setItem('pooja_seve_services', JSON.stringify(services));
    } catch {}
  }, [services]);

  // Cart operations
  const handleAddMaterialToCart = (item: MaterialItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { item, type: 'material', quantity }];
    });
    templeAudio.playTempleBell();
  };

  const handleToggleMaterialCart = (item: MaterialItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.filter((ci) => ci.item.id !== item.id);
      }
      return [...prev, { item, type: 'material', quantity: 1 }];
    });
  };

  const handleAddServiceToBag = (service: PoojaService) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === service.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === service.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item: service, type: 'service', quantity: 1 }];
    });
    templeAudio.playTempleBell();
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === id) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== id));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const selectedItemIds = new Set(
    cart.filter((ci) => ci.type === 'material').map((ci) => ci.item.id)
  );

  const handleBookService = (service: PoojaService) => {
    setSelectedServiceForBooking(service);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmitted = (booking: PurohitBookingRequest, proceedToPay = false) => {
    setBookings((prev) => [booking, ...prev]);
    
    // Save to backend and auto-create/update client details
    clientApi.submitBooking({
      name: booking.name,
      phone: booking.phone,
      poojaType: booking.poojaType,
      date: booking.date,
      time: booking.time,
      location: booking.location,
      message: booking.message,
      amount: booking.amount,
      status: booking.status,
      purohitName: booking.purohitName,
    }).catch((err) => console.error('Error submitting booking to backend:', err));

    if (proceedToPay) {
      const service = services.find((s) => booking.poojaType.includes(s.nameKn));
      if (service) {
        handleAddServiceToBag(service);
      }
      setIsPaymentOpen(true);
    }
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsPaymentOpen(false);
    setConfirmedOrder(newOrder);

    // Save order to backend and auto-create/update client details
    clientApi.submitOrder({
      customerName: newOrder.customer.fullName,
      customerPhone: newOrder.customer.phone,
      customerAddress: `${newOrder.customer.addressLine}, ${newOrder.customer.landmark ? newOrder.customer.landmark + ', ' : ''}${newOrder.customer.city}, ${newOrder.customer.state} - ${newOrder.customer.pincode}`,
      items: newOrder.items,
      total: newOrder.total,
      paymentMethod: newOrder.payment.method,
      paymentStatus: newOrder.payment.status,
    }).catch((err) => console.error('Error submitting order to backend:', err));
  };

  // Admin Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleUpdateBookingStatus = (bookingId: string, status: 'confirmed' | 'assigned', purohitName?: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, ...(purohitName ? { purohitName } : {}) } : b))
    );
  };

  const handleAddBooking = (newBk: PurohitBookingRequest) => {
    setBookings((prev) => [newBk, ...prev]);
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleUpdateMaterialPrice = (materialId: string, newPrice: number) => {
    setMaterials((prev) => prev.map((m) => (m.id === materialId ? { ...m, price: newPrice } : m)));
  };

  const handleToggleMaterialEssential = (materialId: string) => {
    setMaterials((prev) => prev.map((m) => (m.id === materialId ? { ...m, essential: !m.essential } : m)));
  };

  const handleAddMaterial = (newMat: MaterialItem) => {
    setMaterials((prev) => [newMat, ...prev]);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  const handleUpdateServicePrice = (serviceId: string, newPrice: number) => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, price: newPrice } : s)));
  };

  return (
    <div className={`relative min-h-screen flex flex-col bg-transparent text-[#4D2300] ${lang === 'en' ? 'lang-en' : 'lang-kn'}`}>
      {/* Full Top-to-Bottom Sri Ranganathaswamy Temple Background */}
      <div className="fixed inset-0 -z-20 pointer-events-none select-none overflow-hidden">
        <img
          src={RANGANATHA_TEMPLE_BG}
          alt="Sri Ranganathaswamy Temple Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top filter brightness-[0.70] contrast-[1.15]"
        />
        {/* Sacred Devotional Scrim with darker warm ambiance */}
        <div className="absolute inset-0 bg-black/25 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/65 via-[#FFFDF9]/70 to-[#FFFDF9]/75 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-[#2E1200]/25 mix-blend-multiply" />
      </div>

      {/* 1. Header with Multi-Page Navigation & Language Toggle */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === 'kn' ? 'en' : 'kn')}
        currentPage={currentPage}
        onNavigate={navigateToPage}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
        ordersCount={orders.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Today's Vedic Panchang & Shubh Muhurat Banner */}
      <PanchangBanner />

      {/* 3. Main Multi-Page Route View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            lang={lang}
            onNavigate={navigateToPage}
            onBookService={handleBookService}
            onAddMaterial={handleToggleMaterialCart}
            onViewMaterialDetails={setSelectedMaterialForDetail}
            selectedItemIds={selectedItemIds}
            materials={materials}
            services={services}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            lang={lang}
            onBookService={handleBookService}
            onAddServiceToBag={handleAddServiceToBag}
            services={services}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            lang={lang}
            onAddToCart={handleToggleMaterialCart}
            onBookPurohit={() => navigateToPage('booking')}
          />
        )}

        {currentPage === 'materials' && (
          <MaterialsSection
            lang={lang}
            onAddToCart={handleToggleMaterialCart}
            onViewItemDetails={setSelectedMaterialForDetail}
            selectedItemIds={selectedItemIds}
            materials={materials}
            onOpenCheckout={() => {
              if (cart.length > 0) setIsPaymentOpen(true);
              else setIsCartOpen(true);
            }}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentPage === 'booking' && (
          <BookingPage
            lang={lang}
            onBookingSubmitted={handleBookingSubmitted}
            initialService={bookingInitialService || (selectedServiceForBooking ? (lang === 'kn' ? selectedServiceForBooking.nameKn : selectedServiceForBooking.nameEn) : undefined)}
          />
        )}

        {currentPage === 'process' && (
          <ProcessPage
            lang={lang}
            onNavigate={navigateToPage}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            lang={lang}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        lang={lang}
        onNavigate={navigateToPage}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => {
          setPrivacyInitialTab('privacy');
          setIsPrivacyModalOpen(true);
        }}
        onOpenTerms={() => {
          setPrivacyInitialTab('terms');
          setIsPrivacyModalOpen(true);
        }}
      />

      {/* 5. Admin Portal Modal with Login & Dashboard */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = currentPage;
          }
        }}
        lang={lang}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        bookings={bookings}
        onUpdateBookingStatus={handleUpdateBookingStatus}
        onAddBooking={handleAddBooking}
        onDeleteBooking={handleDeleteBooking}
        materials={materials}
        onUpdateMaterialPrice={handleUpdateMaterialPrice}
        onToggleMaterialEssential={handleToggleMaterialEssential}
        onAddMaterial={handleAddMaterial}
        onDeleteMaterial={handleDeleteMaterial}
        services={services}
        onUpdateServicePrice={handleUpdateServicePrice}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminAuthChange={setIsAdminLoggedIn}
      />

      {/* Modals & Drawers */}
      <MaterialDetailModal
        item={selectedMaterialForDetail}
        lang={lang}
        onClose={() => setSelectedMaterialForDetail(null)}
        onAddToCart={handleAddMaterialToCart}
      />

      <PurohitBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        lang={lang}
        preselectedService={selectedServiceForBooking}
        onBookingSubmitted={handleBookingSubmitted}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        lang={lang}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        items={cart}
        lang={lang}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        lang={lang}
        onClose={() => setConfirmedOrder(null)}
        onContinueShopping={() => {
          setConfirmedOrder(null);
          navigateToPage('home');
        }}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        lang={lang}
        orders={orders}
        onSelectOrder={(order) => setConfirmedOrder(order)}
      />

      <PrivacyAndTermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        lang={lang}
        initialTab={privacyInitialTab}
      />
    </div>
  );
}
