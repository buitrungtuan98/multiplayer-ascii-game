#!/bin/bash
cd apps/game-servers/game-rts-sc
bun run src/index.ts > sc.log 2>&1 &
echo $! > sc.pid
cd ../../../

cd apps/game-lobby
bun run src/index.ts > lobby.log 2>&1 &
echo $! > lobby.pid
cd ../../

cd apps/web-portal
pnpm run start -p 3001 > portal.log 2>&1 &
echo $! > portal.pid
cd ../../
