# ASCII MULTIPLAYER GAME UNIVERSE

Welcome to the ASCII Multiplayer Game Universe! This project implements a Zero-Cost, Zero-Database, stateless edge-to-core architecture for supporting massive numbers of concurrent users (CCU) across multiple game types (RTS, Action, Turn-based) using pure ASCII graphics rendered via HTML5 Canvas.

## 🛠️ TASKLIST

### Nhiệm vụ cốt lõi (Core Engines)
- [x] **[Done]** Lockstep Engine (15Hz/30Hz) - `packages/lockstep-engine`
- [x] **[Done]** Fixed-Point Math & Deterministic PRNG - `packages/core-math`
- [x] **[Done]** Game Logic: Uno (Turn-based)
- [x] **[Done]** Game Logic: Zombie Invasion (Flow Field Pathfinding)
- [x] **[Done]** Game Logic: Age of Empires (Isometric 2.5D)
- [x] **[Done]** Game Logic: StarCraft (Z-axis, Flocking)
- [x] **[Done]** Giao thức mạng nhị phân (Binary Protocol - 12 bytes/lệnh)
- [x] **[Done]** Thuật toán Hash FNV-1a & Active Desync Consensus

### Ứng dụng (Apps Integration)
- [x] **[Done]** Game Servers (Worker 1 -> Worker 4) chạy Bun.js
- [x] **[Done]** Next.js Web Portal (SSG, Lobby UI, ASCII Art UI)
- [x] **[Done]** HTML5 Canvas ASCII Renderer (Foreground/Background Layering)
- [x] **[Done]** Client-side Interpolation (Lerp) & Jitter Buffer 60FPS
- [x] **[Done]** Game Lobby API (Smart Matchmaking via Redis)

### Tối ưu hóa & Hạ tầng (Infra & Optimization)
- [x] **[Done]** Docker Compose CPU Pinning & Zero-Disk Redis Setup
- [x] **[Done]** Cloudflare Tunnels Routing & Nginx Gateway
- [x] **[Done]** Stateless Prometheus Telemetry & System Monitoring
- [x] **[Done]** State Snapshot Catch-up & Reconnect Protocol
- [x] **[Done]** Server-side Rate Limiting & Anti-Cheat
- [x] **[Done]** CI/CD Pipeline Setup (GitHub Actions)

*Thực hiện tuân thủ 100% Hiến pháp Bảo trì Tài liệu & Nguyên tắc Code Chuẩn hóa (Mục 12).*
