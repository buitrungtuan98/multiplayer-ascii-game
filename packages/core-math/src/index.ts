// ==========================================
// THƯ VIỆN TOÁN HỌC CỐ ĐỊNH (FIXED-POINT MATH)
// CHỈ THỊ: Cấm sử dụng Float. Bắt buộc dùng phân giải 1000.
// ==========================================

export const FP_MULTIPLIER = 1000;

export class FixedPoint {
  /**
   * Chuyển đổi số thực sang số nguyên định phẩy (Chỉ dùng lúc khởi tạo config, cấm dùng trong Game Loop).
   */
  static fromFloat(value: number): number {
    return Math.round(value * FP_MULTIPLIER);
  }

  /**
   * Chuyển đổi ngược về số thực (Chỉ dùng cho Render Client, cấm dùng cho Logic Server).
   */
  static toFloat(value: number): number {
    return value / FP_MULTIPLIER;
  }

  /**
   * Phép nhân hai số fixed-point
   */
  static mul(a: number, b: number): number {
    // (a * b) / multiplier để giữ nguyên thang đo
    return Math.floor((a * b) / FP_MULTIPLIER);
  }

  /**
   * Phép chia hai số fixed-point
   */
  static div(a: number, b: number): number {
    // (a * multiplier) / b
    return Math.floor((a * FP_MULTIPLIER) / b);
  }
}

// ==========================================
// BỘ SINH SỐ NGẪU NHIÊN XÁC ĐỊNH (DETERMINISTIC PRNG)
// ==========================================
export class PRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  /**
   * Trả về số nguyên ngẫu nhiên từ 1 đến 2147483646 (Park-Miller)
   */
  public next(): number {
    return this.seed = (this.seed * 16807) % 2147483647;
  }

  /**
   * Trả về số fixed-point ngẫu nhiên trong khoảng [min, max] (min, max là fixed-point)
   */
  public rangeFixed(min: number, max: number): number {
    // Để lấy ngẫu nhiên an toàn trong khoảng, chia lấy dư khoảng cách
    const diff = max - min + 1; // +1 để bao gồm cả giá trị max
    if (diff <= 0) return min;
    const offset = this.next() % diff;
    return min + offset;
  }
}

// ==========================================
// QUẢN LÝ BỘ NHỚ ĐỆM VECTOR2 (ZERO-ALLOCATION)
// ==========================================
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
  private static initialSize = 10000; // Pre-allocate 10,000 vectors cho AoE/Zombie

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
    console.warn("Vector2Pool exhausted! Allocating new memory.");
    return new Vector2(x, y);
  }

  public static release(vec: Vector2): void {
    this.pool.push(vec);
  }
}
