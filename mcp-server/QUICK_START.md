# MCP Server Quick Start Guide

Hướng dẫn nhanh để thiết lập và sử dụng MCP server cho hệ thống đặt phòng họp.

## 🚀 Setup nhanh

### 1. Cài đặt dependencies
```bash
cd mcp-server
npm install
```

### 2. Build project
```bash
npm run build
```

### 3. Test kết nối
```bash
npm test
```

### 4. Chạy server
```bash
npm start
```

## 🔧 Tích hợp với MCP Clients

### Cursor
1. Mở Cursor
2. Vào Settings > Extensions > MCP
3. Thêm server với cấu hình:
```json
{
  "name": "meeting-room-booking",
  "command": "node",
  "args": ["/path/to/meeting-room-booking/mcp-server/dist/index.js"]
}
```

### Claude Desktop
1. Mở Claude Desktop
2. Vào Settings > Tools
3. Thêm MCP server với cấu hình tương tự

## 💬 Ví dụ sử dụng

Sau khi tích hợp, bạn có thể chat với LLM:

```
User: "Cho tôi xem danh sách phòng họp"
LLM: [Sử dụng get_rooms] "Có 5 phòng họp: A1, A2, B1, B2, C1..."

User: "Tạo booking cho phòng A1 ngày mai 9h-10h cho John"
LLM: [Sử dụng create_booking] "Đã tạo booking thành công..."

User: "Xem các booking hiện tại"
LLM: [Sử dụng get_bookings] "Có 3 booking: ..."
```

## 🛠️ Troubleshooting

### Lỗi kết nối API
- Đảm bảo backend đang chạy: `cd backend && npm run dev`
- Kiểm tra URL: `http://localhost:3001`

### Lỗi MCP Protocol
- Kiểm tra đã build thành công: `npm run build`
- Xem logs để debug

## 📁 Files quan trọng

- `src/functions.ts` - MCP server implementation
- `src/api-client.ts` - API client cho backend
- `examples/` - Cấu hình mẫu cho clients
- `scripts/test-mcp.js` - Test script

## 🔗 Links

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Cursor MCP Guide](https://cursor.sh/docs/mcp)
- [Claude Desktop MCP](https://docs.anthropic.com/claude/docs/model-context-protocol-mcp) 