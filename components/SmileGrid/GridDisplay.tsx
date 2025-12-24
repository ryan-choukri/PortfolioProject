'use client';
import { useRef, useEffect } from 'react';
// import explosion from '@/assets/explosion.mp3';

type Entity = {
  name: string;
  id: number;
  x: number;
  y: number;
  dir: Direction;
  state: string;
  smyleyMeet: number[];
};
const GRID_SIZE = 100; // taille de la grille en nombre de cellules
const CELL_SIZE = 6; // taille d'une cellule en pixels
const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
const SMILEY_STATES: Record<string, string> = {
  normal: '🙂',
  touched: '😤',
  thirsty: '😥',
  makeKid: '👹',
  old: '🥶',
  young: '🤡',
};
type Direction = (typeof DIRECTIONS)[number];

const GridDisplay = ({
  smileys,
  smileySize,
  mousePosRef,
  mouseOnGrid,
  setMouseOnGrid,
  natality,
  nbBorn,
  nbDead,
  launchBomb,
  bombatPosition,
  setBombatPosition,
  leaveTrace,
}: {
  mouseOnGrid: boolean;
  setMouseOnGrid: React.Dispatch<React.SetStateAction<boolean>>;
  smileys: Entity[];
  smileySize: number;
  mousePosRef: React.RefObject<{ x: number; y: number }>;
  natality: number;
  nbBorn: number;
  nbDead: number;
  launchBomb: boolean;
  bombatPosition: { x: number; y: number } | null;
  setBombatPosition: (pos: { x: number; y: number }) => void;
  leaveTrace: Map<string, number[]>[];
}) => {
  const bombStatus = useRef<{ status: number; x: number; y: number }>({ status: 0, x: 0, y: 0 });
  const bombSizeByStatus = [45, 35, 25, 15, 10, 5, 1]; // taille de la bombe en fonction de son état
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const explosionAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    explosionAudio.current = new Audio('assets/explosion.mp3');
    explosionAudio.current.volume = 0.2;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- grille ---
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    leaveTrace.map((traceMap, index) =>
      Array.from(traceMap.entries()).map(([key, ids]) => {
        const [x, y] = key.split(',').map(Number);
        // increase opacity with number of smileys by index
        // const opacity = Math.min(0.1 + ids.length * 0.1, 0.9) * ((index + 1) / leaveTrace.length);
        // ctx.font = `${CELL_SIZE * (smileySize * 10)}px serif`;
        // ctx.fillText(SMILEY_STATES['touched'], x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);

        return;
        // <div
        //   key={key}
        //   className="absolute flex items-center justify-center select-none"
        //   style={{
        //     width: CELL_SIZE,
        //     height: CELL_SIZE,
        //     transform: `translate(${x * CELL_SIZE}px, ${y * CELL_SIZE}px)`,
        //     fontSize: CELL_SIZE * (smileySize * 10),
        //     lineHeight: '1',
        //     opacity: opacity,
        //   }}>
        //   {ids.length > 1 ? SMILEY_STATES['touched'] : SMILEY_STATES['normal']}
        // </div>
      })
    );

    // --- smileys ---
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const s of smileys) {
      const emoji = SMILEY_STATES[s.state] ?? SMILEY_STATES.normal;
      ctx.font = `${CELL_SIZE * (smileySize * 10)}px serif`;
      ctx.fillText(emoji, s.x * CELL_SIZE + CELL_SIZE / 2, s.y * CELL_SIZE + CELL_SIZE / 2);
    }
    // when boom is dropped at mouse position draw a bomb emoji at that position
    if (bombatPosition || (bombStatus.current.status > 0 && bombStatus.current.status < bombSizeByStatus.length)) {
      bombStatus.current.status++;
      bombStatus.current.x = bombatPosition ? bombatPosition.x : bombStatus.current.x;
      bombStatus.current.y = bombatPosition ? bombatPosition.y : bombStatus.current.y;

      ctx.font = `${CELL_SIZE * bombSizeByStatus[bombStatus.current.status]}px serif`;
      ctx.fillText('💥', bombStatus.current.x * CELL_SIZE + CELL_SIZE / 2, bombStatus.current.y * CELL_SIZE + CELL_SIZE / 2);
    }
    if (bombStatus.current.status === 1) {
      explosionAudio.current?.play();
    }
    if (bombStatus.current.status === bombSizeByStatus.length) {
      bombStatus.current.status = 0;
    }
  }, [smileys, smileySize, leaveTrace, bombatPosition, bombSizeByStatus]);

  return (
    <div className="flex flex-1 scale-[0.5] flex-col items-center justify-center sm:scale-100">
      <div className="flex h-[90vw] max-h-[600px] w-[90vw] max-w-[600px] items-center justify-center rounded-md md:h-[600px] md:w-[600px]">
        <div
          onClick={() => {
            if (launchBomb) {
              const pos = mousePosRef.current;
              console.log(`Clicked on grid at cell (${pos.x}, ${pos.y})`);
              // déclenche une action de bombe à la position de la souris
              setBombatPosition({ x: pos.x, y: pos.y });
            }
          }}
          onMouseMove={(e) => {
            if (!mouseOnGrid) setMouseOnGrid(true);

            const rect = e.currentTarget.getBoundingClientRect();
            mousePosRef.current = {
              x: Math.floor((e.clientX - rect.left) / CELL_SIZE),
              y: Math.floor((e.clientY - rect.top) / CELL_SIZE),
            };
          }}
          onMouseLeave={() => {
            // reset la position ou déclenche une action
            mousePosRef.current = { x: -1, y: -1 };
            setMouseOnGrid(false);
            console.log('Mouse left the grid');
          }}
          className="relative bg-neutral-900"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}>
          {/* grille logique */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            }}
          />
          {/* traces leave a subltile trace on the map under the smileys
              and it disappears over time */}
          {/* its laggy */}
          {/* {leaveTrace.map((traceMap, index) => (
                <div key={index}>
                  {Array.from(traceMap.entries()).map(([key, ids]) => {
                    const [x, y] = key.split(',').map(Number);
                    // increase opacity with number of smileys by index
                    const opacity = Math.min(0.1 + ids.length * 0.1, 0.9) * ((index + 1) / leaveTrace.length);
                    return (
                      <div
                        key={key}
                        className="absolute flex items-center justify-center select-none"
                        style={{ width: CELL_SIZE, height: CELL_SIZE, transform: `translate(${x * CELL_SIZE}px, ${y * CELL_SIZE}px)`, fontSize: CELL_SIZE * (smileySize * 10), lineHeight: '1', opacity: opacity}}>
                        {ids.length > 1 ? SMILEY_STATES['touched'] : SMILEY_STATES['normal']}
                      </div>
                    );
                  })}
                </div>
              ))} 
        */}
          {/* smileys */}

          <canvas ref={canvasRef} width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE} className="rounded-md bg-neutral-900" />
          {/* {smileys.map((s) => (
          <div
            key={s.id}
            className="linear absolute flex items-center justify-center select-none"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              transform: `translate(${s.x * CELL_SIZE}px, ${s.y * CELL_SIZE}px)`,
              // left: s.x * CELL_SIZE,
              // top: s.y * CELL_SIZE,
              fontSize: CELL_SIZE * (smileySize * 10),
              lineHeight: '1',
            }}>
            {s.state in SMILEY_STATES ? SMILEY_STATES[s.state] : SMILEY_STATES['normal']}
          </div>
        ))} */}
        </div>
      </div>

      <div className="flex flex-row rounded bg-neutral-900 p-3 font-mono text-[10px] text-neutral-200">
        <div className="flex flex-col">
          <p className="text-neutral-400">
            Population:<span className="text-neutral-300"> {smileys.length}</span>
          </p>
          <p className="text-neutral-400">
            Natalité: <span className="text-neutral-300">{natality.toFixed(2)}</span>
          </p>
          <p className="text-neutral-400">
            Naissances: <span className="text-neutral-300">{nbBorn}</span>, Décès: <span className="text-neutral-300">{nbDead}</span>
          </p>
          <pre className="mt-2 text-neutral-400">
            {(() => {
              const counts = smileys.reduce(
                (acc, s) => {
                  acc[s.state] = (acc[s.state] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>
              );
              if (nbDead > 0) counts['dead'] = nbDead;

              const max = Math.max(...Object.values(counts));

              const stateSymbols: Record<string, string> = {
                young: 'Jeunes      ',
                touched: 'Touchés     ',
                makeKid: 'Reproduction',
                old: 'Âgés.       ',
                normal: 'Adultes     ',
                dead: 'Décès       ',
              };
              const stateOrder = ['young', 'touched', 'makeKid', 'old', 'normal', 'dead'];

              return stateOrder
                .map((state) => {
                  const count = counts[state] || 0;
                  let barLength = Math.round((count / max) * 20); // scale sur 20 caractères
                  const deathCount = Math.max(
                    ...Object.entries(counts)
                      .filter(([k]) => k !== 'dead')
                      .map(([, v]) => v)
                  );
                  if (state === 'dead' && deathCount < count) {
                    //scale bar length differently for dead set it by the max of other states
                    barLength = Math.round((deathCount / max) * 20);
                  }

                  const bar = '█'.repeat(barLength);
                  const label = stateSymbols[state] || state.padEnd(12);
                  return `${label} | ${bar} ${count}`;
                })
                .join('\n');

              // return Object.entries(counts)
              //   .map(([state, count]) => {
              //     const barLength = Math.round((count / max) * 20); // scale sur 20 caractères
              //     const bar = '█'.repeat(barLength);
              //     const label = stateSymbols[state] || state.padEnd(12);
              //     return `${label} | ${bar} ${count}`;
              //   })
            })()}
          </pre>

          <p className="mt-2 font-semibold text-neutral-400">Top Smileys par collision:</p>
          <ul className="ml-4 list-disc text-neutral-300">
            {smileys
              .sort((a, b) => b.smyleyMeet.length - a.smyleyMeet.length)
              .slice(0, 5)
              .map((s) => (
                <li key={s.id}>
                  {s.name}: {s.smyleyMeet.length} rencontres
                </li>
              ))}
          </ul>
        </div>
        <pre className="ml-4 max-h-40 overflow-auto">
          {smileys
            .slice(0, 20)
            .map((s) => `  { name: ${s.name}, state: '${s.state}', x: ${s.x}, y: ${s.y} }`)
            .join('\n')}
          {smileys.length > 20 ? '\n  ...' : ''}
        </pre>
      </div>
    </div>
  );
};

export default GridDisplay;
