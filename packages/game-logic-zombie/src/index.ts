import { IGameEngine, GameRoomConfig, PlayerMetadata, ZombieGameState, ZombieInput } from "@ascii-game/shared-types";
import { FixedPoint, FlowField, Vector2Pool, Vector2 } from "@ascii-game/core-math";

export class ZombieGameEngine implements IGameEngine<ZombieGameState, ZombieInput> {
  private flowField: FlowField;
  private tempVec: Vector2;

  constructor() {
     this.flowField = new FlowField(100, 100);
     Vector2Pool.initialize();
     this.tempVec = Vector2Pool.acquire();
  }

  public initialize(config: GameRoomConfig): ZombieGameState {
    return {
      status: 'WAITING',
      heroes: [],
      zombies: [],
      wave: 1,
      score: 0
    };
  }

  public validateInput(player: PlayerMetadata, input: ZombieInput, state: ZombieGameState): boolean {
    if (input.type === 'JOIN') return true;
    if (state.status !== 'PLAYING') return false;
    return true;
  }

  public update(currentState: ZombieGameState, batchInputs: ZombieInput[], currentTick: number): ZombieGameState {
    const nextState = currentState; // In-place mutation (Zero-Allocation)

    for (let i = 0; i < batchInputs.length; i++) {
      const input = batchInputs[i];
      if (input.type === 'JOIN') {
         if (!nextState.heroes.find(h => h.id === input.playerId)) {
            nextState.heroes.push({
               id: input.playerId,
               x: FixedPoint.fromFloat(50),
               y: FixedPoint.fromFloat(50),
               hp: 100
            });
            if (nextState.heroes.length >= 1 && nextState.status === 'WAITING') {
               nextState.status = 'PLAYING';
            }
         }
      } else if (input.type === 'MOVE') {
         const hero = nextState.heroes.find(h => h.id === input.playerId);
         if (hero) {
            hero.x += input.dirX * 1500;
            hero.y += input.dirY * 1500;
         }
      }
    }

    if (nextState.status !== 'PLAYING') return nextState;

    if (currentTick % 30 === 0 && nextState.zombies.length < 500) {
       nextState.zombies.push({
          id: currentTick,
          x: FixedPoint.fromFloat(0),
          y: FixedPoint.fromFloat(0),
          hp: 20,
          state: 'WALK'
       });
    }

    if (nextState.heroes.length > 0) {
       // Sử dụng phép chia Fixed-Point để lấy index lưới thay vì chuyển float
       const targetX = Math.floor(nextState.heroes[0].x / 1000);
       const targetY = Math.floor(nextState.heroes[0].y / 1000);

       this.flowField.generate(targetX, targetY);

       for (let i = 0; i < nextState.zombies.length; i++) {
          const zombie = nextState.zombies[i];
          const zxGrid = Math.floor(zombie.x / 1000);
          const zyGrid = Math.floor(zombie.y / 1000);

          this.flowField.getDirectionVector(zxGrid, zyGrid, this.tempVec);

          zombie.x += FixedPoint.div(FixedPoint.mul(this.tempVec.x, 2000), 1000);
          zombie.y += FixedPoint.div(FixedPoint.mul(this.tempVec.y, 2000), 1000);
       }
    }

    return nextState;
  }

  public serializeState(state: ZombieGameState): ArrayBuffer {
    const jsonStr = JSON.stringify(state);
    return new TextEncoder().encode(jsonStr).buffer;
  }

  public deserializeState(buffer: ArrayBuffer): ZombieGameState {
    const jsonStr = new TextDecoder().decode(buffer);
    return JSON.parse(jsonStr) as ZombieGameState;
  }
}
