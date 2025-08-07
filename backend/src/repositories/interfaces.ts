import { Room, Booking, CreateBookingRequest } from '../../../shared/types';

/**
 * Repository interface for room operations
 */
export interface RoomRepository {
  getAllRooms(): Promise<Room[]>;
  getRoomById(id: string): Promise<Room | null>;
  createRoom(room: Omit<Room, 'id'>): Promise<Room>;
}

/**
 * Repository interface for booking operations
 */
export interface BookingRepository {
  getAllBookings(): Promise<Booking[]>;
  getBookingsByRoomId(roomId: string): Promise<Booking[]>;
  getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | null>;
  createBooking(bookingData: CreateBookingRequest): Promise<Booking>;
  deleteBooking(id: string): Promise<boolean>;
  hasConflict(roomId: string, startTime: string, endTime: string): Promise<boolean>;
} 