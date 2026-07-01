"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Gamepad2, Globe, Radio, Info } from 'lucide-react';
import { AsciiBox } from '@ascii-game/ui-ascii';

const ASCII_LOGO = `
    ___  _____ ______________   __  ___      ____  _
   /   |/ ___// ____/  _/  _/  /  |/  /_  __/ / /_(_)
  / /| |\\__ \\/ /    / / / /   / /|_/ / / / / / __/ /
 / ___ |___/ / /___/ / / /   / /  / / /_/ / / /_/ /
/_/  |_/____/\\____/___/___/ /_/  /_/\\__,_/_/\\__/_/
         G A M E   U N I V E R S E
`;

const games = [
  { id: 'aoe', title: 'A.G.E OF EMPIRES', type: 'RTS Lockstep', status: 'ONLINE', ccu: 4512, desc: 'Xây dựng đế chế, khai thác tài nguyên gỗ/thịt và điều khiển nông dân trong thời gian thực trên bản đồ Isometric 2.5D.', maxPlayers: 8 },
  { id: 'starcraft', title: 'STARCRAFT: SECTOR X', type: 'Sci-Fi RTS', status: 'BETA', ccu: 1205, desc: 'Chỉ huy binh đoàn Terran chống lại các hiểm họa vũ trụ. Quản lý tài nguyên khoáng sản (Minerals) và huấn luyện lính Marine.', maxPlayers: 8 },
  { id: 'zombie', title: 'ZOMBIE INVASION', type: 'Co-op Survival', status: 'DEV', ccu: 342, desc: 'Phòng thủ căn cứ Bunker trước làn sóng Zombie ASCII vô tận. Sử dụng súng máy tầm xa tiêu diệt mục tiêu di động.', maxPlayers: 4 },
  { id: 'uno', title: 'TERMINAL U.N.O', type: 'Board Game', status: 'ONLINE', ccu: 8432, desc: 'Game bài huyền thoại phiên bản Terminal cổ điển. Trải nghiệm rút bài, đánh bài đổi màu sắc trực quan qua Canvas.', maxPlayers: 10 }
];

export default function Home() {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <header className="mb-8">
          <pre className="text-[#33FF33] font-bold text-xs md:text-sm overflow-hidden whitespace-pre-wrap leading-tight hidden md:block drop-shadow-[0_0_10px_rgba(51,255,51,0.6)]">
            {ASCII_LOGO}
          </pre>
          <div className="md:hidden text-2xl font-bold text-[#33FF33] mb-4 border-b border-[#005500] pb-2 drop-shadow-[0_0_10px_rgba(51,255,51,0.6)] text-center">
            ASCII GAME UNIVERSE
          </div>

          <nav className="flex flex-wrap border-b border-[#005500] pb-2 gap-6 mt-4">
            <button className="text-[#C0FFC0] font-bold glow-text-light flex items-center cursor-pointer">
              <Terminal size={16} className="mr-2" /> ~/home
            </button>
            <button
              onClick={() => window.location.href='/about'}
              className="text-[#00AA00] hover:text-[#C0FFC0] hover:shadow-[0_0_10px_rgba(192,255,192,0.5)] transition-all flex items-center cursor-pointer"
            >
              <Info size={16} className="mr-2" /> ~/about_us
            </button>
            <span className="text-[#005500] ml-auto flex items-center font-bold hidden sm:flex">
              [ THIẾT BỊ ONLINE ]
            </span>
          </nav>
        </header>

        <main className="min-h-[500px]">
          <div className="mb-4 text-[#00AA00] text-sm flex items-center glow-text-light">
            root@oracle-core-1: <span className="text-[#33FF33] ml-1">/var/www/home</span>$ ls -la
            {blink ? '█' : ' '}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <AsciiBox
                key={game.id}
                onClick={() => window.location.href=`http://localhost:3001/lobby/${game.id}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:text-[#33FF33] transition-all transform group-hover:scale-110">
                  <Gamepad2 size={80} />
                </div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <h3 className="text-xl font-bold text-[#C0FFC0] glow-text-light group-hover:text-[#33FF33]">[{game.title}]</h3>
                  <span className={`text-xs px-2 py-1 border ${game.status === 'ONLINE' ? 'border-[#33FF33] text-[#33FF33] glow-box' : 'border-yellow-500 text-yellow-500'}`}>
                    {game.status}
                  </span>
                </div>
                <div className="text-sm text-[#33FF33] mb-4 flex-grow relative z-10 font-bold">{game.type}</div>
                <p className="text-sm text-[#00AA00] mb-6 flex-grow relative z-10">{game.desc}</p>
                <div className="flex justify-between items-center border-t border-[#005500] pt-3 mt-auto relative z-10">
                  <div className="text-xs text-[#00AA00]">
                    <Radio size={12} className="inline mr-1 mb-1 animate-pulse" />
                    NODES: {game.ccu.toLocaleString()}
                  </div>
                  <button className="text-black bg-[#33FF33] shadow-[0_0_10px_rgba(51,255,51,0.6)] hover:bg-[#C0FFC0] px-4 py-1 text-sm font-bold flex items-center transition-all cursor-pointer">
                    <Globe size={14} className="mr-2" /> ENTER_HUB
                  </button>
                </div>
              </AsciiBox>
            ))}
          </div>
        </main>

        <footer className="mt-12 border-t border-[#005500] pt-4 text-xs text-[#00AA00] flex justify-between">
          <div>SYSTEM v2.5.2 (ARM64_Glow_Final)</div>
          <div className="glow-text-light">ENCRYPTED SSL SESSION ACTIVE</div>
        </footer>
      </div>
    </div>
  );
}
