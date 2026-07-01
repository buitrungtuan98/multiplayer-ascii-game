# `@ascii-game/game-logic-uno`

## Tổng quan
Luật chơi bài UNO. Là Game có độ khó "Dễ" nhất trong lộ trình, chạy theo cơ chế Turn-based thay vì Real-time Lockstep (Tần số Tick = 0Hz).

## Kiểu dữ liệu đặc thù
- `UnoGameState`: Chứa bộ State Machine (Người chơi, bài trên tay, chồng bài bốc/bỏ).
- `UnoInput`: Các Payload mạng từ Client gửi lên (`ACT_DRAW`, `ACT_DISCARD`).

## Tham số nghiệp vụ
- Khởi tạo sử dụng thuật toán PRNG từ `core-math` (Shuffle bộ bài đảm bảo đồng thuận).
- Mọi logic phải tuân thủ chuẩn `IGameEngine`.
- Game theo lượt, không có tick interval.

## Hướng dẫn Kiểm thử cục bộ
- Tạo State giả định (Mock state), chèn các input array và gọi hàm `update` để quan sát state biến đổi. Trạng thái thuần túy không có side effect.

## Nhật ký thay đổi (Change Log)
- Khởi tạo khung state cho game UNO.
- Thực hiện shuffle bằng thẻ PRNG xác định.
