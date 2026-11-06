import apiClient from './api';
import { DEMO_LOCATIONS } from './mockData';

export const locationService = {
  async getLocations() {
    try {
      const response = await apiClient.get('/api/locations');
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      if (isSample) {
        return { data: DEMO_LOCATIONS, isLive: false, isSample: true };
      }
      return { data: [], isLive: false, isSample: false };
    }
  },

  async getNearbyLocations(lat, lng, radius = 5000) {
    try {
      const response = await apiClient.get(`/api/locations/nearby`, {
        params: { lat, lng, radius },
      });
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      if (isSample) {
        return { data: DEMO_LOCATIONS, isLive: false, isSample: true };
      }
      return { data: [], isLive: false, isSample: false };
    }
  },

  async getLocationById(locationId) {
    try {
      const response = await apiClient.get(`/api/locations/${locationId}`);
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      if (isSample) {
        const found = DEMO_LOCATIONS.find(l => l.id === locationId);
        if (found) return { data: found, isLive: false, isSample: true };
      }
      return { data: null, isLive: false, isSample: false };
    }
  },
};
