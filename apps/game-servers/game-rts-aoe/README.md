# `game-server-rts-aoe`

## Tổng quan
Worker điều phối Game RTS Age of Empires 1. Chạy vòng lặp Lockstep 15Hz.

## Tham số nghiệp vụ
- Khởi chạy ở cổng `8083`.
- Tick Rate: `66.6ms` (15Hz).

## Nhật ký thay đổi
- Khởi tạo Worker và tích hợp `Unified Tick Loop` 15Hz.
