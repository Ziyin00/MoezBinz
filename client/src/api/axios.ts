import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Store } from 'redux';

// Use VITE_API_URL for Vite, fallback to REACT_APP_API_URL for CRA, else localhost
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof window !== 'undefined' && (window as any).VITE_API_URL) ||
  'https://moezbinz.onrender.com/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // important for refresh cookie
});

export function setupInterceptors(store: Store) {
  let isRefreshing = false;
  let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
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
        console.log('🔓 Public endpoint, no token required:', config.url);
        return config;
      }
      
      const state = store.getState() as { auth?: { accessToken?: string } };
      const token = state.auth?.accessToken;
      if (token && config.headers) {
        (config.headers as any).Authorization = `Bearer ${token}`;
        console.log('✅ Token attached to request:', config.url, token.substring(0, 20) + '...');
      } else {
        console.log('❌ No token found in store for request to:', config.url);
        console.log('Store state:', state);
      }
    } catch (e) { 
      console.warn('Failed to get token from store:', e);
    }
    return config;
  });

  api.interceptors.response.use(
    resp => resp,
    async (error) => {
      console.log('🚨 API Error:', error.response?.status, error.response?.data, error.config?.url);
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
          // call refresh using plain axios to avoid calling interceptors again
          const res = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
          const newToken = res.data.accessToken;

          // Dispatch plain action strings to avoid cyclic import of slice
          store.dispatch({ type: 'auth/setCredentials', payload: { accessToken: newToken } });

          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
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
}
