import axios, { AxiosInstance } from 'axios';
import { 
  Room, 
  Booking, 
  CreateBookingRequest, 
  ApiResponse,
  RoomSchema,
  BookingSchema,
  CreateBookingRequestSchema,
  ApiResponseSchema
} from './types.js';

export class MeetingRoomApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  /**
   * Get all available rooms
   */
  async getRooms(): Promise<Room[]> {
    try {
      const response = await this.client.get<ApiResponse>('/api/rooms');
      const validatedResponse = ApiResponseSchema.parse(response.data);
      
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.error || 'Failed to fetch rooms');
      }

      const rooms = Array.isArray(validatedResponse.data) 
        ? validatedResponse.data.map(room => RoomSchema.parse(room))
        : [];
      
      return rooms;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw new Error(`Failed to fetch rooms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all bookings with optional filters
   */
  async getBookings(roomId?: string, date?: string): Promise<Booking[]> {
    try {
      let url = '/api/bookings';
      const params = new URLSearchParams();
      
      if (roomId) {
        params.append('roomId', roomId);
      }
      if (date) {
        params.append('date', date);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await this.client.get<ApiResponse>(url);
      const validatedResponse = ApiResponseSchema.parse(response.data);
      
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.error || 'Failed to fetch bookings');
      }

      const bookings = Array.isArray(validatedResponse.data) 
        ? validatedResponse.data.map(booking => BookingSchema.parse(booking))
        : [];
      
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error(`Failed to fetch bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      // Validate input data
      const validatedData = CreateBookingRequestSchema.parse(bookingData);
      
      const response = await this.client.post<ApiResponse>('/api/bookings', validatedData);
      const validatedResponse = ApiResponseSchema.parse(response.data);
      
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.error || 'Failed to create booking');
      }

      const booking = BookingSchema.parse(validatedResponse.data);
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a booking by ID
   */
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      const response = await this.client.delete<ApiResponse>(`/api/bookings/${bookingId}`);
      const validatedResponse = ApiResponseSchema.parse(response.data);
      
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error(`Failed to delete booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available time slots for a room on a specific date
   */
  async getAvailableTimeSlots(roomId: string, date: string): Promise<string[]> {
    try {
      const response = await this.client.get<ApiResponse>(`/api/bookings/room/${roomId}?date=${date}`);
      const validatedResponse = ApiResponseSchema.parse(response.data);
      
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.error || 'Failed to fetch available time slots');
      }

      // The API might return available time slots or we can calculate them
      // For now, we'll return an empty array as the API might not have this endpoint
      return [];
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw new Error(`Failed to fetch available time slots: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if the API server is running
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
} 