import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { MeetingRoomApiClient } from './api-client.js';
import {
  GetRoomsSchema,
  GetBookingsSchema,
  CreateBookingSchema,
  DeleteBookingSchema,
  GetAvailableTimeSlotsSchema,
  GetRoomsParams,
  GetBookingsParams,
  CreateBookingParams,
  DeleteBookingParams,
  GetAvailableTimeSlotsParams,
} from './types.js';

export class MeetingRoomBookingServer {
  private server: Server;
  private apiClient: MeetingRoomApiClient;

  constructor() {
    this.server = new Server(
      {
        name: 'meeting-room-booking-server',
        version: '1.0.0',
      }
    );

    this.apiClient = new MeetingRoomApiClient();

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_rooms',
            description: 'Get all available meeting rooms',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          {
            name: 'get_bookings',
            description: 'Get all bookings with optional filters by room ID and date',
            inputSchema: {
              type: 'object',
              properties: {
                roomId: {
                  type: 'string',
                  description: 'Optional room ID to filter bookings',
                },
                date: {
                  type: 'string',
                  description: 'Optional date to filter bookings (YYYY-MM-DD format)',
                },
              },
              required: [],
            },
          },
          {
            name: 'create_booking',
            description: 'Create a new meeting room booking',
            inputSchema: {
              type: 'object',
              properties: {
                roomId: {
                  type: 'string',
                  description: 'ID of the room to book',
                },
                userName: {
                  type: 'string',
                  description: 'Name of the person making the booking',
                },
                userEmail: {
                  type: 'string',
                  description: 'Email of the person making the booking',
                },
                startTime: {
                  type: 'string',
                  description: 'Start time of the booking (ISO 8601 format)',
                },
                endTime: {
                  type: 'string',
                  description: 'End time of the booking (ISO 8601 format)',
                },
              },
              required: ['roomId', 'userName', 'userEmail', 'startTime', 'endTime'],
            },
          },
          {
            name: 'delete_booking',
            description: 'Delete a booking by ID',
            inputSchema: {
              type: 'object',
              properties: {
                bookingId: {
                  type: 'string',
                  description: 'ID of the booking to delete',
                },
              },
              required: ['bookingId'],
            },
          },
          {
            name: 'get_available_time_slots',
            description: 'Get available time slots for a room on a specific date',
            inputSchema: {
              type: 'object',
              properties: {
                roomId: {
                  type: 'string',
                  description: 'ID of the room',
                },
                date: {
                  type: 'string',
                  description: 'Date to check availability (YYYY-MM-DD format)',
                },
              },
              required: ['roomId', 'date'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_rooms':
            return await this.handleGetRooms(args as GetRoomsParams);

          case 'get_bookings':
            return await this.handleGetBookings(args as GetBookingsParams);

          case 'create_booking':
            return await this.handleCreateBooking(args as CreateBookingParams);

          case 'delete_booking':
            return await this.handleDeleteBooking(args as DeleteBookingParams);

          case 'get_available_time_slots':
            return await this.handleGetAvailableTimeSlots(args as GetAvailableTimeSlotsParams);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error handling tool call ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            },
          ],
        };
      }
    });
  }

  private async handleGetRooms(args: GetRoomsParams) {
    const rooms = await this.apiClient.getRooms();
    
    const roomsText = rooms.map(room => 
      `- ${room.name} (ID: ${room.id}): Capacity ${room.capacity} people, Floor ${room.floor}`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Available meeting rooms:\n${roomsText}`,
        },
      ],
    };
  }

  private async handleGetBookings(args: GetBookingsParams) {
    const { roomId, date } = args;
    const bookings = await this.apiClient.getBookings(roomId, date);
    
    if (bookings.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No bookings found.',
          },
        ],
      };
    }

    const bookingsText = bookings.map(booking => 
      `- Booking ID: ${booking.id}\n  Room: ${booking.roomName}\n  User: ${booking.user.name} (${booking.user.email})\n  Time: ${booking.startTime} to ${booking.endTime}\n  Created: ${booking.createdAt}`
    ).join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Current bookings:\n\n${bookingsText}`,
        },
      ],
    };
  }

  private async handleCreateBooking(args: CreateBookingParams) {
    const { roomId, userName, userEmail, startTime, endTime } = args;
    
    const booking = await this.apiClient.createBooking({
      roomId,
      user: {
        name: userName,
        email: userEmail,
      },
      startTime,
      endTime,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Booking created successfully!\n\nDetails:\n- Booking ID: ${booking.id}\n- Room: ${booking.roomName}\n- User: ${booking.user.name} (${booking.user.email})\n- Time: ${booking.startTime} to ${booking.endTime}\n- Created: ${booking.createdAt}`,
        },
      ],
    };
  }

  private async handleDeleteBooking(args: DeleteBookingParams) {
    const { bookingId } = args;
    
    await this.apiClient.deleteBooking(bookingId);

    return {
      content: [
        {
          type: 'text',
          text: `Booking with ID ${bookingId} has been deleted successfully.`,
        },
      ],
    };
  }

  private async handleGetAvailableTimeSlots(args: GetAvailableTimeSlotsParams) {
    const { roomId, date } = args;
    
    const timeSlots = await this.apiClient.getAvailableTimeSlots(roomId, date);

    if (timeSlots.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No available time slots found for room ${roomId} on ${date}.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Available time slots for room ${roomId} on ${date}:\n${timeSlots.join('\n')}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Meeting Room Booking MCP Server is running...');
  }
}

// Start the server
const server = new MeetingRoomBookingServer();
server.run().catch(console.error); 