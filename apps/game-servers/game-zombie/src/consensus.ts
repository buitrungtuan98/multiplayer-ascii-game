import { ChecksumPayload } from "shared-types";
import { PrometheusExporter } from "./telemetry";

export class ConsensusManager {
  private checksums = new Map<number, Map<string, number>>(); // tick -> (playerId -> hash)

  public registerChecksum(payload: ChecksumPayload): void {
    if (!this.checksums.has(payload.tick)) {
      this.checksums.set(payload.tick, new Map());
    }
    this.checksums.get(payload.tick)!.set(payload.playerId, payload.hash);
  }

  public verify(tick: number): boolean {
    const hashes = this.checksums.get(tick);
    if (!hashes || hashes.size <= 1) return true; // Not enough data or already cleared

    let expectedHash: number | null = null;
    let hasDesync = false;

    for (const [playerId, hash] of hashes.entries()) {
      if (expectedHash === null) {
        expectedHash = hash;
      } else if (hash !== expectedHash) {
        hasDesync = true;
        break;
      }
    }

    if (hasDesync) {
      console.warn(JSON.stringify({
        timestamp: new Date().toISOString(),
        service: "game-zombie",
        level: "WARN",
        message: "Desync detected",
        tick,
      }));
      PrometheusExporter.metrics.game_desync_events_total++;
    }

    this.checksums.delete(tick); // Cleanup
    return !hasDesync;
  }
}
