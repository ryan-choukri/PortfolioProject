import { useEffect, useRef, useState } from 'react';
import { Airplay, Bluetooth, FastForward, Moon, Monitor, Music2, PanelsTopLeft, Play, RadioTower, ScreenShare, SunMedium, Volume2, Wifi, type LucideIcon } from 'lucide-react';

type Props = {
  onOpen: (id: string) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
};

function ControlItem({ icon: Icon, title, status, active = false }: { icon: LucideIcon; title: string; status: string; active?: boolean }) {
  return (
    <div className="control-center-item">
      <span className={`control-center-round-icon ${active ? 'is-active' : ''}`}>
        <Icon aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <strong>{title}</strong>
        <small>{status}</small>
      </span>
    </div>
  );
}

function SliderCard({ icon: Icon, title, level }: { icon: LucideIcon; title: string; level: string }) {
  return (
    <div className="control-center-card control-center-slider-card">
      <strong>{title}</strong>
      <div className="control-center-slider" aria-hidden="true">
        <span style={{ width: level }}>
          <Icon />
        </span>
      </div>
    </div>
  );
}

export function MenuBar({ onOpen, crtEnabled, onToggleCrt }: Props) {
  const [time, setTime] = useState<string>('');
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const controlCenterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date())
      );
    tick();
    const i = setInterval(tick, 30_000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!controlCenterOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!controlCenterRef.current?.contains(event.target as Node)) setControlCenterOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setControlCenterOpen(false);
      controlCenterButtonRef.current?.focus();
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [controlCenterOpen]);

  return (
    <div className="text-desktop-ink fixed inset-x-0 top-0 z-[9999] flex h-7 items-center justify-between gap-4 bg-black/25 px-3 text-[12px] backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-4">
        <button onClick={() => onOpen('about')} className="shrink-0 cursor-pointer font-semibold tracking-tight">
          Ryan Choukri
        </button>
        <button onClick={() => onOpen('projects')} className="hidden cursor-pointer opacity-80 hover:opacity-100 sm:inline">
          Projets
        </button>
        <button onClick={() => onOpen('contact')} className="hidden cursor-pointer opacity-80 hover:opacity-100 sm:inline">
          Contact
        </button>
        <button onClick={() => onOpen('cv')} className="hidden cursor-pointer opacity-80 hover:opacity-100 sm:inline">
          Mon CV
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={crtEnabled}
          aria-label="Effet CRT"
          title={crtEnabled ? 'Désactiver l’effet CRT' : 'Activer l’effet CRT'}
          onClick={onToggleCrt}
          className="crt-toggle flex h-6 items-center gap-1.5 rounded-md px-1.5 text-[10px] font-medium transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
        >
          <Monitor className="size-3.5" aria-hidden="true" />
          <span>CRT</span>
          <span className={`relative h-3 w-5 rounded-full transition-colors ${crtEnabled ? 'bg-emerald-400' : 'bg-white/30'}`} aria-hidden="true">
            <span className={`absolute top-0.5 left-0.5 size-2 rounded-full bg-white shadow-sm transition-transform ${crtEnabled ? 'translate-x-2' : ''}`} />
          </span>
        </button>
        <div ref={controlCenterRef} className="relative flex items-center">
          <button
            ref={controlCenterButtonRef}
            type="button"
            aria-label="Centre de contrôle"
            aria-expanded={controlCenterOpen}
            aria-controls="desktop-control-center"
            title="Centre de contrôle"
            onClick={() => setControlCenterOpen((open) => !open)}
            className="control-center-trigger"
          >
            <span className="control-center-mark" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>

          {controlCenterOpen && (
            <section id="desktop-control-center" aria-label="Centre de contrôle" className="control-center-panel">
              <div className="control-center-top-grid">
                <div className="control-center-card control-center-network-card">
                  <ControlItem icon={Wifi} title="Wi-Fi" status="Connecté" active />
                  <ControlItem icon={Bluetooth} title="Bluetooth" status="Non" />
                  <ControlItem icon={RadioTower} title="AirDrop" status="Non" />
                </div>
                <div className="control-center-side-grid">
                  <div className="control-center-card control-center-focus-card">
                    <span className="control-center-round-icon">
                      <Moon aria-hidden="true" />
                    </span>
                    <strong>Concentration</strong>
                  </div>
                  <div className="control-center-mini-grid">
                    <div className="control-center-card control-center-mini-card">
                      <PanelsTopLeft aria-hidden="true" />
                      <strong>Stage Manager</strong>
                    </div>
                    <div className="control-center-card control-center-mini-card">
                      <ScreenShare aria-hidden="true" />
                      <strong>Recopie de l’écran</strong>
                    </div>
                  </div>
                </div>
              </div>

              <SliderCard icon={SunMedium} title="Moniteur" level="68%" />
              <SliderCard icon={Volume2} title="Son" level="22%" />

              <div className="control-center-card control-center-music-card">
                <span className="control-center-album">
                  <Music2 aria-hidden="true" />
                </span>
                <strong>Musique</strong>
                <span className="control-center-media-icons" aria-hidden="true">
                  <Play />
                  <FastForward />
                  <Airplay />
                </span>
              </div>
            </section>
          )}
        </div>
        <span className="shrink-0 text-[10px] tabular-nums opacity-80 sm:text-xs">
          <span className="hidden min-[400px]:inline">{time}</span>
          <span className="min-[400px]:hidden">{time.slice(-5)}</span>
        </span>
      </div>
    </div>
  );
}
