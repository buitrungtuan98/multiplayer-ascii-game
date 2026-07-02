# Core Math Logic

## 1. Tổng quan
Thư viện toán học dùng chung cho toàn bộ "ASCII MULTIPLAYER GAME UNIVERSE". Nó cung cấp các tính năng toán học số nguyên cố định (Fixed-Point Math) để tránh Desync, thuật toán PRNG tất định, bộ nội suy đồ họa Isometric, thuật toán băm FNV-1a và mã hóa giao thức Binary Protocol.

## 2. Kiểu dữ liệu đặc thù
Không có interface chuyên biệt nào. Các Class xuất ra dưới dạng Static Utils.

## 3. Tham số nghiệp vụ
- Kích thước binary encode: 12 bytes/packet.
- `FNV_PRIME` = 16777619
- `OFFSET_BASIS` = 2166136261

## 4. Hướng dẫn Kiểm thử cục bộ
Chạy lệnh kiểm thử đơn vị:
```bash
bun test
```

## 5. Nhật ký thay đổi
- Triển khai `FNV1a` để tính toán state hash.
- Bổ sung `BinaryEncoder` để giảm băng thông lệnh MOVE xuống còn 12 Bytes.
