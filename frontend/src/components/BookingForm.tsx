import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format, addHours, setMinutes, setHours } from 'date-fns';
import { bookingApi } from '../services/api';
import { Room, Booking, CreateBookingRequest } from '../../../shared/types';
import { getAvailableTimeSlots, isValidEmail } from '../../../shared/utils';

interface BookingFormProps {
  rooms: Room[];
  onBookingCreated: (booking: Booking) => void;
}

interface FormData {
  roomId: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ rooms, onBookingCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>();

  const watchedDate = watch('date');
  const watchedStartTime = watch('startTime');

  // Update available time slots when date changes
  React.useEffect(() => {
    if (watchedDate) {
      const date = new Date(watchedDate);
      const slots = getAvailableTimeSlots(date);
      const slotOptions = slots.map(slot => format(slot, 'HH:mm'));
      setAvailableSlots(slotOptions);
      setSelectedDate(watchedDate);
      
      // Reset time selections when date changes
      setValue('startTime', '');
      setValue('endTime', '');
    }
  }, [watchedDate, setValue]);

  // Update end time when start time changes
  React.useEffect(() => {
    if (watchedStartTime && watchedDate) {
      const startTime = new Date(`${watchedDate}T${watchedStartTime}`);
      const endTime = addHours(startTime, 1);
      setValue('endTime', format(endTime, 'HH:mm'));
    }
  }, [watchedStartTime, watchedDate, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!data.roomId || !data.userName || !data.userEmail || !data.date || !data.startTime || !data.endTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!isValidEmail(data.userEmail)) {
      toast.error('Email không hợp lệ');
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${data.date}T${data.startTime}`);
      const endDateTime = new Date(`${data.date}T${data.endTime}`);

      const bookingData: CreateBookingRequest = {
        roomId: data.roomId,
        user: {
          name: data.userName,
          email: data.userEmail,
        },
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      };

      const newBooking = await bookingApi.createBooking(bookingData);
      onBookingCreated(newBooking);
      
      toast.success('Đặt lịch thành công!');
      reset();
      setSelectedDate('');
      setAvailableSlots([]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Có lỗi xảy ra';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="roomId">Chọn phòng *</label>
        <select
          id="roomId"
          className={`form-control ${errors.roomId ? 'error' : ''}`}
          {...register('roomId', { required: 'Vui lòng chọn phòng' })}
        >
          <option value="">-- Chọn phòng --</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              {room.name} (Sức chứa: {room.capacity} người, Tầng: {room.floor})
            </option>
          ))}
        </select>
        {errors.roomId && <div className="error-message">{errors.roomId.message}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="userName">Họ tên *</label>
        <input
          type="text"
          id="userName"
          className={`form-control ${errors.userName ? 'error' : ''}`}
          placeholder="Nhập họ tên của bạn"
          {...register('userName', { 
            required: 'Vui lòng nhập họ tên',
            minLength: { value: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
          })}
        />
        {errors.userName && <div className="error-message">{errors.userName.message}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="userEmail">Email *</label>
        <input
          type="email"
          id="userEmail"
          className={`form-control ${errors.userEmail ? 'error' : ''}`}
          placeholder="example@company.com"
          {...register('userEmail', { 
            required: 'Vui lòng nhập email',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email không hợp lệ'
            }
          })}
        />
        {errors.userEmail && <div className="error-message">{errors.userEmail.message}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Ngày đặt lịch *</label>
        <input
          type="date"
          id="date"
          className={`form-control ${errors.date ? 'error' : ''}`}
          min={getMinDate()}
          {...register('date', { required: 'Vui lòng chọn ngày' })}
        />
        {errors.date && <div className="error-message">{errors.date.message}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="startTime">Thời gian bắt đầu *</label>
        <select
          id="startTime"
          className={`form-control ${errors.startTime ? 'error' : ''}`}
          {...register('startTime', { required: 'Vui lòng chọn thời gian bắt đầu' })}
        >
          <option value="">-- Chọn thời gian --</option>
          {availableSlots.map(slot => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.startTime && <div className="error-message">{errors.startTime.message}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="endTime">Thời gian kết thúc *</label>
        <select
          id="endTime"
          className={`form-control ${errors.endTime ? 'error' : ''}`}
          {...register('endTime', { required: 'Vui lòng chọn thời gian kết thúc' })}
        >
          <option value="">-- Chọn thời gian --</option>
          {availableSlots.map(slot => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.endTime && <div className="error-message">{errors.endTime.message}</div>}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
        style={{ width: '100%' }}
      >
        {isSubmitting ? 'Đang xử lý...' : 'Đặt lịch'}
      </button>
    </form>
  );
};

export default BookingForm; 