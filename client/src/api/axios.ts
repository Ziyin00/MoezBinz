import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Store } from 'redux';

// Dynamic API URL configuration for deployment
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3001/api';
  }
  
  // Production fallback - update this to your actual deployment URL
  return 'https://moezbinz.onrender.com/api';
};

const API_BASE = getApiBaseUrl();

// // Debug logging for deployment
// console.log('🌐 API Base URL:', API_BASE);
// console.log('🌐 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // important for refresh cookie
});

export function setupInterceptors(store: Store) {
  let isRefreshing = false;
  let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];
  let refreshTimer: number | null = null;

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
  };

  // Function to decode JWT and get expiration time
  const getTokenExpiration = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  };

  // Function to schedule token refresh
  const scheduleTokenRefresh = (token: string) => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    const expiration = getTokenExpiration(token);
    if (!expiration) return;

    // Refresh token 5 minutes before expiration
    const refreshTime = expiration - Date.now() - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      refreshTimer = setTimeout(async () => {
        try {
          // console.log('⏰ Proactively refreshing token...');
          const res = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
          const newToken = res.data.accessToken;
          store.dispatch({ type: 'auth/setCredentials', payload: { accessToken: newToken } });
          scheduleTokenRefresh(newToken); // Schedule next refresh
          // console.log('✅ Token refreshed proactively');
        } catch (err) {
          // console.error('❌ Proactive token refresh failed:', err);
          store.dispatch({ type: 'auth/logout' });
        }
      }, refreshTime);
    }
  };

  api.interceptors.request.use((config) => {
    try {
      // Skip token attachment for public endpoints
      const publicEndpoints = [
        '/auth/login',
        '/auth/register', 
        '/auth/refresh',
        '/password-reset/forgot-password',
        '/password-reset/verify-reset-token',
        '/password-reset/reset-password'
      ];
      
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        config.url?.includes(endpoint)
      );
      
      if (isPublicEndpoint) {
        // console.log('🔓 Public endpoint, no token required:', config.url);
        return config;
      }
      
      const state = store.getState() as { auth?: { accessToken?: string } };
      const token = state.auth?.accessToken;
      if (token && config.headers) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        // console.log('✅ Token attached to request:', config.url, token.substring(0, 20) + '...');
        
        // Schedule token refresh if not already scheduled
        if (!refreshTimer) {
          scheduleTokenRefresh(token);
        }
      } else {
        // console.log('❌ No token found in store for request to:', config.url);
        // console.log('Store state:', state);
      }
    } catch (e) { 
      // console.warn('Failed to get token from store:', e);
    }
    return config;
  });

  api.interceptors.response.use(
    resp => resp,
    async (error) => {
      // console.log('🚨 API Error:', error.response?.status, error.response?.data, error.config?.url);
      const originalRequest = error.config;
      
      // Skip token refresh for public endpoints
      const publicEndpoints = [
        '/auth/login',
        '/auth/register', 
        '/auth/refresh',
        '/password-reset/forgot-password',
        '/password-reset/verify-reset-token',
        '/password-reset/reset-password'
      ];
      
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        originalRequest.url?.includes(endpoint)
      );
      
      if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // console.log('🔄 Attempting to refresh token...');
          // call refresh using plain axios to avoid calling interceptors again
          const res = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
          const newToken = res.data.accessToken;
          // console.log('✅ Token refreshed successfully:', newToken.substring(0, 20) + '...');

          // Dispatch plain action strings to avoid cyclic import of slice
          store.dispatch({ type: 'auth/setCredentials', payload: { accessToken: newToken } });

          // Schedule next token refresh
          scheduleTokenRefresh(newToken);

          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          // console.error('❌ Token refresh failed:', err);
          processQueue(err, null);
          store.dispatch({ type: 'auth/logout' });
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  // Return cleanup function
  return () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  };
}
