import { IGameEngine, GameRoomConfig, PlayerMetadata, ScGameState, ScInput, ScEntity } from "@ascii-game/shared-types";
import { PRNG, FixedPoint } from "@ascii-game/core-math";

export class ScGameEngine implements IGameEngine<ScGameState, ScInput> {
  private prng!: PRNG;

  public initialize(config: GameRoomConfig): ScGameState {
    this.prng = new PRNG(config.seed);

    return {
      status: 'WAITING',
      players: [],
      entities: [],
      tick: 0
    };
  }

  public validateInput(player: PlayerMetadata, input: ScInput, state: ScGameState): boolean {
    if (input.type === 'JOIN') return true;
    if (state.status !== 'PLAYING') return false;

    if (input.type === 'MOVE_ENTITY') {
        const entity = state.entities.find(e => e.id === input.entityId);
        if (!entity || entity.ownerId !== player.playerId) return false;
    }

    return true;
  }

  public update(currentState: ScGameState, batchInputs: ScInput[], currentTick: number): ScGameState {
    const nextState = currentState;
    nextState.tick = currentTick;

    for (let i = 0; i < batchInputs.length; i++) {
      const input = batchInputs[i];
      if (input.type === 'JOIN') {
         if (!nextState.players.find(p => p.playerId === input.playerId)) {
            nextState.players.push({ playerId: input.playerId, minerals: 50 });

            const pIdx = nextState.players.length;
            const spawnX = FixedPoint.fromFloat(pIdx * 5);
            const spawnY = FixedPoint.fromFloat(pIdx * 5);

            nextState.entities.push({
               id: `base_${input.playerId}`, type: 'BASE', ownerId: input.playerId,
               x: spawnX, y: spawnY, hp: 1500, state: 'IDLE'
            });

            // Sinh lính Marine và Mutalisk (Giả lập chủng tộc hỗn hợp cho prototype)
            for(let j=0; j<2; j++) {
               nextState.entities.push({
                  id: `marine_${input.playerId}_${j}`, type: 'MARINE', ownerId: input.playerId,
                  x: spawnX + FixedPoint.fromFloat(j), y: spawnY + FixedPoint.fromFloat(j),
                  hp: 40, state: 'IDLE'
               });
            }
            nextState.entities.push({
               id: `muta_${input.playerId}_0`, type: 'MUTALISK', ownerId: input.playerId,
               x: spawnX, y: spawnY + FixedPoint.fromFloat(2),
               hp: 120, state: 'IDLE'
            });

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

    const SPEED = FixedPoint.fromFloat(0.2); // ~ 3 tiles / sec
    const FLY_SPEED = FixedPoint.fromFloat(0.4);

    for (let i = 0; i < nextState.entities.length; i++) {
       const entity = nextState.entities[i];

       if (entity.state === 'MOVE' && entity.targetX !== undefined && entity.targetY !== undefined) {
          const dx = entity.targetX - entity.x;
          const dy = entity.targetY - entity.y;

          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          const s = entity.type === 'MUTALISK' ? FLY_SPEED : SPEED;

          if (absDx < s && absDy < s) {
             entity.x = entity.targetX;
             entity.y = entity.targetY;
             entity.state = 'IDLE';
          } else {
             // Đơn giản hóa di chuyển Fixed-Point 8 hướng
             if (absDx > absDy) {
                entity.x += (dx > 0 ? s : -s);
             } else {
                entity.y += (dy > 0 ? s : -s);
             }
          }
       }
    }

    return nextState;
  }

  public serializeState(state: ScGameState): ArrayBuffer {
    const jsonStr = JSON.stringify(state);
    return new TextEncoder().encode(jsonStr).buffer;
  }

  public deserializeState(buffer: ArrayBuffer): ScGameState {
    const jsonStr = new TextDecoder().decode(buffer);
    return JSON.parse(jsonStr) as ScGameState;
  }
}
