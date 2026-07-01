import { ServerWebSocket } from "bun";
import Redis from "ioredis";

export interface SocketData {
  roomId: string;
  playerId: string;
}

export class CoreSocketManager {
  private redis: Redis;
  private connections: Map<string, Set<ServerWebSocket<SocketData>>> = new Map();

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  public handleJoin(ws: ServerWebSocket<SocketData>) {
    const { roomId, playerId } = ws.data;
    if (!this.connections.has(roomId)) {
      this.connections.set(roomId, new Set());
    }
    this.connections.get(roomId)!.add(ws);
    console.log(`[CoreSocket] Player ${playerId} joined room ${roomId}`);
  }

  public handleLeave(ws: ServerWebSocket<SocketData>) {
    const { roomId, playerId } = ws.data;
    const roomConns = this.connections.get(roomId);
    if (roomConns) {
      roomConns.delete(ws);
      if (roomConns.size === 0) {
        this.connections.delete(roomId);
      }
    }
    console.log(`[CoreSocket] Player ${playerId} left room ${roomId}`);
  }

  public broadcastToRoom(roomId: string, message: string) {
    const roomConns = this.connections.get(roomId);
    if (roomConns) {
      for (const ws of roomConns) {
        ws.send(message);
      }
    }
  }

  public async pullStateFromRedis(roomId: string): Promise<any> {
    const stateStr = await this.redis.get(`room:${roomId}:state`);
    if (stateStr) {
       return JSON.parse(stateStr);
    }
    return null;
  }

  public async pushStateToRedis(roomId: string, state: any): Promise<void> {
    await this.redis.set(`room:${roomId}:state`, JSON.stringify(state));
  }
}
