#!/usr/bin/env node

import { MeetingRoomBookingServer } from './functions.js';

// Start the MCP server
const server = new MeetingRoomBookingServer();
server.run().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
}); 