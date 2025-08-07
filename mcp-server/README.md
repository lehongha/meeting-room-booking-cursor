# Meeting Room Booking MCP Server

MCP (Model Context Protocol) server cho hệ thống đặt phòng họp, cho phép tích hợp với các MCP client như Cursor hoặc Claude Desktop để tương tác với hệ thống đặt phòng thông qua chat với LLM.

## Tính năng

MCP server này cung cấp các function sau:

### 1. `get_rooms`
Lấy danh sách tất cả các phòng họp có sẵn.

**Parameters:** Không có

**Response:** Danh sách các phòng với thông tin ID, tên, sức chứa và tầng.

### 2. `get_bookings`
Lấy danh sách các booking với bộ lọc tùy chọn.

**Parameters:**
- `roomId` (optional): ID của phòng để lọc
- `date` (optional): Ngày để lọc (định dạng YYYY-MM-DD)

**Response:** Danh sách các booking với thông tin chi tiết.

### 3. `create_booking`
Tạo một booking mới.

**Parameters:**
- `roomId` (required): ID của phòng muốn đặt
- `userName` (required): Tên người đặt
- `userEmail` (required): Email người đặt
- `startTime` (required): Thời gian bắt đầu (định dạng ISO 8601)
- `endTime` (required): Thời gian kết thúc (định dạng ISO 8601)

**Response:** Thông tin booking đã tạo thành công.

### 4. `delete_booking`
Xóa một booking theo ID.

**Parameters:**
- `bookingId` (required): ID của booking cần xóa

**Response:** Thông báo xóa thành công.

### 5. `get_available_time_slots`
Lấy danh sách các khung giờ có sẵn cho một phòng vào ngày cụ thể.

**Parameters:**
- `roomId` (required): ID của phòng
- `date` (required): Ngày kiểm tra (định dạng YYYY-MM-DD)

**Response:** Danh sách các khung giờ có sẵn.

## Cài đặt

1. **Cài đặt dependencies:**
```bash
cd mcp-server
npm install
```

2. **Build project:**
```bash
npm run build
```

3. **Chạy server:**
```bash
npm start
```

Hoặc chạy trong development mode:
```bash
npm run dev
```

## Cấu hình

MCP server sẽ kết nối với API backend tại `http://localhost:3001` theo mặc định. Để thay đổi URL, bạn có thể:

1. Sửa đổi trong file `src/api-client.ts`
2. Hoặc thêm biến môi trường `API_BASE_URL`

## Tích hợp với MCP Clients

### Cursor

1. Mở Cursor
2. Vào Settings > Extensions > MCP
3. Thêm MCP server với cấu hình:
```json
{
  "name": "meeting-room-booking",
  "command": "node",
  "args": ["/path/to/mcp-server/dist/index.js"],
  "env": {}
}
```

### Claude Desktop

1. Mở Claude Desktop
2. Vào Settings > Tools
3. Thêm MCP server với cấu hình tương tự như trên

## Ví dụ sử dụng

Sau khi tích hợp, bạn có thể chat với LLM như sau:

```
User: "Hãy cho tôi xem danh sách các phòng họp có sẵn"
LLM: [Sử dụng get_rooms function] "Đây là danh sách các phòng họp có sẵn..."

User: "Tạo một booking cho phòng A1 vào ngày mai từ 9h đến 10h cho John Doe"
LLM: [Sử dụng create_booking function] "Đã tạo booking thành công..."

User: "Xem các booking hiện tại"
LLM: [Sử dụng get_bookings function] "Đây là danh sách các booking hiện tại..."
```

## Cấu trúc Project

```
mcp-server/
├── src/
│   ├── index.ts          # Entry point
│   ├── functions.ts      # MCP server implementation
│   ├── api-client.ts     # API client for backend
│   └── types.ts          # TypeScript type definitions
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Lỗi kết nối API
- Đảm bảo backend server đang chạy tại `http://localhost:3001`
- Kiểm tra network connectivity
- Xem logs để debug chi tiết

### Lỗi MCP Protocol
- Đảm bảo đã build project thành công
- Kiểm tra cấu hình MCP client
- Xem console logs để debug

## Development

Để phát triển thêm tính năng:

1. Thêm function mới trong `src/functions.ts`
2. Cập nhật types trong `src/types.ts` nếu cần
3. Thêm method tương ứng trong `src/api-client.ts`
4. Test với MCP client

## License

MIT License 