'use client';

import { TextScramble } from '@/components/ui/text-scramble';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent WebGL context issues
const GuitarView = dynamic(() => import('@/components/GuitarView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-pulse text-neutral-500">Loading 3D Model...</div>
    </div>
  ),
});

const my3D = () => {
  return (
    <div className="flex h-screen w-full flex-col gap-6 p-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-4xl font-bold text-neutral-800 sm:text-6xl dark:text-white">
          <TextScramble text="Guitare" />
        </h1>
        <p className="max-w-lg text-center text-neutral-600 dark:text-neutral-400">Modèle 3D interactif. Faites glisser pour tourner, scrollez pour zoomer.</p>
      </div>

      {/* 3D View Container */}
      <div className="h-[calc(100vh-200px)] min-h-[500px] w-full flex-1 overflow-hidden">
        <GuitarView />
      </div>
    </div>
  );
};

export default my3D;
