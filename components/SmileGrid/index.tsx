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
const SPEED_GAME = 9; // nombre en ms entre chaque déplacement
const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
const SMILEY_STATES: Record<string, string> = {
  normal: '🙂',
  touched: '😤',
  thirsty: '😥',
  angry: '👹',
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

export default function EmojiGame() {
  const [smileys, setSmileys] = useState<Entity[]>(generateSmyleys);
  const nextIdRef = useRef(smileys.length);
  const [isRunning, setIsRunning] = useState(true);
  const [idRemovedList, setIdRemovedList] = useState<number[]>([]);

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
          const newDir =
            Math.random() > CHANGE_PROB ? s.dir : getSmartDirectionNoBack(s, GRID_SIZE);
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
            ids.forEach((id) => {
              if (!newPositions[id]) return;
              const hasThree = hasSameId(newPositions[id].smyleyMeet, 4);
              if (hasThree.find) {
                idsToRemove.push(...hasThree.otherids, newPositions[id].id);
              } else if (hasSameId(newPositions[id].smyleyMeet, 3).find) {
                newPositions[id].state = 'old';
              } else if (hasSameId(newPositions[id].smyleyMeet, 2).find) {
                newPositions[id].state = 'angry';
                if (Math.random() < 0.014) {
                  toAdd.push(makeSmiley(nextIdRef.current++, 'young'));
                }
              } else {
                newPositions[id].state = 'touched';
              }
              newPositions[id].smyleyMeet.push(...ids.filter((i) => i !== id));
            });
          }
        });

        // suppression après calcul
        newPositions = newPositions.filter((s) => !idsToRemove.includes(s.id));

        return [...newPositions, ...toAdd];
      });
    }, SPEED_GAME);

    return () => clearInterval(interval);
  }, [isRunning]);

  // console.log(' -------SMILEY LONGEUR--------', smileys);
  const arrOfmeetlg = smileys.map((s) => (s && s.smyleyMeet ? s.smyleyMeet.length : 0));
  // console.log(' -------SMILEY LONGEUR--------', smileys);
  console.log(arrOfmeetlg.reduce((acc, cur) => acc + cur, 0));
  // console.log(
  //   ' -------SMILEY--------',
  //   smileys.filter((s) => idRemovedList.includes(s.id))
  // );

  return (
    <div className="flex w-full items-center justify-center overflow-hidden">
      <h1 className="text-white">{idRemovedList.join(', ')}</h1>
      <button
        onClick={() => setIsRunning((v) => !v)}
        className="fixed right-4 bottom-4 rounded bg-neutral-800 px-4 py-2 text-white transition hover:bg-neutral-700"
      >
        {isRunning ? '⏸ Pause' : '▶️ Play'}
      </button>

      <div
        className="relative bg-neutral-900"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* grille logique */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
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
              fontSize: CELL_SIZE * 3,
              lineHeight: '1',
            }}
          >
            {s.state in SMILEY_STATES ? SMILEY_STATES[s.state] : SMILEY_STATES['normal']}
          </div>
        ))}
      </div>
    </div>
  );
}
