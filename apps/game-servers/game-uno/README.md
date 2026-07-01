# `game-server-uno`

## Tổng quan
Server Worker chạy chuyên biệt cho game UNO. Kết hợp thư viện `core-socket` (Lifecycle) và `game-logic-uno` (Game Engine) để nhận/gửi State qua WebSocket cho người chơi.

## Kiểu dữ liệu đặc thù
Không, dùng lại từ `shared-types`.

## Tham số nghiệp vụ
- Khởi động mặc định ở port cấu hình qua `WORKER_PORT`.

## Hướng dẫn Kiểm thử cục bộ
Chạy `bun dev` và kết nối WebSocket vào `WORKER_PORT`.

## Nhật ký thay đổi
- Khởi tạo worker cơ sở cho Uno.
