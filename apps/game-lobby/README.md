# Game Lobby Service

## 1. Tổng quan
Cổng điều hướng WebSocket (Gateway) chạy bằng Bun.js. Quản lý danh sách các phòng chờ và thực hiện Matchmaking động dựa trên truy vấn load balancing qua Redis.

## 2. Kiểu dữ liệu đặc thù
Không khai báo thêm, sử dụng chung từ `shared-types` (ví dụ `RoomMetadata`).

## 3. Tham số nghiệp vụ
- Khởi chạy ở cổng `8080`.
- Nhận diện `active_workers` từ Redis để phân bổ phòng cho worker rảnh rỗi nhất.

## 4. Hướng dẫn Kiểm thử cục bộ
```bash
bun run src/index.ts
```
Yêu cầu phải có Redis Server chạy nền.

## 5. Nhật ký thay đổi
- Chuyển đổi định tuyến tĩnh sang định tuyến động đa Node (Worker Self-Registration).
