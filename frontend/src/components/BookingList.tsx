import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Booking, Room } from '../../../shared/types';

interface BookingListProps {
  bookings: Booking[];
  rooms: Room[];
  filterRoomId: string;
  filterDate: string;
  onFilterRoomChange: (roomId: string) => void;
  onFilterDateChange: (date: string) => void;
  onBookingDeleted: (bookingId: string) => void;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  rooms,
  filterRoomId,
  filterDate,
  onFilterRoomChange,
  onFilterDateChange,
  onBookingDeleted,
}) => {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đặt lịch này?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(bookingId));

    try {
      await onBookingDeleted(bookingId);
      toast.success('Đã xóa đặt lịch thành công');
    } catch (error) {
      toast.error('Không thể xóa đặt lịch');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const formatBookingDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
  };

  const formatBookingTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'HH:mm');
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room?.name || 'Phòng không xác định';
  };

  const clearFilters = () => {
    onFilterRoomChange('');
    onFilterDateChange('');
  };

  const hasActiveFilters = filterRoomId || filterDate;

  return (
    <div>
      {/* Filter Section */}
      <div className="filter-section">
        <h3>🔍 Lọc đặt lịch</h3>
        <div className="filter-controls">
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="filterRoom">Lọc theo phòng</label>
            <select
              id="filterRoom"
              className="form-control"
              value={filterRoomId}
              onChange={(e) => onFilterRoomChange(e.target.value)}
            >
              <option value="">Tất cả phòng</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="filterDate">Lọc theo ngày</label>
            <input
              type="date"
              id="filterDate"
              className="form-control"
              value={filterDate}
              onChange={(e) => onFilterDateChange(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="loading">
          <h3>📝 Không có đặt lịch nào</h3>
          <p>
            {hasActiveFilters 
              ? 'Không có đặt lịch nào phù hợp với bộ lọc hiện tại'
              : 'Chưa có đặt lịch nào. Hãy tạo đặt lịch đầu tiên!'
            }
          </p>
        </div>
      ) : (
        <div>
          <h3>📋 Danh sách đặt lịch ({bookings.length})</h3>
          {bookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <h3>📅 {formatBookingDate(booking.startTime)}</h3>
              <p><strong>Phòng:</strong> {getRoomName(booking.roomId)}</p>
              <p><strong>Thời gian:</strong> {formatBookingTime(booking.startTime)} - {formatBookingTime(booking.endTime)}</p>
              <p><strong>Người đặt:</strong> {booking.user.name}</p>
              <p><strong>Email:</strong> {booking.user.email}</p>
              <p><strong>Đặt lúc:</strong> {format(parseISO(booking.createdAt), 'dd/MM/yyyy HH:mm')}</p>
              
              <div className="booking-actions">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteBooking(booking.id)}
                  disabled={deletingIds.has(booking.id)}
                >
                  {deletingIds.has(booking.id) ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList; 