"use client"
import Game2048 from "@/app/components/Game2048"
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';


export default function Grid2048() {
  const [gameKey, setGameKey] = useState(0);
  const resetGame = () => {
    setGameKey(prev => prev + 1); // forces Game2048 to remount
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Titre */}
      <h1 className="text-4xl font-bold text-center mb-2">2048</h1>
      <div className="rounded-t-lg overflow-hidden text-center p-3">
        <button onClick={resetGame} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          <p>RELOAD</p>
        </button>
      </div>
      <Game2048 key={gameKey} />
      <div className="px-2 w-full max-w-4xl mt-8 mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {[
          {
            title: "Création du composant",
            desc: "J'ai commencé par créer un petit composant React pour le plateau du jeu 2048. L'idée était de générer un grid simple de 4x4 cases avec des valeurs initiales.",
            color: "bg-blue-200"
          },
          {
            title: "Gestion des déplacements",
            desc: "Ensuite, j'ai implémenté la logique pour déplacer les tuiles à gauche, droite, haut et bas. J'ai commencé simple, en bougeant les cases et en essayant de fusionner les mêmes valeurs.",
            color: "bg-green-200"
          },
          {
            title: "Ajout des cases aléatoires",
            desc: "J'ai ajouté la génération de nouvelles cases aléatoires après chaque mouvement pour que le jeu avance, avec une valeur de 2 ou 4.",
            color: "bg-yellow-200"
          },
          {
            title: "Gestion clavier & tactile",
            desc: "J'ai géré les événements clavier pour PC et les swipe pour mobile, pour rendre le jeu interactif sur tous les devices.",
            color: "bg-purple-200"
          },
          {
            title: "Affichage et couleurs",
            desc: "J'ai utilisé Tailwind pour styliser les cases avec des couleurs différentes selon les valeurs, et rendre le tout plus lisible et sympa.",
            color: "bg-pink-200"
          },
          {
            title: "Tests et ajustements",
            desc: "Enfin, j'ai testé le jeu, ajusté les tailles, les paddings, et fait en sorte que ça reste agréable sur mobile comme sur grand écran.",
            color: "bg-orange-200"
          },
  ].map((step, i) => (
    <div
      key={i}
      className={`${step.color} p-4 rounded-lg border border-zinc-700 flex flex-col transform transition-all hover:scale-105 hover:shadow-lg`}
    >
      <h3 className="text-gray-900 font-bold text-lg mb-2">{step.title}</h3>
      <p className="text-gray-700 text-sm">{step.desc}</p>
    </div>
  ))}
</div>

    <SyntaxHighlighter language="tsx" style={tomorrow}>
      {`
const mergeLine = (line: number[]): number[] => {
const nonZero = line.filter(n => n !== 0);
const merged: number[] = [];

for (let i = 0; i < nonZero.length; i++) {
  if (nonZero[i] === nonZero[i + 1]) {
    merged.push(nonZero[i] * 2);
    i++; // on saute la suivante
  } else {
    merged.push(nonZero[i]);
  }
}

while (merged.length < 4) merged.push(0);
return merged;
};

const NewMoveBox = (direction: string, grid: number[][]): number[][] => {
switch (direction) {
  case "left":
    return grid.map(row => mergeLine(row));

  case "right":
    return grid.map(row =>
      mergeLine([...row].reverse()).reverse()
    );

  case "top": {
    const t = transpose(grid);
    const moved = t.map(row => mergeLine(row));
    return transpose(moved);
  }

  case "bottom": {
    const t = transpose(grid);
    const moved = t.map(row =>
      mergeLine([...row].reverse()).reverse()
    );
    return transpose(moved);
  }

  default:
    return grid;
}
};
        `}
    </SyntaxHighlighter>

    </div>
      
  );
}
