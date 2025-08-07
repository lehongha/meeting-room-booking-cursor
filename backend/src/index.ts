import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import repositories
import { InMemoryRoomRepository } from './repositories/inMemoryRoomRepository';
import { InMemoryBookingRepository } from './repositories/inMemoryBookingRepository';

// Import services
import { RoomService } from './services/roomService';
import { BookingService } from './services/bookingService';

// Import controllers
import { RoomController } from './controllers/roomController';
import { BookingController } from './controllers/bookingController';

// Import routes
import { createRoomRoutes } from './routes/roomRoutes';
import { createBookingRoutes } from './routes/bookingRoutes';

/**
 * Main application entry point
 */
class App {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS middleware
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }));

    // Logging middleware
    this.app.use(morgan('combined'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  /**
   * Initialize routes with dependency injection
   */
  private initializeRoutes(): void {
    // Initialize repositories
    const roomRepository = new InMemoryRoomRepository();
    const bookingRepository = new InMemoryBookingRepository();

    // Initialize services
    const roomService = new RoomService(roomRepository);
    const bookingService = new BookingService(bookingRepository, roomRepository);

    // Initialize controllers
    const roomController = new RoomController(roomService);
    const bookingController = new BookingController(bookingService);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Meeting Room Booking API is running'
      });
    });

    // API routes
    this.app.use('/api/rooms', createRoomRoutes(roomController));
    this.app.use('/api/bookings', createBookingRoutes(bookingController));

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint không tồn tại',
      });
    });

    // Error handler
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        error: 'Lỗi server nội bộ',
      });
    });
  }

  /**
   * Start the server
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
      console.log(`🔗 API Base URL: http://localhost:${this.port}/api`);
    });
  }
}

// Start the application
const app = new App();
app.start(); 