'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Instrument_Sans } from 'next/font/google';
import { DesktopIcon } from '@/components/desktop/DescktopDesgin';
import { DesktopArtwork } from '@/components/desktop/DesktopArtwork';
import { Dock } from '@/components/desktop/Dock';
import { MenuBar } from '@/components/desktop/MenuBar';
import { OSWindow } from '@/components/desktop/OSWindow';
import { PixelSpider } from '@/components/desktop/PixelSpider';
import { WindowContent } from '@/components/desktop/WindowContent';
import { PageLoader } from '@/components/desktop/PageLoader';
import { desktopItems, profile, windowItems } from '@/data/portfolio';
import { wallpaperUrl } from '@/data/projects';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWindowManager } from '@/hooks/useWindowsManager';
import './pageAlternative.css';

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans', display: 'swap' });
type Pos = { x: number; y: number };
const POSITIONS_KEY = 'ryan-choukri-desktop-positions-v1';
const MOBILE_POSITIONS_KEY = 'ryan-choukri-mobile-positions-v1';
const CRT_KEY = 'ryan-choukri-crt-enabled';
const defaultPositions: Record<string, Pos> = Object.fromEntries(desktopItems.map((item) => [item.id, item.pos]));
const MOBILE_ICON_WIDTH = 96;
const MOBILE_ICON_HEIGHT = 112;
const MOBILE_ROWS = Math.ceil(desktopItems.length / 3);
const defaultMobilePositions: Record<string, Pos> = Object.fromEntries(
  desktopItems.map((item, index) => [item.id, { x: (index % 3) * 50, y: MOBILE_ROWS > 1 ? (Math.floor(index / 3) / (MOBILE_ROWS - 1)) * 100 : 0 }])
);

function loadPositions(key: string, defaults: Record<string, Pos>, allowAboveOrigin = false): Record<string, Pos> {
  const positions = { ...defaults };
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? '{}');
    for (const item of desktopItems) {
      const pos = stored?.[item.id];
      if (typeof pos?.x === 'number' && Number.isFinite(pos.x) && typeof pos?.y === 'number' && Number.isFinite(pos.y)) {
        positions[item.id] = { x: Math.min(100, Math.max(0, pos.x)), y: Math.min(100, allowAboveOrigin ? pos.y : Math.max(0, pos.y)) };
      }
    }
  } catch {
    // Le bureau reste utilisable si le stockage est indisponible.
  }
  return positions;
}

