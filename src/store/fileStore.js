import { create } from 'zustand';
import api from '../lib/api';

const uploadApi = api;

export const useFileStore = create((set, get) => ({
  uploads: [],
  isUploading: false,
  uploadProgress: 0,
  isLoading: false,
  error: null,
  stats: null,
  categories: [],
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1
  },

  fetchUploads: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/files/', { params });
      
      if (response.data.results) {
        set({
          uploads: response.data.results,
          pagination: {
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            currentPage: params.page || 1
          }
        });
      } else {
        set({ uploads: response.data.uploads || [] });
      }
      
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch uploads';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  uploadFile: async (file, options = {}) => {
    const { onProgress, description = '', category = 'other', isPublic = false } = options;
    
    set({ isUploading: true, uploadProgress: 0, error: null });
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('is_public', isPublic);

      const response = await api.post('/files/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
          );
          set({ uploadProgress: progress });
          if (onProgress) onProgress(progress);
        }
      });

      if (response.data.upload) {
        set(state => ({
          uploads: [response.data.upload, ...state.uploads],
          isUploading: false,
          uploadProgress: 0
        }));
      }

      return { 
        success: true, 
        upload: response.data.upload,
        message: response.data.message 
      };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.file?.[0] || 
                     error.message || 
                     'Upload failed';
      set({ 
        error: message, 
        isUploading: false, 
        uploadProgress: 0 
      });
      return { success: false, error: message };
    }
  },

  deleteUpload: async (uploadId) => {
    set({ isLoading: true, error: null });
    
    try {
      await api.delete(`/files/${uploadId}/delete/`);
      
      set(state => ({
        uploads: state.uploads.filter(u => u.id !== uploadId),
        isLoading: false
      }));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete file';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  downloadFile: async (uploadId, filename) => {
    try {
      const response = await api.get(`/files/${uploadId}/download/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Download failed';
      return { success: false, error: message };
    }
  },

  fetchStats: async () => {
    try {
      const response = await api.get('/files/stats/');
      set({ stats: response.data.stats });
      return { success: true, stats: response.data.stats };
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return { success: false };
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get('/files/categories/');
      set({ categories: response.data.categories });
      return { success: true, categories: response.data.categories };
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return { success: false };
    }
  },

  getUploadDetail: async (uploadId) => {
    try {
      const response = await api.get(`/files/${uploadId}/`);
      return { success: true, upload: response.data.upload };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to get upload details';
      return { success: false, error: message };
    }
  },

  getSortedUploads: () => {
    return [...get().uploads].sort((a, b) => 
      new Date(b.uploaded_at) - new Date(a.uploaded_at)
    );
  },

  getUploadsByUser: (userId) => {
    return get().uploads.filter(u => u.user?.id === userId || u.user_id === userId);
  },

  getRecentUploads: () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return get().uploads.filter(u => new Date(u.uploaded_at) > oneDayAgo);
  },

  getUploadsByCategory: (category) => {
    return get().uploads.filter(u => u.category === category);
  },

  getTotalSize: () => {
    return get().uploads.reduce((total, upload) => total + (upload.file_size || 0), 0);
  },

  searchUploads: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().uploads.filter(u => 
      u.original_filename?.toLowerCase().includes(lowerQuery) ||
      u.description?.toLowerCase().includes(lowerQuery)
    );
  },

  clearError: () => set({ error: null }),

  resetState: () => set({
    uploads: [],
    isUploading: false,
    uploadProgress: 0,
    isLoading: false,
    error: null,
    stats: null,
    categories: []
  })
}));
