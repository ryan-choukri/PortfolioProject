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
  history: string[];
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
const nextZ = (windows: WindowState[]) => Math.max(10, ...windows.map((window) => window.z)) + 1;

function createWindow(id: string, current: WindowState[], history: string[] = []): WindowState {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = clamp(Math.round(vw * 0.52), 320, 820);
  const h = clamp(Math.round(vh * 0.72), 260, Math.min(680, vh - 120));
  const offset = (current.length % 5) * 28;
  return {
    id,
    x: clamp(Math.round((vw - w) / 2) + offset - 40, 8, vw - w - 8),
    y: clamp(Math.round((vh - h) / 2) + offset - 30, 40, vh - h - 88),
    w,
    h,
    z: nextZ(current),
    minimized: false,
    maximized: false,
    history,
  };
}

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const focus = useCallback((id: string) => {
    setWindows((current) => current.map((window) => (window.id === id ? { ...window, z: nextZ(current), minimized: false } : window)));
  }, []);

  const activate = useCallback((id: string, toggle = false, sourceId?: string) => {
    setWindows((current) => {
      const existing = current.find((window) => window.id === id);
      if (toggle && existing && !existing.minimized) {
        return current.filter((window) => window.id !== id);
      }
      const source = current.find((window) => window.id === sourceId && window.id !== id);
      const history = source ? [...(source.history ?? []), source.id] : (existing?.history ?? []);
      const z = nextZ(current);
      if (existing) {
        return current.map((window) => (window.id === id ? { ...window, z, minimized: false, history } : window));
      }
      return [...current, createWindow(id, current, history)];
    });
  }, []);

  const open = useCallback((id: string) => activate(id), [activate]);
  const navigate = useCallback((id: string, sourceId: string) => activate(id, false, sourceId), [activate]);
  const back = useCallback((id: string) => {
    setWindows((current) => {
      const history = current.find((window) => window.id === id)?.history ?? [];
      const previousId = history.at(-1);
      if (!previousId) return current;

      const remaining = current.filter((window) => window.id !== id);
      const previousHistory = history.slice(0, -1);
      if (remaining.some((window) => window.id === previousId)) {
        return remaining.map((window) => (window.id === previousId ? { ...window, z: nextZ(current), minimized: false, history: previousHistory } : window));
      }
      return [...remaining, createWindow(previousId, remaining, previousHistory)];
    });
  }, []);
  const toggle = useCallback((id: string) => activate(id, true), [activate]);
  const close = useCallback((id: string) => setWindows((current) => current.filter((window) => window.id !== id)), []);
  const minimize = useCallback((id: string) => setWindows((current) => current.map((window) => (window.id === id ? { ...window, minimized: true } : window))), []);
  const toggleMaximize = useCallback((id: string) => setWindows((current) => current.map((window) => (window.id === id ? { ...window, maximized: !window.maximized } : window))), []);
  const move = useCallback((id: string, x: number, y: number) => setWindows((current) => current.map((window) => (window.id === id ? { ...window, x, y } : window))), []);
  const resize = useCallback((id: string, w: number, h: number) => setWindows((current) => current.map((window) => (window.id === id ? { ...window, w, h } : window))), []);

  return { windows, open, navigate, back, close, focus, minimize, toggleMaximize, move, resize, toggle };
}
