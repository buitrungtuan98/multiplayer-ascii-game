export class FNV1a {
  private static readonly FNV_PRIME = 16777619;
  private static readonly OFFSET_BASIS = 2166136261;

  /**
   * Calculates the 32-bit FNV-1a hash of an ArrayBuffer.
   * Uses integer math to strictly avoid floating-point issues.
   */
  public static hash(buffer: ArrayBuffer): number {
    const view = new Uint8Array(buffer);
    let hash = this.OFFSET_BASIS;

    for (let i = 0; i < view.length; i++) {
      hash = hash ^ view[i];
      // Math.imul safely does 32-bit integer multiplication
      hash = Math.imul(hash, this.FNV_PRIME);
    }

    // Ensure it remains an unsigned 32-bit integer
    return hash >>> 0;
  }
}
