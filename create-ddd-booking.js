import { MeetingRoomApiClient } from './mcp-server/dist/api-client.js';

async function createDDDBooking() {
  try {
    console.log('🎯 Tạo booking cho DDD thông qua MCP server...\n');
    
    const client = new MeetingRoomApiClient();
    
    // Lấy ngày mai
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    // Tạo thời gian cho ngày mai 9:00-10:00
    const startTime = `${dateString}T09:00:00`;
    const endTime = `${dateString}T10:00:00`;
    
    console.log('📋 Thông tin booking:');
    console.log('- Phòng: Phòng họp B - Tầng 1 (ID: 5mujqkopdme0sceny)');
    console.log('- Người đặt: DDD');
    console.log('- Email: ddd@example.com');
    console.log('- Ngày: ' + dateString);
    console.log('- Thời gian: 9:00 - 10:00');
    console.log('');
    
    const bookingData = {
      roomId: '5mujqkopdme0sceny', // ID của phòng B - Tầng 1
      user: {
        name: 'DDD',
        email: 'ddd@example.com'
      },
      startTime: startTime,
      endTime: endTime
    };
    
    const booking = await client.createBooking(bookingData);
    
    console.log('✅ Booking đã được tạo thành công!');
    console.log('📝 Chi tiết booking:');
    console.log('- Booking ID:', booking.id);
    console.log('- Phòng:', booking.roomName);
    console.log('- Người đặt:', booking.user.name);
    console.log('- Email:', booking.user.email);
    console.log('- Thời gian:', booking.startTime, 'đến', booking.endTime);
    console.log('- Tạo lúc:', new Date(booking.createdAt).toLocaleString('vi-VN'));
    
  } catch (error) {
    console.log('❌ Lỗi khi tạo booking:', error.message);
    console.log('💡 Đảm bảo backend server đang chạy tại http://localhost:3001');
  }
}

createDDDBooking(); 