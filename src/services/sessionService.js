import apiClient from './api';
import { DEMO_SESSIONS } from './mockData';

const USER_SESSIONS_KEY = 'parkit_user_sessions';

function getStoredSessions() {
  try {
    const raw = localStorage.getItem(USER_SESSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

function saveStoredSessions(sessions) {
  try {
    localStorage.setItem(USER_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions to localStorage', e);
  }
}

export const sessionService = {
  async getActiveSession() {
    try {
      const response = await apiClient.get('/api/users/me/sessions/active');
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      const sessions = getStoredSessions();
      let active = sessions.find(s => s.status === 'ACTIVE');
      if (!active && isSample) {
        active = DEMO_SESSIONS.find(s => s.status === 'ACTIVE');
      }
      return { data: active || null, isLive: false, isSample };
    }
  },

  async getUserSessions() {
    try {
      const response = await apiClient.get('/api/users/me/sessions');
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      const stored = getStoredSessions();
      if (stored.length > 0) {
        return { data: stored, isLive: false, isSample };
      }
      if (isSample) {
        saveStoredSessions(DEMO_SESSIONS);
        return { data: DEMO_SESSIONS, isLive: false, isSample: true };
      }
      return { data: [], isLive: false, isSample: false };
    }
  },

  async getSessionById(sessionId) {
    try {
      const response = await apiClient.get(`/api/sessions/${sessionId}`);
      return { data: response.data, isLive: true };
    } catch (err) {
      const isSample = localStorage.getItem('parkit_sample_mode') === 'true';
      const sessions = getStoredSessions();
      let found = sessions.find(s => s.id === sessionId);
      if (!found && isSample) {
        found = DEMO_SESSIONS.find(s => s.id === sessionId);
      }
      return { data: found || null, isLive: false, isSample };
    }
  },

  async recordSession(sessionData) {
    const sessions = getStoredSessions();
    const newSession = {
      ...sessionData,
      id: 'sess_' + Date.now().toString(36),
      entryTime: sessionData.entryTime || new Date().toISOString(),
      status: sessionData.status || 'ACTIVE',
    };
    const updated = [newSession, ...sessions];
    saveStoredSessions(updated);
    return newSession;
  },
};
