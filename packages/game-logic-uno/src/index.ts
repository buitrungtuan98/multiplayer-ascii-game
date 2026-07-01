import { IGameEngine, GameRoomConfig, PlayerMetadata, UnoGameState, UnoInput, UnoCard, CardColor, CardValue } from "@ascii-game/shared-types";
import { PRNG, FixedPoint } from "@ascii-game/core-math";

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
      const jInt = prng.rangeFixed(0, i);
      [deck[i], deck[jInt]] = [deck[jInt], deck[i]];
    }
    return deck;
  }

  public initialize(config: GameRoomConfig): UnoGameState {
    const prng = new PRNG(config.seed);
    let deck = this.shuffle(this.generateDeck(), prng);

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
    if (input.type === 'ACT_JOIN') return true;

    if (state.status !== 'PLAYING') return false;

    // Kiểm tra có đúng lượt của người này không
    const currentPlayerId = state.players[state.currentTurnIndex]?.playerId;
    if (player.playerId !== currentPlayerId) return false;
    if (input.playerId !== currentPlayerId) return false;

    if (input.type === 'ACT_DISCARD') {
      const pState = state.players.find(p => p.playerId === player.playerId);
      if (!pState || !pState.hand.find(c => c.id === input.cardId)) return false;
    }

    return true;
  }

  public update(currentState: UnoGameState, batchInputs: UnoInput[], currentTick: number): UnoGameState {
    const nextState = JSON.parse(JSON.stringify(currentState)) as UnoGameState;

    for (const input of batchInputs) {
       if (input.type === 'ACT_JOIN') {
          if (!nextState.players.find(p => p.playerId === input.playerId)) {
             nextState.players.push({ playerId: input.playerId, hand: [] });
             // Khởi tạo bài cho người mới
             for (let i=0; i<7; i++) {
                if (nextState.drawPile.length > 0) {
                   nextState.players[nextState.players.length-1].hand.push(nextState.drawPile.pop()!);
                }
             }
             if (nextState.players.length > 1 && nextState.status === 'WAITING') {
                nextState.status = 'PLAYING';
                // Mở bài khởi đầu
                if (nextState.discardPile.length === 0 && nextState.drawPile.length > 0) {
                    nextState.discardPile.push(nextState.drawPile.pop()!);
                }
             }
          }
       } else if (input.type === 'ACT_DRAW') {
          if (nextState.drawPile.length > 0) {
             const pState = nextState.players.find(p => p.playerId === input.playerId);
             if (pState) {
                pState.hand.push(nextState.drawPile.pop()!);
                nextState.currentTurnIndex = (nextState.currentTurnIndex + nextState.direction + nextState.players.length) % nextState.players.length;
             }
          }
       } else if (input.type === 'ACT_DISCARD') {
          const playerIdx = nextState.currentTurnIndex;
          const player = nextState.players[playerIdx];

          const cardIdx = player.hand.findIndex(c => c.id === input.cardId);
          if (cardIdx !== -1) {
             const playedCard = player.hand.splice(cardIdx, 1)[0];
             nextState.discardPile.push(playedCard);
             nextState.currentColor = input.declaredColor || playedCard.color;

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
