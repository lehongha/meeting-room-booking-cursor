import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';
import { ApiResponse } from '../../../shared/types';

/**
 * Controller for room-related HTTP requests
 */
export class RoomController {
  constructor(private roomService: RoomService) {}

  /**
   * Get all rooms
   */
  async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getAllRooms();
      const response: ApiResponse<typeof rooms> = {
        success: true,
        data: rooms,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get room by ID
   */
  async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const room = await this.roomService.getRoomById(id);
      
      if (!room) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Phòng không tồn tại',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof room> = {
        success: true,
        data: room,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(500).json(response);
    }
  }

  /**
   * Create a new room
   */
  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const roomData = req.body;
      const room = await this.roomService.createRoom(roomData);
      
      const response: ApiResponse<typeof room> = {
        success: true,
        data: room,
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
      res.status(400).json(response);
    }
  }
} 