import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';

/**
 * Router for booking-related endpoints
 */
export function createBookingRoutes(bookingController: BookingController): Router {
  const router = Router();

  // GET /api/bookings - Get all bookings
  router.get('/', (req, res) => bookingController.getAllBookings(req, res));

  // GET /api/bookings/:id - Get booking by ID
  router.get('/:id', (req, res) => bookingController.getBookingById(req, res));

  // GET /api/bookings/room/:roomId - Get bookings by room ID
  router.get('/room/:roomId', (req, res) => bookingController.getBookingsByRoomId(req, res));

  // POST /api/bookings - Create a new booking
  router.post('/', (req, res) => bookingController.createBooking(req, res));

  // DELETE /api/bookings/:id - Delete a booking
  router.delete('/:id', (req, res) => bookingController.deleteBooking(req, res));

  return router;
} 