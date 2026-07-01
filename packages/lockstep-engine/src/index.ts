// ==========================================
// CORE LOCKSTEP LOGIC FRAMEWORK
// ==========================================

export interface TickContext {
  tick: number;
  deltaTimeMs: number; // Mặc định: 33 hoặc 66 tùy game
}

/**
 * Interface chuẩn cho mọi Object tham gia vào Lockstep.
 */
export interface ILockstepEntity {
  id: number;
  update(ctx: TickContext): void;
}

/**
 * Hash FNV-1a 32-bit (Phát hiện Desync không dùng số thực)
 */
export class Checksum {
  private static FNV_PRIME = 16777619;
  private static OFFSET_BASIS = 2166136261;

  public static hashBuffer(buffer: Uint8Array): number {
    let hash = this.OFFSET_BASIS;
    for (let i = 0; i < buffer.length; i++) {
      hash ^= buffer[i];
      // Mô phỏng hash * FNV_PRIME trong môi trường 32bit int
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
      hash >>>= 0; // Đẩy về unsigned 32-bit
    }
    return hash;
  }
}

/**
 * Khung Jitter Buffer dành cho Client (Nội suy trượt mượt mà)
 */
export class JitterBuffer<T> {
  private queue: { tick: number, state: T }[] = [];
  private targetDelayTicks: number = 2; // Giữ lại 2 ticks làm đệm

  public push(tick: number, state: T) {
    this.queue.push({ tick, state });
    // Sắp xếp lại nếu mạng đến lộn xộn
    this.queue.sort((a, b) => a.tick - b.tick);
  }

  public getLerpTargets(currentClientTick: number): { from: T, to: T, ratio: number } | null {
    // Trả về state của 2 tick bao quanh currentClientTick để thực hiện nội suy
    if (this.queue.length < 2) return null;

    // Đơn giản hóa nội suy cho prototype:
    // Trong thực tế sẽ tính tỉ lệ (ratio) bằng FixedPoint Math.
    return {
      from: this.queue[0].state,
      to: this.queue[1].state,
      ratio: 500 // 0.5 ở hệ fixed point 1000
    };
  }

  public cleanup(tick: number) {
    this.queue = this.queue.filter(q => q.tick >= tick - this.targetDelayTicks);
  }
}
