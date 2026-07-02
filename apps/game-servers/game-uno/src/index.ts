import { serve } from "bun";
import { CoreSocketManager, SocketData } from "@ascii-game/core-socket";
import { UnoGameEngine, UnoGameState, UnoInput } from "@ascii-game/game-logic-uno";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const PORT = process.env.WORKER_PORT || 8081;

const socketManager = new CoreSocketManager(REDIS_URL);
const engine = new UnoGameEngine();

// In-memory state cache for active rooms
const activeRooms: Map<string, UnoGameState> = new Map();

const server = serve<SocketData>({
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

      if (!roomId || !playerId) {
        return new Response("Missing parameters", { status: 400 });
      }

      const upgraded = server.upgrade(req, {
        data: { roomId, playerId },
      });
      if (upgraded) return undefined;
      return new Response("Upgrade failed", { status: 400 });
    }
    return new Response("Game Worker Uno Active");
  },
  websocket: {
    async open(ws) {
          PrometheusExporter.metrics.game_connected_players++;
      socketManager.handleJoin(ws);
      const { roomId, playerId } = ws.data;

      let state = activeRooms.get(roomId);
      if (!state) {
        const redisState = await socketManager.pullStateFromRedis(roomId);
        if (redisState) {
           state = redisState as UnoGameState;
        } else {
           state = engine.initialize({ roomId, gameId: 'uno', maxPlayers: 10, seed: 12345 });
        }
        activeRooms.set(roomId, state);
      }

      // Pass pure ACT_JOIN input to game engine instead of modifying state here
      if (engine.validateInput({ playerId, username: '' }, { type: 'ACT_JOIN', playerId }, state)) {
         state = engine.update(state, [{ type: 'ACT_JOIN', playerId }], 0);
         activeRooms.set(roomId, state);
      }

      await socketManager.pushStateToRedis(roomId, state);
      socketManager.broadcastToRoom(roomId, JSON.stringify({ type: 'STATE_UPDATE', state }));
    },
    async message(ws, message) {
      const { roomId, playerId } = ws.data;
      try {
        const input = JSON.parse(message as string) as UnoInput;
        let state = activeRooms.get(roomId);
        if (state) {
           if (engine.validateInput({ playerId, username: '' }, input, state)) {
              state = engine.update(state, [input], 0);
              activeRooms.set(roomId, state);
              await socketManager.pushStateToRedis(roomId, state);
              socketManager.broadcastToRoom(roomId, JSON.stringify({ type: 'STATE_UPDATE', state }));
           }
        }
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    },
    close(ws) {
          PrometheusExporter.metrics.game_connected_players--;
      socketManager.handleLeave(ws);
    },
  },
});

console.log(`JSON Log: {"timestamp": "${new Date().toISOString()}", "service": "game-uno", "level": "INFO", "message": "Uno Worker started on port ${PORT}"}`);
