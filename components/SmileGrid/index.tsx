'use client';
import { useState, useEffect, useRef } from 'react';
import { log } from 'util';

type Direction = (typeof DIRECTIONS)[number];
type Entity = {
  id: number;
  x: number;
  y: number;
  dir: Direction;
  state: string;
  smyleyMeet: number[];
};

const GRID_SIZE = 100; // taille de la grille en nombre de cellules
const CELL_SIZE = 6; // taille d'une cellule en pixels
const NUM_SMILEYS = 110; // nombre initial de smileys
const SPEED_GAME = 24; // nombre en ms entre chaque déplacement
const NATALITY = 0.3; // taux de natalité
const SMILEY_SIZE = 0.2; // taille des smileys
const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
const SMILEY_STATES: Record<string, string> = {
  normal: '🙂',
  touched: '😤',
  thirsty: '😥',
  makeKid: '👹',
  old: '🥶',
  young: '🤡',
};

const CHANGE_PROB = 0.2; // 10% de chance de changer de direction
const MOVE_MAP: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

const makeSmiley = (id: number, state: string = 'normal'): Entity => ({
  id,
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
  dir: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
  state: state,
  smyleyMeet: [],
});

const generateSmyleys = Array.from({ length: NUM_SMILEYS }, (_, i) => makeSmiley(i, 'normal'));

