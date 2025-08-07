import { Room } from '../../../shared/types';
import { RoomRepository } from './interfaces';
import { generateId } from '../../../shared/utils';

/**
 * In-memory implementation of RoomRepository
 * This can be easily replaced with a database implementation later
 */
export class InMemoryRoomRepository implements RoomRepository {
  private rooms: Room[] = [];

  constructor() {
    this.initializeSampleRooms();
  }

  /**
   * Initialize sample rooms on startup
   */
  private initializeSampleRooms(): void {
    const sampleRooms: Omit<Room, 'id'>[] = [
      {
        name: 'Phòng họp A - Tầng 1',
        capacity: 8,
        floor: 1,
      },
      {
        name: 'Phòng họp B - Tầng 1',
        capacity: 12,
        floor: 1,
      },
      {
        name: 'Phòng họp C - Tầng 2',
        capacity: 6,
        floor: 2,
      },
      {
        name: 'Phòng họp D - Tầng 2',
        capacity: 15,
        floor: 2,
      },
      {
        name: 'Phòng họp E - Tầng 3',
        capacity: 20,
        floor: 3,
      },
    ];

    this.rooms = sampleRooms.map(room => ({
      ...room,
      id: generateId(),
    }));
  }

  async getAllRooms(): Promise<Room[]> {
    return [...this.rooms];
  }

  async getRoomById(id: string): Promise<Room | null> {
    const room = this.rooms.find(r => r.id === id);
    return room || null;
  }

  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    const newRoom: Room = {
      ...room,
      id: generateId(),
    };
    this.rooms.push(newRoom);
    return newRoom;
  }
} 