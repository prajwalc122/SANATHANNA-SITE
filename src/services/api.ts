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

export interface ClientProfileResponse {
  success: boolean;
  client: Client;
  bookings: any[];
  orders: any[];
}

// Token management (stored in sessionStorage for high security - cleared on tab close)
const AUTH_TOKEN_KEY = 'pooja_seve_admin_jwt';

export const getAuthToken = (): string | null => {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string, persist = false): void => {
  try {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    if (persist) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } catch {}
};

export const clearAuthToken = (): void => {
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {}
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Authentication API
export const authApi = {
  async login(username: string, password: string, twoFactorCode?: string): Promise<{
    success: boolean;
    token?: string;
    expiresIn?: number;
    requires2FA?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, twoFactorCode }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (e: any) {
      return { success: false, error: 'Network or server error during authentication' };
    }
  },

  async verifySession(): Promise<{
    success: boolean;
    user?: string;
    twoFactorEnabled?: boolean;
    expiresIn?: number;
  }> {
    const token = getAuthToken();
    if (!token) return { success: false };

    try {
      const res = await fetch('/api/auth/verify', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        clearAuthToken();
        return { success: false };
      }
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuthToken();
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: 'Failed to update password' };
    }
  },

  async toggle2FA(enabled: boolean, pin?: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/auth/toggle-2fa', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled, pin }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: 'Failed to update 2FA configuration' };
    }
  },
};

// Contact Form API
export const contactApi = {
  async submitInquiry(data: {
    name: string;
    phone: string;
    query: string;
    hp_field?: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: 'Failed to send inquiry. Please try again or call our helpline.' };
    }
  },
};

export const clientApi = {
  // Fetch all clients (Admin protected)
  async getClients(search?: string, city?: string): Promise<Client[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (city) params.append('city', city);
      const url = `/api/clients${params.toString() ? `?${params.toString()}` : ''}`;
      
      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        clearAuthToken();
        throw new Error('Unauthorized');
      }
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      return data.clients || [];
    } catch (error) {
      const saved = localStorage.getItem('pooja_seve_clients_fallback');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Get single client profile with history (Admin protected)
  async getClientById(id: string): Promise<ClientProfileResponse | null> {
    try {
      const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch client details');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Create or upsert client (Admin protected)
  async saveClient(client: Partial<Client>): Promise<Client | null> {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(client),
      });
      if (!res.ok) throw new Error('Failed to save client');
      const data = await res.json();
      return data.client;
    } catch {
      return null;
    }
  },

  // Update client (Admin protected)
  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    try {
      const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update client');
      const data = await res.json();
      return data.client;
    } catch {
      return null;
    }
  },

  // Delete client (Admin protected)
  async deleteClient(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Create booking (Public, sanitized and rate limited)
  async submitBooking(bookingData: any): Promise<any> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit booking');
      }
      return await res.json();
    } catch (error: any) {
      return { success: false, error: error?.message || 'Failed to submit booking' };
    }
  },

  // Submit order (Public, sanitized and rate limited)
  async submitOrder(orderData: any): Promise<any> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit order');
      }
      return await res.json();
    } catch (error: any) {
      return { success: false, error: error?.message || 'Failed to submit order' };
    }
  },

  // Get all bookings (Admin protected)
  async getAllBookings(): Promise<any[]> {
    try {
      const res = await fetch('/api/bookings', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      return data.bookings || [];
    } catch {
      return [];
    }
  },

  // Get all orders (Admin protected)
  async getAllOrders(): Promise<any[]> {
    try {
      const res = await fetch('/api/orders', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.orders || [];
    } catch {
      return [];
    }
  },
};

export const databaseApi = {
  async getStatus(): Promise<{
    success: boolean;
    isConnected: boolean;
    uriConfigured: boolean;
    dbName: string;
    counts: { clients: number; bookings: number; orders: number; payments: number };
    lastError?: string;
  }> {
    try {
      const res = await fetch('/api/database/status', {
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (e: any) {
      return {
        success: false,
        isConnected: false,
        uriConfigured: false,
        dbName: 'Local Mode',
        counts: { clients: 0, bookings: 0, orders: 0, payments: 0 },
        lastError: e?.message,
      };
    }
  },

  async connect(uri: string): Promise<{ success: boolean; message: string; dbName?: string; synced?: any; error?: string }> {
    try {
      const res = await fetch('/api/database/connect', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ uri }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e?.message || 'Connection failed', error: e?.message };
    }
  },

  async sync(): Promise<{ success: boolean; message: string; synced?: any }> {
    try {
      const res = await fetch('/api/database/sync', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e?.message || 'Sync failed' };
    }
  },
};

export const paymentApi = {
  async createOrder(amount: number, receipt?: string): Promise<{
    success: boolean;
    orderId?: string;
    amount?: number;
    currency?: string;
  }> {
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt }),
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async verifyPayment(paymentData: {
    orderId: string;
    transactionId: string;
    gateway?: string;
    method?: string;
    amount: number;
    utrNumber?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
  }): Promise<{ success: boolean; payment?: any }> {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async getPayments(): Promise<any[]> {
    try {
      const res = await fetch('/api/payments', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.payments || [];
    } catch (e) {
      return [];
    }
  },
};

export interface AdminNotification {
  id: string;
  type: 'booking' | 'order' | 'inquiry';
  title: string;
  devoteeName?: string;
  phone?: string;
  details?: any;
  bookingData?: any;
  orderData?: any;
  createdAt: string;
  emailRecipient: string;
  emailSent: boolean;
  sentAt?: string;
}

export const notificationsApi = {
  async getNotifications(): Promise<AdminNotification[]> {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return [];
      const data = await res.json();
      return data.notifications || [];
    } catch {
      return [];
    }
  },

  async markSent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/notifications/${encodeURIComponent(id)}/mark-sent`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

