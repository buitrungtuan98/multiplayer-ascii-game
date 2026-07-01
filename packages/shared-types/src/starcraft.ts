export interface ScEntity {
  id: string;
  type: 'MARINE' | 'MUTALISK' | 'BASE';
  ownerId: string;
  x: number; // Grid X (Fixed Point)
  y: number; // Grid Y (Fixed Point)
  hp: number;
  state: 'IDLE' | 'MOVE' | 'ATTACK';
  targetX?: number; // Destination X (Fixed Point)
  targetY?: number; // Destination Y (Fixed Point)
}

export interface ScGameState {
  status: 'WAITING' | 'PLAYING' | 'GAME_OVER';
  players: { playerId: string, minerals: number }[];
  entities: ScEntity[];
  tick: number;
}

export type ScInput =
  | { type: 'JOIN', playerId: string }
  | { type: 'MOVE_ENTITY', playerId: string, entityId: string, targetX: number, targetY: number };
