// Shared types for the meeting room booking system

export interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
}

export interface User {
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  user: User;
  startTime: string; // ISO string
  endTime: string; // ISO string
  createdAt: string; // ISO string
}

export interface CreateBookingRequest {
  roomId: string;
  user: User;
  startTime: string;
  endTime: string;
}

export interface BookingConflictError {
  message: string;
  conflictingBooking?: Booking;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Time slot configuration
export const TIME_SLOT_DURATION = 60; // minutes
export const BUSINESS_HOURS = {
  start: 8, // 8 AM
  end: 18, // 6 PM
};

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface BookingValidation {
  isValid: boolean;
  errors: ValidationError[];
} 