# `@ascii-game/game-logic-aoe`

## Tổng quan
Game RTS Age of Empires 1. Chạy Lockstep Rate 15Hz (66.6ms). Hỗ trợ logic khai thác tài nguyên và di chuyển Isometric.

## Kiểu dữ liệu đặc thù
- `AoeGameState`, `AoeEntity`
- `AoeInput`: Phân biệt `MOVE_ENTITY` và `ATTACK_ENTITY`.

## Tham số nghiệp vụ
- Tick Rate: 15Hz.
- PRNG khởi tạo vị trí cây cối.

## Nhật ký thay đổi
- Xây dựng AoeGameEngine và Logic Physics Fixed-Point.
