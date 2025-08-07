import { Booking, CreateBookingRequest, Room, BookingValidation, ValidationError } from '../../../shared/types';
import { BookingRepository, RoomRepository } from '../repositories/interfaces';
import { 
  isValidEmail, 
  isDateInFuture, 
  isWithinBusinessHours, 
  isValidTimeSlot,
  hasBookingConflict 
} from '../../../shared/utils';

/**
 * Service layer for booking operations
 * Handles business logic and validation
 */
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private roomRepository: RoomRepository
  ) {}

  /**
   * Get all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.getAllBookings();
  }

  /**
   * Get bookings by room ID
   */
  async getBookingsByRoomId(roomId: string): Promise<Booking[]> {
    return await this.bookingRepository.getBookingsByRoomId(roomId);
  }

  /**
   * Get bookings by date range
   */
  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return await this.bookingRepository.getBookingsByDateRange(startDate, endDate);
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<Booking | null> {
    return await this.bookingRepository.getBookingById(id);
  }

  /**
   * Create a new booking with validation
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    // Validate booking data
    const validation = this.validateBookingData(bookingData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Check if room exists
    const room = await this.roomRepository.getRoomById(bookingData.roomId);
    if (!room) {
      throw new Error('Phòng không tồn tại');
    }

    // Check for conflicts
    const existingBookings = await this.bookingRepository.getAllBookings();
    const conflict = hasBookingConflict(bookingData, existingBookings);
    if (conflict) {
      throw new Error(`Xung đột đặt lịch với booking hiện tại: ${conflict.user.name} - ${new Date(conflict.startTime).toLocaleString()}`);
    }

    // Create booking
    const booking = await this.bookingRepository.createBooking(bookingData);
    
    // Set room name
    booking.roomName = room.name;
    
    return booking;
  }

  /**
   * Delete a booking
   */
  async deleteBooking(id: string): Promise<boolean> {
    return await this.bookingRepository.deleteBooking(id);
  }

  /**
   * Validate booking data
   */
  private validateBookingData(bookingData: CreateBookingRequest): BookingValidation {
    const errors: ValidationError[] = [];

    // Validate user name
    if (!bookingData.user.name || bookingData.user.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Tên không được để trống' });
    }

    // Validate email
    if (!bookingData.user.email || !isValidEmail(bookingData.user.email)) {
      errors.push({ field: 'email', message: 'Email không hợp lệ' });
    }

    // Validate room ID
    if (!bookingData.roomId) {
      errors.push({ field: 'roomId', message: 'Phòng không được để trống' });
    }

    // Validate start time
    const startTime = new Date(bookingData.startTime);
    if (isNaN(startTime.getTime())) {
      errors.push({ field: 'startTime', message: 'Thời gian bắt đầu không hợp lệ' });
    } else {
      if (!isDateInFuture(startTime)) {
        errors.push({ field: 'startTime', message: 'Thời gian bắt đầu phải trong tương lai' });
      }
      if (!isWithinBusinessHours(startTime)) {
        errors.push({ field: 'startTime', message: 'Thời gian bắt đầu phải trong giờ làm việc (8:00 - 18:00)' });
      }
      if (!isValidTimeSlot(startTime)) {
        errors.push({ field: 'startTime', message: 'Thời gian bắt đầu phải là giờ chẵn hoặc 30 phút' });
      }
    }

    // Validate end time
    const endTime = new Date(bookingData.endTime);
    if (isNaN(endTime.getTime())) {
      errors.push({ field: 'endTime', message: 'Thời gian kết thúc không hợp lệ' });
    } else {
      if (endTime <= startTime) {
        errors.push({ field: 'endTime', message: 'Thời gian kết thúc phải sau thời gian bắt đầu' });
      }
      if (!isWithinBusinessHours(endTime)) {
        errors.push({ field: 'endTime', message: 'Thời gian kết thúc phải trong giờ làm việc (8:00 - 18:00)' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
} 