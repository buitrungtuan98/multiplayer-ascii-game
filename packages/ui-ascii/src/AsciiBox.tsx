import React, { useRef, useEffect, useState } from 'react';

export interface AsciiBoxProps {
  children?: React.ReactNode;
  width?: number;
  title?: string;
  style?: React.CSSProperties;
}

export const AsciiBox: React.FC<AsciiBoxProps> = ({ children, width = 40, title, style }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      // Get height of content in characters (approximate based on line-height)
      const computedStyle = window.getComputedStyle(contentRef.current);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const height = contentRef.current.getBoundingClientRect().height;

      // Calculate how many lines of text we have
      const lines = Math.max(1, Math.ceil(height / lineHeight));
      setContentHeight(lines);
    }
  }, [children]);

  const horizontalLine = '─'.repeat(Math.max(0, width - 2));
  const titleString = title ? ` ${title} ` : '';
  const topBorder = `┌${titleString.padEnd(width - 2, '─')}┐`;
  const bottomBorder = `└${horizontalLine}┘`;

  // Generate vertical bars that span the height of the content
  const leftBorder = Array.from({ length: contentHeight }).map((_, i) => <div key={i}>│</div>);
  const rightBorder = Array.from({ length: contentHeight }).map((_, i) => <div key={i}>│</div>);

  return (
    <div style={{
      fontFamily: '"JetBrains Mono", "Courier New", Courier, monospace',
      lineHeight: '1.2',
      color: '#00ff00',
      backgroundColor: '#000000',
      display: 'inline-block',
      ...style
    }}>
      <div style={{ whiteSpace: 'pre' }}>{topBorder}</div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {leftBorder}
        </div>
        <div ref={contentRef} style={{ width: `${width - 2}ch`, overflow: 'hidden' }}>
          {children}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rightBorder}
        </div>
      </div>
      <div style={{ whiteSpace: 'pre' }}>{bottomBorder}</div>
    </div>
  );
};
