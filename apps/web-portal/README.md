# Web Portal Client

## 1. Tổng quan
Client ứng dụng chính xây dựng trên nền Next.js App Router. Phụ trách quản lý giao diện Lobby, khởi tạo kết nối WebSockets với các Worker Nodes, quản lý Jitter Buffer, và vẽ đồ họa game qua thẻ HTML5 Canvas (Foreground/Background).

## 2. Kiểu dữ liệu đặc thù
Không có kiểu mới, mọi dữ liệu nhận về được mapping chặt chẽ qua package `shared-types`.

## 3. Tham số nghiệp vụ
- Render Frame Rate: 60Hz.
- Jitter Buffer length: 3 ticks (Hấp thụ lag mạng).
- Checksum Rate: 150 ticks.

## 4. Hướng dẫn Kiểm thử cục bộ
Chạy ở cổng 3001 trong dev mode:
```bash
pnpm dev
```

## 5. Nhật ký thay đổi
- Chuyển JSON string payload sang `ArrayBuffer` sử dụng `BinaryEncoder`.
- Tích hợp logic Catch-up khi nhận cờ `DESYNC_DETECTED`.
