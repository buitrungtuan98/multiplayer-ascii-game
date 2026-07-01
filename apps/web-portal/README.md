# `web-portal`

## Tổng quan
Ứng dụng Web Portal (Next.js) quản lý UI phức tạp: Lobby, Room Browser, và trang vào trận. Cung cấp bộ Container tích hợp Engine Game lên Browser qua HTML5 Canvas.

## Kiểu dữ liệu đặc thù
- Kế thừa types mạng từ `shared-types`. Không định nghĩa riêng.

## Tham số nghiệp vụ
- Khởi tạo kết nối qua cổng API `8080` tới `game-lobby` và `8081+` cho các worker.

## Hướng dẫn Kiểm thử cục bộ
Chạy lệnh `pnpm dev --port 3001` và mock WebSocket test nếu cần.

## Nhật ký thay đổi
- Chỉnh sửa tích hợp trang Lobby.
- Tích hợp HTML5 Canvas Render UNO game.
