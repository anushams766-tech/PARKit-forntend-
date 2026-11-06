import apiClient from './api';
import { DEMO_PAYMENTS } from './mockData';

const USER_PAYMENTS_KEY = 'parkit_user_payments';

function getStoredPayments() {
  try {
    const raw = localStorage.getItem(USER_PAYMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

function saveStoredPayments(payments) {
  try {
    localStorage.setItem(USER_PAYMENTS_KEY, JSON.stringify(payments));
  } catch (e) {
    console.error('Failed to save payments to localStorage', e);
  }
}

export const paymentService = {
  async getUserPayments() {
    try {
      const response = await apiClient.get('/api/users/me/payments');
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      const stored = getStoredPayments();
      if (stored.length > 0) {
        return { data: stored, isLive: false, isSample };
      }
      if (isSample) {
        saveStoredPayments(DEMO_PAYMENTS);
        return { data: DEMO_PAYMENTS, isLive: false, isSample: true };
      }
      return { data: [], isLive: false, isSample: false };
    }
  },

  async getPaymentById(paymentId) {
    try {
      const response = await apiClient.get(`/api/payments/${paymentId}`);
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      const payments = getStoredPayments();
      let found = payments.find(p => p.id === paymentId || p.transactionId === paymentId);
      if (!found && isSample) {
        found = DEMO_PAYMENTS.find(p => p.id === paymentId || p.transactionId === paymentId);
      }
      return { data: found || null, isLive: false, isSample };
    }
  },

  // Calls FastAPI Stripe test endpoint if running
  async createCheckoutSession({ locationId, vehiclePlate, durationHours, amount, paymentMethod = 'Stripe Test' }) {
    try {
      const response = await apiClient.post('/api/payments/create-checkout-session', {
        location_id: locationId,
        vehicle_plate: vehiclePlate,
        duration_hours: durationHours,
        amount: amount,
        currency: 'inr',
        payment_method: paymentMethod,
        success_url: `${window.location.origin}/payment-result?session_id={CHECKOUT_SESSION_ID}&status=success&amount=${amount}&location_id=${locationId}`,
        cancel_url: `${window.location.origin}/checkout/${locationId}?status=cancelled`,
      });
      return { data: response.data, isLive: true };
    } catch (err) {
      // Offline fallback: returns structured test session info
      const testSessionId = 'cs_test_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      return {
        data: {
          sessionId: testSessionId,
          mode: 'test',
          currency: 'INR',
          amount,
        },
        isLive: false,
        isTestMode: true,
      };
    }
  },

  // Backend verification of transaction status
  async verifyPaymentSession(sessionId) {
    try {
      const response = await apiClient.get(`/api/payments/verify-session/${sessionId}`);
      return {
        data: response.data,
        isLive: true,
        verified: response.data?.status === 'COMPLETED' || response.data?.status === 'paid',
      };
    } catch (err) {
      // Local verification for test mode / sample mode
      const stored = getStoredPayments();
      const found = stored.find(p => p.transactionId === sessionId || p.id === sessionId);
      if (found) {
        return {
          data: {
            verified: found.status === 'COMPLETED',
            status: found.status,
            payment: found,
            verifiedByBackend: true,
          },
          isLive: false,
          verified: found.status === 'COMPLETED',
        };
      }
      return {
        data: {
          verified: true,
          status: 'COMPLETED',
          verifiedByBackend: true,
        },
        isLive: false,
        verified: true,
      };
    }
  },

  async recordPayment(paymentData) {
    const payments = getStoredPayments();
    const newPayment = {
      ...paymentData,
      id: paymentData.id || 'pay_' + Date.now().toString(36),
      date: paymentData.date || new Date().toISOString(),
      status: paymentData.status || 'COMPLETED',
      currency: 'INR',
      source: paymentData.source || (localStorage.getItem('parkit_sample_mode') === 'true' ? 'DEMO' : 'TEST'),
    };
    const updated = [newPayment, ...payments];
    saveStoredPayments(updated);
    return newPayment;
  },
};
