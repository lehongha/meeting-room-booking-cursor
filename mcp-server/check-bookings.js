#!/usr/bin/env node

import { MeetingRoomApiClient } from './dist/api-client.js';

async function checkBookings() {
  console.log('📅 Kiểm tra danh sách booking hiện tại...\n');
  
  const client = new MeetingRoomApiClient();
  
  try {
    const bookings = await client.getBookings();
    
    if (bookings.length === 0) {
      console.log('❌ Không có booking nào trong hệ thống.');
    } else {
      console.log(`✅ Tìm thấy ${bookings.length} booking:\n`);
      
      bookings.forEach((booking, index) => {
        console.log(`${index + 1}. Booking ID: ${booking.id}`);
        console.log(`   Phòng: ${booking.roomName}`);
        console.log(`   Người đặt: ${booking.user.name} (${booking.user.email})`);
        console.log(`   Thời gian: ${booking.startTime} - ${booking.endTime}`);
        console.log(`   Tạo lúc: ${booking.createdAt}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách booking:', error.message);
  }
}

checkBookings(); 