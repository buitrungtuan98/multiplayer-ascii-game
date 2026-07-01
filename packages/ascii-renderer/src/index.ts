// ==========================================
// ASCII CANVAS RENDERER (DOM-LESS GAMING)
// ==========================================

export class AsciiSpriteCache {
  private cache: Map<string, HTMLCanvasElement> = new Map();

  /**
   * Khởi tạo một ký tự/khối ASCII thô ra Offscreen Canvas (Pre-render)
   */
  public preRender(id: string, text: string, color: string, font: string = '16px "JetBrains Mono", monospace') {
    if (this.cache.has(id)) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Phân tích nhiều dòng
    const lines = text.split('\n');
    ctx.font = font;

    // Tính toán kích thước bound box
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = ctx.measureText(line);
      if (metrics.width > maxWidth) maxWidth = metrics.width;
    });

    const lineHeight = parseInt(font, 10) * 1.2;
    canvas.width = maxWidth || 16;
    canvas.height = (lines.length * lineHeight) || 16;

    // Reset lại font vì khi set width/height canvas bị mất state context
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
  private spriteCache: AsciiSpriteCache;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.mainCtx = canvas.getContext('2d', { alpha: false })!; // Tối ưu GPU
    this.width = canvas.width;
    this.height = canvas.height;
    this.spriteCache = new AsciiSpriteCache();

    // Pre-cache một vài symbol mẫu
    this.spriteCache.preRender('zombie_0', '[o_o]', '#FF3333');
    this.spriteCache.preRender('hero_0', '[@_@]', '#33FF33');
  }

  public getCache(): AsciiSpriteCache {
    return this.spriteCache;
  }

  public clear() {
    this.mainCtx.fillStyle = '#050505';
    this.mainCtx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Hàm vẽ siêu tốc O(1) sử dụng GPU thông qua việc copy Bitmap
   */
  public drawSprite(spriteId: string, x: number, y: number) {
    const sprite = this.spriteCache.getSprite(spriteId);
    if (sprite) {
      // Math.floor cực kỳ quan trọng ở đây, cấm truyền số float vào drawImage
      this.mainCtx.drawImage(sprite, Math.floor(x), Math.floor(y));
    }
  }
}
export * from "./uno/UnoSpriteCache";
export * from "./zombie/ZombieSpriteCache";
