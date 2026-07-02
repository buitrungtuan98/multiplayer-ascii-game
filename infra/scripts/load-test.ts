import { parseArgs } from "util";
import { BinaryEncoder } from "../../packages/core-math/src/BinaryEncoder";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    target: { type: 'string', default: 'ws://localhost:8084' }, // default SC worker
    ccu: { type: 'string', default: '100' },
    room: { type: 'string', default: 'LOADTEST' },
  },
  strict: true,
  allowPositionals: true,
});

const targetUrl = values.target;
const ccu = parseInt(values.ccu as string, 10);
const room = values.room;

console.log(`Starting load test with ${ccu} bots connecting to ${targetUrl} for room ${room}...`);

const bots: WebSocket[] = [];

for (let i = 0; i < ccu; i++) {
  const wsUrl = `${targetUrl}?room=${room}&player=bot_${i}`;
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    // Send a move command every 500ms
    setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            const buffer = BinaryEncoder.encodeMoveCommand({
                cmd: "MOVE",
                playerId: i % 255, // 8-bit id simulation
                unitId: Math.floor(Math.random() * 100),
                targetX: Math.floor(Math.random() * 50000),
                targetY: Math.floor(Math.random() * 50000)
            });
            ws.send(buffer);
        }
    }, 500);
  };

  ws.onerror = () => {
    // ignore
  }

  bots.push(ws);
}

console.log("All bots initialized. Press Ctrl+C to stop.");
