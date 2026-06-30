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
      socketManager.handleJoin(ws);
      const { roomId } = ws.data;

      // Load or init state
      let state = activeRooms.get(roomId);
      if (!state) {
        // Try pull from Redis
        const redisState = await socketManager.pullStateFromRedis(roomId);
        if (redisState) {
           state = redisState as UnoGameState;
        } else {
           // Init new game
           state = engine.initialize({ roomId, gameId: 'uno', maxPlayers: 10, seed: 12345 });
        }
        activeRooms.set(roomId, state);
      }

      // Add player if not exists
      if (!state.players.find(p => p.playerId === ws.data.playerId)) {
         state.players.push({ playerId: ws.data.playerId, hand: [] });
         // Give 7 cards
         for(let i=0; i<7; i++) {
            if(state.drawPile.length > 0) {
               state.players[state.players.length-1].hand.push(state.drawPile.pop()!);
            }
         }
         if (state.players.length > 1 && state.status === 'WAITING') {
            state.status = 'PLAYING';
         }
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
           // Validate & Update
           if (engine.validateInput({ playerId, username: 'Unknown' }, input, state)) {
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
      socketManager.handleLeave(ws);
    },
  },
});

console.log(`JSON Log: {"timestamp": "${new Date().toISOString()}", "service": "game-uno", "level": "INFO", "message": "Uno Worker started on port ${PORT}"}`);
