import apiClient from './client';
import type {
  OTPRequestPayload,
  OTPVerifyPayload,
  TokenResponse,
  UserProfile
} from './types';

export const authApi = {
  /**
   * Request OTP for phone number
   */
  requestOTP: async (data: OTPRequestPayload): Promise<{ message: string }> => {
    return apiClient.post('users/otp/request/', data);
  },

  /**
   * Verify OTP and get tokens
   */
  verifyOTP: async (data: OTPVerifyPayload): Promise<TokenResponse> => {
    return apiClient.post('users/otp/verify/', data);
  },

  /**
   * Get JWT token (traditional login with phone and password)
   */
  getToken: async (phone: string, password: string): Promise<TokenResponse> => {
    return apiClient.post('users/token/', { phone, password });
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    return apiClient.post('users/token/refresh/', { refresh });
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get('users/me/');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.patch('users/me/', data);
  },

  /**
   * Logout (client-side token removal)
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },
};
