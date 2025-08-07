async function getAllBookings() {
  try {
    const response = await fetch('http://localhost:3001/api/bookings');
    const data = await response.json();
    
    if (data.success) {
      console.log('=== DANH SÁCH TẤT CẢ CÁC BOOKING ===\n');
      
      if (data.data.length === 0) {
        console.log('Chưa có booking nào.');
        return;
      }
      
      data.data.forEach((booking, index) => {
        const startDate = new Date(booking.startTime);
        const endDate = new Date(booking.endTime);
        
        console.log(`${index + 1}. Booking ID: ${booking.id}`);
        console.log(`   - Phòng: ${booking.roomName}`);
        console.log(`   - Người đặt: ${booking.user.name}`);
        console.log(`   - Email: ${booking.user.email}`);
        console.log(`   - Ngày: ${startDate.toLocaleDateString('vi-VN')}`);
        console.log(`   - Thời gian: ${startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`);
        console.log(`   - Tạo lúc: ${new Date(booking.createdAt).toLocaleString('vi-VN')}`);
        console.log('');
      });
    } else {
      console.log('Lỗi:', data.error);
    }
  } catch (error) {
    console.log('Không thể kết nối đến server. Đảm bảo backend đang chạy tại http://localhost:3001');
    console.log('Lỗi:', error.message);
  }
}

getAllBookings(); 