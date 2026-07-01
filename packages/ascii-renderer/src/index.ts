// ==========================================
// ASCII CANVAS RENDERER (DOM-LESS GAMING)
// ==========================================

export class AsciiSpriteCache {
  private cache: Map<string, HTMLCanvasElement> = new Map();

  public preRender(id: string, text: string, color: string, font: string = '16px "JetBrains Mono", monospace') {
    if (this.cache.has(id)) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lines = text.split('\n');
    ctx.font = font;

    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = ctx.measureText(line);
      if (metrics.width > maxWidth) maxWidth = metrics.width;
    });

    const lineHeight = parseInt(font, 10) * 1.2;
    canvas.width = maxWidth || 16;
    canvas.height = (lines.length * lineHeight) || 16;

    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    lines.forEach((line, idx) => {
      ctx.fillText(line, 0, idx * lineHeight);
    });

    this.cache.set(id, canvas);
  }

  public getSprite(id: string): HTMLCanvasElement | undefined {
    return this.cache.get(id);
  }
}

export class AsciiRenderer {
  private mainCtx: CanvasRenderingContext2D;
  private backgroundCtx: CanvasRenderingContext2D;
  private backgroundCanvas: HTMLCanvasElement;
  private spriteCache: AsciiSpriteCache;
  private width: number;
  private height: number;
  private isBackgroundDirty: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.mainCtx = canvas.getContext('2d', { alpha: false })!;
    this.width = canvas.width;
    this.height = canvas.height;

    // Khởi tạo Offscreen Canvas riêng cho Background Layer (Tối ưu hóa Dirty Rectangles/Layering)
    this.backgroundCanvas = document.createElement('canvas');
    this.backgroundCanvas.width = this.width;
    this.backgroundCanvas.height = this.height;
    this.backgroundCtx = this.backgroundCanvas.getContext('2d', { alpha: false })!;

    this.spriteCache = new AsciiSpriteCache();

    this.spriteCache.preRender('zombie_0', '[o_o]', '#FF3333');
    this.spriteCache.preRender('hero_0', '[@_@]', '#33FF33');
  }

  public getCache(): AsciiSpriteCache {
    return this.spriteCache;
  }

  /**
   * Xóa toàn bộ layer Foreground, và tự động vẽ lại lớp Background đã cache lên (Nhanh O(1))
   */
  public clearForeground() {
    this.mainCtx.drawImage(this.backgroundCanvas, 0, 0);
  }

  public getBackgroundContext(): CanvasRenderingContext2D {
    return this.backgroundCtx;
  }

  public setBackgroundDirty(dirty: boolean) {
    this.isBackgroundDirty = dirty;
  }

  public getBackgroundDirty(): boolean {
    return this.isBackgroundDirty;
  }

  /**
   * Xóa toàn bộ nền (Chỉ gọi khi map thay đổi cực lớn)
   */
  public clearBackground() {
    this.backgroundCtx.fillStyle = '#050505';
    this.backgroundCtx.fillRect(0, 0, this.width, this.height);
  }

  public drawSpriteToBackground(spriteId: string, x: number, y: number) {
    const sprite = this.spriteCache.getSprite(spriteId);
    if (sprite) {
      this.backgroundCtx.drawImage(sprite, Math.floor(x), Math.floor(y));
    }
  }

  public drawSprite(spriteId: string, x: number, y: number) {
    const sprite = this.spriteCache.getSprite(spriteId);
    if (sprite) {
      this.mainCtx.drawImage(sprite, Math.floor(x), Math.floor(y));
    }
  }
}

export * from "./uno/UnoSpriteCache";
export * from "./zombie/ZombieSpriteCache";
export * from "./aoe/AoeSpriteCache";
