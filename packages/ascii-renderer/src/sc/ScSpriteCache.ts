export class ScSpriteCache {
  private static canvasMap = new Map<string, HTMLCanvasElement>();

  public static initialize(): void {
    if (this.canvasMap.size > 0) return;

    // Cache Marine
    const marineStr = " [M]\n /|\\\n / \\";
    this.canvasMap.set("MARINE", this.createSprite(marineStr));

    // Cache Mutalisk
    const mutaStr = " \\~\\_O\n  \\_/";
    this.canvasMap.set("MUTALISK", this.createSprite(mutaStr));
  }

  private static createSprite(ascii: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    ctx.font = "14px 'Courier New', Courier, monospace";
    ctx.fillStyle = "#00FF00";
    ctx.textBaseline = "top";

    const lines = ascii.split("\n");
    let y = 0;
    for (const line of lines) {
      ctx.fillText(line, 0, y);
      y += 14;
    }

    return canvas;
  }

  public static getSprite(type: string): HTMLCanvasElement | null {
    return this.canvasMap.get(type) || null;
  }
}
