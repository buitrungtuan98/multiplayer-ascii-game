export interface GameRegistryConfig {
  gameId: string;
  gameTitle: string;
  gameType: 'TURN_BASED' | 'LOCKSTEP_REALTIME';
  tickRateHz: number;             // Tần số chạy logic (15Hz cho RTS, 30Hz cho Action, 0 cho Turn-based)
  maxPlayers: number;             // Số người chơi tối đa trong một phòng
  maxRoomsAllowed: number;        // Giới hạn phòng tối đa cho game này trên toàn hệ thống
  mapDimensions?: { x: number; y: number }; // Kích thước lưới fixed-point
  balanceSheet: Record<string, any>; // Các hằng số cân bằng (Máu, dame, lá bài, tốc độ...)
}

export const GlobalGameRegistry: Record<string, GameRegistryConfig> = {
  "starcraft-1": {
    gameId: "starcraft-1",
    gameTitle: "StarCraft ASCII Edition",
    gameType: "LOCKSTEP_REALTIME",
    tickRateHz: 15,
    maxPlayers: 8,
    maxRoomsAllowed: 1000,
    mapDimensions: { x: 120000, y: 120000 },
    balanceSheet: {}
  },
  "uno": {
    gameId: "uno",
    gameTitle: "ASCII Uno Boardgame",
    gameType: "TURN_BASED",
    tickRateHz: 0,
    maxPlayers: 10,
    maxRoomsAllowed: 1000,
    balanceSheet: {
      initialCardsPerPlayer: 7,
      drawPenaltyCount: 2,
      wildPenaltyCount: 4,
    }
  },
  "zombie-invasion": {
    gameId: "zombie-invasion",
    gameTitle: "Zombie Invasion CO-OP",
    gameType: "LOCKSTEP_REALTIME",
    tickRateHz: 30,
    maxPlayers: 4,
    maxRoomsAllowed: 500,
    mapDimensions: { x: 50000, y: 50000 },
    balanceSheet: {
      maxZombiesCount: 10000,
      heroMoveSpeed: 1500,
      zombieSpawnIntervalMs: 5000,
    }
  },
  "aoe-1": {
    gameId: "aoe-1",
    gameTitle: "Age of Empires 1 ASCII Edition",
    gameType: "LOCKSTEP_REALTIME",
    tickRateHz: 15,
    maxPlayers: 8,
    maxRoomsAllowed: 1000,
    mapDimensions: { x: 120000, y: 120000 },
    balanceSheet: {
      villagerGatherRate: 100,
      clubmanHealth: 45000,
      clubmanAttack: 3000,
    }
  }
};
