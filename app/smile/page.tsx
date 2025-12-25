'use client';

import SmileGrid from '@/components/SmileGrid';
import { emojiExplainData } from './emojiExplainData';
import { DisplayBlock } from '@/components/ui/DisplayBlock';

const SmilePage = () => {
  return (
    <>
      <div className="flex w-full items-center justify-center py-6">
        <SmileGrid />
      </div>

      <div className="flex flex-col">
        <section className="mt-6 text-sm">
          <div className="mx-auto w-full px-4 sm:px-8 lg:max-w-5xl lg:px-8">
            <h2 className="mb-4 text-xl font-semibold text-white">Décomposition technique du compteur BPM</h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.values(emojiExplainData).map((block, index) => (
                <DisplayBlock key={index} {...block} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );

  // return <SmileGrid />;
};

export default SmilePage;
