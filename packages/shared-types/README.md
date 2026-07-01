# `@ascii-game/shared-types`

## Tổng quan
Single Source of Truth (Nguồn chân lý duy nhất) cho toàn bộ Interface, Type và Dữ liệu truyền tải mạng trong dự án ASCII Multiplayer Game Universe.

## Kiểu dữ liệu đặc thù
- `RoomMetadata`: Chứa thông tin phòng ở sảnh chờ, bao gồm `workerPort` phục vụ định tuyến động.
- `IGameEngine`: Interface bắt buộc đối với mọi loại game để tương thích với hệ thống Worker Lockstep.

## Tham số nghiệp vụ
Không có cấu hình trực tiếp ở đây, các config chuyển sang `game-configs`.

## Hướng dẫn Kiểm thử cục bộ
Package này chỉ chứa TypeScript Interface, không cần Unit Test.
