async function getAvailableRooms() {
  try {
    const response = await fetch('http://localhost:3001/api/rooms');
    const data = await response.json();
    
    if (data.success) {
      console.log('=== DANH SÁCH CÁC PHÒNG HỌP CÓ SẴN ===\n');
      data.data.forEach((room, index) => {
        console.log(`${index + 1}. ${room.name}`);
        console.log(`   - ID: ${room.id}`);
        console.log(`   - Sức chứa: ${room.capacity} người`);
        console.log(`   - Tầng: ${room.floor}`);
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

getAvailableRooms(); 