"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Info } from 'lucide-react';
import { AsciiBox } from '@ascii-game/ui-ascii';

export default function About() {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <header className="mb-8">
          <div className="text-2xl font-bold text-[#33FF33] mb-4 border-b border-[#005500] pb-2 drop-shadow-[0_0_10px_rgba(51,255,51,0.6)]">
            ASCII GAME UNIVERSE
          </div>

          <nav className="flex flex-wrap border-b border-[#005500] pb-2 gap-6 mt-4">
            <button
              onClick={() => window.location.href='/'}
              className="text-[#00AA00] hover:text-[#C0FFC0] hover:shadow-[0_0_10px_rgba(192,255,192,0.5)] transition-all flex items-center cursor-pointer"
            >
              <Terminal size={16} className="mr-2" /> ~/home
            </button>
            <button className="text-[#C0FFC0] font-bold glow-text-light flex items-center cursor-pointer">
              <Info size={16} className="mr-2" /> ~/about_us
            </button>
            <span className="text-[#005500] ml-auto flex items-center font-bold hidden sm:flex">
              [ ĐANG ĐỌC TÀI LIỆU SYSTEM ]
            </span>
          </nav>
        </header>

        <main className="min-h-[500px]">
          <div className="mb-4 text-[#00AA00] text-sm flex items-center glow-text-light">
            root@oracle-core-1: <span className="text-[#33FF33] ml-1">/var/www/about</span>$ cat architecture.md
            {blink ? '█' : ' '}
          </div>

          <div className="space-y-6 text-[#00AA00] animate-fade-in">
            <div className="border-l-4 border-[#33FF33] pl-4 py-2 bg-[#005500]/10">
              <h2 className="text-2xl font-bold text-[#33FF33] mb-2 glow-text">/ABOUT_US (GIỚI THIỆU DỰ ÁN)</h2>
              <p className="text-[#00AA00] leading-relaxed text-justify">
                Dự án <strong>ASCII GAME UNIVERSE</strong> được phát triển dựa trên niềm đam mê mãnh liệt đối với lối chơi (gameplay) cốt lõi của các tựa game kinh điển thế kỷ trước.
                Bằng việc lược bỏ đồ họa 3D nặng nề, chúng tôi xây dựng một môi trường kết nối multiplayer gọn nhẹ, mượt mà và bảo mật tuyệt đối, chạy hoàn toàn thông qua việc vẽ ký tự ASCII trực tiếp bằng GPU phần cứng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <AsciiBox>
                <h3 className="font-bold text-[#33FF33] mb-3 flex items-center glow-text-light">
                  <Cpu className="mr-2" size={18}/> KỸ THUẬT RENDER ĐỒ HỌA 2.5D
                </h3>
                <p className="text-sm text-[#00AA00] leading-relaxed mb-4">
                  Để tạo độ sâu (chiều thứ 3) từ các ký tự 2D, hệ thống sử dụng phép ánh xạ ma trận Isometric Projection. Hệ tọa độ màn hình $(X, Y)$ được biến đổi theo tỉ lệ chênh lệch khoảng cách khoảng trống:
                </p>
                <pre className="bg-[#020a02] p-3 text-xs border border-[#005500] text-[#33FF33] leading-tight font-mono">
{`          /\\         <- Gốc Tọa Độ (0,0)
         /\\/\\
        /\\/\\/\\       Mỗi "Block" ký tự được phân lớp
        \\/\\/\\/       độ cao (Z-Index ảo) để chống
         \\/\\/        hiện tượng vẽ đè lỗi (Z-fighting).
          \\/         <- (N,N)`}
                </pre>
              </AsciiBox>

              <AsciiBox>
                <div>
                  <h3 className="font-bold text-[#33FF33] mb-3 flex items-center glow-text-light">
                    <Shield className="mr-2" size={18}/> CƠ CHẾ KHÔNG LƯU TRỮ TRẠNG THÁI (STATELESS)
                  </h3>
                  <p className="text-sm text-[#00AA00] leading-relaxed text-justify">
                    Nhằm triệt tiêu chi phí tài nguyên lưu trữ và nguy cơ rò rỉ dữ liệu, phòng chơi của từng nhóm được lưu trữ trực tiếp trên bộ nhớ RAM tạm thời (In-Memory). Game vận hành qua cơ chế Lockstep Deterministic đồng bộ hóa đầu vào ở tần số 10Hz, mang lại trải nghiệm không giật lag ngay cả ở cấu hình siêu thấp.
                  </p>
                </div>
                <div className="border-t border-[#005500] pt-4 mt-4 text-xs text-[#00AA00] font-bold">
                  &gt; STACK: HTML5 Canvas API | React State Machine | CRT Shader Simulation.
                </div>
              </AsciiBox>
            </div>
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
