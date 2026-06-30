"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Globe, Server, Lock } from 'lucide-react';
import { AsciiBox, AsciiButton } from '@ascii-game/ui-ascii';

export default function Lobby({ params }: { params: { gameId: string } }) {
  const [playerName, setPlayerName] = useState('Guest_' + Math.floor(Math.random() * 9999));
  const [roomType, setRoomType] = useState('public');
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(interval);
  }, []);

  const publicRooms = [
    { id: 'X7A9B', host: 'Hacker01', players: 3, maxPlayers: 8, ping: 15 },
    { id: 'Z2V1C', host: 'NeoMatrix', players: 7, maxPlayers: 8, ping: 42 }
  ];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    const newRoomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    window.location.href = `/join/${newRoomCode}?host=${encodeURIComponent(playerName)}&game=${params.gameId}`;
  };

  const handleJoin = (roomId: string) => {
    window.location.href = `/join/${roomId}?game=${params.gameId}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <header className="mb-8 border-b-2 border-[#33FF33] pb-4 glow-box-bottom">
          <div>
            <button onClick={() => window.location.href='http://localhost:3000'} className="text-[#00AA00] hover:text-[#33FF33] mb-2 cursor-pointer flex items-center glow-text-hover font-bold">
              &lt;&lt; VỀ MENU CHÍNH [HOME]
            </button>
            <h2 className="text-3xl font-bold text-[#33FF33] glow-text uppercase">LOBBY SẢNH: {params.gameId}</h2>
          </div>
        </header>

        <main className="min-h-[500px]">
          <div className="mb-4 text-[#00AA00] text-sm flex items-center glow-text-light">
            root@oracle-core-1: <span className="text-[#33FF33] ml-1">/var/www/lobby/{params.gameId}</span>$ netstat -tuln
            {blink ? '█' : ' '}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AsciiBox className="lg:col-span-2">
              <h3 className="text-[#C0FFC0] font-bold mb-4 flex items-center glow-text-light"><Globe size={18} className="mr-2"/> DANH SÁCH LOBBY CÔNG KHAI</h3>

              {publicRooms.length > 0 ? (
                <div className="space-y-3">
                  {publicRooms.map(room => (
                    <div key={room.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-[#005500] hover:border-[#33FF33] hover:bg-[#002200] transition-colors group">
                      <div>
                        <div className="text-[#33FF33] font-bold text-lg group-hover:glow-text">NODE_ID: [{room.id}]</div>
                        <div className="text-xs text-[#00AA00]">CHỦ PHÒNG: {room.host} | ĐỘ TRỄ: {room.ping}ms</div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-between">
                        <div className="text-[#00AA00] text-sm">
                          {room.players} / {room.maxPlayers} THÀNH VIÊN
                        </div>
                        <AsciiButton
                          onClick={() => handleJoin(room.id)}
                          disabled={room.players >= room.maxPlayers}
                          variant="secondary"
                        >
                          JOIN_LOBBY
                        </AsciiButton>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[#005500] italic p-4 text-center border border-dashed border-[#005500]">
                  Không có phòng công khai nào hoạt động. Hãy tạo một phòng mới!
                </div>
              )}
            </AsciiBox>

            <AsciiBox>
              <h3 className="text-[#C0FFC0] font-bold mb-4 flex items-center glow-text-light"><Terminal size={18} className="mr-2"/> PANEL HỆ THỐNG</h3>
              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div>
                  <label className="block text-[#C0FFC0] text-sm mb-2">&gt; TÊN HIỂN THỊ (PLAYER_ID):</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={16}
                    className="w-full bg-[#020a02] border border-[#33FF33] shadow-[0_0_10px_rgba(51,255,51,0.2)] text-[#33FF33] p-3 focus:outline-none focus:shadow-[0_0_20px_rgba(51,255,51,0.5)] transition-all font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#C0FFC0] text-sm mb-2">&gt; TRẠNG THÁI PHÒNG:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setRoomType('public')}
                      className={`p-4 border cursor-pointer transition-all flex items-center justify-center ${roomType === 'public' ? 'border-[#33FF33] bg-[#002200] glow-box shadow-[inset_0_0_15px_rgba(51,255,51,0.3)]' : 'border-[#005500] text-[#00AA00] hover:border-[#00AA00]'}`}
                    >
                      <Globe size={18} className="mr-2" /> PUBLIC
                    </div>
                    <div
                      onClick={() => setRoomType('private')}
                      className={`p-4 border cursor-pointer transition-all flex items-center justify-center ${roomType === 'private' ? 'border-[#33FF33] bg-[#002200] glow-box shadow-[inset_0_0_15px_rgba(51,255,51,0.3)]' : 'border-[#005500] text-[#00AA00] hover:border-[#00AA00]'}`}
                    >
                      <Lock size={18} className="mr-2" /> PRIVATE
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#005500]">
                  <button
                    type="submit"
                    className="w-full bg-[#33FF33] text-black shadow-[0_0_20px_rgba(51,255,51,0.6)] hover:bg-[#C0FFC0] p-4 font-bold flex justify-center items-center transition-all cursor-pointer text-lg"
                  >
                    <Server size={22} className="mr-2" /> KHỞI TẠO PHÒNG MỚI
                  </button>
                </div>
              </form>
            </AsciiBox>
          </div>
        </main>
      </div>
    </div>
  );
}
