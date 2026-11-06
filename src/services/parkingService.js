import apiClient, { IS_DEMO_MODE } from './api';
import { DEMO_LOCATIONS } from './mockData';
import { SLOT_STATUS } from '../utils/constants';

export const parkingService = {
  async getLocationSlots(locationId) {
    try {
      const response = await apiClient.get(`/api/locations/${locationId}/slots`);
      return { data: response.data, isDemo: false };
    } catch (err) {
      if (IS_DEMO_MODE) {
        const loc = DEMO_LOCATIONS.find(l => l.id === locationId);
        return { data: loc ? loc.slots : [], isDemo: true };
      }
      throw err;
    }
  },

  async getLocationStatus(locationId) {
    try {
      const response = await apiClient.get(`/api/locations/${locationId}/status`);
      return { data: response.data, isDemo: false };
    } catch (err) {
      if (IS_DEMO_MODE) {
        const loc = DEMO_LOCATIONS.find(l => l.id === locationId) || DEMO_LOCATIONS[0];
        const emptyCount = loc.slots.filter(s => s.status === SLOT_STATUS.EMPTY).length;
        const occupiedCount = loc.slots.filter(s => s.status === SLOT_STATUS.OCCUPIED).length;
        const uncertainCount = loc.slots.filter(s => s.status === SLOT_STATUS.UNCERTAIN).length;
        return {
          data: {
            locationId: loc.id,
            camera: loc.camera,
            totalSlots: loc.slots.length,
            emptySlots: emptyCount,
            occupiedSlots: occupiedCount,
            uncertainSlots: uncertainCount,
            lastDetection: loc.camera.lastDetection,
          },
          isDemo: true,
        };
      }
      throw err;
    }
  },

  async overrideSlot(slotId, newStatus) {
    try {
      const response = await apiClient.post(`/api/slots/${slotId}/override`, { status: newStatus });
      return { data: response.data, isDemo: false };
    } catch (err) {
      if (IS_DEMO_MODE) {
        // Update in demo store
        for (const loc of DEMO_LOCATIONS) {
          const slot = loc.slots.find(s => s.id === slotId);
          if (slot) {
            slot.status = newStatus;
            return { data: slot, isDemo: true };
          }
        }
        return { data: { id: slotId, status: newStatus }, isDemo: true };
      }
      throw err;
    }
  },

  async recalibrateCamera(cameraId) {
    try {
      const response = await apiClient.post(`/api/cameras/${cameraId}/recalibrate`);
      return { data: response.data, isDemo: false };
    } catch (err) {
      if (IS_DEMO_MODE) {
        for (const loc of DEMO_LOCATIONS) {
          if (loc.camera?.id === cameraId) {
            loc.camera.status = 'CONNECTED';
            loc.camera.lastDetection = new Date().toISOString();
            loc.camera.confidenceScore = 0.97;
            return { data: { success: true, camera: loc.camera }, isDemo: true };
          }
        }
        return { data: { success: true, message: 'Recalibrated camera' }, isDemo: true };
      }
      throw err;
    }
  },

  async getSystemHealth() {
    try {
      const response = await apiClient.get('/api/system/health');
      return { data: response.data, isDemo: false };
    } catch (err) {
      if (IS_DEMO_MODE) {
        return {
          data: {
            status: 'operational',
            visionInferenceAvgMs: 48,
            activeCameras: 4,
            offlineCameras: 1,
            apiLatencyMs: 14,
            uptimeSeconds: 864200,
          },
          isDemo: true,
        };
      }
      throw err;
    }
  },
};

