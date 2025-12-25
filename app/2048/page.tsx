'use client';
import { useState } from 'react';
import Game2048 from '@/components/Game2048';

import { gameExplainData } from './gameExplainData';
import { DisplayBlock } from '@/components/ui/DisplayBlock';

export default function Game2048Explanation() {
  const [gameKey, setGameKey] = useState(0);
  const resetGame = () => {
    setGameKey((prev) => prev + 1); // forces Game2048 to remount
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Titre */}
      <h1 className="mb-2 text-center text-4xl font-bold">2048</h1>
      <div className="overflow-hidden rounded-t-lg p-3 text-center">
        <button onClick={resetGame} className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">
          <p>Rejouer</p>
        </button>
      </div>
      <Game2048 key={gameKey} />

      <section className="mt-6 text-sm">
        <div className="mx-auto w-full px-4 sm:px-8 lg:max-w-5xl lg:px-8">
          {/* <section className="mt-6 text-sm"> */}
          <h2 className="mb-4 text-xl font-semibold text-white">Décomposition technique du jeu 2048</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Object.values(gameExplainData).map((block, index) => (
              <DisplayBlock key={index} {...block} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
