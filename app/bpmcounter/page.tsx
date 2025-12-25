'use client';

import BpmCounter from '@/components/BpmCounter';

import { bpmExplainData } from './bpmExplainData';
import { DisplayBlock } from '@/components/ui/DisplayBlock';

export default function BpmCounterExplanation() {
  return (
    <div className="flex h-[80vh] w-full flex-col">
      <BpmCounter />

      <section className="mt-6 text-sm">
        <div className="mx-auto w-full px-4 sm:px-8 lg:max-w-5xl lg:px-8">
          <h2 className="mb-4 text-xl font-semibold text-white">Décomposition technique du compteur BPM</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Object.values(bpmExplainData).map((block, index) => (
              <DisplayBlock key={index} {...block} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
