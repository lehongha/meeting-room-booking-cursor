import axios from 'axios';
import { Room, Booking, CreateBookingRequest, ApiResponse } from '../../../shared/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle API responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Room API service
 */
export const roomApi = {
  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    const response = await api.get<ApiResponse<Room[]>>('/rooms');
    return response.data.data || [];
  },

  /**
   * Get room by ID
   */
  async getRoomById(id: string): Promise<Room | null> {
    try {
      const response = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
      return response.data.data || null;
    } catch (error) {
      return null;
    }
  },
};

/**
 * Booking API service
 */
export const bookingApi = {
  /**
   * Get all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings');
    return response.data.data || [];
  },

  /**
   * Get bookings by room ID
   */
  async getBookingsByRoomId(roomId: string): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>(`/bookings/room/${roomId}`);
    return response.data.data || [];
  },

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
      return response.data.data || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Create a new booking
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);
    return response.data.data!;
  },

  /**
   * Delete a booking
   */
  async deleteBooking(id: string): Promise<boolean> {
    try {
      await api.delete<ApiResponse<{ message: string }>>(`/bookings/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  },
}; 