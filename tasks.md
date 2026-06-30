## 🛠️ TASKLIST

### 1. Nhiệm vụ cốt lõi (Core Engines)
- [Done] Khởi tạo `packages/shared-types` (Định nghĩa Types/Interfaces: GameRoomConfig, PlayerMetadata, RoomMetadata, etc.)
- [Done] Khởi tạo `packages/game-configs` (Định nghĩa cấu hình game: GlobalGameRegistry, GameRegistryConfig)

### 2. Ứng dụng (Apps Integration)
- [Done] Khởi tạo Monorepo Next.js + CSS CRT (Trang Chủ & UI Prototype)
- [Done] Xây dựng `apps/game-lobby` (Bun.js WebSocket/HTTP Server)
- [Done] Tích hợp `apps/game-lobby` với `apps/web-portal` (Kết nối Data/API thực)

### 3. Tối ưu hóa & Hạ tầng (Infra & Optimization)
- [Done] Thiết lập kết nối Redis Engine (ioredis/native) cho Worker
