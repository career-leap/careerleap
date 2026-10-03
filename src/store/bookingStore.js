import { create } from 'zustand';
import api from '../lib/api';

export const useBookingStore = create((set, get) => ({
  selectedMentor: null,
  availability: [],
  selectedSlot: null,
  mySessions: [],
  loading: false,
  error: null,
  bookingSuccess: false,

  setSelectedMentor: (mentor) => {
    set({ 
      selectedMentor: mentor, 
      availability: [], 
      selectedSlot: null,
      bookingSuccess: false 
    });
  },

  fetchAvailability: async (mentorId, date) => {
    set({ loading: true, error: null, availability: [] });
    
    try {
      const response = await api.get(`/sessions/availability/?mentorId=${mentorId}&date=${date}`);
      set({ 
        availability: response.data.data || [],
        loading: false 
      });
    } catch (error) {
      console.error('Failed to load availability:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to load availability',
        loading: false 
      });
    }
  },

  selectSlot: (slot) => {
    set({ selectedSlot: slot });
  },

  bookSession: async (topic) => {
    const { selectedMentor, selectedSlot } = get();
    
    if (!selectedMentor || !selectedSlot) {
      set({ error: 'Please select a mentor and time slot' });
      return { success: false };
    }

    set({ loading: true, error: null });

    try {
      const mentorId = selectedMentor.user?.id || selectedMentor.id;
      
      const response = await api.post('/sessions/create/', {
        mentorId: mentorId,
        scheduledAt: selectedSlot.time,
        duration: 60,
        topic
      });

      set({ 
        bookingSuccess: true,
        loading: false,
        selectedSlot: null
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Booking failed:', error);
      set({ 
        error: error.response?.data?.message || 'Booking failed',
        loading: false 
      });
      return { success: false };
    }
  },

  fetchMySessions: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.get('/sessions/my-sessions/');
      set({ 
        mySessions: response.data.data || [],
        loading: false 
      });
    } catch (error) {
      console.error('Failed to load sessions:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to load sessions',
        loading: false 
      });
    }
  },

  clearBooking: () => {
    set({
      selectedMentor: null,
      availability: [],
      selectedSlot: null,
      bookingSuccess: false,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));
