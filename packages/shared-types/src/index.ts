// [QUAN TRỌNG] Single Source of Truth cho các Interface API & WebSockets.
// Cấm tạo thêm packages/types trùng lặp. Mọi Type đều ở đây.

export interface GameRoomConfig {
  roomId: string;
  gameId: string;
  maxPlayers: number;
  seed: number;
}

export interface PlayerMetadata {
  playerId: string;
  username: string;
}

export type RoomVisibility = 'PUBLIC' | 'PRIVATE';
export type RoomStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export interface RoomMetadata {
  id: string;
  gameId: string;
  host: string; // playerId của chủ phòng
  hostName: string;
  visibility: RoomVisibility;
  players: number;
  maxPlayers: number;
  status: RoomStatus;
  workerPort: number; // Cổng của worker đang gánh phòng này
}

// Lệnh tạo phòng từ client gửi lên API
export interface CreateRoomPayload {
  gameId: string;
  hostName: string;
  visibility: RoomVisibility;
}

// Phản hồi từ Server khi tạo phòng
export interface CreateRoomResponse {
  roomId: string;
  workerPort: number;
}

export interface IGameEngine<TState, TInput> {
  initialize(roomConfig: GameRoomConfig): TState;
  update(currentState: TState, batchInputs: TInput[], currentTick: number): TState;
  validateInput(player: PlayerMetadata, input: TInput, currentState: TState): boolean;
  serializeState(state: TState): ArrayBuffer;
  deserializeState(buffer: ArrayBuffer): TState;
}
export * from "./uno";
export * from "./zombie";
export * from "./aoe";
export * from "./starcraft";
export interface ChecksumPayload {
  cmd: "STATE_CHECKSUM";
  playerId: string;
  tick: number;
  hash: number;
}

export interface DesyncWarningPayload {
  type: "DESYNC_DETECTED";
  targetTick: number;
  snapshotBuffer?: ArrayBuffer;
}

export interface ReconnectRequestPayload {
  cmd: "REQ_RECONNECT";
  playerId: string;
}

export interface CatchupPayload {
  type: "CATCH_UP_STATE";
  snapshot: any;
  tickHistory: { tick: number; inputs: any[] }[];
}
