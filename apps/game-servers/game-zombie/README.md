# `game-server-zombie`

## Tổng quan
Game Worker thực thụ đầu tiên sử dụng kiến trúc Real-time Lockstep (30Hz). Có vòng lặp thời gian thực `setInterval` chuyên biệt.

## Tham số nghiệp vụ
- Khởi chạy ở cổng `8082`.
- Tick Rate: `33.3ms`.

## Nhật ký thay đổi
- Khởi tạo Worker và tích hợp `Unified Tick Loop`.
- Gom nhóm `Input Aggregation`.
