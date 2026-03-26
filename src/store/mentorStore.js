import { create } from 'zustand';
import api from '../lib/api';

export const useMentorStore = create((set, get) => ({
  mentors: [],
  filters: {
    industries: [],
    priceRange: { min: 0, max: 500 }
  },
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  },
  selectedFilters: {
    search: '',
    industry: '',
    minRate: '',
    maxRate: '',
    sortBy: 'rating'
  },

  // Fetch mentors with filters
  fetchMentors: async (page = 1) => {
    set({ loading: true, error: null });
    
    try {
      const { selectedFilters } = get();
      
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 9);
      
      if (selectedFilters.search) params.append('search', selectedFilters.search);
      if (selectedFilters.industry) params.append('industry', selectedFilters.industry);
      if (selectedFilters.minRate) params.append('minRate', selectedFilters.minRate);
      if (selectedFilters.maxRate) params.append('maxRate', selectedFilters.maxRate);
      if (selectedFilters.sortBy) params.append('sortBy', selectedFilters.sortBy);
      
      const response = await api.get(`/mentors/?${params.toString()}`);
      
      set({
        mentors: response.data.data || [],
        pagination: response.data.pagination || { total: 0, page: 1, pages: 1, limit: 9 },
        loading: false
      });
    } catch (error) {
      console.error('Failed to load mentors:', error);
      set({
        error: error.response?.data?.message || 'Failed to load mentors',
        loading: false
      });
    }
  },

  // Fetch filter options
  fetchFilters: async () => {
    try {
      const response = await api.get('/mentors/filters/');
      set({ filters: response.data.data || { industries: [], priceRange: { min: 0, max: 500 } } });
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  },

  // Update filters
  setFilter: (key, value) => {
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [key]: value
      }
    }));
  },

  // Clear all filters
  clearFilters: () => {
    set({
      selectedFilters: {
        search: '',
        industry: '',
        minRate: '',
        maxRate: '',
        sortBy: 'rating'
      }
    });
  }
}));
