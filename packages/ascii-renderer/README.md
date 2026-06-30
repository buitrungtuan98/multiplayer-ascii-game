# `@ascii-game/ascii-renderer`

## Tổng quan
Engine kết xuất đồ họa HTML5 Canvas 2D được sinh ra để triệt tiêu việc tạo các thẻ DOM. Áp dụng kỹ thuật Sprite Caching (OffscreenCanvas) để đạt tốc độ vẽ 60FPS cho hàng ngàn ký tự.

## Kiểu dữ liệu đặc thù
- `AsciiSpriteCache`: Bộ nhớ đệm chứa các thẻ canvas nháp.
- `AsciiRenderer`: Trình quản lý vẽ ảnh tĩnh (GPU-accelerated) và nội suy tọa độ.

## Tham số nghiệp vụ
- Kích thước ký tự và màu sắc có thể tùy biến nhưng mặc định `JetBrains Mono` là chuẩn render.

## Hướng dẫn Kiểm thử cục bộ
Cần môi trường trình duyệt (Browser environment) để gọi API Canvas.

## Nhật ký thay đổi (Change Log)
- Tích hợp Offscreen rendering canvas (preRender).
- Cài đặt `drawSprite` dùng `drawImage` để đẩy thẳng lên Canvas chính.
