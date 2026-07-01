# StarCraft ASCII Logic

## 1. Tổng quan
Thư viện quản lý vòng lặp lockstep (15Hz) và engine logic cho game StarCraft. Hỗ trợ hệ thống va chạm cơ bản, cơ chế flocking cho đơn vị lính bay (Mutalisk) và lính mặt đất (Marine), cùng với tính toán khoảng cách nội suy 3D (Z-axis).

## 2. Kiểu dữ liệu đặc thù
Không có kiểu dữ liệu đặc thù nào nằm ngoài `shared-types`. Toàn bộ kiểu dữ liệu được định nghĩa trong `packages/shared-types/src/starcraft.ts`.

## 3. Tham số nghiệp vụ (Business Parameters)
Cấu hình máu (HP), tốc độ (Speed) và sát thương (Damage) được định nghĩa tại `packages/game-configs/src/index.ts` dưới trường `starcraft-1`.
- Marine: Tốc độ 1000, bay=false.
- Mutalisk: Tốc độ 2500, bay=true, Z-axis shadow offset.

## 4. Hướng dẫn Kiểm thử cục bộ (Testing Guide)
Để test riêng rẽ module logic này (unit test):
```bash
cd packages/game-logic-starcraft
bun test
```
*(Hiện tại unit tests chưa được thiết lập tự động)*

## 5. Nhật ký thay đổi (Change Log)
- Khởi tạo thư viện logic cơ bản cho StarCraft với cơ chế bay (Z-axis) và Vector2Pool.
