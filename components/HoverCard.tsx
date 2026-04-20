'use client';
import { useState } from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  className?: string;
}

export function HoverCard({ children, style = {}, hoverStyle = {}, className }: HoverCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      style={{ ...style, ...(hovered ? hoverStyle : {}) }}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

interface HoverLinkProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hoverColor?: string;
  baseColor?: string;
}

export function HoverLink({ children, style = {}, hoverColor = 'var(--accent)', baseColor = 'var(--silver)' }: HoverLinkProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      style={{ ...style, color: hovered ? hoverColor : baseColor, transition: 'color 0.2s', cursor: 'pointer' }}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      {children}
    </span>
  );
}
