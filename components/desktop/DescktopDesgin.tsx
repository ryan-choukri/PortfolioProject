import { useRef } from 'react';

type Props = {
  title: string;
  image: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onDragBy?: (dx: number, dy: number) => void;
  style?: React.CSSProperties;
  className?: string;
};

export function DesktopIcon({ title, image, selected, onSelect, onOpen, onDragBy, style, className }: Props) {
  const drag = useRef<{ startX: number; startY: number; moved: boolean } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!onDragBy || e.pointerType === 'touch') return;
    if (e.button !== 0) return;
    drag.current = { startX: e.clientX, startY: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true;
    if (d.moved) {
      onDragBy?.(dx, dy);
      d.startX = e.clientX;
      d.startY = e.clientY;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const wasMoved = drag.current?.moved;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!wasMoved) onSelect();
  };

  return (
    <button
      type="button"
      style={style}
      onClick={onDragBy ? undefined : onSelect}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (drag.current = null)}
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen();
      }}
      className={`group flex w-24 touch-none flex-col items-center gap-1.5 rounded-lg p-1.5 text-center transition-colors ${
        selected ? 'bg-desktop-ink/20' : 'hover:bg-desktop-ink/10'
      } ${onDragBy ? 'cursor-grab active:cursor-grabbing' : ''} ${className ?? ''}`}>
      <img
        src={image}
        alt=""
        loading="lazy"
        width={160}
        height={107}
        draggable={false}
        className="h-12 w-[72px] rounded-md object-cover shadow-[var(--shadow-icon)] ring-1 ring-white/40 transition-transform duration-200 group-hover:-translate-y-0.5"
      />
      <span className="text-desktop-ink w-full text-[11px] leading-tight break-words drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{title}</span>
    </button>
  );
}
