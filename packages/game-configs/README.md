# `@ascii-game/game-configs`

## Tổng quan
Hệ thống Cấu hình Động Tập Trung. Lưu trữ config của toàn bộ các game trong vũ trụ ASCII (Uno, Zombie, AoE).

## Kiểu dữ liệu đặc thù
- `GameRegistryConfig`: Cấu trúc config động quy định tên game, chế độ tick, số người tối đa, và hệ số cân bằng (balanceSheet).

## Tham số nghiệp vụ
Được định nghĩa cứng tại object `GlobalGameRegistry`.
Lưu ý: Không hard-code các thông số game vào logic mà phải đọc từ thư viện này ra.

## Hướng dẫn Kiểm thử cục bộ
Chỉ chứa constants và types.
