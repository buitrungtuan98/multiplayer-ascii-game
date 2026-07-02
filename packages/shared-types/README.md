# Shared Types (Single Source of Truth)

## 1. Tổng quan
Đóng vai trò là Nguồn Chân Lý Duy Nhất (Single Source of Truth) cho toàn bộ cấu trúc dữ liệu, các Interface trao đổi mạng và State Schema của tất cả trò chơi trong vũ trụ ASCII.

## 2. Kiểu dữ liệu đặc thù
Tất cả các Types của hệ thống: `RoomMetadata`, `IGameEngine`, `ScGameState`, `AoeGameState`, `ZombieGameState`, `MoveCommandPayload`, `ChecksumPayload`, `CatchupPayload`.

## 3. Tham số nghiệp vụ
- Khống chế không dùng Float trong mọi state định nghĩa ở đây.

## 4. Hướng dẫn Kiểm thử cục bộ
Chỉ xuất các interface, không chứa logic, nên test bằng cách kiểm tra type check:
```bash
pnpm tsc --noEmit
```

## 5. Nhật ký thay đổi
- Thêm `ChecksumPayload` và `DesyncWarningPayload` cho cơ chế đồng thuận Desync.
- Bổ sung `CatchupPayload` và `REQ_RECONNECT` cho Reconnect Protocol.
