# Home Page SSG

## 1. Tổng quan
Ứng dụng xây dựng bằng Next.js sử dụng kiến trúc Static Site Generation (SSG). Chịu trách nhiệm render các trang Landing Page, giới thiệu và điều hướng (Discovery) cho các game với phong cách ASCII UI. Không chứa logic game phức tạp.

## 2. Kiểu dữ liệu đặc thù
Không có.

## 3. Tham số nghiệp vụ
- Tốc độ tải trang mục tiêu TTFB < 50ms.
- Hoàn thiện 100/100 Core Web Vitals.

## 4. Hướng dẫn Kiểm thử cục bộ
```bash
pnpm dev
```

## 5. Nhật ký thay đổi
- Sửa lỗi định tuyến cứng localhost sang URL tương đối để hoạt động với Nginx Gateway.
