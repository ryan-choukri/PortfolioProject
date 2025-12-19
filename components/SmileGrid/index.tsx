'use client';
import { useState, useEffect, useRef } from 'react';
import SidebarAndData from './SidebarAndData';
import GridDisplay from './GridDisplay';

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
const NUM_SMILEYS = 20; // nombre initial de smileys
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

const makeSmiley = (x: number, y: number, id: number, state: string = 'normal'): Entity => ({
  //make baby born from two parents positioned at the same place
  id,
  x,
  y,
  dir: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
  state: state,
  smyleyMeet: [],
});

const generateSmyleys = Array.from({ length: NUM_SMILEYS }, (_, i) => makeSmiley(Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE), i, 'normal'));

// Commente cette focntion EmojiGame explique les interaction et la logique en quelque ligne
export default function EmojiGame() {
  const [smileys, setSmileys] = useState<Entity[]>(generateSmyleys);
  const nextIdRef = useRef(smileys.length);
  const [isRunning, setIsRunning] = useState(false);
  const [speedOfGame, setSpeedOfGame] = useState(SPEED_GAME);
  const [natality, setNatality] = useState(NATALITY);
  const [manageNatality, setManageNatality] = useState(false);
  const [smileySize, setSmileySize] = useState(SMILEY_SIZE);
  const [walkStraight, setWalkStraight] = useState(CHANGE_PROB);
  const [leaveTrace, setLeaveTrace] = useState<Map<string, number[]>[]>([]);
  const [nbBorn, setNbBorn] = useState(0);
  const [nbDead, setNbDead] = useState(0);
  const [mousDisatanceEscape, setMousDisatanceEscape] = useState(10);

  // const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1, y: -1 });
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

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
    const moveSmiley = (s: Entity, walkStraight: number, gridSize: number, mousePos: { x: number; y: number }, mousEscapeDistance: number) => {
      //si le smiley est au bord, il doit forcément changer de direction
      const distX = s.x - mousePos.x;
      const distY = s.y - mousePos.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
      let newDir: Direction = s.dir;

      if (distance < mousEscapeDistance) {
        // s'éloigner de la souris
        if (Math.abs(distX) > Math.abs(distY)) newDir = distX > 0 ? 'right' : 'left';
        else newDir = distY > 0 ? 'down' : 'up';
      } else {
        if (s.x === 0 || s.x === gridSize - 1 || s.y === 0 || s.y === gridSize - 1) {
          //prend la direction opposé à celle du bord
          newDir = getSmartDirectionNoBack(s, gridSize);
          const newPos = moveInGrid(s, newDir, gridSize);
          return { ...s, ...newPos, dir: newDir };
        }

        newDir = Math.random() > walkStraight ? s.dir : getSmartDirectionNoBack(s, gridSize);
      }
      const newPos = moveInGrid(s, newDir, gridSize);

      return { ...s, ...newPos, dir: newDir };
    };

    const handleCollisions = (newPositions: Entity[], natality: number, nextIdRef: React.MutableRefObject<number>): { posWithCollision: Entity[]; newPos: Entity[] } => {
      const positionsMap = new Map<string, number[]>();
      newPositions.forEach((s, idx) => {
        const key = `${s.x},${s.y}`;
        if (!positionsMap.has(key)) positionsMap.set(key, []);
        positionsMap.get(key)!.push(idx);
      });
      setLeaveTrace((prev) => {
        //retain only last 10 traces
        if (prev.length >= 5) prev.shift();
        return [...prev, positionsMap];
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
              setNbDead((n) => n + 1);
              idsToRemove.push(...hasFour.otherids, newPositions[id].id);
            } else {
              // try to make baby if is not young already
              if (newPositions.length < 1500 && !birthDone && Math.random() < natality && newPositions[id].state !== 'young') {
                toAdd.push(makeSmiley(Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE), nextIdRef.current++, 'young'));
                setNbBorn((n) => n + 1);
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
      return { posWithCollision: newPositions, newPos: toAdd };
    };

    if (!isRunning) return;
    const interval = setInterval(() => {
      setSmileys((prev) => {
        const newPositions = prev.map((entity) => moveSmiley(entity, walkStraight, GRID_SIZE, mousePosRef.current, mousDisatanceEscape));
        const { posWithCollision, newPos } = handleCollisions(newPositions, natality, nextIdRef);
        return [...posWithCollision, ...newPos];
      });
    }, speedOfGame);

    return () => clearInterval(interval);
  }, [isRunning, speedOfGame, natality, walkStraight, mousDisatanceEscape]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-screen w-full text-white">
        {/* Sidebar */}
        <SidebarAndData
          {...{
            smileys,
            natality,
            manageNatality,
            speedOfGame,
            walkStraight,
            smileySize,
            mousDisatanceEscape,
            nbBorn,
            nbDead,
            isRunning,
          }}
          {...{ setNatality, setManageNatality, setSpeedOfGame, setWalkStraight, setSmileySize, setMousDisatanceEscape, setIsRunning }}
        />

        {/* Zone du cube / jeu */}
        <GridDisplay /* props ici */ smileys={smileys} smileySize={smileySize} mousePosRef={mousePosRef} />
      </div>
    </div>
  );
}
