"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AsciiRenderer } from '@ascii-game/ascii-renderer';
import { UnoSpriteCache } from '@ascii-game/ascii-renderer';
import { UnoGameState } from '@ascii-game/shared-types';

export default function JoinRoom({ params }: { params: { roomCode: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AsciiRenderer | null>(null);
  const cacheRef = useRef<UnoSpriteCache | null>(null);
  const [gameState, setGameState] = useState<UnoGameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('ĐANG KẾT NỐI TỚI GAME WORKER...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const workerPort = urlParams.get('workerPort') || '8081';

    let myPlayerId = urlParams.get('hostId');
    if (!myPlayerId) {
       myPlayerId = 'p_' + (Date.now() % 9999);
    }
    setPlayerId(myPlayerId);

    const wsUrl = \`ws://localhost:\${workerPort}/ws-connect?room=\${params.roomCode}&player=\${myPlayerId}\`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setStatusText('KẾT NỐI THÀNH CÔNG. ĐANG CHỜ ĐỒNG BỘ STATE...');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'STATE_UPDATE') {
          setGameState(data.state);
          setStatusText(\`ĐANG TRONG TRẬN... (\${data.state.players.length} Players)\`);
        }
      } catch(e) {}
    };

    ws.onclose = () => {
      setStatusText('MẤT KẾT NỐI TỚI GAME WORKER!');
    };

    (window as any).gameWs = ws;

    return () => {
      ws.close();
      delete (window as any).gameWs;
    };
  }, [params.roomCode]);

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new AsciiRenderer(canvasRef.current);
    cacheRef.current = new UnoSpriteCache(rendererRef.current.getCache());
    cacheRef.current.preRenderBackCard();
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !cacheRef.current || !gameState || !playerId || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    const unoCache = cacheRef.current;

    gameState.players.forEach(p => {
      p.hand.forEach(c => unoCache.preRenderCard(c.id, c.color, c.value));
    });
    if (gameState.discardPile.length > 0) {
      const topDiscard = gameState.discardPile[gameState.discardPile.length - 1];
      unoCache.preRenderCard(topDiscard.id, topDiscard.color, topDiscard.value);
    }

    let animationFrameId: number;

    const render = () => {
      renderer.clear();

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#00AA00';
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText(\`ROOM: \${params.roomCode} | STATUS: \${gameState.status} | TURN: Player \${gameState.currentTurnIndex}\`, 20, 20);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      renderer.drawSprite('CARD_BACK', centerX - 80, centerY - 40);

      if (gameState.discardPile.length > 0) {
         const topCard = gameState.discardPile[gameState.discardPile.length - 1];
         renderer.drawSprite(topCard.id, centerX + 10, centerY - 40);
      }

      const myState = gameState.players.find(p => p.playerId === playerId);
      if (myState) {
        const isMyTurn = (gameState.players[gameState.currentTurnIndex] && gameState.players[gameState.currentTurnIndex].playerId === playerId);
        ctx.fillStyle = isMyTurn ? '#33FF33' : '#00AA00';
        ctx.fillText(\`BÀI CỦA BẠN (LƯỢT CỦA BẠN: \${isMyTurn ? 'CÓ' : 'KHÔNG'})\`, 20, canvas.height - 120);

        myState.hand.forEach((card, idx) => {
          const x = 20 + idx * 45;
          const y = canvas.height - 100;
          renderer.drawSprite(card.id, x, y);
        });
      }

      const opponents = gameState.players.filter(p => p.playerId !== playerId);
      opponents.forEach((opp, oIdx) => {
        const isOppTurn = (gameState.players[gameState.currentTurnIndex] && gameState.players[gameState.currentTurnIndex].playerId === opp.playerId);
        ctx.fillStyle = isOppTurn ? '#FF3333' : '#AA0000';
        ctx.fillText(\`PLAYER: \${opp.playerId} (\${opp.hand.length} lá)\`, 20, 50 + (oIdx * 90));
        for(let i=0; i < opp.hand.length; i++) {
           renderer.drawSprite('CARD_BACK', 20 + i*20, 70 + (oIdx*90));
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, playerId, params.roomCode]);

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
            if (!gameState || !playerId) return;
            const myState = gameState.players.find(p => p.playerId === playerId);
            if (!myState || gameState.players[gameState.currentTurnIndex]?.playerId !== playerId) return;

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
