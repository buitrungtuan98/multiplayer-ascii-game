# `@ascii-game/core-math`

## Tổng quan
Thư viện toán học nền tảng cho Game Logic. Tuân thủ tuyệt đối "No Float Policy" (Cấm số thực) và "Zero-Allocation Policy" (Tái sử dụng object bằng Pool).

## Kiểu dữ liệu đặc thù
- `FixedPoint`: Hàm tiện ích tính toán định phẩy, phân giải tiêu chuẩn `FP_MULTIPLIER = 1000`.
- `PRNG`: Lớp sinh số ngẫu nhiên xác định (Park-Miller), đảm bảo Sync tuyệt đối.
- `Vector2Pool`: Hàng đợi vector2 đệm để triệt tiêu Garbage Collection (GC).

## Tham số nghiệp vụ
- Độ phân giải mặc định: 3 chữ số thập phân (Multiplier = 1000). Số sinh ngẫu nhiên max modulo 2147483647.

## Hướng dẫn Kiểm thử cục bộ
Dành riêng cho test logic nội bộ không phụ thuộc Server/Client. Có thể test độ chính xác PRNG và Vector pool qua Node/Bun.

## Nhật ký thay đổi (Change Log)
- Áp dụng `FP_MULTIPLIER = 1000`.
- Triển khai PRNG dựa trên thuật toán Park-Miller và rangeFixed.
