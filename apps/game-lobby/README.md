# `game-lobby`

## Tổng quan
Cổng điều hướng WebSocket và HTTP API cho Sảnh chờ (Lobby).
Nhiệm vụ chính:
- Nhận lệnh tạo phòng từ Client, ghi thông tin vào Redis.
- Lắng nghe sự thay đổi phòng (Lobby Updates) qua Redis Pub/Sub và broadcast qua WebSocket về Client đang duyệt danh sách phòng.

## Tham số nghiệp vụ
Chạy cổng mặc định 8080 (hoặc qua `process.env.PORT`).

## Cấu trúc Log
Tuân thủ rule JSON stdout logging.
