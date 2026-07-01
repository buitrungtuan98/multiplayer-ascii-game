import { AsciiSpriteCache } from "../index";

const UNO_CARD_WIDTH = 9;
const UNO_CARD_HEIGHT = 5;

// Định dạng ASCII thô của lá bài
/*
 ┌───────┐
 │ R     │
 │   5   │
 │     R │
 └───────┘
*/

export class UnoSpriteCache {
  private cache: AsciiSpriteCache;

  constructor(cache: AsciiSpriteCache) {
    this.cache = cache;
  }

  public getCardColor(colorStr: string): string {
    switch (colorStr) {
      case 'RED': return '#FF3333';
      case 'BLUE': return '#3333FF';
      case 'GREEN': return '#33FF33';
      case 'YELLOW': return '#FFFF33';
      case 'WILD': return '#FFFFFF';
      default: return '#CCCCCC';
    }
  }

  public preRenderCard(id: string, colorStr: string, value: string) {
    const color = this.getCardColor(colorStr);

    // Rút gọn ký tự hiển thị (Ví dụ: RED -> R, REVERSE -> REV)
    const cLabel = colorStr === 'WILD' ? 'W' : colorStr.charAt(0);
    let vLabel = value;
    if (value === 'SKIP') vLabel = 'SKP';
    if (value === 'REVERSE') vLabel = 'REV';
    if (value === 'DRAW_2') vLabel = '+2 ';
    if (value === 'WILD_DRAW_4') vLabel = '+4 ';
    if (value === 'WILD') vLabel = 'WLD';

    // Căn giữa value (độ dài 3 ký tự)
    vLabel = vLabel.padEnd(3, ' ').substring(0, 3);

    const asciiArt =
`┌───────┐
│ ${cLabel}     │
│  ${vLabel}  │
│     ${cLabel} │
└───────┘`;

    this.cache.preRender(id, asciiArt, color, '14px "JetBrains Mono", monospace');
  }

  public preRenderBackCard() {
    const asciiArt =
`┌───────┐
│U N O !│
│ /\\ /\\ │
│U N O !│
└───────┘`;
    this.cache.preRender('CARD_BACK', asciiArt, '#FF3333', '14px "JetBrains Mono", monospace');
  }
}
