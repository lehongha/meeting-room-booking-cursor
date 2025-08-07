import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import { bookingApi, roomApi } from './services/api';
import { Booking, Room } from '../../shared/types';
import './App.css';

function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRoomId, setFilterRoomId] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsData, roomsData] = await Promise.all([
          bookingApi.getAllBookings(),
          roomApi.getAllRooms(),
        ]);
        setBookings(bookingsData);
        setRooms(roomsData);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updatedBookings = await bookingApi.getAllBookings();
        setBookings(updatedBookings);
      } catch (err) {
        console.error('Error polling bookings:', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle new booking creation
  const handleBookingCreated = async (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  // Handle booking deletion
  const handleBookingDeleted = async (bookingId: string) => {
    const success = await bookingApi.deleteBooking(bookingId);
    if (success) {
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    }
  };

  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    if (filterRoomId && booking.roomId !== filterRoomId) return false;
    if (filterDate) {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      if (bookingDate !== filterDate) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Đang tải...</h2>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Lỗi</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <header className="header">
        <div className="container">
          <h1>🏢 Hệ thống đặt phòng họp</h1>
          <p>Quản lý và đặt lịch phòng họp một cách dễ dàng</p>
        </div>
      </header>

      <main className="container">
        <div className="grid grid-2">
          <div className="card">
            <h2>📅 Đặt lịch mới</h2>
            <BookingForm 
              rooms={rooms}
              onBookingCreated={handleBookingCreated}
            />
          </div>

          <div className="card">
            <h2>📋 Danh sách đặt lịch</h2>
            <BookingList 
              bookings={filteredBookings}
              rooms={rooms}
              filterRoomId={filterRoomId}
              filterDate={filterDate}
              onFilterRoomChange={setFilterRoomId}
              onFilterDateChange={setFilterDate}
              onBookingDeleted={handleBookingDeleted}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 