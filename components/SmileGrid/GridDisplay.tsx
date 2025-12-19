'use client';

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

const GridDisplay = ({ smileys, smileySize, mousePosRef }: { smileys: Entity[]; smileySize: number; mousePosRef: React.RefObject<{ x: number; y: number }> }) => (
  <div className="flex flex-1 scale-[0.5] items-center justify-center sm:scale-100">
    <div className="flex h-[90vw] max-h-[600px] w-[90vw] max-w-[600px] items-center justify-center rounded-md md:h-[600px] md:w-[600px]">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mousePosRef.current = {
            x: Math.floor((e.clientX - rect.left) / CELL_SIZE),
            y: Math.floor((e.clientY - rect.top) / CELL_SIZE),
          };
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
              ))} */}

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
);

export default GridDisplay;
