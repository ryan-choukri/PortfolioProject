"use client";

import { useState, useRef } from "react";

const BPM_STYLES = [
  { label: "Ambient", min: 40, max: 70, color: "from-blue-400 to-blue-600" },
  { label: "Hip-Hop", min: 70, max: 95, color: "from-purple-400 to-purple-600" },
  { label: "Downtempo", min: 80, max: 110, color: "from-indigo-400 to-indigo-600" },
  { label: "Funk", min: 90, max: 120, color: "from-yellow-400 to-yellow-500" },
  { label: "Disco", min: 110, max: 125, color: "from-pink-400 to-pink-600" },
  { label: "House", min: 115, max: 130, color: "from-green-400 to-green-600" },
  { label: "Techno", min: 125, max: 145, color: "from-cyan-400 to-cyan-600" },
  { label: "Rock", min: 110, max: 140, color: "from-orange-400 to-orange-600" },
  { label: "Hard Rock", min: 140, max: 165, color: "from-red-400 to-red-600" },
  { label: "Punk", min: 160, max: 200, color: "from-red-600 to-red-700" },
  { label: "Drum & Bass", min: 165, max: 180, color: "from-lime-400 to-lime-600" },
  { label: "Hardcore", min: 180, max: 220, color: "from-fuchsia-600 to-fuchsia-800" },
  { label: "Speedcore", min: 220, max: 300, color: "from-pink-700 to-pink-900" },
  { label: "Terror", min: 300, max: 350, color: "from-red-700 to-red-900" },
  { label: "Extrême", min: 350, max: 400, color: "from-black to-zinc-900" },
];

const getStyleFromBPM = (bpm: number) => {
  return BPM_STYLES.find(style => bpm >= style.min && bpm <= style.max) || {
    label: "Unknown",
    color: "from-zinc-500 to-zinc-700",
  };
};


const BpmCounter = () => {
  const [isInCount, setIsInCount] = useState(false);
  const [timer, setTimer] = useState(0);
  const [displayBpm, setDisplayBpm] = useState(0);
  const [numberOfClick, setNumberOfClick] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const getStyleFromBPM = (bpm: number) => {
    console.log('bpm');
    console.log(bpm);
    
    return (
      BPM_STYLES.find(style => bpm >= style.min && bpm <= style.max) || {
        label: "Unknown",
        color: "bg-zinc-500",
      }
    );
  };

  const handleClick = () => {
    if(!isInCount) {
      // start here the bpm counter
      timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 100);
      setIsInCount(true);
    }
      

    setDisplayBpm(Math.round(((numberOfClick + 1) / (timer / 10)) * 60));
    setNumberOfClick(numberOfClick + 1);
  }

  const style = getStyleFromBPM(displayBpm);

   return (
    <div className="min-h-screen flex items-center justify-center ">
      {/* Card */}
      <div className="w-full max-w-sm bg-zinc-800 rounded-2xl border border-zinc-700 shadow-xl p-6 flex flex-col items-center gap-6">

        {/* Label */}
        <div className="text-zinc-400 uppercase tracking-widest text-xs">
          BPM Counter
        </div>
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">
          {/* Label musical avec transition */}
          <div
            className={`w-full py-3 text-center text-sm font-extrabold uppercase tracking-widest text-black rounded-lg transition-all duration-500 ease-in-out bg-gradient-to-r ${style.color}`}
          >
            {style.label}
          </div>

          {/* BPM Display avec gradient */}
          <div
            className={`w-full flex items-center justify-center rounded-xl border border-zinc-700 py-8 text-white font-extrabold text-6xl tabular-nums bg-zinc-900`}
          >
            {displayBpm}
          </div>
        </div>


        {/* Tap Area */}
        <button
        onClick={handleClick}
          className="
            w-full h-24
            rounded-xl
            bg-yellow-500
            text-white
            text-2xl
            font-bold
            tracking-wide
            active:scale-95
            hover:bg-yellow-600
            transition-all
            shadow-lg
          "
        >
          TAP
        </button>

        {/* Helper text */}
        <div className="text-zinc-500 text-sm text-center">
          Tapote en rythme pour détecter le tempo
        </div>
      </div>
    </div>
  );
};

export default BpmCounter;
