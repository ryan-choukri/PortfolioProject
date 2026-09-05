import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { WindowState } from '@/hooks/useWindowsManager';

type Props = {
  state: WindowState;
  title: string;
  isMobile: boolean;
  children: ReactNode;
  onBack?: () => void;
  backTitle?: string;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

export function OSWindow({ state, title, isMobile, children, onBack, backTitle, onClose, onMinimize, onToggleMaximize, onFocus, onMove, onResize }: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (drag.current) {
        onMove(clamp(e.clientX - drag.current.dx, 0, window.innerWidth - state.w), clamp(e.clientY - drag.current.dy, 28, window.innerHeight - 60));
      } else if (resizeRef.current) {
        const r = resizeRef.current;
        onResize(clamp(r.w + (e.clientX - r.x), 320, window.innerWidth - state.x - 8), clamp(r.h + (e.clientY - r.y), 220, window.innerHeight - state.y - 8));
      }
    };
    const onPointerUp = () => {
      drag.current = null;
      resizeRef.current = null;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [onMove, onResize, state.w, state.x, state.y]);

  if (state.minimized) return null;

  const fullscreen = isMobile || state.maximized;

  const frameStyle = fullscreen
    ? { left: 0, top: isMobile ? 28 : 28, width: '100%', height: `calc(100% - ${isMobile ? 108 : 96}px)`, zIndex: state.z }
    : { left: state.x, top: state.y, width: state.w, height: state.h, zIndex: state.z };

  return (
    <div
      role="dialog"
      aria-label={title}
      onPointerDown={onFocus}
      style={frameStyle}
      className={`os-window bg-window text-window-foreground ring-border fixed flex flex-col overflow-hidden rounded-xl shadow-[var(--shadow-window)] ring-1 transition-[opacity,transform] duration-200 ${
        mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
    >
      <div
        onPointerDown={(e) => {
          if (fullscreen || e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
          e.preventDefault();
          drag.current = { dx: e.clientX - state.x, dy: e.clientY - state.y };
        }}
        onDoubleClick={onToggleMaximize}
        className="bg-window-chrome border-border flex shrink-0 cursor-grab touch-none items-center gap-2 border-b px-3 py-2.5 select-none active:cursor-grabbing"
      >
        <div className="flex shrink-0 items-center gap-1.5" onDoubleClick={(event) => event.stopPropagation()}>
          <button aria-label="Fermer" onClick={onClose} className="bg-traffic-red size-3 rounded-full transition-opacity hover:opacity-70" />
          <button aria-label="Réduire" onClick={onMinimize} className="bg-traffic-yellow size-3 rounded-full transition-opacity hover:opacity-70" />
          <button aria-label="Plein écran" onClick={onToggleMaximize} className="bg-traffic-green size-3 rounded-full transition-opacity hover:opacity-70" />
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            onDoubleClick={(event) => event.stopPropagation()}
            aria-label={backTitle ? `Retour à ${backTitle}` : 'Retour à la page précédente'}
            title={backTitle ? `Retour à ${backTitle}` : 'Retour à la page précédente'}
            className="border-border -my-1 ml-1 flex min-h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2 text-xs font-medium transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:hover:bg-white/10"
          >
            <ArrowLeft size={15} strokeWidth={2.5} aria-hidden="true" />
            Retour
          </button>
        )}
        <span className="min-w-0 truncate pl-2 text-xs font-medium opacity-80">{title}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

      {!fullscreen && (
        <div
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            onFocus();
            resizeRef.current = { x: e.clientX, y: e.clientY, w: state.w, h: state.h };
          }}
          className="absolute right-0 bottom-0 size-4 cursor-nwse-resize touch-none"
        />
      )}
    </div>
  );
}
