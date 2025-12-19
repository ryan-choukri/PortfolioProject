'use client';
type Direction = (typeof DIRECTIONS)[number];

type Entity = {
  id: number;
  x: number;
  y: number;
  dir: Direction;
  state: string;
  smyleyMeet: number[];
};
const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;

const SidebarAndData = ({
  smileys,
  natality,
  manageNatality,
  speedOfGame,
  walkStraight,
  smileySize,
  mousDisatanceEscape,
  nbBorn,
  nbDead,
  setNatality,
  setManageNatality,
  setSpeedOfGame,
  setWalkStraight,
  setSmileySize,
  setMousDisatanceEscape,
  isRunning,
  setIsRunning,
}: {
  smileys: Entity[];
  natality: number;
  manageNatality: boolean;
  speedOfGame: number;
  walkStraight: number;
  smileySize: number;
  mousDisatanceEscape: number;
  nbBorn: number;
  nbDead: number;
  setNatality: (natality: number) => void;
  setManageNatality: React.Dispatch<React.SetStateAction<boolean>>;
  setSpeedOfGame: (speed: number) => void;
  setWalkStraight: (walkStraight: number) => void;
  setSmileySize: (size: number) => void;
  setMousDisatanceEscape: (distance: number) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}) => (
  <div className="hidden w-[590px] flex-col bg-neutral-800 p-4 text-xs text-neutral-200 md:flex">
    <div className="grid flex-1 grid-cols-[1.7fr_1.3fr] gap-3">
      {/* ==== COL 2 : DESCRIPTION + STATS ==== */}
      <div className="flex flex-col gap-2 pr-1">
        {/* Description */}
        <div className="rounded bg-neutral-900 p-3 text-[12px] leading-snug text-neutral-300">
          <p className="mb-1 text-sm font-semibold text-neutral-100">Règles de la simulation</p>

          <p>
            Les smileys évoluent sur une grille discrète et se déplacent de manière autonome à chaque tick. Leur trajectoire est semi-aléatoire : ils peuvent continuer tout droit ou changer de
            direction, sans jamais revenir immédiatement en arrière ni sortir de la grille.
          </p>

          <p className="mt-1">
            La souris influence le comportement des entités : lorsqu’un smiley se trouve à proximité du curseur, il cherche activement à s’en éloigner, créant une zone de répulsion dynamique.
          </p>

          <p className="mt-1">
            Lorsqu’au moins deux smileys occupent la même case, une interaction est enregistrée. Chaque smiley conserve l’historique de ses rencontres, ce qui fait évoluer son état au fil du temps :
            <span className="text-neutral-100"> Touché → Reproduction → Vieux → Supprimé</span>.
          </p>

          <p className="mt-1">
            Les smileys en phase de Reproduction peuvent engendrer de nouveaux individus selon le taux de natalité. À l’inverse, des rencontres répétées excessives conduisent à la disparition des
            entités concernées.
          </p>

          <p className="mt-2 text-[11px] text-neutral-400">
            💡 Logique interne : chaque smiley mémorise les identifiants des entités rencontrées (smyleyMeet). Le nombre de répétitions déclenche des transitions d’état, des naissances ou des
            suppressions, permettant à la population d’évoluer de façon émergente.
          </p>
        </div>

        {/* Live stats */}
        <h3 className="text-[10px] font-semibold tracking-wide text-neutral-400 uppercase">Live stats</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 rounded bg-neutral-700 p-3 font-mono text-xs">
          <div>Population</div>
          <div className="text-right">{smileys.length}</div>

          <div>Natalité</div>
          <div className="text-right">{natality}</div>

          <div>Vitesse simu</div>
          <div className="text-right">{speedOfGame} ms</div>

          <div>Marche droit</div>
          <div className="text-right">{walkStraight}</div>

          <div>Nb Naissance</div>
          <div className="text-right">{nbBorn} </div>
          <div>Nb Déces</div>
          <div className="text-right">{nbDead} </div>
        </div>

        {/* Debug */}
        {/* <div className="rounded bg-neutral-900 p-2 font-mono text-[11px] text-neutral-400">
                <p>Collisions: —</p>
                <p>Births / tick: —</p>
                <p>Deaths / tick: —</p>
              </div> */}
      </div>

      {/* ==== COL 1 : CONTROLS ==== */}
      <div className="flex flex-col gap-3 pl-1">
        <h3 className="text-[10px] font-semibold tracking-wide text-neutral-100 uppercase">Controls</h3>
        {/* Taille des smiley */}
        <div>
          <label htmlFor="smiley" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
            Taille des smiley <span className="ml-1 text-neutral-400">({Math.round(smileySize * 100)}%)</span>
          </label>
          <input onChange={(e) => setSmileySize(Number(e.target.value) / 100)} type="range" id="smiley" min="10" max="40" defaultValue={smileySize * 100} className="w-full accent-green-500" />
        </div>

        {/* Natalité */}
        <div>
          <label htmlFor="natality" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
            Taux de Natalité
            <span className="ml-1 text-neutral-400">({Math.round(natality * 100)}%)</span>
            <span>
              {/* create a button that say manage natality */}
              <button
                onClick={() => setManageNatality((prev) => !prev)}
                //put a different color if manageNatality is true
                className={(!manageNatality ? 'bg-red-400 hover:bg-red-600' : 'bg-green-400 hover:bg-green-600') + ' ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold text-black transition'}>
                {manageNatality ? 'auto mode' : 'manual mode'}
              </button>
            </span>
          </label>
          <input
            disabled={manageNatality}
            onChange={(e) => setNatality(Number(e.target.value) / 100)}
            type="range"
            id="natality"
            min="0"
            max="100"
            defaultValue={natality * 100}
            className="w-full accent-yellow-500"
          />
        </div>

        {/* Speed */}
        <div>
          <label htmlFor="speed" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
            Vitesse de la simulation
            <span className="ml-1 text-neutral-400">({speedOfGame} ms)</span>
          </label>
          <input onChange={(e) => setSpeedOfGame(51 - Number(e.target.value))} type="range" id="speed" min="1" max="50" defaultValue={speedOfGame} className="w-full accent-sky-400" />
        </div>

        {/* Walkt raight */}
        <div>
          <label htmlFor="speed" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
            Marche droit
            <span className="ml-1 text-neutral-400">({Math.round(walkStraight * 100)}%)</span>
          </label>
          <input onChange={(e) => setWalkStraight(Number(e.target.value) / 100)} type="range" id="walkStraight" min="1" max="50" defaultValue={walkStraight * 100} className="w-full accent-pink-400" />
        </div>

        {/* mousDisatanceEscape, setMousDisatanceEscape */}
        {/* répulsion de la souris */}
        <div>
          <label htmlFor="speed" className="mb-0.5 block text-xs font-medium font-semibold text-neutral-100">
            répulsion de la souris
            <span className="ml-1 text-neutral-400">({mousDisatanceEscape} cellules)</span>
          </label>
          <input onChange={(e) => setMousDisatanceEscape(Number(e.target.value))} type="range" id="speed" min="4" max="50" defaultValue={mousDisatanceEscape} className="w-full accent-blue-500" />
        </div>

        {/* ACTION */}
        <button onClick={() => setIsRunning(!isRunning)} className="mt-3 rounded bg-green-500 py-1.5 text-sm font-bold text-black transition hover:bg-green-400">
          {isRunning ? '⏸ Pause' : '▶️ Play'}
        </button>
      </div>
    </div>
  </div>
);

export default SidebarAndData;
