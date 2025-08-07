#!/usr/bin/env node

/**
 * Test script for Meeting Room Booking MCP Server
 * This script tests the API client functionality
 */

import { MeetingRoomApiClient } from '../dist/api-client.js';

async function testApiClient() {
  console.log('🧪 Testing Meeting Room Booking API Client...\n');

  const client = new MeetingRoomApiClient();

  try {
    // Test health check
    console.log('1. Testing health check...');
    const isHealthy = await client.healthCheck();
    console.log(`   Health check: ${isHealthy ? '✅ PASS' : '❌ FAIL'}\n`);

    if (!isHealthy) {
      console.log('❌ Backend server is not running. Please start the backend server first.');
      console.log('   Run: cd backend && npm run dev');
      return;
    }

    // Test get rooms
    console.log('2. Testing get rooms...');
    const rooms = await client.getRooms();
    console.log(`   Found ${rooms.length} rooms:`);
    rooms.forEach(room => {
      console.log(`   - ${room.name} (ID: ${room.id}): Capacity ${room.capacity}, Floor ${room.floor}`);
    });
    console.log('   ✅ PASS\n');

    // Test get bookings
    console.log('3. Testing get bookings...');
    const bookings = await client.getBookings();
    console.log(`   Found ${bookings.length} bookings`);
    console.log('   ✅ PASS\n');

    // Test create booking (if rooms available)
    if (rooms.length > 0) {
      console.log('4. Testing create booking...');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(10, 0, 0, 0);

      const testBooking = await client.createBooking({
        roomId: rooms[0].id,
        user: {
          name: 'Test User',
          email: 'test@example.com'
        },
        startTime: tomorrow.toISOString(),
        endTime: endTime.toISOString()
      });

      console.log(`   Created booking: ${testBooking.id}`);
      console.log('   ✅ PASS\n');

      // Test delete booking
      console.log('5. Testing delete booking...');
      await client.deleteBooking(testBooking.id);
      console.log(`   Deleted booking: ${testBooking.id}`);
      console.log('   ✅ PASS\n');
    }

    console.log('🎉 All tests passed! MCP server is ready to use.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Make sure the backend server is running at http://localhost:3001');
  }
}

// Run the test
testApiClient().catch(console.error); 