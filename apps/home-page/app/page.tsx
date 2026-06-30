"use client";

import { AsciiBox, AsciiButton } from '@ascii-game/ui-ascii';

export default function Home() {
  const logo = `
   ___  _____  ______________   __  __       _
  / _ \\/ __/ |/ /_  __/ __/ /  / / / /__    (_)__  ___ _______ ___
 / __ /\\ \\/    / / / / _// /__/ /_/ / _ \\  / / _ \\/ -_) __(_-</ -_)
/_/ |_/___/_/|_/ /_/ /___/____/\\____/_//_/_/ /_//_/\\__/_/ /___/\\__/

  `;

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <pre style={{ color: '#00ff00', fontWeight: 'bold' }}>{logo}</pre>

      <AsciiBox title="PUBLIC LOBBY" width={60} style={{ marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Welcome to the ASCII Game Universe!
          <br /><br />
          Experience fully deterministic lockstep games
          <br />rendered 100% via ASCII Art.
        </div>
      </AsciiBox>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <AsciiBox title="GAME: UNO" width={30}>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>Turn-based Card Game</div>
            <AsciiButton onClick={() => window.location.href='/lobby/uno'}>
              JOIN LOBBY
            </AsciiButton>
          </div>
        </AsciiBox>

        <AsciiBox title="GAME: ZOMBIE" width={30}>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>30Hz CO-OP Survival</div>
            <AsciiButton onClick={() => window.location.href='/lobby/zombie-invasion'}>
              JOIN LOBBY
            </AsciiButton>
          </div>
        </AsciiBox>

        <AsciiBox title="GAME: AoE" width={30}>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>15Hz Lockstep RTS</div>
            <AsciiButton onClick={() => window.location.href='/lobby/aoe'}>
              JOIN LOBBY
            </AsciiButton>
          </div>
        </AsciiBox>
      </div>
    </div>
  );
}