// Commente cette focntion EmojiGame explique les interaction et la logique en quelque ligne
export default function EmojiGame() {
  const [smileys, setSmileys] = useState<Entity[]>(generateSmyleys);
  const nextIdRef = useRef(smileys.length);
  const [isRunning, setIsRunning] = useState(false);
  const [speedOfGame, setSpeedOfGame] = useState(SPEED_GAME);
  const [natality, setNatality] = useState(NATALITY);
  const [smileySize, setSmileySize] = useState(SMILEY_SIZE);
  const [walkStraight, setWalkStraight] = useState(CHANGE_PROB);

  const hasSameId = (arr: number[], threshold: number): { find: boolean; otherids: number[] } => {
    const count: Record<number, number> = {};
    const otherids: number[] = [];

    for (const v of arr) {
      count[v] = (count[v] || 0) + 1;
      // push UNE SEULE FOIS quand le seuil est atteint
      if (count[v] === threshold) otherids.push(v);
    }
    return { find: otherids.length > 0, otherids };
  };

  function moveInGrid(position: { x: number; y: number }, direction: Direction, gridSize: number) {
    const { dx, dy } = MOVE_MAP[direction];
    return {
      x: Math.max(0, Math.min(gridSize - 1, position.x + dx)),
      y: Math.max(0, Math.min(gridSize - 1, position.y + dy)),
    };
  }

  function getSmartDirectionNoBack(entity: Entity, gridSize: number): Direction {
    const possible: Direction[] = [];
    const { x, y, dir } = entity;

    if (y > 0 && dir !== 'down') possible.push('up');
    if (y < gridSize - 1 && dir !== 'up') possible.push('down');
    if (x > 0 && dir !== 'right') possible.push('left');
    if (x < gridSize - 1 && dir !== 'left') possible.push('right');

    return possible[Math.floor(Math.random() * possible.length)]!;
  }

  // ✅ Real-time movement + collision detection
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSmileys((prev) => {
        let newPositions = prev.map((s) => {
          //si le smiley est au bord, il doit forcément changer de direction
          if (s.x === 0 || s.x === GRID_SIZE - 1 || s.y === 0 || s.y === GRID_SIZE - 1) {
            //prend la direction opposé à celle du bord
            const newDir = getSmartDirectionNoBack(s, GRID_SIZE);
            const newPos = moveInGrid(s, newDir, GRID_SIZE);
            return { ...s, ...newPos, dir: newDir };
          }
          const newDir = Math.random() > walkStraight ? s.dir : getSmartDirectionNoBack(s, GRID_SIZE);
          const newPos = moveInGrid(s, newDir, GRID_SIZE);
          return { ...s, ...newPos, dir: newDir };
        });

        const positionsMap = new Map<string, number[]>();
        newPositions.forEach((s, idx) => {
          const key = `${s.x},${s.y}`;
          if (!positionsMap.has(key)) positionsMap.set(key, []);
          positionsMap.get(key)!.push(idx);
        });

        const idsToRemove: number[] = [];
        const toAdd: Entity[] = [];

        positionsMap.forEach((ids) => {
          if (ids.length > 1) {
            let birthDone = false;

            ids.forEach((id) => {
              if (!newPositions[id]) return;

              const meet = newPositions[id].smyleyMeet;
              const hasFour = hasSameId(meet, 4);
              const hasThree = hasSameId(meet, 3);
              const hasTwo = hasSameId(meet, 2);

              // si 4 rencontres identiques => mort
              if (hasFour.find) {
                idsToRemove.push(...hasFour.otherids, newPositions[id].id);
              } else {
                // try to make baby if is not young already
                if (prev.length < 2700 && !birthDone && Math.random() < natality && newPositions[id].state !== 'young') {
                  toAdd.push(makeSmiley(nextIdRef.current++, 'young'));
                  birthDone = true;
                }
              }

              if (hasThree.find) newPositions[id].state = 'old';
              else if (hasTwo.find) newPositions[id].state = 'makeKid';
              else newPositions[id].state = 'touched';
              newPositions[id].smyleyMeet.push(...ids.filter((i) => i !== id));
            });
          }
        });

        // suppression après calcul
        newPositions = newPositions.filter((s) => !idsToRemove.includes(s.id));

        // 🔴 DEBUG NAISSANCES (AJOUTE ÇA)
        if (toAdd.length > 0) {
          console.log('[BIRTH]', 'natality =', natality, '| births =', toAdd.length, '| total before =', prev.length, '| total after =', newPositions.length + toAdd.length);
        }

        return [...newPositions, ...toAdd];
      });
    }, speedOfGame);

    return () => clearInterval(interval);
  }, [isRunning, speedOfGame, natality, walkStraight]);

  return (
    <div className="flex w-full items-center justify-center overflow-hidden">
      <div className="flex h-screen w-full text-white">
        {/* Sidebar */}
        <div className="flex w-[420px] flex-col bg-neutral-800 p-4 text-xs text-neutral-200">
          <div className="grid flex-1 grid-cols-[1.7fr_1.3fr] gap-3">
            {/* ==== COL 2 : DESCRIPTION + STATS ==== */}
            <div className="flex flex-col gap-2 pr-1">
              {/* Description */}
              <div className="rounded bg-neutral-900 p-3 text-[12px] leading-snug text-neutral-300">
                <p className="mb-1 text-sm font-semibold text-neutral-100">Règles de la simulation</p>
                <p>
                  Chaque smiley se déplace librement sur une grille et interagit lorsqu’il partage la même case qu’un autre. Les rencontres répétées font évoluer son état :
                  <span className="text-neutral-100"> Touché → En colère → Vieux → Supprimé</span>.
                </p>
                <p className="mt-1">Les smileys en colère peuvent générer de nouveaux individus selon le taux de natalité. Le système évolue en continu, guidé par le hasard et les collisions.</p>
                <p className="mt-2 text-[11px] text-neutral-400">
                  💡 Logique interne : Chaque smiley garde une trace des rencontres passées (smyleyMeet). Selon le nombre de rencontres répétées, il change d&rsquo;état ou peut générer un nouveau
                  smiley.
                </p>
              </div>

              {/* Live stats */}
              <h3 className="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">Live stats</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 rounded bg-neutral-700 p-3 font-mono text-[11px]">
                <div>Population</div>
                <div className="text-right">{smileys.length}</div>

                <div>Natalité</div>
                <div className="text-right">{natality}</div>

                <div>Vitesse de la simulation</div>
                <div className="text-right">{speedOfGame} ms</div>

                <div>Marche droit</div>
                <div className="text-right">{walkStraight}</div>

                <div>Grid</div>
                <div className="text-right">
                  {GRID_SIZE}×{GRID_SIZE}
                </div>
              </div>

              {/* Debug */}
              <div className="rounded bg-neutral-900 p-2 font-mono text-[11px] text-neutral-400">
                <p>Collisions: —</p>
                <p>Births / tick: —</p>
                <p>Deaths / tick: —</p>
              </div>
            </div>

            {/* ==== COL 1 : CONTROLS ==== */}
            <div className="flex flex-col gap-3 pl-1">
              <h3 className="text-[10px] font-semibold tracking-wide text-neutral-100 uppercase">Controls</h3>
              {/* Taille des smiley */}
              <div>
                <label htmlFor="smiley" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
                  Taille des smiley {Math.round(smileySize * 100)}%
                </label>
                <input onChange={(e) => setSmileySize(Number(e.target.value) / 100)} type="range" id="smiley" min="10" max="40" defaultValue={smileySize * 100} className="w-full accent-green-500" />
              </div>

              {/* Natalité */}
              <div>
                <label htmlFor="natality" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
                  Taux de Natalité
                </label>
                <input onChange={(e) => setNatality(Number(e.target.value) / 100)} type="range" id="natality" min="0" max="100" defaultValue={natality * 100} className="w-full accent-yellow-500" />
              </div>

              {/* Speed */}
              <div>
                <label htmlFor="speed" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
                  Vitesse de la simulation
                </label>
                <input onChange={(e) => setSpeedOfGame(51 - Number(e.target.value))} type="range" id="speed" min="1" max="50" defaultValue={speedOfGame} className="w-full accent-red-500" />
              </div>

              {/* Walkt raight */}
              <div>
                <label htmlFor="speed" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
                  Marche droit
                </label>
                <input
                  onChange={(e) => setWalkStraight(Number(e.target.value) / 100)}
                  type="range"
                  id="walkStraight"
                  min="1"
                  max="50"
                  defaultValue={walkStraight * 100}
                  className="w-full accent-red-500"
                />
              </div>

              {/* ACTION */}
              <button onClick={() => setIsRunning((v) => !v)} className="mt-3 rounded bg-green-500 py-1.5 text-sm font-bold text-black transition hover:bg-green-400">
                {isRunning ? '⏸ Pause' : '▶️ Play'}
              </button>
            </div>
          </div>
        </div>

        {/* Zone du cube / jeu */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-[600px] w-[600px] items-center justify-center rounded-md">
            <div
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

              {/* smileys */}
              {smileys.map((s) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
