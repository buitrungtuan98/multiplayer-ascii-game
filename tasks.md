## 🛠️ TASKLIST

### 1. Nhiệm vụ cốt lõi (Core Engines)
- [Done] Khởi tạo `packages/shared-types` (Định nghĩa Types/Interfaces: GameRoomConfig, PlayerMetadata, RoomMetadata, etc.)
- [Done] Khởi tạo `packages/game-configs` (Định nghĩa cấu hình game: GlobalGameRegistry, GameRegistryConfig)
- [Done] Khởi tạo `packages/core-math` (Fixed-Point Math, Zero-Allocation Vector2Pool, PRNG)
- [Done] Khởi tạo `packages/lockstep-engine` (Pure Functions cho Tick Loop và Snapshot)
- [Done] Khởi tạo `packages/ascii-renderer` (Canvas Sprite Caching Engine)
- [Done] Khởi tạo `packages/game-logic-uno` (Uno FSM và luật chơi)
- [Done] Khởi tạo `apps/game-servers/core-socket` (Lõi quản lý WebSocket Handshake)

### 2. Ứng dụng (Apps Integration)
- [Done] Khởi tạo Monorepo Next.js + CSS CRT (Trang Chủ & UI Prototype)
- [Done] Xây dựng `apps/game-lobby` (Bun.js WebSocket/HTTP Server)
- [Done] Tích hợp `apps/game-lobby` với `apps/web-portal` (Kết nối Data/API thực)
- [Done] Khởi tạo Worker `apps/game-servers/game-uno`

### 3. Tối ưu hóa & Hạ tầng (Infra & Optimization)
- [Done] Thiết lập kết nối Redis Engine (ioredis/native) cho Worker
