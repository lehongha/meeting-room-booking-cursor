import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { ApiResponse, CreateBookingRequest } from '../../../shared/types';

/**
 * Controller for booking-related HTTP requests
 */
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get all bookings
   */
  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await this.bookingService.getAllBookings();
      const response: ApiResponse<typeof bookings> = {
        success: true,
        data: bookings,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get bookings by room ID
   */
  async getBookingsByRoomId(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const bookings = await this.bookingService.getBookingsByRoomId(roomId);
      const response: ApiResponse<typeof bookings> = {
        success: true,
        data: bookings,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await this.bookingService.getBookingById(id);
      
      if (!booking) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Đặt lịch không tồn tại',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof booking> = {
        success: true,
        data: booking,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(500).json(response);
    }
  }

  /**
   * Create a new booking
   */
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingData: CreateBookingRequest = req.body;
      const booking = await this.bookingService.createBooking(bookingData);
      
      const response: ApiResponse<typeof booking> = {
        success: true,
        data: booking,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(400).json(response);
    }
  }

  /**
   * Delete a booking
   */
  async deleteBooking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.bookingService.deleteBooking(id);
      
      if (!deleted) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Đặt lịch không tồn tại',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Đặt lịch đã được xóa thành công' },
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(500).json(response);
    }
  }
} 