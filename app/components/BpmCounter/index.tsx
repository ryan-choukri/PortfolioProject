'use client';

import { useState, useRef, useEffect } from 'react';

const BPM_STYLES = [
  { label: 'Ambient', min: 40, max: 70, color: 'from-blue-400 to-blue-600' },
  { label: 'Hip-Hop', min: 70, max: 95, color: 'from-purple-400 to-purple-600' },
  { label: 'Downtempo', min: 80, max: 110, color: 'from-indigo-400 to-indigo-600' },
  { label: 'Funk', min: 90, max: 120, color: 'from-yellow-400 to-yellow-500' },
  { label: 'Disco', min: 110, max: 125, color: 'from-pink-400 to-pink-600' },
  { label: 'House', min: 115, max: 130, color: 'from-green-400 to-green-600' },
  { label: 'Techno', min: 125, max: 145, color: 'from-cyan-400 to-cyan-600' },
  { label: 'Rock', min: 110, max: 140, color: 'from-orange-400 to-orange-600' },
  { label: 'Hard Rock', min: 140, max: 165, color: 'from-red-400 to-red-600' },
  { label: 'Punk', min: 160, max: 200, color: 'from-red-600 to-red-700' },
  { label: 'Drum & Bass', min: 165, max: 180, color: 'from-lime-400 to-lime-600' },
  { label: 'Hardcore', min: 180, max: 220, color: 'from-fuchsia-600 to-fuchsia-800' },
  { label: 'Speedcore', min: 220, max: 300, color: 'from-pink-700 to-pink-900' },
  { label: 'Terror', min: 300, max: 350, color: 'from-red-700 to-red-900' },
  { label: 'Extrême', min: 350, max: 400, color: 'from-black to-zinc-900' },
];

const getStyleFromBPM = (bpm: number) => {
  return (
    BPM_STYLES.find((style) => bpm >= style.min && bpm <= style.max) || {
      label: 'Unknown',
      color: 'from-zinc-500 to-zinc-700',
    }
  );
};

const BpmCounter = () => {
  const [isInCount, setIsInCount] = useState(false);
  const [timer, setTimer] = useState(0);
  const [displayBpm, setDisplayBpm] = useState(0);
  const [numberOfClick, setNumberOfClick] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (!isInCount) {
      timerRef.current = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 100);
      setIsInCount(true);
    }

    const newCount = numberOfClick + 1;
    const seconds = timer / 10 || 0.1;
    setDisplayBpm(Math.round((newCount / seconds) * 60));
    setNumberOfClick((prev) => prev + 1);
  };

  const style = getStyleFromBPM(displayBpm);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-zinc-700 bg-zinc-800 p-6 shadow-xl">
        <div className="text-xs tracking-widest text-zinc-400 uppercase">BPM Counter</div>
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
          <div
            className={`w-full rounded-lg bg-gradient-to-r py-3 text-center text-sm font-extrabold tracking-widest text-black uppercase transition-all duration-500 ease-in-out ${style.color}`}
          >
            {style.label}
          </div>
          <div
            className={`flex w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 py-8 text-6xl font-extrabold text-white tabular-nums`}
          >
            {displayBpm}
          </div>
        </div>

        <button
          onClick={handleClick}
          className="h-24 w-full rounded-xl bg-yellow-500 text-2xl font-bold tracking-wide text-white shadow-lg transition-all hover:bg-yellow-600 active:scale-95"
        >
          TAP
        </button>

        <div className="text-center text-sm text-zinc-500">
          Tapote en rythme pour détecter le tempo
        </div>
      </div>
    </div>
  );
};

export default BpmCounter;
