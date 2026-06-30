import { IGameEngine, GameRoomConfig, PlayerMetadata } from "@ascii-game/shared-types";
import { PRNG, FixedPoint } from "@ascii-game/core-math";

// ==========================================
// UNO STATE MACHINE
// ==========================================

export type CardColor = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'WILD';
export type CardValue = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'SKIP'|'REVERSE'|'DRAW_2'|'WILD'|'WILD_DRAW_4';

export interface UnoCard {
  id: string; // "RED_5", "WILD_DRAW_4"
  color: CardColor;
  value: CardValue;
}

export interface UnoPlayerState {
  playerId: string;
  hand: UnoCard[];
}

export interface UnoGameState {
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  players: UnoPlayerState[];
  currentTurnIndex: number;
  direction: 1 | -1;
  discardPile: UnoCard[];
  drawPile: UnoCard[];
  currentColor: CardColor; // Hữu ích khi đánh lá WILD
  winnerId: string | null;
}

// Payload từ client
export type UnoInput =
  | { type: 'ACT_DRAW', playerId: string }
  | { type: 'ACT_DISCARD', playerId: string, cardId: string, declaredColor?: CardColor };

export class UnoGameEngine implements IGameEngine<UnoGameState, UnoInput> {
  private generateDeck(): UnoCard[] {
    const deck: UnoCard[] = [];
    const colors: CardColor[] = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
    const values: CardValue[] = ['1','2','3','4','5','6','7','8','9','SKIP','REVERSE','DRAW_2'];

    colors.forEach(color => {
      deck.push({ id: `${color}_0`, color, value: '0' });
      values.forEach(value => {
        deck.push({ id: `${color}_${value}_1`, color, value });
        deck.push({ id: `${color}_${value}_2`, color, value });
      });
    });

    for (let i = 0; i < 4; i++) {
      deck.push({ id: `WILD_${i}`, color: 'WILD', value: 'WILD' });
      deck.push({ id: `WILD_DRAW_4_${i}`, color: 'WILD', value: 'WILD_DRAW_4' });
    }
    return deck;
  }

  private shuffle(deck: UnoCard[], prng: PRNG): UnoCard[] {
    for (let i = deck.length - 1; i > 0; i--) {
      // Dùng PRNG trả về nguyên fixed point sau đó chuyển về số thực an toàn bằng toFloat
      const jInt = prng.rangeFixed(0, i);
      // jInt is already a direct index
      [deck[i], deck[jInt]] = [deck[jInt], deck[i]];
    }
    return deck;
  }

  public initialize(config: GameRoomConfig): UnoGameState {
    const prng = new PRNG(config.seed);
    let deck = this.shuffle(this.generateDeck(), prng);

    // Mặc định khởi tạo rỗng, players sẽ được add vào lúc Worker start game
    return {
      status: 'WAITING',
      players: [],
      currentTurnIndex: 0,
      direction: 1,
      discardPile: [],
      drawPile: deck,
      currentColor: 'RED',
      winnerId: null,
    };
  }

  public validateInput(player: PlayerMetadata, input: UnoInput, state: UnoGameState): boolean {
    if (state.status !== 'PLAYING') return false;

    // Kiểm tra có đúng lượt của người này không
    const currentPlayerId = state.players[state.currentTurnIndex].playerId;
    if (player.playerId !== currentPlayerId) return false;
    if (input.playerId !== currentPlayerId) return false;

    if (input.type === 'ACT_DISCARD') {
      // Validate xem có cầm lá bài đó trên tay không
      const pState = state.players.find(p => p.playerId === player.playerId);
      if (!pState || !pState.hand.find(c => c.id === input.cardId)) return false;
    }

    return true;
  }

  public update(currentState: UnoGameState, batchInputs: UnoInput[], currentTick: number): UnoGameState {
    // Vì là game Turn-based 0Hz, mỗi lượt cập nhật thường chỉ có 1 input hợp lệ
    // Clone state để đảm bảo pure function (Trong thực tế có thể dùng Immer hoặc clone tay sâu)
    const nextState = JSON.parse(JSON.stringify(currentState)) as UnoGameState;

    for (const input of batchInputs) {
       // Logic đánh bài cơ bản (Prototype Demo)
       if (input.type === 'ACT_DISCARD') {
          const playerIdx = nextState.currentTurnIndex;
          const player = nextState.players[playerIdx];

          const cardIdx = player.hand.findIndex(c => c.id === input.cardId);
          if (cardIdx !== -1) {
             const playedCard = player.hand.splice(cardIdx, 1)[0];
             nextState.discardPile.push(playedCard);
             nextState.currentColor = input.declaredColor || playedCard.color;

             // Chuyển turn
             nextState.currentTurnIndex = (nextState.currentTurnIndex + nextState.direction + nextState.players.length) % nextState.players.length;

             if (player.hand.length === 0) {
               nextState.status = 'FINISHED';
               nextState.winnerId = player.playerId;
             }
          }
       }
    }

    return nextState;
  }

  public serializeState(state: UnoGameState): ArrayBuffer {
    const jsonStr = JSON.stringify(state);
    return new TextEncoder().encode(jsonStr).buffer;
  }

  public deserializeState(buffer: ArrayBuffer): UnoGameState {
    const jsonStr = new TextDecoder().decode(buffer);
    return JSON.parse(jsonStr) as UnoGameState;
  }
}
