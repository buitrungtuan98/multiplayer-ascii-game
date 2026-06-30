import React, { useState } from 'react';

export interface AsciiButtonProps {
  onClick?: () => void;
  children: string;
  width?: number;
}

export const AsciiButton: React.FC<AsciiButtonProps> = ({ onClick, children, width }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const text = children;
  const paddingLength = Math.max(0, (width || text.length + 4) - text.length - 2);
  const padLeft = Math.floor(paddingLength / 2);
  const padRight = Math.ceil(paddingLength / 2);

  const innerText = `${' '.repeat(padLeft)}${text}${' '.repeat(padRight)}`;
  const topBorder = `┌${'─'.repeat(innerText.length)}┐`;
  const bottomBorder = `└${'─'.repeat(innerText.length)}┘`;

  const defaultStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", "Courier New", monospace',
    whiteSpace: 'pre',
    lineHeight: '1.2',
    color: '#00ff00',
    backgroundColor: '#000000',
    display: 'inline-block',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const hoverStyle: React.CSSProperties = {
    ...defaultStyle,
    color: '#000000',
    backgroundColor: '#00ff00',
  };

  const activeStyle: React.CSSProperties = {
    ...defaultStyle,
    color: '#ffffff',
    backgroundColor: '#00aa00',
  };

  const currentStyle = active ? activeStyle : hovered ? hoverStyle : defaultStyle;

  return (
    <div
      style={currentStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      <div>{topBorder}</div>
      <div>│{innerText}│</div>
      <div>{bottomBorder}</div>
    </div>
  );
};
