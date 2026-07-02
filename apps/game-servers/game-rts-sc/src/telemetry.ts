export class PrometheusExporter {
  public static metrics = {
    game_active_rooms: 0,
    game_connected_players: 0,
    game_tick_latency_ms: 0,
    game_desync_events_total: 0,
    game_memory_heap_bytes: 0,
  };

  public static getMetrics(): string {
    const mem = process.memoryUsage();
    this.metrics.game_memory_heap_bytes = mem.heapUsed;

    return `
# HELP game_active_rooms Current number of active rooms
# TYPE game_active_rooms gauge
game_active_rooms ${this.metrics.game_active_rooms}

# HELP game_connected_players Current number of connected clients
# TYPE game_connected_players gauge
game_connected_players ${this.metrics.game_connected_players}

# HELP game_tick_latency_ms Lockstep loop latency in ms
# TYPE game_tick_latency_ms gauge
game_tick_latency_ms ${this.metrics.game_tick_latency_ms}

# HELP game_desync_events_total Total number of consensus deviations
# TYPE game_desync_events_total counter
game_desync_events_total ${this.metrics.game_desync_events_total}

# HELP game_memory_heap_bytes RAM usage from Bun/V8 heap
# TYPE game_memory_heap_bytes gauge
game_memory_heap_bytes ${this.metrics.game_memory_heap_bytes}
    `.trim() + "\n";
  }
}
