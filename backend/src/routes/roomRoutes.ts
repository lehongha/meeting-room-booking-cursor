import { Router } from 'express';
import { RoomController } from '../controllers/roomController';

/**
 * Router for room-related endpoints
 */
export function createRoomRoutes(roomController: RoomController): Router {
  const router = Router();

  // GET /api/rooms - Get all rooms
  router.get('/', (req, res) => roomController.getAllRooms(req, res));

  // GET /api/rooms/:id - Get room by ID
  router.get('/:id', (req, res) => roomController.getRoomById(req, res));

  // POST /api/rooms - Create a new room
  router.post('/', (req, res) => roomController.createRoom(req, res));

  return router;
} 