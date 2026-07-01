# StarCraft Game Worker

## 1. Tổng quan
Máy chủ xử lý game RTS StarCraft, chạy Lockstep Loop tần số 15Hz (khoảng 66.6ms một tick). Được dùng để nhận inputs, gom thành batch và phát tín hiệu cho các client.

## 2. Kiểu dữ liệu đặc thù
Mọi kiểu dữ liệu đều phụ thuộc từ `packages/shared-types`. Không định nghĩa kiểu dữ liệu độc lập.

## 3. Tham số nghiệp vụ (Business Parameters)
- Chạy trên Worker Port 8084.
- Tick rate 15Hz.

## 4. Hướng dẫn Kiểm thử cục bộ (Testing Guide)
Chạy server một cách độc lập:
```bash
cd apps/game-servers/game-rts-sc
bun run src/index.ts
```
*(Yêu cầu có sẵn Redis)*

## 5. Nhật ký thay đổi (Change Log)
- Bổ sung Worker mới (Worker 4) phục vụ xử lý Lockstep 15Hz cho StarCraft.
