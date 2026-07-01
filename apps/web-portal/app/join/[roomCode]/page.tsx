"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AsciiRenderer } from '@ascii-game/ascii-renderer';
import { UnoSpriteCache } from '@ascii-game/ascii-renderer';
import { ZombieSpriteCache } from '@ascii-game/ascii-renderer';
import { UnoGameState, ZombieGameState, ZombieInput } from '@ascii-game/shared-types';
import { FixedPoint, LerpMath } from '@ascii-game/core-math';

export default function JoinRoom({ params }: { params: { roomCode: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AsciiRenderer | null>(null);

  // Ref chứa Object của 2 trò chơi
  const unoCacheRef = useRef<UnoSpriteCache | null>(null);
  const zombieCacheRef = useRef<ZombieSpriteCache | null>(null);

  const [gameStateUno, setGameStateUno] = useState<UnoGameState | null>(null);
  const [gameStateZombie, setGameStateZombie] = useState<ZombieGameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('ĐANG KẾT NỐI TỚI GAME WORKER...');

  const gameType = useRef<'uno'|'zombie'>('uno');

  // Thêm hệ thống Lerp Buffer
  const prevZombieState = useRef<ZombieGameState | null>(null);
  const targetZombieState = useRef<ZombieGameState | null>(null);
  const lerpStartMs = useRef<number>(0);

  // Nhận nút di chuyển từ bàn phím (Zombie Mode)
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
    const workerPort = urlParams.get('workerPort') || '8081';
    gameType.current = urlParams.get('game') === 'zombie-invasion' ? 'zombie' : 'uno';

    let myPlayerId = urlParams.get('hostId');
    if (!myPlayerId) myPlayerId = 'p_' + (Date.now() % 9999);
    setPlayerId(myPlayerId);

    const wsUrl = `ws://localhost:${workerPort}/ws-connect?room=${params.roomCode}&player=${myPlayerId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setStatusText('KẾT NỐI THÀNH CÔNG. ĐANG CHỜ ĐỒNG BỘ STATE...');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'STATE_UPDATE' || data.type === 'STATE_SYNC') {
           if (gameType.current === 'uno') {
              setGameStateUno(data.state);
              setStatusText(`ĐANG TRONG TRẬN... (${data.state.players?.length || 0} Players)`);
           } else {
              // --- Zombie Logic: Lưu state vào bộ đệm Lerp ---
              prevZombieState.current = targetZombieState.current || data.state;
              targetZombieState.current = data.state;
              lerpStartMs.current = performance.now();
              setGameStateZombie(data.state); // Dùng để kích trigger render
              setStatusText(`ZOMBIE INVASION! Wave: ${data.state.wave} | Ticks: ${data.tick}`);
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
      unoCacheRef.current = new UnoSpriteCache(rendererRef.current.getCache());
      unoCacheRef.current.preRenderBackCard();
    } else {
      zombieCacheRef.current = new ZombieSpriteCache(rendererRef.current.getCache());
      zombieCacheRef.current.preRenderAll();
    }
  }, []);

  // Render Loop (60FPS Interpolation Dual Loop)
  useEffect(() => {
    if (!rendererRef.current || !canvasRef.current || !playerId) return;

    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    let animationFrameId: number;

    const renderUno = () => {
      if (!gameStateUno || !unoCacheRef.current) return;
      renderer.clear();
      const unoCache = unoCacheRef.current;

      gameStateUno.players.forEach(p => p.hand.forEach(c => unoCache.preRenderCard(c.id, c.color, c.value)));
      if (gameStateUno.discardPile.length > 0) {
        const topDiscard = gameStateUno.discardPile[gameStateUno.discardPile.length - 1];
        unoCache.preRenderCard(topDiscard.id, topDiscard.color, topDiscard.value);
      }

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#00AA00';
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText(`ROOM: ${params.roomCode} | STATUS: ${gameStateUno.status} | TURN: Player ${gameStateUno.currentTurnIndex}`, 20, 20);

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
        ctx.fillText(`BÀI CỦA BẠN (LƯỢT CỦA BẠN: ${isMyTurn ? 'CÓ' : 'KHÔNG'})`, 20, canvas.height - 120);
        myState.hand.forEach((card, idx) => {
          renderer.drawSprite(card.id, 20 + idx * 45, canvas.height - 100);
        });
      }

      const opponents = gameStateUno.players.filter(p => p.playerId !== playerId);
      opponents.forEach((opp, oIdx) => {
        const isOppTurn = (gameStateUno.players[gameStateUno.currentTurnIndex]?.playerId === opp.playerId);
        ctx.fillStyle = isOppTurn ? '#FF3333' : '#AA0000';
        ctx.fillText(`PLAYER: ${opp.playerId} (${opp.hand.length} lá)`, 20, 50 + (oIdx * 90));
        for(let i=0; i < opp.hand.length; i++) renderer.drawSprite('CARD_BACK', 20 + i*20, 70 + (oIdx*90));
      });
    };

    const renderZombie = (timeMs: number) => {
      if (!prevZombieState.current || !targetZombieState.current || !zombieCacheRef.current) return;
      renderer.clear();
      const zCache = zombieCacheRef.current;

      // Tính Lerp Ratio (Time trôi qua chia cho TICK_RATE 33.3ms)
      const elapsedMs = performance.now() - lerpStartMs.current;
      const tLerp = Math.min(1000, Math.floor((elapsedMs / 33.3) * 1000)); // Fixed Point ratio

      const prev = prevZombieState.current;
      const target = targetZombieState.current;

      // Vẽ nền cỏ (Giả lập)
      for(let x=0; x<canvas.width; x+=30) {
         for(let y=0; y<canvas.height; y+=30) {
            renderer.drawSprite('GRASS_TILE', x, y);
         }
      }

      // Vẽ Zombie (Lerp tọa độ)
      target.zombies.forEach(zTarget => {
         const zPrev = prev.zombies.find(z => z.id === zTarget.id);
         let drawX = FixedPoint.toFloat(zTarget.x);
         let drawY = FixedPoint.toFloat(zTarget.y);

         if (zPrev) {
            drawX = FixedPoint.toFloat(LerpMath.lerpFixed(zPrev.x, zTarget.x, tLerp));
            drawY = FixedPoint.toFloat(LerpMath.lerpFixed(zPrev.y, zTarget.y, tLerp));
         }

         // Tráo khung hình (Frame-swapping) dựa trên thời gian
         const spriteId = zCache.getZombieSpriteId(timeMs);
         renderer.drawSprite(spriteId, drawX, drawY);
      });

      // Vẽ Heroes
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
         ctx.fillText(`HP: ${hTarget.hp}`, drawX, drawY - 10);
      });
    };

    const loop = (timeMs: number) => {
      if (gameType.current === 'uno') renderUno();
      else renderZombie(timeMs);
      animationFrameId = requestAnimationFrame(loop);
    };

    loop(performance.now());
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStateUno, gameStateZombie, playerId, params.roomCode]);

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
            if (gameType.current !== 'uno' || !gameStateUno || !playerId) return;
            const myState = gameStateUno.players.find(p => p.playerId === playerId);
            if (!myState || gameStateUno.players[gameStateUno.currentTurnIndex]?.playerId !== playerId) return;

            const rect = canvasRef.current!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = 800 / 2;
            const centerY = 600 / 2;
            if (x >= centerX - 80 && x <= centerX - 80 + 70 && y >= centerY - 40 && y <= centerY - 40 + 90) {
               (window as any).gameWs?.send(JSON.stringify({ type: 'ACT_DRAW', playerId }));
               return;
            }

            const handY = 600 - 100;
            if (y >= handY && y <= handY + 90) {
               for (let i = myState.hand.length - 1; i >= 0; i--) {
                  const cardX = 20 + i * 45;
                  if (x >= cardX && x <= cardX + 70) {
                     const card = myState.hand[i];
                     (window as any).gameWs?.send(JSON.stringify({
                       type: 'ACT_DISCARD',
                       playerId,
                       cardId: card.id,
                       declaredColor: card.color === 'WILD' ? 'RED' : undefined
                     }));
                     return;
                  }
               }
            }
          }}
        />
      </div>
    </div>
  );
}
