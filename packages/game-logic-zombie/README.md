# `@ascii-game/game-logic-zombie`

## Tổng quan
Game Action Co-op chạy ở tốc độ 30Hz Lockstep. Tối ưu hóa cực điểm thông qua Flow Field Pathfinding để gánh 10,000 thực thể trên một CPU Thread duy nhất.

## Kiểu dữ liệu đặc thù
Sử dụng `ZombieGameState` làm State cốt lõi. Gói Input bao gồm lệnh di chuyển và tấn công thời gian thực.

## Tham số nghiệp vụ
- Tốc độ Tick: 30Hz (Mỗi chu kỳ 33.3ms).
- Max Zombie mặc định (có thể bị overriden bởi game-configs).

## Hướng dẫn Kiểm thử cục bộ
Khởi tạo instance `ZombieGameEngine` bằng jest/bun test, cung cấp `currentTick` tuần tự và theo dõi FPS.

## Nhật ký thay đổi
- Tích hợp thành công cấu trúc `FlowField` O(1).
