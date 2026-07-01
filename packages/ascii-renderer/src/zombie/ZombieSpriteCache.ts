import { AsciiSpriteCache } from "../index";

export class ZombieSpriteCache {
  private cache: AsciiSpriteCache;

  constructor(cache: AsciiSpriteCache) {
    this.cache = cache;
  }

  public preRenderAll() {
    // HERO SPRITES
    this.cache.preRender('HERO_IDLE',
` [o_o]
 /| |\\
 / \\   `, '#33FF33');

    // ZOMBIE WALK ANIMATION (2 Khung - Frame-swapping)
    this.cache.preRender('ZOMBIE_WALK_0',
` [x_x]
  | |\\
 / \\   `, '#FF3333');

    this.cache.preRender('ZOMBIE_WALK_1',
` [x_x]
 /| |
  / \\  `, '#FF3333');

    // Bãi cỏ (Map Tile)
    this.cache.preRender('GRASS_TILE', ` . `, '#005500');
  }

  /**
   * Tính toán khung hình cần vẽ dựa vào thời gian thực định phẩy
   */
  public getZombieSpriteId(animationTick: number): string {
    // Tráo khung sau mỗi 300 tick (giả lập)
    const frameIdx = Math.floor(animationTick / 300) % 2;
    return `ZOMBIE_WALK_${frameIdx}`;
  }
}
