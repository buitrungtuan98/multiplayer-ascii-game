export interface AoeEntity {
  id: string;
  type: 'VILLAGER' | 'CLUBMAN' | 'TOWN_CENTER' | 'TREE';
  ownerId: string | null; // null nếu là tài nguyên thiên nhiên
  x: number; // Grid X (Fixed Point)
  y: number; // Grid Y (Fixed Point)
  hp: number;
  state: 'IDLE' | 'MOVE' | 'GATHER' | 'ATTACK';
  targetX?: number; // Destination X (Fixed Point)
  targetY?: number; // Destination Y (Fixed Point)
  resources?: number; // Lượng gỗ đang vác (Villager) hoặc đang chứa (Tree)
}

export interface AoeGameState {
  status: 'WAITING' | 'PLAYING' | 'GAME_OVER';
  players: { playerId: string, wood: number, food: number }[];
  entities: AoeEntity[];
  tick: number;
}

export type AoeInput =
  | { type: 'JOIN', playerId: string }
  | { type: 'MOVE_ENTITY', playerId: string, entityId: string, targetX: number, targetY: number }
  | { type: 'ATTACK_ENTITY', playerId: string, entityId: string, targetEntityId: string };
