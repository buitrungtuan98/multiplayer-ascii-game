import { serve } from "bun";
import { CoreSocketManager, SocketData } from "@ascii-game/core-socket";
import { AoeGameEngine, AoeGameState, AoeInput } from "@ascii-game/game-logic-aoe";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const PORT = process.env.WORKER_PORT || 8083; // 8083 for AoE

const socketManager = new CoreSocketManager(REDIS_URL);
const engine = new AoeGameEngine();

const activeRooms: Map<string, { state: AoeGameState, inputs: AoeInput[], tick: number }> = new Map();

// Tốc độ 15Hz chuẩn game cổ điển
const TICK_RATE_MS = 66.6;

setInterval(() => {
  for (const [roomId, roomData] of activeRooms.entries()) {
     if (roomData.state.status === 'PLAYING') {
        roomData.state = engine.update(roomData.state, roomData.inputs, roomData.tick);
        roomData.tick++;

        roomData.inputs = [];

        socketManager.broadcastToRoom(roomId, JSON.stringify({ type: 'STATE_SYNC', tick: roomData.tick, state: roomData.state }));

        if (roomData.tick % 15 === 0) { // Lưu state mỗi 1s
           socketManager.pushStateToRedis(roomId, roomData.state).catch(e => console.error(e));
        }
     }
  }
}, TICK_RATE_MS);

serve<SocketData>({
  port: PORT,
  fetch(req, server) {
      if (req.url.endsWith("/metrics")) {
        return new Response(PrometheusExporter.getMetrics(), {
          headers: { "Content-Type": "text/plain" },
        });
      }
    const url = new URL(req.url);
    if (url.pathname.startsWith("/ws-connect")) {
      const roomId = url.searchParams.get("room");
      const playerId = url.searchParams.get("player");
      if (!roomId || !playerId) return new Response("Missing params", { status: 400 });

      const upgraded = server.upgrade(req, { data: { roomId, playerId } });
      if (upgraded) return undefined;
      return new Response("Upgrade failed", { status: 400 });
    }
    return new Response("Game Worker AoE Active");
  },
  websocket: {
    open(ws) {
          PrometheusExporter.metrics.game_connected_players++;
      socketManager.handleJoin(ws);
      const { roomId, playerId } = ws.data;

      let roomData = activeRooms.get(roomId);
      if (!roomData) {
         roomData = { state: engine.initialize({ roomId, gameId: 'aoe-1', maxPlayers: 8, seed: 9999 }), inputs: [], tick: 0 };
         activeRooms.set(roomId, roomData);
      }

      roomData.inputs.push({ type: 'JOIN', playerId });
    },
    message(ws, message) {
      const { roomId, playerId } = ws.data;
      try {
        const input = JSON.parse(message as string) as AoeInput;
        input.playerId = playerId;

        const roomData = activeRooms.get(roomId);
        if (roomData) {
           if (engine.validateInput({ playerId, username: '' }, input, roomData.state)) {
              roomData.inputs.push(input);
           }
        }
      } catch (e) {}
    },
    close(ws) {
          PrometheusExporter.metrics.game_connected_players--;
      socketManager.handleLeave(ws);
    }
  }
});

console.log(`JSON Log: {"timestamp": "${new Date().toISOString()}", "service": "game-aoe", "level": "INFO", "message": "AoE Worker started on port ${PORT}"}`);
