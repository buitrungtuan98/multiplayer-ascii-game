"use client";

import { AsciiBox, AsciiButton } from '@ascii-game/ui-ascii';

export default function Lobby() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ marginBottom: '2rem' }}>
        <AsciiButton onClick={() => window.location.href='/'}>
          {'< BACK TO HOME'}
        </AsciiButton>
      </div>

      <AsciiBox title="PUBLIC ROOM BROWSER" width={80} style={{ marginBottom: '2rem' }}>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #00ff00', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '15ch' }}>ROOM ID</span>
            <span style={{ width: '20ch' }}>HOST</span>
            <span style={{ width: '15ch' }}>GAME</span>
            <span style={{ width: '10ch' }}>PLAYERS</span>
            <span style={{ width: '10ch' }}>ACTION</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ width: '15ch' }}>X7A9B</span>
            <span style={{ width: '20ch' }}>Hacker01</span>
            <span style={{ width: '15ch' }}>UNO</span>
            <span style={{ width: '10ch' }}>3/10</span>
            <span style={{ width: '10ch' }}>
              <AsciiButton onClick={() => alert('Join clicked!')}>JOIN</AsciiButton>
            </span>
          </div>
        </div>
      </AsciiBox>

      <AsciiBox title="CREATE NEW ROOM" width={50}>
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div>PLAYER NAME:</div>
            <div style={{ border: '1px solid #00ff00', padding: '0.5rem', marginTop: '0.5rem' }}>
              <input type="text" defaultValue="Player1" style={{
                background: 'transparent',
                border: 'none',
                color: '#00ff00',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                outline: 'none',
                width: '100%'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <AsciiButton width={20}>PUBLIC</AsciiButton>
            <AsciiButton width={20}>PRIVATE</AsciiButton>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <AsciiButton width={46} onClick={() => alert('Create Room')}>
              CREATE_ROOM
            </AsciiButton>
          </div>
        </div>
      </AsciiBox>
    </div>
  );
}
