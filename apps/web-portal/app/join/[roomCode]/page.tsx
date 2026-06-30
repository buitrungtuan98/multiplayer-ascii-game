"use client";

import React, { useState, useEffect } from 'react';
import { LogOut, Check, Copy, UserPlus, Swords } from 'lucide-react';
import { AsciiBox } from '@ascii-game/ui-ascii';

export default function Room({ params, searchParams }: { params: { roomCode: string }, searchParams: { host?: string, game?: string } }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [blink, setBlink] = useState(true);

  const isHost = !!searchParams.host;
  const playerName = searchParams.host || 'Guest';

  const [players, setPlayers] = useState([
    { id: 'p1', name: playerName, isHost: isHost, status: 'READY' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    const link = `http://localhost:3001/join/${params.roomCode}`;
    const textArea = document.createElement("textarea");
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedLink(true);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const simulatePlayerJoin = () => {
    setPlayers(prev => [
      ...prev,
      { id: `p${prev.length + 1}`, name: 'Player_' + Math.floor(Math.random() * 1000), isHost: false, status: 'READY' }
    ]);
  };

  const handleLeaveRoom = () => {
    window.location.href = `http://localhost:3001/lobby/${searchParams.game || 'uno'}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center border border-[#33FF33] p-4 bg-[#002200] glow-box shadow-[inset_0_0_20px_rgba(51,255,51,0.2)]">
          <div>
            <div className="text-xs text-[#00AA00] mb-1 flex items-center">
              GAME ĐANG CHỜ: {searchParams.game?.toUpperCase()}
              <span className="ml-3 px-2 py-0.5 border border-[#33FF33] text-[#33FF33] text-[10px] font-bold">
                PUBLIC_NODE
              </span>
            </div>
            <div className="text-3xl font-bold text-[#33FF33] glow-text">ROOM_CODE: [{params.roomCode}]</div>
          </div>
          <button onClick={handleLeaveRoom} className="text-[#FF3333] hover:text-[#fff] hover:shadow-[0_0_15px_rgba(255,51,51,0.8)] flex items-center border border-[#FF3333] p-2 hover:bg-[#FF3333]/20 transition-all cursor-pointer font-bold">
            <LogOut size={16} className="mr-2" /> DISCONNECT
          </button>
        </div>

        <main className="min-h-[500px]">
          <div className="mb-4 text-[#00AA00] text-sm flex items-center glow-text-light">
            root@oracle-core-1: <span className="text-[#33FF33] ml-1">/var/www/room/{params.roomCode}</span>$ tail -f server.log
            {blink ? '█' : ' '}
          </div>

          <AsciiBox className="mb-6">
            <h3 className="text-[#C0FFC0] mb-2 text-sm glow-text-light font-bold">&gt; ĐƯỜNG DẪN THAM GIA PHÒNG CHỜ (MỜI BẠN BÈ):</h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`http://localhost:3001/join/${params.roomCode}?game=${searchParams.game}`}
                className="flex-1 bg-[#020a02] border border-[#005500] text-[#00AA00] p-2 focus:outline-none font-mono selection:bg-[#33FF33] selection:text-black"
              />
              <button
                onClick={handleCopyLink}
                className={`px-6 flex items-center font-bold transition-all cursor-pointer ${copiedLink ? 'bg-[#33FF33] text-black shadow-[0_0_15px_rgba(51,255,51,0.8)]' : 'border border-[#33FF33] text-[#33FF33] hover:bg-[#002200] hover:shadow-[0_0_10px_rgba(51,255,51,0.5)]'}`}
              >
                {copiedLink ? <><Check size={16} className="mr-2"/> COPIED</> : <><Copy size={16} className="mr-2"/> COPY</>}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#005500] flex justify-end">
              <button onClick={simulatePlayerJoin} className="text-xs text-[#FFCC00] hover:text-[#fff] hover:shadow-[0_0_10px_rgba(255,204,0,0.8)] border border-[#FFCC00]/50 px-3 py-1 cursor-pointer transition-all">
                [DEV_TOOLS]: Giả lập 1 Player tham gia phòng
              </button>
            </div>
          </AsciiBox>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AsciiBox>
              <div className="flex justify-between items-center mb-4 border-b border-[#005500] pb-2">
                <h3 className="font-bold text-[#33FF33] glow-text">CONNECTED_NODES (PLAYERS)</h3>
                <span className="text-sm text-[#33FF33] border border-[#33FF33] px-2 glow-box font-bold">{players.length} / 8 MAX</span>
              </div>

              <ul className="space-y-2">
                {players.map((p) => (
                  <li key={p.id} className="flex justify-between items-center p-3 bg-[#002200]/50 border border-[#005500] hover:border-[#33FF33] transition-colors">
                    <span className="text-[#C0FFC0] flex items-center glow-text-light">
                      <UserPlus size={16} className="mr-2 text-[#33FF33]"/>
                      {p.name} {p.isHost && <span className="ml-2 text-xs text-[#FFCC00] glow-text-light font-bold">(HOST)</span>}
                    </span>
                    <span className="text-xs text-black bg-[#33FF33] font-bold px-2 py-1 shadow-[0_0_8px_rgba(51,255,51,0.6)]">[{p.status}]</span>
                  </li>
                ))}
              </ul>
            </AsciiBox>

            <AsciiBox className="flex flex-col justify-between">
              <div className="p-4 flex-1">
                <div className="text-xs text-[#00AA00] mb-2 font-bold">LOGS HỆ THỐNG:</div>
                <div className="text-sm text-[#00AA00] font-mono space-y-1 opacity-80">
                  <div>&gt; Khởi tạo phòng chờ thành công (public).</div>
                  <div>&gt; Đang mở cổng lắng nghe kết nối tại Cổng 8080...</div>
                  {players.length > 1 && <div>&gt; Nhận kết nối an toàn từ 1 node mới thành công.</div>}
                </div>
              </div>

              <button
                className="w-full p-5 font-bold text-lg flex items-center justify-center transition-all bg-[#33FF33] text-black hover:bg-[#C0FFC0] shadow-[0_0_25px_rgba(51,255,51,0.8)] cursor-pointer mt-4"
              >
                <Swords size={20} className="mr-2" />
                INITIALIZE_SIMULATION (START)
              </button>
            </AsciiBox>
          </div>
        </main>
      </div>
    </div>
  );
}
