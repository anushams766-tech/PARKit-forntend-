import apiClient from './api';
import { DEMO_VEHICLES } from './mockData';

const USER_VEHICLES_KEY = 'parkit_user_vehicles';

function getStoredVehicles() {
  try {
    const raw = localStorage.getItem(USER_VEHICLES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

function saveStoredVehicles(vehicles) {
  try {
    localStorage.setItem(USER_VEHICLES_KEY, JSON.stringify(vehicles));
  } catch (e) {
    console.error('Failed to save vehicles to localStorage', e);
  }
}

export const vehicleService = {
  async getUserVehicles() {
    try {
      const response = await apiClient.get('/api/users/me/vehicles');
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      const stored = getStoredVehicles();
      if (stored.length > 0) {
        return { data: stored, isLive: false, isSample };
      }
      if (isSample) {
        saveStoredVehicles(DEMO_VEHICLES);
        return { data: DEMO_VEHICLES, isLive: false, isSample: true };
      }
      return { data: [], isLive: false, isSample: false };
    }
  },

  async addVehicle(vehicleData) {
    try {
      const response = await apiClient.post('/api/users/me/vehicles', vehicleData);
      return { data: response.data, isLive: true };
    } catch (err) {
      const current = getStoredVehicles();
      const newVehicle = {
        ...vehicleData,
        id: 'veh_' + Date.now().toString(36),
        isPrimary: current.length === 0 || vehicleData.isPrimary,
        createdAt: new Date().toISOString(),
      };
      // If marked primary, unset other vehicles
      const updated = newVehicle.isPrimary
        ? [newVehicle, ...current.map(v => ({ ...v, isPrimary: false }))]
        : [newVehicle, ...current];
      saveStoredVehicles(updated);
      return { data: newVehicle, isLive: false };
    }
  },

  async updateVehicle(vehicleId, updatedData) {
    try {
      const response = await apiClient.put(`/api/users/me/vehicles/${vehicleId}`, updatedData);
      return { data: response.data, isLive: true };
    } catch (err) {
      const current = getStoredVehicles();
      const idx = current.findIndex(v => v.id === vehicleId);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updatedData };
        saveStoredVehicles(current);
        return { data: current[idx], isLive: false };
      }
      throw new Error('Vehicle not found');
    }
  },

  async deleteVehicle(vehicleId) {
    try {
      const response = await apiClient.delete(`/api/users/me/vehicles/${vehicleId}`);
      return response.data;
    } catch (err) {
      const current = getStoredVehicles();
      const filtered = current.filter(v => v.id !== vehicleId);
      saveStoredVehicles(filtered);
      return { success: true };
    }
  },

  async setDefaultVehicle(vehicleId) {
    const current = getStoredVehicles();
    const updated = current.map(v => ({
      ...v,
      isPrimary: v.id === vehicleId,
    }));
    saveStoredVehicles(updated);
    return { success: true, data: updated };
  },
};
