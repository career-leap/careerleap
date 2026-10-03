import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register/', userData);
      
      const { user, accessToken } = response.data;
      
      if (!user || !accessToken) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('accessToken', accessToken);
      set({ user, isAuthenticated: true, isLoading: false });
      
      return { success: true };
    } catch (error) {
      let message = 'Registration failed';
      if (error.response?.status === 429) {
        message = 'Too many registration attempts. Please try again later.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        message = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('; ');
      } else if (error.message) {
        message = error.message;
      }
      
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login/', { email, password });
      
      const { user, accessToken } = response.data;
      
      if (!user || !accessToken) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('accessToken', accessToken);
      set({ user, isAuthenticated: true, isLoading: false });
      
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      if (error.response?.status === 429) {
        message = 'Too many login attempts. Please try again later.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (e) {
      // Ignore error - still clear local storage
    }
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false });
  },

  refreshAccessToken: async () => {
    try {
      // Refresh token is sent automatically as an httpOnly cookie
      const response = await api.post('/auth/refresh/');
      const { accessToken } = response.data;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        return true;
      }
      return false;
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
      return false;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    try {
      const response = await api.get('/auth/me/');
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/forgot-password/', { email });
      set({ isLoading: false });
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset link';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  validateResetToken: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/auth/validate-reset-token/', {
        params: { token }
      });
      set({ isLoading: false });
      return { 
        success: true, 
        valid: response.data.valid,
        message: response.data.message 
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid or expired token';
      set({ error: message, isLoading: false });
      return { success: false, valid: false, error: message };
    }
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/reset-password/', {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      set({ isLoading: false });
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null })
}));
