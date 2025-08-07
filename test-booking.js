async function testBooking() {
  try {
    // Tạo booking cho ngày mai lúc 13:00-14:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    const bookingData = {
      roomId: 'ldpxbojkvme0sceny',
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      startTime: `${dateString}T13:00:00`,
      endTime: `${dateString}T14:00:00`
    };
    
    console.log('Tạo booking test...');
    
    const response = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.log('Lỗi:', error.message);
  }
}

testBooking(); 