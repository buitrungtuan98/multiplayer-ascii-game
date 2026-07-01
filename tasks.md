## 🛠️ TASKLIST

### 1. Nhiệm vụ cốt lõi (Core Engines)
- [Done] Khởi tạo `packages/shared-types` (Types: GameRoomConfig, PlayerMetadata, RoomMetadata, etc.)
- [Done] Khởi tạo `packages/game-configs` (Cấu hình: GlobalGameRegistry, GameRegistryConfig)
- [Done] Khởi tạo `packages/core-math` (Fixed-Point Math, Zero-Allocation Vector2Pool, PRNG)
- [Done] Khởi tạo `packages/lockstep-engine` (Pure Functions Tick Loop, Checksum)
- [Done] Khởi tạo `packages/ascii-renderer` (Canvas Sprite Caching Engine)
- [Done] Khởi tạo `packages/game-logic-uno` (Uno FSM và luật chơi)
- [Done] Khởi tạo `apps/game-servers/core-socket` (Lõi quản lý WebSocket Handshake)
- [Done] Bổ sung `core-math` (Flow Field Pathfinding, Lerp Fixed-Point)
- [Done] Khởi tạo `packages/game-logic-zombie` (Zombie Logic & State)
- [Done] Bổ sung `core-math` (Isometric Math)
- [Done] Nâng cấp `ascii-renderer` (Background Layer, Bounding Box)
- [Done] Xây dựng `packages/game-logic-aoe` (Lockstep 15Hz)

### 2. Ứng dụng (Apps Integration)
- [Done] Khởi tạo Monorepo Next.js + CSS CRT (Trang Chủ & UI Prototype)
- [Done] Xây dựng `apps/game-lobby` (Bun.js WebSocket/HTTP Server)
- [Done] Tích hợp `apps/game-lobby` với `apps/web-portal` (Kết nối Data/API thực)
- [Done] Khởi tạo Worker `apps/game-servers/game-uno`
- [Done] Xây dựng màn hình Canvas Frontend (Game UNO Client)
- [Done] Khởi tạo Worker `apps/game-servers/game-zombie` (30Hz Lockstep)
- [Done] Tích hợp Client Render Game Zombie (60FPS Interpolation & Flow Field Animation)
- [Done] Khởi tạo Worker `apps/game-servers/game-rts-aoe` (15Hz Lockstep)
- [Done] Tích hợp Client Render Game AoE (Isometric 2.5D, Chuột)

### 3. Tối ưu hóa & Hạ tầng (Infra & Optimization)
- [Done] Thiết lập kết nối Redis Engine (ioredis/native) cho Worker
