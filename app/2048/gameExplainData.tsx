export const gameExplainData = {
  createComponent: {
    title: 'Création du composant',
    description:
      'J’ai commencé par créer un composant React simple représentant le plateau du jeu. ' +
      'Le plateau est une grille 4x4 stockée dans un state, ce qui permet de déclencher un re-render ' +
      'à chaque mouvement du joueur.',
    code: `const templateGrid = [[0, 0, 0, 0],
                      [0, 0, 0, 0],
                      [0, 0, 0, 0],
                      [0, 0, 0, 0],];

const [grid, setGrid] = useState(templateGrid);

{ /* Rendu de la grille */}
 <div className="grid grid-cols-4 gap-2">
  {grid.map((row, rowIndex) =>
    row.map((cell, cellIndex) => (
      <div key={\`\${rowIndex}-\${cellIndex}\`} className="h-16 w-16 flex items-center justify-center rounded bg-white/10 text-lg font-bold text-white">
        {cell !== 0 ? cell : ''}
      </div>
    ))
  )}
</div>`,
  },

  moveTiles: {
    title: 'Gestion des déplacements',
    description:
      'La logique des déplacements est centralisée dans une fonction unique. ' +
      'Selon la direction (gauche, droite, haut ou bas), je transforme la grille, ' +
      'fusionne les valeurs identiques et reconstruis une nouvelle grille.',
    code: `const mergeLine = (line: number[]) => {
  const nonZero = line.filter(n => n !== 0);
  const merged = [];

  for (let i = 0; i < nonZero.length; i++) {
    if (nonZero[i] === nonZero[i + 1]) {
      merged.push(nonZero[i] * 2);
      i++;
    } else {
      merged.push(nonZero[i]);
    }
  }

  while (merged.length < 4) merged.push(0);
  return merged;
};`,
  },

  randomTiles: {
    title: 'Ajout de cases aléatoires',
    description: 'Après chaque mouvement valide, une nouvelle tuile est ajoutée à une position vide. ' + 'La valeur générée est généralement 2, avec une petite probabilité d’obtenir un 4.',
    code: `const addRandomTile = (grid: number[][]) => {
  const empty = [];

  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c]);
    })
  );

  if (!empty.length) return grid;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const copy = grid.map(row => [...row]);
  copy[r][c] = value;
  return copy;
};`,
  },

  endingGame: {
    title: 'Détection de la fin de partie',
    description: 'Une fonction vérifie en permanence s’il reste des coups possibles. Si aucune fusion ni déplacement n’est envisageable, le jeu affiche un écran de fin.',
    code: `const checkGameOver = (grid: number[][]) => {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
      if (grid[r][c] === grid[r]?.[c + 1]) return false;
      if (grid[r]?.[c] === grid[r + 1]?.[c]) return false;
    }
  }
  return true;
};`,
  },
};
