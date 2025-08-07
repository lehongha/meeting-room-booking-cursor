async function createBooking() {
  try {
    // Lấy ngày mai
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Tạo thời gian bắt đầu và kết thúc cho ngày mai (14:00-15:00 thay vì 9:00-10:00)
    const startTime = `${dateString}T14:00:00.000Z`;
    const endTime = `${dateString}T15:00:00.000Z`;
    
    const bookingData = {
      roomId: 'ldpxbojkvme0sceny', // ID của phòng A - Tầng 1
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      startTime: startTime,
      endTime: endTime
    };
    
    console.log('Đang tạo booking...');
    console.log('Thông tin booking:');
    console.log('- Phòng: Phòng họp A - Tầng 1');
    console.log('- Người đặt: John Doe');
    console.log('- Email: john.doe@example.com');
    console.log('- Ngày: ' + dateString);
    console.log('- Thời gian: 14:00 - 15:00');
    console.log('');
    
    const response = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Booking đã được tạo thành công!');
      console.log('Booking ID:', data.data.id);
      console.log('Thời gian tạo:', new Date(data.data.createdAt).toLocaleString('vi-VN'));
    } else {
      console.log('❌ Lỗi khi tạo booking:', data.error);
    }
  } catch (error) {
    console.log('❌ Không thể kết nối đến server. Đảm bảo backend đang chạy tại http://localhost:3001');
    console.log('Lỗi:', error.message);
  }
}

createBooking(); 