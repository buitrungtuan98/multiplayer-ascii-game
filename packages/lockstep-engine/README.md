# `@ascii-game/lockstep-engine`

## Tổng quan
Cung cấp khung trừu tượng (Abstract Framework) để xử lý Lockstep Loop. Không chứa vòng lặp thời gian thực `setInterval` mà chỉ chứa Pure Functions, Hash Functions, và Jitter Buffer hỗ trợ Client nội suy.

## Kiểu dữ liệu đặc thù
- `Checksum`: Thuật toán FNV-1a phát hiện Desync thông qua ArrayBuffer.
- `JitterBuffer`: Hàng đợi trạng thái dùng để nội suy (Lerp) chống giật cục ở phía Client.

## Tham số nghiệp vụ
- TickContext phụ thuộc vào config của từng game (15Hz hay 30Hz).

## Hướng dẫn Kiểm thử cục bộ
Chạy `bun test` trong thư mục này (nếu có test files). Các module đều là pure function, dễ dàng mock input state.

## Nhật ký thay đổi (Change Log)
- Khởi tạo khung `Checksum` bằng FNV-1a.
- Khởi tạo khung `JitterBuffer`.
