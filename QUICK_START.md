# 🚀 Hướng dẫn nhanh

## Cài đặt và chạy dự án trong 3 bước

### 1. Cài đặt dependencies
```bash
npm run install:all
```

### 2. Chạy development servers
```bash
npm run dev
```

### 3. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎯 Tính năng chính

### Đặt lịch phòng họp
- Chọn từ 5 phòng họp có sẵn
- Đặt lịch trong giờ làm việc (8:00 - 18:00)
- Validation thời gian và xung đột tự động
- Thu thập thông tin người dùng (tên, email)

### Quản lý đặt lịch
- Xem danh sách tất cả đặt lịch
- Lọc theo phòng và ngày
- Xóa đặt lịch không cần thiết
- Cập nhật real-time mỗi 5 giây

### Giao diện thân thiện
- Responsive design cho mobile và desktop
- Form validation real-time
- Toast notifications cho feedback
- Giao diện tiếng Việt

## 🔧 Troubleshooting

### Lỗi "Port already in use"
```bash
# Tìm và kill process đang sử dụng port
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Lỗi "Module not found"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
npm run install:all
```

### Lỗi "Cannot connect to API"
- Kiểm tra backend có đang chạy tại http://localhost:3001
- Kiểm tra console browser để xem lỗi CORS
- Đảm bảo proxy trong vite.config.ts đúng

## 📱 Test trên mobile

1. Tìm IP của máy tính:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

2. Truy cập từ mobile:
- Frontend: `http://[YOUR_IP]:3000`
- Backend: `http://[YOUR_IP]:3001`

## 🧪 Test API

### Health check
```bash
curl http://localhost:3001/health
```

### Lấy danh sách phòng
```bash
curl http://localhost:3001/api/rooms
```

### Lấy danh sách đặt lịch
```bash
curl http://localhost:3001/api/bookings
```

## 📊 Sample data

Dự án đã được seed với:
- 5 phòng họp mẫu
- 2 đặt lịch mẫu cho ngày mai

## 🆘 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra console browser và terminal
2. Đảm bảo Node.js version 16+
3. Thử restart development servers
4. Xem file README.md để biết thêm chi tiết 