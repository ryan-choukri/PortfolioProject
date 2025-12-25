'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

interface TextScrambleProps {
  text: string;
  className?: string;
}

export function TextScramble({ text, className = '' }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameRef = useRef(0);
  const hasScrambledOnce = useRef(false);

  const scramble = useCallback(() => {
    setIsScrambling(true);
    frameRef.current = 0;
    const duration = text.length * 3;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      frameRef.current++;

      const progress = frameRef.current / duration;
      const revealedLength = Math.floor(progress * text.length);

      const newText = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < revealedLength) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplayText(newText);

      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);
  }, [text]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    scramble();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    if (hasScrambledOnce.current) return;
    hasScrambledOnce.current = true;

    const id = requestAnimationFrame(() => {
      scramble();
    });

    return () => {
      cancelAnimationFrame(id);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [scramble]);

  return (
    <div style={{ textWrap: 'nowrap' }} className={`group relative inline-flex cursor-pointer flex-col select-none ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className="relative">
        {displayText.split('').map((char, i) => (
          <span
            key={i}
            className={`inline-block transition-all duration-200 ${isScrambling && char !== text[i] ? 'text-primary scale-110' : 'text-foreground'}`}
            style={{
              transitionDelay: `${i * 15}ms`,
            }}>
            {char}
          </span>
        ))}
      </span>

      {/* Animated underline */}
      {/* <span className="relative mt-2 h-px w-full overflow-hidden">
        <span className={`bg-foreground absolute inset-0 origin-left transition-transform duration-500 ease-out ${isHovering ? 'scale-x-100' : 'scale-x-0'}`} />
        <span className="bg-border absolute inset-0" />
      </span> */}

      {/* Subtle glow on hover */}
      <span className={`bg-primary/5 absolute -inset-4 -z-10 rounded-lg transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
