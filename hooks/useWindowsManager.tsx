import { useCallback, useState } from 'react';

export type WindowState = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [topZ, setTopZ] = useState(10);

  const focus = useCallback((id: string) => {
    setTopZ((z) => {
      const next = z + 1;
      setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: next, minimized: false } : w)));
      return next;
    });
  }, []);

  const open = useCallback(
    (id: string) => {
      setWindows((ws) => {
        if (ws.some((w) => w.id === id)) return ws;
        const vw = typeof window === 'undefined' ? 1280 : window.innerWidth;
        const vh = typeof window === 'undefined' ? 800 : window.innerHeight;
        const w = clamp(Math.round(vw * 0.52), 320, 820);
        const h = clamp(Math.round(vh * 0.72), 300, 680);
        const offset = ws.length * 28;
        return [
          ...ws,
          {
            id,
            x: clamp(Math.round((vw - w) / 2) + offset - 40, 8, Math.max(8, vw - w - 8)),
            y: clamp(Math.round((vh - h) / 2) + offset - 60, 40, Math.max(40, vh - h - 8)),
            w,
            h,
            z: topZ + 1,
            minimized: false,
            maximized: false,
          },
        ];
      });
      setTopZ((z) => z + 1);
    },
    [topZ]
  );

  const close = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const move = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((id: string, w: number, h: number) => {
    setWindows((ws) => ws.map((win) => (win.id === id ? { ...win, w, h } : win)));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const existing = windows.find((w) => w.id === id);
      if (!existing) open(id);
      else focus(id);
    },
    [windows, open, focus]
  );

  return { windows, open, close, focus, minimize, toggleMaximize, move, resize, toggle };
}