export default function HomeAlternative() {
  const wm = useWindowManager();
  const isMobile = useIsMobile();
  const desktopRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const mobileDesktopRef = useRef<HTMLDivElement>(null);
  const [mobileTopAllowance, setMobileTopAllowance] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [positions, setPositions] = useState(defaultPositions);
  const [mobilePositions, setMobilePositions] = useState(defaultMobilePositions);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);

  const finishBoot = useCallback(() => {
    setIsBooting(false);
    setSpotlightId('about');
    desktopRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!spotlightId) return;
    const timeout = window.setTimeout(() => setSpotlightId(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [spotlightId]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPositions(loadPositions(POSITIONS_KEY, defaultPositions));
      setMobilePositions(loadPositions(MOBILE_POSITIONS_KEY, defaultMobilePositions, true));
      try {
        setCrtEnabled(localStorage.getItem(CRT_KEY) !== 'off');
      } catch {
        setCrtEnabled(true);
      }
      setPreferencesReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isMobile || !introRef.current) return;
    // La zone mobile peut remonter sur l’introduction, jusqu’à la barre de menu.
    const observer = new ResizeObserver(() => {
      setMobileTopAllowance(Math.max(0, (mobileDesktopRef.current?.offsetTop ?? 0) - 36));
    });
    observer.observe(introRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
    } catch {
      /* Stockage facultatif. */
    }
  }, [positions, preferencesReady]);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      localStorage.setItem(MOBILE_POSITIONS_KEY, JSON.stringify(mobilePositions));
    } catch {
      /* Stockage facultatif. */
    }
  }, [mobilePositions, preferencesReady]);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      localStorage.setItem(CRT_KEY, crtEnabled ? 'on' : 'off');
    } catch {
      // Le bouton reste fonctionnel sans stockage local.
    }
  }, [crtEnabled, preferencesReady]);

  const moveIcon = (id: string, dx: number, dy: number) => {
    if (isMobile) {
      const bounds = mobileDesktopRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const travelX = Math.max(1, bounds.width - MOBILE_ICON_WIDTH - 16);
      const travelY = Math.max(1, bounds.height - MOBILE_ICON_HEIGHT - 16);
      setMobilePositions((previous) => {
        const current = previous[id] ?? defaultMobilePositions[id];
        const currentY = Math.min(travelY + 8, Math.max(-mobileTopAllowance, 8 + (current.y / 100) * travelY));
        const nextY = Math.min(travelY + 8, Math.max(-mobileTopAllowance, currentY + dy));
        return {
          ...previous,
          [id]: { x: Math.min(100, Math.max(0, current.x + (dx / travelX) * 100)), y: ((nextY - 8) / travelY) * 100 },
        };
      });
      return;
    }
    const bounds = desktopRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setPositions((previous) => {
      const current = previous[id] ?? defaultPositions[id];
      return {
        ...previous,
        [id]: {
          x: (Math.min(Math.max(8, bounds.width - 112), Math.max(8, (current.x / 100) * bounds.width + dx)) / bounds.width) * 100,
          y: (Math.min(Math.max(52, bounds.height - 180), Math.max(52, (current.y / 100) * bounds.height + dy)) / bounds.height) * 100,
        },
      };
    });
  };

  return (
    <main
      ref={desktopRef}
      tabIndex={-1}
      data-crt={crtEnabled ? 'on' : 'off'}
      className={`${instrumentSans.variable} alternative-page font-display relative isolate h-dvh w-full overflow-x-hidden overflow-y-auto bg-neutral-800 bg-cover bg-center md:overflow-hidden`}
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) setSelected(null);
      }}
    >
      <div className="desktop-surface" inert={isBooting} aria-hidden={isBooting ? true : undefined}>
        <MenuBar onOpen={wm.open} crtEnabled={crtEnabled} onToggleCrt={() => setCrtEnabled((enabled) => !enabled)} />
        <header ref={introRef} className="desktop-intro pointer-events-none relative px-6 pt-14 pb-5 text-white md:absolute md:top-[36%] md:left-[34%] md:w-[30%] md:p-0">
          <p className="mb-1.5 text-[10px] font-medium tracking-[0.22em] text-white/75 uppercase">Portfolio · Paris</p>
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight lg:text-5xl">{profile.name}</h1>
          <p className="mt-1.5 text-sm leading-snug text-white/90">
            {profile.roleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-1 text-[10px] tracking-wider text-white/70">{profile.focus}</p>
          <p className="mt-3 max-w-xs text-xs leading-snug text-white/70">
            {isMobile ? 'Touchez un fichier pour l’ouvrir, faites-le glisser pour le déplacer.' : 'Mon parcours, mes projets, un peu de moi. Cliquez sur un fichier pour l’ouvrir.'}
          </p>
        </header>

        <div ref={mobileDesktopRef} className={isMobile ? 'relative mb-28 w-full' : 'contents'} style={isMobile ? { height: MOBILE_ROWS * 128 } : undefined}>
          {desktopItems.map((item) => {
            const pos = isMobile ? (mobilePositions[item.id] ?? defaultMobilePositions[item.id]) : (positions[item.id] ?? item.pos);
            return (
              <DesktopIcon
                key={item.id}
                title={item.title}
                artwork={<DesktopArtwork item={item} />}
                selected={selected === item.id}
                onSelect={() => {
                  setSelected(item.id);
                  if (item.id === spotlightId) setSpotlightId(null);
                }}
                onOpen={() => wm.open(item.id)}
                onDoubleActivate={() => wm.toggle(item.id)}
                openOnSingleClick={isMobile}
                onDragBy={(dx, dy) => moveIcon(item.id, dx, dy)}
                className={item.id === spotlightId ? 'desktop-icon--attention' : undefined}
                style={
                  isMobile
                    ? {
                        position: 'absolute',
                        width: MOBILE_ICON_WIDTH,
                        height: MOBILE_ICON_HEIGHT,
                        left: `calc(${pos.x}% + ${8 - ((MOBILE_ICON_WIDTH + 16) * pos.x) / 100}px)`,
                        top: `clamp(${-mobileTopAllowance}px, calc(${pos.y}% + ${8 - ((MOBILE_ICON_HEIGHT + 16) * pos.y) / 100}px), calc(100% - ${MOBILE_ICON_HEIGHT + 8}px))`,
                        zIndex: selected === item.id ? 1 : 0,
                      }
                    : { position: 'absolute', left: `clamp(8px, ${pos.x}%, calc(100% - 112px))`, top: `clamp(52px, ${pos.y}%, calc(100% - 180px))` }
                }
              />
            );
          })}
        </div>

        {wm.windows.map((window) => (
          <OSWindow
            key={window.id}
            state={window}
            title={windowItems.find((item) => item.id === window.id)?.title ?? window.id}
            isMobile={isMobile}
            onBack={window.history?.length ? () => wm.back(window.id) : undefined}
            backTitle={windowItems.find((item) => item.id === window.history?.at(-1))?.title}
            onClose={() => wm.close(window.id)}
            onMinimize={() => wm.minimize(window.id)}
            onToggleMaximize={() => wm.toggleMaximize(window.id)}
            onFocus={() => wm.focus(window.id)}
            onMove={(x, y) => wm.move(window.id, x, y)}
            onResize={(width, height) => wm.resize(window.id, width, height)}
          >
            <WindowContent id={window.id} onOpen={(id) => wm.navigate(id, window.id)} />
          </OSWindow>
        ))}
        <Dock onToggle={wm.toggle} openIds={wm.windows.map((window) => window.id)} />
        <PixelSpider active={!isBooting} />
        {crtEnabled && <div className="crt-overlay" aria-hidden="true" />}
      </div>
      {isBooting && <PageLoader ready={preferencesReady} onComplete={finishBoot} />}
    </main>
  );
}
