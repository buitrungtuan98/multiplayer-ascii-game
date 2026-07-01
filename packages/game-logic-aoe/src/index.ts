import { IGameEngine, GameRoomConfig, PlayerMetadata, AoeGameState, AoeInput, AoeEntity } from "@ascii-game/shared-types";
import { PRNG, FixedPoint } from "@ascii-game/core-math";

export class AoeGameEngine implements IGameEngine<AoeGameState, AoeInput> {
  private prng!: PRNG;

  public initialize(config: GameRoomConfig): AoeGameState {
    this.prng = new PRNG(config.seed);

    const entities: AoeEntity[] = [];

    // Khởi tạo Rừng (Trees) rải rác trên lưới Fixed-Point
    for (let i = 0; i < 20; i++) {
        const tx = this.prng.rangeFixed(FixedPoint.fromFloat(2), FixedPoint.fromFloat(18));
        const ty = this.prng.rangeFixed(FixedPoint.fromFloat(2), FixedPoint.fromFloat(18));
        entities.push({
            id: `tree_${i}`,
            type: 'TREE',
            ownerId: null,
            x: tx, y: ty,
            hp: 50,
            state: 'IDLE',
            resources: 100 // 100 gỗ
        });
    }

    return {
      status: 'WAITING',
      players: [],
      entities,
      tick: 0
    };
  }

  public validateInput(player: PlayerMetadata, input: AoeInput, state: AoeGameState): boolean {
    if (input.type === 'JOIN') return true;
    if (state.status !== 'PLAYING') return false;

    // Ownership check
    if (input.type === 'MOVE_ENTITY') {
        const entity = state.entities.find(e => e.id === input.entityId);
        if (!entity || entity.ownerId !== player.playerId) return false;
    }

    return true;
  }

  public update(currentState: AoeGameState, batchInputs: AoeInput[], currentTick: number): AoeGameState {
    const nextState = currentState; // In-place mutation cho Zero-Allocation
    nextState.tick = currentTick;

    // --- 1. XỬ LÝ LỆNH TỪ NGƯỜI CHƠI ---
    for (let i = 0; i < batchInputs.length; i++) {
      const input = batchInputs[i];
      if (input.type === 'JOIN') {
         if (!nextState.players.find(p => p.playerId === input.playerId)) {
            nextState.players.push({ playerId: input.playerId, wood: 200, food: 200 });

            // Cấp 1 Town Center và 3 Nông dân cho người mới
            const pIdx = nextState.players.length;
            const spawnX = FixedPoint.fromFloat(pIdx * 5);
            const spawnY = FixedPoint.fromFloat(pIdx * 5);

            nextState.entities.push({
               id: `tc_${input.playerId}`, type: 'TOWN_CENTER', ownerId: input.playerId,
               x: spawnX, y: spawnY, hp: 600, state: 'IDLE'
            });

            for(let j=0; j<3; j++) {
               nextState.entities.push({
                  id: `v_${input.playerId}_${j}`, type: 'VILLAGER', ownerId: input.playerId,
                  x: spawnX + FixedPoint.fromFloat(j), y: spawnY + FixedPoint.fromFloat(j),
                  hp: 25, state: 'IDLE', resources: 0
               });
            }

            if (nextState.players.length >= 1 && nextState.status === 'WAITING') {
               nextState.status = 'PLAYING';
            }
         }
      } else if (input.type === 'MOVE_ENTITY') {
         const entity = nextState.entities.find(e => e.id === input.entityId);
         if (entity && entity.ownerId === input.playerId) {
            entity.state = 'MOVE';
            entity.targetX = input.targetX;
            entity.targetY = input.targetY;
         }
      }
    }

    if (nextState.status !== 'PLAYING') return nextState;

    // --- 2. LOGIC VẬT LÝ / CẬP NHẬT TRẠNG THÁI (15Hz Lockstep) ---
    // Tốc độ di chuyển nông dân (Ví dụ: 0.2 tiles mỗi tick ~ 3 tiles/giây)
    const SPEED = FixedPoint.fromFloat(0.15);

    for (let i = 0; i < nextState.entities.length; i++) {
       const entity = nextState.entities[i];

       if (entity.state === 'MOVE' && entity.targetX !== undefined && entity.targetY !== undefined) {
          const dx = entity.targetX - entity.x;
          const dy = entity.targetY - entity.y;

          // Ước tính khoảng cách (Dùng giá trị tuyệt đối thô để tối ưu tốc độ thay vì Math.sqrt)
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          if (absDx < SPEED && absDy < SPEED) {
             entity.x = entity.targetX;
             entity.y = entity.targetY;
             entity.state = 'IDLE';
          } else {
             // Di chuyển đơn giản 8 hướng
             if (absDx > absDy) {
                entity.x += (dx > 0 ? SPEED : -SPEED);
             } else {
                entity.y += (dy > 0 ? SPEED : -SPEED);
             }
          }
       }
    }

    return nextState;
  }

  public serializeState(state: AoeGameState): ArrayBuffer {
    const jsonStr = JSON.stringify(state);
    return new TextEncoder().encode(jsonStr).buffer;
  }

  public deserializeState(buffer: ArrayBuffer): AoeGameState {
    const jsonStr = new TextDecoder().decode(buffer);
    return JSON.parse(jsonStr) as AoeGameState;
  }
}
