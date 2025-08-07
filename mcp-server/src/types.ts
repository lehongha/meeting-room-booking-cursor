import { z } from 'zod';

// API Response schemas
export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number(),
  floor: z.number()
});

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email()
});

export const BookingSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  roomName: z.string(),
  user: UserSchema,
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string()
});

export const CreateBookingRequestSchema = z.object({
  roomId: z.string(),
  user: UserSchema,
  startTime: z.string(),
  endTime: z.string()
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional()
});

// MCP Function schemas
export const GetRoomsSchema = z.object({});

export const GetBookingsSchema = z.object({
  roomId: z.string().optional(),
  date: z.string().optional()
});

export const CreateBookingSchema = z.object({
  roomId: z.string(),
  userName: z.string(),
  userEmail: z.string().email(),
  startTime: z.string(),
  endTime: z.string()
});

export const DeleteBookingSchema = z.object({
  bookingId: z.string()
});

export const GetAvailableTimeSlotsSchema = z.object({
  roomId: z.string(),
  date: z.string()
});

// Type exports
export type Room = z.infer<typeof RoomSchema>;
export type User = z.infer<typeof UserSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export type GetRoomsParams = z.infer<typeof GetRoomsSchema>;
export type GetBookingsParams = z.infer<typeof GetBookingsSchema>;
export type CreateBookingParams = z.infer<typeof CreateBookingSchema>;
export type DeleteBookingParams = z.infer<typeof DeleteBookingSchema>;
export type GetAvailableTimeSlotsParams = z.infer<typeof GetAvailableTimeSlotsSchema>; 