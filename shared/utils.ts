// Shared utility functions

import { Booking, Room, TIME_SLOT_DURATION, BUSINESS_HOURS } from './types';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a date is in the future
 */
export function isDateInFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if a time is within business hours
 */
export function isWithinBusinessHours(date: Date): boolean {
  const hour = date.getHours();
  return hour >= BUSINESS_HOURS.start && hour < BUSINESS_HOURS.end;
}

/**
 * Check if a time slot is valid (starts on the hour or half hour)
 */
export function isValidTimeSlot(date: Date): boolean {
  const minutes = date.getMinutes();
  return minutes === 0 || minutes === 30;
}

/**
 * Check if two time ranges overlap
 */
export function hasTimeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Check if a booking conflicts with existing bookings
 */
export function hasBookingConflict(
  newBooking: { roomId: string; startTime: string; endTime: string },
  existingBookings: Booking[]
): Booking | null {
  const newStart = new Date(newBooking.startTime);
  const newEnd = new Date(newBooking.endTime);

  for (const booking of existingBookings) {
    if (booking.roomId === newBooking.roomId) {
      const existingStart = new Date(booking.startTime);
      const existingEnd = new Date(booking.endTime);

      if (hasTimeOverlap(newStart, newEnd, existingStart, existingEnd)) {
        return booking;
      }
    }
  }

  return null;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get available time slots for a given date
 */
export function getAvailableTimeSlots(date: Date): Date[] {
  const slots: Date[] = [];
  const startDate = new Date(date);
  startDate.setHours(BUSINESS_HOURS.start, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(BUSINESS_HOURS.end, 0, 0, 0);

  const currentSlot = new Date(startDate);
  
  while (currentSlot < endDate) {
    slots.push(new Date(currentSlot));
    currentSlot.setMinutes(currentSlot.getMinutes() + TIME_SLOT_DURATION);
  }

  return slots;
}

/**
 * Find room by ID
 */
export function findRoomById(rooms: Room[], roomId: string): Room | undefined {
  return rooms.find(room => room.id === roomId);
} 