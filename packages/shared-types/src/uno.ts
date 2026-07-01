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

export type UnoInput =
  | { type: 'ACT_JOIN', playerId: string }
  | { type: 'ACT_DRAW', playerId: string }
  | { type: 'ACT_DISCARD', playerId: string, cardId: string, declaredColor?: CardColor };
