#!/usr/bin/env node

import { MeetingRoomApiClient } from './dist/api-client.js';

async function checkRooms() {
  console.log('🏢 Checking available meeting rooms...\n');
  
  const client = new MeetingRoomApiClient();
  
  try {
    const rooms = await client.getRooms();
    
    if (rooms.length === 0) {
      console.log('❌ No meeting rooms available.');
    } else {
      console.log(`✅ Found ${rooms.length} meeting rooms:\n`);
      
      rooms.forEach((room, index) => {
        console.log(`${index + 1}. Room: ${room.name}`);
        console.log(`   ID: ${room.id}`);
        console.log(`   Capacity: ${room.capacity} people`);
        console.log(`   Floor: ${room.floor}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Error getting rooms:', error.message);
  }
}

checkRooms(); 