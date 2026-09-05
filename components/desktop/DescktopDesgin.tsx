import { useRef, type ReactNode } from 'react';

type Props = {
  title: string;
  artwork: ReactNode;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onDoubleActivate?: () => void;
  openOnSingleClick?: boolean;
  onDragBy?: (dx: number, dy: number) => void;
  style?: React.CSSProperties;
  className?: string;
};

export function DesktopIcon({ title, artwork, selected, onSelect, onOpen, onDoubleActivate, openOnSingleClick = false, onDragBy, style, className }: Props) {
  const drag = useRef<{ pointerId: number; startX: number; startY: number; threshold: number; moved: boolean } | null>(null);
  const pointerType = useRef('mouse');
  const suppressClick = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!e.isPrimary || e.button !== 0 || drag.current) return;
    pointerType.current = e.pointerType;
    suppressClick.current = false;
    if (!onDragBy) return;
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, threshold: e.pointerType === 'touch' ? 8 : 4, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > d.threshold) {
      d.moved = true;
      suppressClick.current = true;
      onSelect();
    }
    if (d.moved) {
      onDragBy?.(dx, dy);
      d.startX = e.clientX;
      d.startY = e.clientY;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current || drag.current.pointerId !== e.pointerId) return;
    suppressClick.current = drag.current.moved;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <button
      type="button"
      style={style}
      aria-label={title}
      aria-pressed={selected}
      onClick={() => {
        if (suppressClick.current) return;
        onSelect();
        onOpen();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={(e) => {
        if (drag.current?.pointerId !== e.pointerId) return;
        suppressClick.current = true;
        drag.current = null;
      }}
      onLostPointerCapture={(e) => {
        if (drag.current?.pointerId !== e.pointerId) return;
        suppressClick.current = true;
        drag.current = null;
      }}
      onDragStart={(e) => e.preventDefault()}
      onDoubleClick={() => {
        if (!openOnSingleClick && pointerType.current !== 'touch' && !suppressClick.current) onDoubleActivate?.();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          suppressClick.current = false;
          onOpen();
        }
      }}
      className={`desktop-icon group flex w-[104px] flex-col items-center gap-2 rounded-lg p-2 text-center transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        selected ? 'bg-desktop-ink/20' : 'hover:bg-desktop-ink/10'
      } ${onDragBy ? 'cursor-grab touch-none active:cursor-grabbing' : 'cursor-pointer'} ${className ?? ''}`}
    >
      {artwork}
      <span className="text-desktop-ink w-full text-xs leading-tight font-medium break-words drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{title}</span>
    </button>
  );
}
