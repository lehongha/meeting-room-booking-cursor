import { Room } from '../../../shared/types';
import { RoomRepository } from '../repositories/interfaces';

/**
 * Service layer for room operations
 * Handles business logic for room management
 */
export class RoomService {
  constructor(private roomRepository: RoomRepository) {}

  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.getAllRooms();
  }

  /**
   * Get room by ID
   */
  async getRoomById(id: string): Promise<Room | null> {
    return await this.roomRepository.getRoomById(id);
  }

  /**
   * Create a new room
   */
  async createRoom(roomData: Omit<Room, 'id'>): Promise<Room> {
    // Validate room data
    this.validateRoomData(roomData);

    return await this.roomRepository.createRoom(roomData);
  }

  /**
   * Validate room data
   */
  private validateRoomData(roomData: Omit<Room, 'id'>): void {
    if (!roomData.name || roomData.name.trim().length === 0) {
      throw new Error('Tên phòng không được để trống');
    }

    if (roomData.capacity <= 0) {
      throw new Error('Sức chứa phòng phải lớn hơn 0');
    }

    if (roomData.floor <= 0) {
      throw new Error('Tầng phải lớn hơn 0');
    }
  }
} 