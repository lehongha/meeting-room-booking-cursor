# Meeting Room Booking System

Hệ thống đặt phòng họp hoàn chỉnh với React TypeScript frontend và Node.js TypeScript backend.

## 🚀 Tính năng

- ✅ **Chọn phòng**: 5 phòng họp có sẵn với thông tin chi tiết
- ✅ **Đặt lịch thông minh**: Validation thời gian và xung đột
- ✅ **Thu thập thông tin**: Tên và email người dùng
- ✅ **Ngăn chặn xung đột**: Tự động kiểm tra và báo lỗi
- ✅ **Quản lý đặt lịch**: Xem, lọc và xóa đặt lịch
- ✅ **Real-time updates**: Cập nhật tự động mỗi 5 giây
- ✅ **Responsive design**: Tương thích mobile và desktop
- ✅ **Type safety**: TypeScript toàn bộ hệ thống

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** với TypeScript
- **Vite** cho development và build
- **React Hook Form** cho form validation
- **React Hot Toast** cho notifications
- **Date-fns** cho xử lý thời gian

### Backend
- **Node.js** với TypeScript
- **Express.js** cho REST API
- **Repository Pattern** cho data access
- **Service Layer** cho business logic
- **CORS** và **Helmet** cho security

### Architecture
- **In-memory storage** (dễ dàng chuyển sang database)
- **Modular structure** với dependency injection
- **Shared types** giữa frontend và backend
- **Real-time polling** cho updates

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Bước 1: Clone và cài đặt
```bash
# Clone repository (nếu có)
git clone <repository-url>
cd meeting-room-booking

# Cài đặt tất cả dependencies
npm run install:all
```

### Bước 2: Chạy development servers
```bash
# Chạy cả frontend và backend
npm run dev
```

Hoặc chạy riêng lẻ:
```bash
# Backend only
npm run dev:backend

# Frontend only  
npm run dev:frontend
```

### Bước 3: Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🏗️ Cấu trúc dự án

```
meeting-room-booking/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── services/          # Business logic layer
│   │   ├── repositories/      # Data access layer
│   │   ├── routes/            # API route definitions
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React + TypeScript app
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── shared/                     # Shared types và utilities
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Utility functions
├── package.json                # Root workspace config
└── README.md
```

## 🔌 API Endpoints

### Rooms
- `GET /api/rooms` - Lấy danh sách tất cả phòng
- `GET /api/rooms/:id` - Lấy thông tin phòng theo ID
- `POST /api/rooms` - Tạo phòng mới

### Bookings
- `GET /api/bookings` - Lấy danh sách tất cả đặt lịch
- `GET /api/bookings/:id` - Lấy thông tin đặt lịch theo ID
- `GET /api/bookings/room/:roomId` - Lấy đặt lịch theo phòng
- `POST /api/bookings` - Tạo đặt lịch mới
- `DELETE /api/bookings/:id` - Xóa đặt lịch

### Health Check
- `GET /health` - Kiểm tra trạng thái server

## 🎯 Tính năng chi tiết

### 1. Quản lý phòng
- 5 phòng họp mẫu được tạo tự động
- Thông tin: tên, sức chứa, tầng
- Dễ dàng thêm phòng mới

### 2. Đặt lịch thông minh
- Validation thời gian (8:00 - 18:00)
- Kiểm tra xung đột tự động
- Time slots 30 phút và 1 giờ
- Validation email và thông tin người dùng

### 3. Giao diện người dùng
- Form đặt lịch với validation real-time
- Danh sách đặt lịch với filter
- Responsive design cho mobile
- Toast notifications cho feedback

### 4. Real-time updates
- Polling tự động mỗi 5 giây
- Cập nhật UI ngay lập tức khi có thay đổi
- Không cần refresh trang

## 🔧 Development

### Scripts có sẵn
```bash
# Development
npm run dev              # Chạy cả frontend và backend
npm run dev:frontend     # Chỉ chạy frontend
npm run dev:backend      # Chỉ chạy backend

# Build
npm run build            # Build cả frontend và backend
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Install
npm run install:all      # Cài đặt tất cả dependencies
```

### Environment Variables
```bash
# Backend
PORT=3001                # Port cho backend server
FRONTEND_URL=http://localhost:3000  # CORS origin

# Frontend  
VITE_API_URL=http://localhost:3001  # API base URL
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Serve dist/ folder với web server
```

## 🔮 Tính năng tương lai

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication và authorization
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Recurring bookings
- [ ] Room equipment management
- [ ] Advanced reporting
- [ ] Mobile app

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📝 License

MIT License - xem file LICENSE để biết thêm chi tiết. 