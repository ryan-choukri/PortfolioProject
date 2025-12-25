export const emojiExplainData = {
  createSmiley: {
    title: 'Création des smileys',
    description: 'Chaque smiley est un objet avec position, direction, état et historique de rencontres. ' + 'Ils sont générés aléatoirement au lancement du jeu à partir de la fonction makeSmiley.',
    code: `const makeSmiley = (x: number, y: number, id: number, state: string = 'normal'): Entity => ({
  name: NAMESOFSMILEYS[id % NAMESOFSMILEYS.length],
  id,
  x,
  y,
  dir: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
  state: state,
  smyleyMeet: [],
});

const generateSmyleys = Array.from({ length: NUM_SMILEYS }, (_, i) =>
  makeSmiley(Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE), i)
);

const [smileys, setSmileys] = useState<Entity[]>(generateSmyleys);`,
  },

  moveLogic: {
    title: 'Déplacement dans la grille',
    description:
      'Chaque smiley se déplace selon sa direction et peut changer aléatoirement de direction. ' +
      'Ils ne sortent jamais de la grille grâce à moveInGrid, et la fonction getSmartDirectionNoBack empêche les retours en arrière.',
    code: `function moveInGrid(position: { x: number; y: number }, direction: Direction, gridSize: number) {
  const { dx, dy } = MOVE_MAP[direction];
  return { x: Math.max(0, Math.min(gridSize - 1, position.x + dx)),
           y: Math.max(0, Math.min(gridSize - 1, position.y + dy)) };
}

function getSmartDirectionNoBack(entity: Entity, gridSize: number): Direction {
  const possible: Direction[] = [];
  if(entity.y > 0 && entity.dir !== 'down') possible.push('up');
  if(entity.y < gridSize - 1 && entity.dir !== 'up') possible.push('down');
  if(entity.x > 0 && entity.dir !== 'right') possible.push('left');
  if(entity.x < gridSize - 1 && entity.dir !== 'left') possible.push('right');
  return possible[Math.floor(Math.random() * possible.length)]!;
}`,
  },

  handleCollisions: {
    title: 'Collisions et interactions',
    description: 'Quand plusieurs smileys occupent la même case, ils interagissent : naissance, vieillesse ou mort. ' + 'Les rencontres sont suivies avec smyleyMeet et la fonction hasSameId.',
    code: `const positionsMap = new Map<string, number[]>();
newPositions.forEach((s, idx) => {
  const key = \`\${s.x},\${s.y}\`;
  if (!positionsMap.has(key)) positionsMap.set(key, []);
  positionsMap.get(key)!.push(idx);
});

positionsMap.forEach((ids) => {
  if(ids.length > 1) {
    let birthDone = false;
    ids.forEach((id) => {
      const meet = newPositions[id].smyleyMeet;
      const hasFour = hasSameId(meet, 4);
      const hasThree = hasSameId(meet, 3);
      const hasTwo = hasSameId(meet, 2);

      if(hasFour.find) idsToRemove.push(...hasFour.otherids, newPositions[id].id);
      if(!birthDone && Math.random() < natality) {
        toAdd.push(makeSmiley(randomX(), randomY(), nextIdRef.current++, 'young'));
        birthDone = true;
      }
      newPositions[id].smyleyMeet.push(...ids.filter(i => i !== id));
    });
  }
});`,
  },

  computeNatality: {
    title: 'Gestion adaptative de la natalité',
    description: 'La natalité est ajustée automatiquement pour maintenir un nombre de smileys stable, ' + 'en augmentant ou diminuant selon la population actuelle.',
    code: `setNatality((prev) => {
  if(smileys.length < NATALITY_TARGET_LOW)
    return Math.min(1, prev + 0.05 + (400 - smileys.length)/1000);
  if(smileys.length < NATALITY_TARGET_BEETWEEN_LOW)
    return Math.min(1, prev + 0.02);
  if(smileys.length > NATALITY_TARGET_HIGH)
    return Math.max(0, prev - 0.05 - (smileys.length - 1000)/1000);
  if(smileys.length > NATALITY_TARGET_BEETWEEN_HIGH)
    return Math.max(0, prev - 0.02);
  return prev;
});`,
  },

  bombsAndEscape: {
    title: 'Bombe et fuite face à la souris',
    description: 'Si une bombe est lancée, les smileys à proximité sont supprimés. ' + 'Ils s’éloignent également de la souris si elle se trouve dans la grille.',
    code: `const distX = s.x - mousePos.x;
const distY = s.y - mousePos.y;
const distance = Math.sqrt(distX*distX + distY*distY);

if(launchBomb && bombAtPosition && distanceToBomb(s) < 20) return [];
if(mouseOnGrid && distance < mousDisatanceEscape) {
  newDir = Math.abs(distX) > Math.abs(distY) ? (distX > 0 ? 'right' : 'left') : (distY > 0 ? 'down' : 'up');
}`,
  },
};
