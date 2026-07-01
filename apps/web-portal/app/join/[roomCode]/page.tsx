"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AsciiRenderer } from '@ascii-game/ascii-renderer';
import { UnoSpriteCache, ZombieSpriteCache, AoeSpriteCache } from '@ascii-game/ascii-renderer';
import { UnoGameState, ZombieGameState, AoeGameState } from '@ascii-game/shared-types';
import { FixedPoint, LerpMath, IsometricMath, Vector2 } from '@ascii-game/core-math';

export default function JoinRoom({ params }: { params: { roomCode: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AsciiRenderer | null>(null);

  const cacheRef = useRef<any>(null);
  const [gameStateUno, setGameStateUno] = useState<UnoGameState | null>(null);
  const [gameStateZombie, setGameStateZombie] = useState<ZombieGameState | null>(null);
  const [gameStateAoe, setGameStateAoe] = useState<AoeGameState | null>(null);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('ĐANG KẾT NỐI TỚI GAME WORKER...');

  const gameType = useRef<'uno'|'zombie'|'aoe'>('uno');

  const prevStateRef = useRef<any>(null);
  const targetStateRef = useRef<any>(null);
  const lerpStartMs = useRef<number>(0);

  const selectedEntityId = useRef<string | null>(null);

  useEffect(() => {
     if (gameType.current !== 'zombie') return;
     const handleKeyDown = (e: KeyboardEvent) => {
        if (!playerId) return;
        const ws = (window as any).gameWs;
        if (!ws) return;

        let dx = 0; let dy = 0;
        if (e.key === 'ArrowUp' || e.key === 'w') dy = -1;
        if (e.key === 'ArrowDown' || e.key === 's') dy = 1;
        if (e.key === 'ArrowLeft' || e.key === 'a') dx = -1;
        if (e.key === 'ArrowRight' || e.key === 'd') dx = 1;

        if (dx !== 0 || dy !== 0) {
           ws.send(JSON.stringify({ type: 'MOVE', playerId, dirX: dx, dirY: dy }));
        }
     };
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gt = urlParams.get('game') || 'uno';

    let workerPort = '8081';
    if (gt === 'zombie-invasion') { gameType.current = 'zombie'; workerPort = '8082'; }
    else if (gt === 'aoe-1') { gameType.current = 'aoe'; workerPort = '8083'; }
    else { gameType.current = 'uno'; workerPort = '8081'; }

    // Fallback if local override provided
    const urlPort = urlParams.get('workerPort');
    if (urlPort) workerPort = urlPort;

    let myPlayerId = urlParams.get('hostId');
    if (!myPlayerId) myPlayerId = 'p_' + (Date.now() % 9999);
    setPlayerId(myPlayerId);

    const wsUrl = \`ws://localhost:\${workerPort}/ws-connect?room=\${params.roomCode}&player=\${myPlayerId}\`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setStatusText('KẾT NỐI THÀNH CÔNG. ĐANG CHỜ ĐỒNG BỘ STATE...');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'STATE_UPDATE' || data.type === 'STATE_SYNC') {
           if (gameType.current === 'uno') {
              setGameStateUno(data.state);
              setStatusText(\`ĐANG TRONG TRẬN... (\${data.state.players?.length || 0} Players)\`);
           } else if (gameType.current === 'zombie') {
              prevStateRef.current = targetStateRef.current || data.state;
              targetStateRef.current = data.state;
              lerpStartMs.current = performance.now();
              setGameStateZombie(data.state);
              setStatusText(\`ZOMBIE INVASION! Wave: \${data.state.wave} | Ticks: \${data.tick}\`);
           } else if (gameType.current === 'aoe') {
              prevStateRef.current = targetStateRef.current || data.state;
              targetStateRef.current = data.state;
              lerpStartMs.current = performance.now();
              setGameStateAoe(data.state);
              setStatusText(\`AGE OF EMPIRES | Ticks: \${data.tick}\`);

              if (rendererRef.current && rendererRef.current.getBackgroundDirty()) {
                 rendererRef.current.clearBackground();
                 const bgCtx = rendererRef.current.getBackgroundContext();
                 bgCtx.fillStyle = '#050505';
                 bgCtx.fillRect(0, 0, 800, 600);

                 const tempVec = new Vector2();
                 for (let x = 0; x < 20; x++) {
                    for (let y = 0; y < 20; y++) {
                       IsometricMath.toScreen(FixedPoint.fromFloat(x), FixedPoint.fromFloat(y), tempVec);
                       rendererRef.current.drawSpriteToBackground('ISO_GRASS', tempVec.x + 400, tempVec.y + 100);
                    }
                 }
                 rendererRef.current.setBackgroundDirty(false);
              }
           }
        }
      } catch(e) {}
    };

    ws.onclose = () => setStatusText('MẤT KẾT NỐI TỚI GAME WORKER!');
    (window as any).gameWs = ws;
    return () => { ws.close(); delete (window as any).gameWs; };
  }, [params.roomCode]);

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new AsciiRenderer(canvasRef.current);

    if (gameType.current === 'uno') {
      cacheRef.current = new UnoSpriteCache(rendererRef.current.getCache());
      cacheRef.current.preRenderBackCard();
    } else if (gameType.current === 'zombie') {
      cacheRef.current = new ZombieSpriteCache(rendererRef.current.getCache());
      cacheRef.current.preRenderAll();
    } else {
      cacheRef.current = new AoeSpriteCache(rendererRef.current.getCache());
      cacheRef.current.preRenderAll();
    }
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !canvasRef.current || !playerId) return;

    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    let animationFrameId: number;
    const tempVec = new Vector2();

    const loop = (timeMs: number) => {
      if (gameType.current === 'uno') {
         if (gameStateUno) {
            renderer.clear();
            const unoCache = cacheRef.current;
            gameStateUno.players.forEach(p => p.hand.forEach(c => unoCache.preRenderCard(c.id, c.color, c.value)));
            if (gameStateUno.discardPile.length > 0) {
              const topDiscard = gameStateUno.discardPile[gameStateUno.discardPile.length - 1];
              unoCache.preRenderCard(topDiscard.id, topDiscard.color, topDiscard.value);
            }
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#00AA00';
            ctx.font = '12px "JetBrains Mono"';
            ctx.fillText(\`ROOM: \${params.roomCode} | STATUS: \${gameStateUno.status} | TURN: Player \${gameStateUno.currentTurnIndex}\`, 20, 20);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            renderer.drawSprite('CARD_BACK', centerX - 80, centerY - 40);
            if (gameStateUno.discardPile.length > 0) {
               const topCard = gameStateUno.discardPile[gameStateUno.discardPile.length - 1];
               renderer.drawSprite(topCard.id, centerX + 10, centerY - 40);
            }
            const myState = gameStateUno.players.find(p => p.playerId === playerId);
            if (myState) {
              const isMyTurn = (gameStateUno.players[gameStateUno.currentTurnIndex]?.playerId === playerId);
              ctx.fillStyle = isMyTurn ? '#33FF33' : '#00AA00';
              ctx.fillText(\`BÀI CỦA BẠN (LƯỢT CỦA BẠN: \${isMyTurn ? 'CÓ' : 'KHÔNG'})\`, 20, canvas.height - 120);
              myState.hand.forEach((card, idx) => {
                renderer.drawSprite(card.id, 20 + idx * 45, canvas.height - 100);
              });
            }
            const opponents = gameStateUno.players.filter(p => p.playerId !== playerId);
            opponents.forEach((opp, oIdx) => {
              const isOppTurn = (gameStateUno.players[gameStateUno.currentTurnIndex]?.playerId === opp.playerId);
              ctx.fillStyle = isOppTurn ? '#FF3333' : '#AA0000';
              ctx.fillText(\`PLAYER: \${opp.playerId} (\${opp.hand.length} lá)\`, 20, 50 + (oIdx * 90));
              for(let i=0; i < opp.hand.length; i++) renderer.drawSprite('CARD_BACK', 20 + i*20, 70 + (oIdx*90));
            });
         }
      }
      else if (gameType.current === 'zombie') {
         if (prevStateRef.current && targetStateRef.current && cacheRef.current) {
            renderer.clear();
            const zCache = cacheRef.current;
            const elapsedMs = performance.now() - lerpStartMs.current;
            const tLerp = Math.min(1000, Math.floor((elapsedMs / 33.3) * 1000));
            const prev = prevStateRef.current as ZombieGameState;
            const target = targetStateRef.current as ZombieGameState;
            for(let x=0; x<canvas.width; x+=30) {
               for(let y=0; y<canvas.height; y+=30) {
                  renderer.drawSprite('GRASS_TILE', x, y);
               }
            }
            target.zombies.forEach(zTarget => {
               const zPrev = prev.zombies.find(z => z.id === zTarget.id);
               let drawX = FixedPoint.toFloat(zTarget.x);
               let drawY = FixedPoint.toFloat(zTarget.y);
               if (zPrev) {
                  drawX = FixedPoint.toFloat(LerpMath.lerpFixed(zPrev.x, zTarget.x, tLerp));
                  drawY = FixedPoint.toFloat(LerpMath.lerpFixed(zPrev.y, zTarget.y, tLerp));
               }
               const spriteId = zCache.getZombieSpriteId(timeMs);
               renderer.drawSprite(spriteId, drawX, drawY);
            });
            target.heroes.forEach(hTarget => {
               const hPrev = prev.heroes.find(h => h.id === hTarget.id);
               let drawX = FixedPoint.toFloat(hTarget.x);
               let drawY = FixedPoint.toFloat(hTarget.y);
               if (hPrev) {
                  drawX = FixedPoint.toFloat(LerpMath.lerpFixed(hPrev.x, hTarget.x, tLerp));
                  drawY = FixedPoint.toFloat(LerpMath.lerpFixed(hPrev.y, hTarget.y, tLerp));
               }
               renderer.drawSprite('HERO_IDLE', drawX, drawY);
               const ctx = canvas.getContext('2d')!;
               ctx.fillStyle = '#33FF33';
               ctx.font = '10px "JetBrains Mono"';
               ctx.fillText(\`HP: \${hTarget.hp}\`, drawX, drawY - 10);
            });
         }
      }
      else {
         if (prevStateRef.current && targetStateRef.current && cacheRef.current) {
            renderer.clearForeground();
            const elapsedMs = performance.now() - lerpStartMs.current;
            const tLerp = Math.min(1000, Math.floor((elapsedMs / 66.6) * 1000));
            const prev = prevStateRef.current as AoeGameState;
            const target = targetStateRef.current as AoeGameState;
            const ctx = canvas.getContext('2d')!;
            const camX = 400;
            const camY = 100;
            target.entities.forEach(entTarget => {
               const entPrev = prev.entities.find(e => e.id === entTarget.id);
               let drawXFixed = entTarget.x;
               let drawYFixed = entTarget.y;
               if (entPrev) {
                  drawXFixed = LerpMath.lerpFixed(entPrev.x, entTarget.x, tLerp);
                  drawYFixed = LerpMath.lerpFixed(entPrev.y, entTarget.y, tLerp);
               }
               IsometricMath.toScreen(drawXFixed, drawYFixed, tempVec);
               renderer.drawSprite(entTarget.type, tempVec.x + camX, tempVec.y + camY);
               if (selectedEntityId.current === entTarget.id) {
                  ctx.strokeStyle = '#FFFFFF';
                  ctx.strokeRect(tempVec.x + camX, tempVec.y + camY, 40, 40);
               }
               if (entTarget.ownerId === playerId) {
                  ctx.fillStyle = '#33FF33';
               } else if (entTarget.ownerId === null) {
                  ctx.fillStyle = '#00AA00';
               } else {
                  ctx.fillStyle = '#FF3333';
               }
               ctx.font = '10px "JetBrains Mono"';
               ctx.fillText(\`[\${entTarget.type}]\`, tempVec.x + camX, tempVec.y + camY - 10);
            });
         }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop(performance.now());
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStateUno, gameStateAoe, gameStateZombie, playerId, params.roomCode]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-[#33FF33] font-mono text-xl animate-pulse">
        {statusText}
      </div>

      <div className="border-2 border-[#33FF33] shadow-[0_0_20px_rgba(51,255,51,0.3)]">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-[#050505] cursor-crosshair"
          onClick={(e) => {
            const ws = (window as any).gameWs;
            if (!ws || !playerId) return;

            const rect = canvasRef.current!.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            if (gameType.current === 'aoe') {
               const targetState = targetStateRef.current as AoeGameState;
               if (!targetState) return;

               const camX = 400; const camY = 100;
               const tempVec = new Vector2();

               if (selectedEntityId.current) {
                  IsometricMath.toGrid(clickX - camX, clickY - camY, tempVec);
                  ws.send(JSON.stringify({
                      type: 'MOVE_ENTITY',
                      playerId,
                      entityId: selectedEntityId.current,
                      targetX: tempVec.x,
                      targetY: tempVec.y
                  }));
                  selectedEntityId.current = null;
                  return;
               }

               let found = false;
               for (const ent of targetState.entities) {
                  IsometricMath.toScreen(ent.x, ent.y, tempVec);
                  const entScreenX = tempVec.x + camX;
                  const entScreenY = tempVec.y + camY;

                  if (clickX >= entScreenX && clickX <= entScreenX + 40 && clickY >= entScreenY && clickY <= entScreenY + 40) {
                      if (ent.ownerId === playerId) {
                         selectedEntityId.current = ent.id;
                         found = true;
                         break;
                      }
                  }
               }
               if (!found) selectedEntityId.current = null;
            }
            else if (gameType.current === 'uno' && gameStateUno) {
               const myState = gameStateUno.players.find(p => p.playerId === playerId);
               if (!myState || gameStateUno.players[gameStateUno.currentTurnIndex]?.playerId !== playerId) return;
               const centerX = 800 / 2; const centerY = 600 / 2;
               if (clickX >= centerX - 80 && clickX <= centerX - 80 + 70 && clickY >= centerY - 40 && clickY <= centerY - 40 + 90) {
                  ws.send(JSON.stringify({ type: 'ACT_DRAW', playerId }));
                  return;
               }
               const handY = 600 - 100;
               if (clickY >= handY && clickY <= handY + 90) {
                  for (let i = myState.hand.length - 1; i >= 0; i--) {
                     const cardX = 20 + i * 45;
                     if (clickX >= cardX && clickX <= cardX + 70) {
                        const card = myState.hand[i];
                        ws.send(JSON.stringify({ type: 'ACT_DISCARD', playerId, cardId: card.id, declaredColor: card.color === 'WILD' ? 'RED' : undefined }));
                        return;
                     }
                  }
               }
            }
          }}
        />
      </div>
    </div>
  );
}
