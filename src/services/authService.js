import apiClient from './api';

export const authService = {
  /**
   * Sends Google Identity Services (GIS) ID Token to FastAPI backend for cryptographic verification
   * @param {string} credential - Signed Google JWT ID Token
   * @returns {Promise<{data: {token: string, user: object, is_new_user: boolean}}>}
   */
  async verifyGoogleCredential(credential) {
    try {
      const response = await apiClient.post('/api/auth/google', {
        credential,
      });
      return {
        data: response.data,
        isLive: true,
      };
    } catch (err) {
      const backendMessage =
        err.response?.data?.detail ||
        (err.code === 'ERR_NETWORK' || !err.response
          ? 'FastAPI backend server is unreachable at ' + (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + '. Please start your backend server to verify Google authentication.'
          : err.message || 'Failed to verify Google authentication credentials.');

      const customError = new Error(backendMessage);
      customError.response = err.response;
      customError.statusCode = err.response?.status;
      throw customError;
    }
  },
};

