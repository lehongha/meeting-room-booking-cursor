import { Booking, CreateBookingRequest } from '../../../shared/types';
import { BookingRepository } from './interfaces';
import { generateId, hasBookingConflict } from '../../../shared/utils';

/**
 * In-memory implementation of BookingRepository
 * This can be easily replaced with a database implementation later
 */
export class InMemoryBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  constructor() {
    this.initializeSampleBookings();
  }

  /**
   * Initialize sample bookings for testing
   */
  private initializeSampleBookings(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const sampleBookings: Omit<Booking, 'id' | 'createdAt'>[] = [
      {
        roomId: 'room-1', // Will be replaced with actual room ID
        roomName: 'Phòng họp A - Tầng 1',
        user: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
        },
        startTime: tomorrow.toISOString(),
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(), // +1 hour
      },
      {
        roomId: 'room-2',
        roomName: 'Phòng họp B - Tầng 1',
        user: {
          name: 'Trần Thị B',
          email: 'tranthib@example.com',
        },
        startTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
        endTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(), // +3 hours
      },
    ];

    this.bookings = sampleBookings.map(booking => ({
      ...booking,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
  }

  async getAllBookings(): Promise<Booking[]> {
    return [...this.bookings].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  async getBookingsByRoomId(roomId: string): Promise<Booking[]> {
    return this.bookings
      .filter(booking => booking.roomId === roomId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return this.bookings.filter(booking => {
      const bookingStart = new Date(booking.startTime);
      return bookingStart >= startDate && bookingStart <= endDate;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const booking = this.bookings.find(b => b.id === id);
    return booking || null;
  }

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    // Check for conflicts before creating
    const conflict = hasBookingConflict(bookingData, this.bookings);
    if (conflict) {
      throw new Error(`Xung đột đặt lịch với booking hiện tại: ${conflict.user.name} - ${new Date(conflict.startTime).toLocaleString()}`);
    }

    const newBooking: Booking = {
      id: generateId(),
      roomId: bookingData.roomId,
      roomName: '', // Will be set by service layer
      user: bookingData.user,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      createdAt: new Date().toISOString(),
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    this.bookings.splice(index, 1);
    return true;
  }

  async hasConflict(roomId: string, startTime: string, endTime: string): Promise<boolean> {
    const conflict = hasBookingConflict({ roomId, startTime, endTime }, this.bookings);
    return conflict !== null;
  }
} 