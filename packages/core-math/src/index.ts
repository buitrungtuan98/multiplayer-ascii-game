export const FP_MULTIPLIER = 1000;

export class FixedPoint {
  static fromFloat(value: number): number {
    return Math.round(value * FP_MULTIPLIER);
  }
  static toFloat(value: number): number {
    return value / FP_MULTIPLIER;
  }
  static mul(a: number, b: number): number {
    return Math.floor((a * b) / FP_MULTIPLIER);
  }
  static div(a: number, b: number): number {
    return Math.floor((a * FP_MULTIPLIER) / b);
  }
}

export class PRNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  public next(): number {
    return this.seed = (this.seed * 16807) % 2147483647;
  }
  public rangeFixed(min: number, max: number): number {
    const diff = max - min + 1;
    if (diff <= 0) return min;
    const offset = this.next() % diff;
    return min + offset;
  }
}

export class Vector2 {
  public x: number = 0;
  public y: number = 0;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  public set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public copyFrom(other: Vector2) {
    this.x = other.x;
    this.y = other.y;
  }
}

export class Vector2Pool {
  private static pool: Vector2[] = [];
  private static initialSize = 10000;

  public static initialize() {
    if (this.pool.length > 0) return;
    for (let i = 0; i < this.initialSize; i++) {
      this.pool.push(new Vector2(0, 0));
    }
  }

  public static acquire(x: number = 0, y: number = 0): Vector2 {
    if (this.pool.length > 0) {
      const vec = this.pool.pop()!;
      vec.x = x;
      vec.y = y;
      return vec;
    }
    return new Vector2(x, y);
  }

  public static release(vec: Vector2): void {
    this.pool.push(vec);
  }
}

export class FlowField {
  public width: number;
  public height: number;
  public grid: number[][];
  public costField: number[][];
  private intField: number[][]; // Reusable integration field
  private queue: {x: number, y: number}[]; // Reusable queue
  private queueLength: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.grid = new Array(width);
    this.costField = new Array(width);
    this.intField = new Array(width);
    this.queue = new Array(width * height);
    for(let i=0; i<width*height; i++) this.queue[i] = {x: 0, y: 0};

    for (let x = 0; x < width; x++) {
      this.grid[x] = new Array(height).fill(-1);
      this.costField[x] = new Array(height).fill(1);
      this.intField[x] = new Array(height).fill(99999);
    }
  }

  public generate(targetX: number, targetY: number) {
    if (targetX < 0 || targetX >= this.width || targetY < 0 || targetY >= this.height) return;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.intField[x][y] = 99999;
        this.grid[x][y] = -1;
      }
    }

    this.intField[targetX][targetY] = 0;
    this.queue[0].x = targetX;
    this.queue[0].y = targetY;
    this.queueLength = 1;
    let queueHead = 0;

    const dirs = [
      { dx: 0, dy: -1, id: 0 }, { dx: 1, dy: -1, id: 1 }, { dx: 1, dy: 0, id: 2 },
      { dx: 1, dy: 1, id: 3 },  { dx: 0, dy: 1, id: 4 },  { dx: -1, dy: 1, id: 5 },
      { dx: -1, dy: 0, id: 6 }, { dx: -1, dy: -1, id: 7 }
    ];

    while (queueHead < this.queueLength) {
      const currX = this.queue[queueHead].x;
      const currY = this.queue[queueHead].y;
      queueHead++;

      const currentCost = this.intField[currX][currY];

      for (let i = 0; i < 8; i++) {
        const nx = currX + dirs[i].dx;
        const ny = currY + dirs[i].dy;

        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          const terrainCost = this.costField[nx][ny];
          if (terrainCost < 255) {
            const newCost = currentCost + terrainCost;
            if (newCost < this.intField[nx][ny]) {
              this.intField[nx][ny] = newCost;
              this.queue[this.queueLength].x = nx;
              this.queue[this.queueLength].y = ny;
              this.queueLength++;
            }
          }
        }
      }
    }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
          if (this.costField[x][y] === 255) continue;

          let minCost = this.intField[x][y];
          let bestDir = -1;

          for (let i = 0; i < 8; i++) {
             const nx = x + dirs[i].dx;
             const ny = y + dirs[i].dy;
             if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                if (this.intField[nx][ny] < minCost) {
                   minCost = this.intField[nx][ny];
                   bestDir = dirs[i].id;
                }
             }
          }
          this.grid[x][y] = bestDir;
      }
    }
  }

  public getDirectionVector(x: number, y: number, outVec: Vector2): void {
     if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        outVec.set(0, 0);
        return;
     }
     const dir = this.grid[x][y];
     switch(dir) {
        case 0: outVec.set(0, -1000); break;
        case 1: outVec.set(707, -707); break;
        case 2: outVec.set(1000, 0); break;
        case 3: outVec.set(707, 707); break;
        case 4: outVec.set(0, 1000); break;
        case 5: outVec.set(-707, 707); break;
        case 6: outVec.set(-1000, 0); break;
        case 7: outVec.set(-707, -707); break;
        default: outVec.set(0, 0); break;
     }
  }
}

export class LerpMath {
  public static lerpFixed(start: number, end: number, t: number): number {
     let clampedT = t;
     if (clampedT < 0) clampedT = 0;
     if (clampedT > 1000) clampedT = 1000;
     const invT = 1000 - clampedT;
     return FixedPoint.div(
        FixedPoint.mul(start, invT) + FixedPoint.mul(end, clampedT),
        1000
     );
  }
}

// ==========================================
// TOÁN HỌC ISOMETRIC 2.5D
// ==========================================
export class IsometricMath {
  public static tileWidth: number = 64; // Ví dụ: Kích thước Tile trên màn hình (Pixels)
  public static tileHeight: number = 32;

  /**
   * Chuyển đổi Tọa độ lưới phẳng (Fixed-Point) sang Tọa độ màn hình 2.5D (Pixels)
   * Sử dụng công thức từ tài liệu kiến trúc.
   */
  public static toScreen(gridXFixed: number, gridYFixed: number, outVec: Vector2): void {
     const xFloat = FixedPoint.toFloat(gridXFixed);
     const yFloat = FixedPoint.toFloat(gridYFixed);

     // ScreenX = (X - Y) * (TileWidth / 2)
     outVec.x = (xFloat - yFloat) * (this.tileWidth / 2);
     // ScreenY = (X + Y) * (TileHeight / 2)
     outVec.y = (xFloat + yFloat) * (this.tileHeight / 2);
  }

  /**
   * Chuyển đổi Tọa độ màn hình (Pixels) ngược về Tọa độ lưới phẳng (Fixed-Point)
   * Phục vụ cho tính năng Click chuột để chọn lính/đất.
   */
  public static toGrid(screenX: number, screenY: number, outVec: Vector2): void {
     // Đảo ngược ma trận:
     // X = (ScreenX / (TileWidth/2) + ScreenY / (TileHeight/2)) / 2
     // Y = (ScreenY / (TileHeight/2) - ScreenX / (TileWidth/2)) / 2

     const halfW = this.tileWidth / 2;
     const halfH = this.tileHeight / 2;

     const gridXFloat = (screenX / halfW + screenY / halfH) / 2;
     const gridYFloat = (screenY / halfH - screenX / halfW) / 2;

     outVec.x = FixedPoint.fromFloat(gridXFloat);
     outVec.y = FixedPoint.fromFloat(gridYFloat);
  }
}
