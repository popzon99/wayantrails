import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { authApi } from '@/lib/api';
import type { UserProfile, OTPRequestPayload, OTPVerifyPayload } from '@/lib/api/types';

/**
 * Hook to get current user profile
 */
export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    '/api/users/me/',
    () => authApi.getProfile(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: () => {
        // If error (likely 401), clear tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      },
    }
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to handle authentication actions
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, mutate } = useUser();

  useEffect(() => {
    // Check if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    }
  }, []);

  const requestOTP = async (phone: string) => {
    const payload: OTPRequestPayload = { phone };
    return authApi.requestOTP(payload);
  };

  const verifyOTP = async (phone: string, otp: string) => {
    const payload: OTPVerifyPayload = { phone, otp };
    const response = await authApi.verifyOTP(payload);

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
    }

    setIsAuthenticated(true);
    await mutate(); // Refetch user profile
    return response;
  };

  const login = async (phone: string, password: string) => {
    const response = await authApi.getToken(phone, password);

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
    }

    setIsAuthenticated(true);
    await mutate(); // Refetch user profile
    return response;
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    mutate(undefined, false); // Clear user data without revalidation
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const updated = await authApi.updateProfile(data);
    await mutate(updated); // Update cached user data
    return updated;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    requestOTP,
    verifyOTP,
    login,
    logout,
    updateProfile,
  };
}
