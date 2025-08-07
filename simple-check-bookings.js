async function getBookings() {
  try {
    const response = await fetch('http://localhost:3001/api/bookings');
    const data = await response.json();
    
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.log('Lỗi:', error.message);
  }
}

getBookings(); 