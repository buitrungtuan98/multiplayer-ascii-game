export interface ZombieHero {
  id: string;
  x: number; // Tọa độ Fixed Point (multiplier = 1000)
  y: number; // Tọa độ Fixed Point
  hp: number;
}

export interface ZombieEntity {
  id: number; // Tiết kiệm bytes, ID theo dạng số nguyên uint16
  x: number;
  y: number;
  hp: number;
  state: 'IDLE' | 'WALK' | 'ATTACK' | 'DEAD';
}

export interface ZombieGameState {
  status: 'WAITING' | 'PLAYING' | 'GAME_OVER';
  heroes: ZombieHero[];
  zombies: ZombieEntity[];
  wave: number;
  score: number;
}

// Lệnh di chuyển: x, y là vector hướng nhị phân 0 -> 8
export type ZombieInput =
  | { type: 'JOIN', playerId: string }
  | { type: 'MOVE', playerId: string, dirX: number, dirY: number }
  | { type: 'SHOOT', playerId: string, targetX: number, targetY: number };
