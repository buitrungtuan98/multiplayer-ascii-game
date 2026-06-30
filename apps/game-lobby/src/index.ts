import { serve } from "bun";
import Redis from "ioredis";
import { CreateRoomPayload, RoomMetadata, RoomVisibility } from "@ascii-game/shared-types";
import { GlobalGameRegistry } from "@ascii-game/game-configs";
import { randomBytes } from "crypto";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const PORT = process.env.PORT || 8080;

const redis = new Redis(REDIS_URL);
const pubClient = new Redis(REDIS_URL);
const subClient = new Redis(REDIS_URL);

// Danh sách các socket đang kết nối vào sảnh lobby (để broadcast danh sách phòng)
const connectedSockets = new Set<any>();

function generateRoomCode() {
  return randomBytes(3).toString("hex").toUpperCase().substring(0, 5);
}

subClient.subscribe("lobby_updates", (err, count) => {
  if (err) console.error("Failed to subscribe to lobby_updates:", err);
});

subClient.on("message", (channel, message) => {
  if (channel === "lobby_updates") {
    const payload = JSON.stringify({ type: "ROOMS_UPDATED" });
    for (const ws of connectedSockets) {
      ws.send(payload);
    }
  }
});

async function getPublicRooms(gameId: string) {
  const keys = await redis.keys("room:*:metadata");
  const rooms: RoomMetadata[] = [];
  for (const key of keys) {
    const data = await redis.hgetall(key);
    if (data && data.visibility === "PUBLIC" && data.gameId === gameId && data.status === "WAITING") {
      rooms.push({
        id: data.id,
        gameId: data.gameId,
        host: data.host,
        hostName: data.hostName,
        visibility: data.visibility as RoomVisibility,
        players: parseInt(data.players || "0", 10),
        maxPlayers: parseInt(data.maxPlayers || "0", 10),
        status: data.status as RoomMetadata["status"],
        workerPort: parseInt(data.workerPort || "0", 10),
      });
    }
  }
  return rooms;
}

const server = serve({
  port: PORT,
  fetch(req, server) {
    const url = new URL(req.url);

    // Xử lý CORS cho API
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // WebSocket cho Lobby (cập nhật danh sách phòng)
    if (url.pathname === "/ws-lobby") {
      const gameId = url.searchParams.get("gameId");
      const upgraded = server.upgrade(req, {
        data: { gameId },
      });
      if (!upgraded) {
        return new Response("Upgrade failed", { status: 400 });
      }
      return;
    }

    // API: Lấy danh sách phòng công khai
    if (url.pathname === "/api/rooms" && req.method === "GET") {
      const gameId = url.searchParams.get("gameId");
      if (!gameId) {
        return new Response("Missing gameId", { status: 400, headers: corsHeaders });
      }
      return getPublicRooms(gameId).then(rooms => {
        return new Response(JSON.stringify(rooms), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      });
    }

    // API: Tạo phòng mới
    if (url.pathname === "/api/create-room" && req.method === "POST") {
      return req.json().then(async (payload: CreateRoomPayload) => {
        const gameConfig = GlobalGameRegistry[payload.gameId];
        if (!gameConfig) {
          return new Response("Invalid gameId", { status: 400, headers: corsHeaders });
        }

        const roomCode = generateRoomCode();
        // Cập nhật hard-coded port cho mock testing (theo cấu trúc docker thì worker 1 là 8081)
        const workerPort = 8081;

        // Sinh playerId ngẫu nhiên cho Host
        const hostId = "p_" + randomBytes(4).toString("hex");

        const roomData = {
          id: roomCode,
          gameId: payload.gameId,
          host: hostId,
          hostName: payload.hostName,
          visibility: payload.visibility,
          players: "1",
          maxPlayers: gameConfig.maxPlayers.toString(),
          status: "WAITING",
          workerPort: workerPort.toString(),
        };

        await redis.hset(`room:${roomCode}:metadata`, roomData);

        // Broadcast thông báo cập nhật lobby
        await pubClient.publish("lobby_updates", "update");

        return new Response(JSON.stringify({ roomId: roomCode, workerPort, hostId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }).catch(err => {
         console.error(err);
         return new Response("Invalid payload", { status: 400, headers: corsHeaders });
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
  websocket: {
    open(ws) {
      connectedSockets.add(ws);
      // Gửi danh sách phòng ban đầu khi vừa kết nối
      const data = ws.data as { gameId: string };
      getPublicRooms(data.gameId).then(rooms => {
        ws.send(JSON.stringify({ type: "INITIAL_ROOMS", rooms }));
      });
    },
    message(ws, message) {
      // Lobby hiện tại không cần xử lý message từ client
    },
    close(ws) {
      connectedSockets.delete(ws);
    },
  },
});

console.log(`JSON Log: {"timestamp": "${new Date().toISOString()}", "service": "game-lobby", "level": "INFO", "message": "Server started on port ${PORT}"}`);
