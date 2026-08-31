import { useEffect, useState } from 'react';

export function MenuBar() {
  const [time, setTime] = useState<string>('');

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

  return (
    <div className="text-desktop-ink fixed inset-x-0 top-0 z-[9999] flex h-7 items-center justify-between gap-4 bg-black/25 px-3 text-[11px] backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-4">
        <span className="font-semibold tracking-tight">Stratosphère</span>
        <span className="hidden opacity-70 sm:inline">Fichier</span>
        <span className="hidden opacity-70 sm:inline">Édition</span>
        <span className="hidden opacity-70 sm:inline">Présentation</span>
      </div>
      <span className="shrink-0 tabular-nums opacity-80">{time}</span>
    </div>
  );
}
