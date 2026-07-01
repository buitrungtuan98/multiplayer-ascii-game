import { serve } from "bun";
import { CoreSocketManager, SocketData } from "@ascii-game/core-socket";
import { ZombieGameEngine, ZombieGameState, ZombieInput } from "@ascii-game/game-logic-zombie";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const PORT = process.env.WORKER_PORT || 8082; // 8082 for Zombie

const socketManager = new CoreSocketManager(REDIS_URL);
const engine = new ZombieGameEngine();

const activeRooms: Map<string, { state: ZombieGameState, inputs: ZombieInput[], tick: number }> = new Map();

// Rate limiting map (PlayerId -> command count)
const playerCmdCount: Map<string, number> = new Map();

const TICK_RATE_MS = 33.3; // 30Hz

setInterval(() => {
  for (const [roomId, roomData] of activeRooms.entries()) {
     if (roomData.state.status === 'PLAYING') {
        roomData.state = engine.update(roomData.state, roomData.inputs, roomData.tick);
        roomData.tick++;

        roomData.inputs = [];
        playerCmdCount.clear(); // Reset rate limit each tick

        socketManager.broadcastToRoom(roomId, JSON.stringify({ type: 'STATE_SYNC', tick: roomData.tick, state: roomData.state }));

        if (roomData.tick % 30 === 0) {
           socketManager.pushStateToRedis(roomId, roomData.state).catch(e => console.error(e));
        }
     }
  }
}, TICK_RATE_MS);

serve<SocketData>({
  port: PORT,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/ws-connect")) {
      const roomId = url.searchParams.get("room");
      const playerId = url.searchParams.get("player");
      if (!roomId || !playerId) return new Response("Missing params", { status: 400 });

      const upgraded = server.upgrade(req, { data: { roomId, playerId } });
      if (upgraded) return undefined;
      return new Response("Upgrade failed", { status: 400 });
    }
    return new Response("Game Worker Zombie Active");
  },
  websocket: {
    open(ws) {
      socketManager.handleJoin(ws);
      const { roomId, playerId } = ws.data;

      let roomData = activeRooms.get(roomId);
      if (!roomData) {
         roomData = { state: engine.initialize({ roomId, gameId: 'zombie-invasion', maxPlayers: 4, seed: 1234 }), inputs: [], tick: 0 };
         activeRooms.set(roomId, roomData);
      }

      roomData.inputs.push({ type: 'JOIN', playerId });
    },
    message(ws, message) {
      const { roomId, playerId } = ws.data;
      try {
        const input = JSON.parse(message as string) as ZombieInput;

        // Ownership Validation: Force the input's playerId to match the socket's authenticated playerId
        input.playerId = playerId;

        // Rate Limiting (Anti-Cheat)
        const count = playerCmdCount.get(playerId) || 0;
        if (count >= 5) {
           console.warn(`[Anti-Cheat] Player ${playerId} rate limited (spamming)`);
           return; // Drop input
        }
        playerCmdCount.set(playerId, count + 1);

        const roomData = activeRooms.get(roomId);
        if (roomData) {
           if (engine.validateInput({ playerId, username: '' }, input, roomData.state)) {
              roomData.inputs.push(input);
           }
        }
      } catch (e) {}
    },
    close(ws) {
      socketManager.handleLeave(ws);
    }
  }
});

console.log(`JSON Log: {"timestamp": "${new Date().toISOString()}", "service": "game-zombie", "level": "INFO", "message": "Zombie Worker started on port ${PORT}"}`);
