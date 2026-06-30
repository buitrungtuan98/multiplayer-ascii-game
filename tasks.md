# 🛠️ TASKLIST: ASCII MULTIPLAYER GAME UNIVERSE

## Trạng Thái
- `[To-Do]` : Chưa làm
- `[In-Progress]` : Đang thực hiện
- `[Done]` : Đã hoàn thành và test
- `[Blocked]` : Đang bị nghẽn (có lý do cụ thể)

---

## 1. Core Engines (Packages)
- `[Done]` Thiết lập khung cấu trúc Monorepo và Pnpm workspace.
- `[To-Do]` Thiết lập Typescript & ESLint configs (Với rules cấm Float, Math.random).
- `[To-Do]` **`packages/shared-types`**: Khai báo IGameEngine, Payload mạng, và Models (Zero-Compression).
- `[To-Do]` **`packages/game-configs`**: Tạo GlobalGameRegistry cho Uno, Zombie, AoE.
- `[To-Do]` **`packages/core-math`**: Tự viết Fixed-Point Math (Vector2, Lerp, Distance).
- `[To-Do]` **`packages/core-math`**: Viết Deterministic PRNG Generator.
- `[To-Do]` **`packages/lockstep-engine`**: Khung Loop cho Server & Client.
- `[To-Do]` **`packages/ascii-renderer`**: Xây dựng Canvas engine hiển thị font Terminal.
- `[To-Do]` **`packages/ui-ascii`**: Khởi tạo Component React UI (Button, Box, Input) với viền ASCII.
- `[To-Do]` **`packages/game-logic-uno`**: Tạo logic Turn-based cho bài Uno.
- `[To-Do]` **`packages/game-logic-zombie`**: Tạo logic tick 30Hz, Flow Field Pathfinding.
- `[To-Do]` **`packages/game-logic-aoe`**: Tạo logic RTS cơ bản (Tick 15Hz).

## 2. Ứng dụng (Apps Integration)
- `[To-Do]` **`apps/home-page`**: Xây dựng Landing page Next.js chuẩn SEO.
- `[To-Do]` **`apps/web-portal`**: Làm trang Lobby UI, hiển thị phòng, ghép phòng (Matchmaking UI).
- `[To-Do]` **`apps/web-portal`**: Tích hợp Canvas renderer và game lockstep client.
- `[To-Do]` **`apps/game-lobby`**: Tạo Bun.js WebSocket Gateway server (quản lý Node và trạng thái).
- `[To-Do]` **`apps/game-servers/core-socket`**: Thư viện socket Worker cho Bun.
- `[To-Do]` **`apps/game-servers/game-uno`**: Tích hợp Worker Uno.
- `[To-Do]` **`apps/game-servers/game-rts-aoe`**: Tích hợp Worker AoE.

## 3. Tối ưu hóa & Hạ tầng (Infra & Optimization)
- `[To-Do]` **Docker Setup**: Cấu hình `docker-compose.yml` với Cloudflare Tunnel.
- `[To-Do]` **Docker CPU Pinning**: Cấu hình `cpuset` chuẩn 4 cores.
- `[To-Do]` **Nginx Config**: Thiết lập Reverse proxy, định tuyến WebSocket `ws-connect`.
- `[To-Do]` **Redis Engine**: Thiết lập Redis In-Memory mode (`--save "" --appendonly no`).
- `[To-Do]` **Scripts**: Tạo file khởi động shell, biến môi trường.
- `[To-Do]` **Performance**: Áp dụng Object Pooling (Zero-allocation) cho Game loop.
- `[To-Do]` **Binary Protocol**: (Tương lai) Dịch Payload sang Uint8Array.
- `[To-Do]` **Jitter Buffer & Catch-up**: Tích hợp trên Client & Server logic.
