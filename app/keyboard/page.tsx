'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TEXTS = [
  'Vais-je réussir le défi en moins de cent secondes sans faire trop d’erreurs ?',
  'Le temps défile et chaque frappe compte, est-ce que je vais tenir jusqu’au bout ?',
  'Mes doigts suivent-ils vraiment mon cerveau ou vont-ils me trahir au dernier moment ?',
  'Encore quelques secondes, je dois rester concentré et ne pas paniquer.',
  'Chaque mot tapé me rapproche de la fin, mais aussi de l’erreur fatale.',
  'Est-ce que je vais garder le rythme ou perdre le fil avant la fin du chrono ?',
  'Respire, regarde l’écran, continue à taper sans réfléchir.',
  'Le compte à rebours est lancé, impossible de revenir en arrière maintenant.',
  'Je sens la pression monter, mais je continue, mot après mot.',
  'Tout peut basculer sur une seule lettre mal placée.',
];

const KeyboardGame = () => {
  const [textToType, setTextToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wordsTyped, setWordsTyped] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timer, setTimer] = useState(1000);
  const [gameActive, setGameActive] = useState(false);
  const [gameEnding, setGameEnding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateText = () => TEXTS[Math.floor(Math.random() * TEXTS.length)];

  const handlePlay = () => {
    const newText = generateText();
    setTextToType(newText);
    setUserInput('');
    setWordsTyped(0);
    setErrors(0);
    setTimer(1000);
    setGameActive(true);
    setGameEnding(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameEnding(true);
          return 0;
        }
        return prev - 1;
      });
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);

    const typedWords = value.trim().split(/\s+/);
    const targetWords = textToType.trim().split(/\s+/);

    let correctWords = 0;
    let errorCount = 0;
    typedWords.forEach((word, i) => {
      if (word === targetWords[i]) correctWords++;
      else errorCount++;
    });

    setWordsTyped(correctWords);
    setErrors(errorCount);
  };

  const clickOnValidate = () => {
    setGameEnding(true);
    if (timerRef.current) clearInterval(timerRef.current);
    console.log('Texte validé :', userInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // évite un retour à la ligne
      clickOnValidate();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start space-y-8 p-2 md:p-6">
      <h1 className="!mb-6 text-center text-5xl font-bold text-white">Keyboard Game</h1>

      {/* Infos */}
      {gameActive && (
        <div className="!mb-2 flex space-x-8 text-sm text-white">
          <div>Nombre de mots: {wordsTyped}</div>
          <div>
            {"Nombre d'erreurs: "}
            {errors}
          </div>
          <div>Temps restant : {(timer / 10).toFixed(2)} s</div>
        </div>
      )}

      {gameEnding && (
        <div className="pointer-events-auto absolute inset-0 z-10 mt-50 flex flex-col items-center">
          <div
            style={{ padding: '30px' }}
            className="flex flex-col items-center justify-center rounded-xl bg-black/50 p-12"
          >
            <p className="mb-6 text-center text-2xl font-extrabold text-white">Resultat</p>
            <p className="text-center text-white">
              Temps : {(timer / 10).toFixed(2)}
              {"s , Nombre d'erreurs : " + errors + ' , Nombre de mots: ' + errors}
            </p>
            <button
              style={{ padding: '6px 17px', margin: '18px' }}
              onClick={handlePlay}
              className="m-4 rounded-lg bg-red-500 px-6 py-3 text-lg font-bold text-white transition hover:bg-red-600"
            >
              Rejouer
            </button>
          </div>
        </div>
      )}
      {/* Texte à taper */}
      {gameActive && (
        <div className="border-white-700 w-full max-w-md rounded-lg border-4 border-double bg-slate-200 !p-4 text-center text-black italic">
          {textToType
            .trim()
            .split(/\s+/)
            .map((val, index) => {
              // console.log('val', val);
              const wordFromUser = userInput.trim().split(/\s+/);
              // console.log('userInput', wordFromUser[index]);
              console.log(wordFromUser[index]?.length, wordFromUser[index]?.length);
              if (val === wordFromUser[index]) {
                return (
                  <span className="text-green-700" key={index}>
                    {val + ' '}
                  </span>
                );
              } else if (wordFromUser[index] == undefined || wordFromUser[index] == '') {
                return val + ' ';
              } else if (wordFromUser[index].length >= val.length) {
                return (
                  <span className="text-red-700" key={index}>
                    {val + ' '}
                  </span>
                );
              }
              return val + ' ';
            })}
        </div>
      )}

      {/* Textarea + bouton valider */}
      <div className="flex w-full max-w-md flex-col space-y-2">
        <textarea
          onKeyDown={handleKeyDown}
          className="!mb-0 h-40 w-full resize-none rounded-t-lg bg-slate-200 p-4 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Tapez ici..."
          value={userInput}
          onChange={handleChange}
        />
        {gameActive && (
          <button
            type="button"
            onClick={clickOnValidate}
            className="disabled w-full rounded-b-lg bg-green-500 px-4 py-3 font-bold text-white transition hover:bg-green-600"
          >
            Validé (Ou apuyer sur entrée)
          </button>
        )}
      </div>
      {/* "#1a4331", // Pastel bleu très clair
  "#6499c3", // Pastel rose
  "#edeaddff", // Pastel crème
  "#bb5387ff", // Pastel vert doux
  "#b84d46", // Pastel pêche
  "#e4c343"  // Pastel lavande 
  "#284e8c"  // Pastel lavande */}

      {/* Bouton Play */}
      <button
        onClick={handlePlay}
        className="rounded-lg bg-red-500 px-6 py-3 text-lg font-bold text-white transition hover:bg-red-600"
      >
        Play
      </button>
      <div className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[
          {
            title: 'Création du composant',
            desc: "J'ai commencé par créer un petit composant React pour le KeyboardGame, avec un textarea simple et un affichage du texte à taper.",
            textColor: '#ffffffff',
            color: '#1a4331',
          },
          {
            title: 'Génération du texte',
            desc: "J'ai mis en place un tableau de phrases aléatoires et généré un texte à chaque partie pour que le joueur ait toujours un nouveau challenge.",
            textColor: '#292929ff',
            color: '#edeaddff',
          },
          {
            title: 'Gestion du compteur et timer',
            desc: "J'ai ajouté un timer de 100 secondes, affiché en secondes avec décimales, pour rendre le jeu dynamique et mesurer la rapidité du joueur.",
            textColor: '#dadadaff',
            color: '#bb5387ff',
          },
          {
            title: "Gestion de l'input",
            desc: "Le textarea capture la saisie utilisateur et calcule en temps réel le nombre de mots corrects et le nombre d'erreurs.",
            textColor: '#dadadaff',
            color: '#b84d46',
          },
          {
            title: 'Bouton Valider',
            desc: "J'ai ajouté un bouton Valider juste en dessous du textarea qui permet de soumettre le texte ou d'appuyer sur Enter pour valider.",
            textColor: '#242424ff',
            color: '#e4c343',
          },
          {
            title: 'Affichage et couleurs',
            desc: 'Le texte à taper change de couleur selon la saisie : vert si correct, rouge si erreur. Tailwind permet un rendu clair et dynamique.',
            textColor: '#dadadaff',
            color: '#284e8c',
          },
        ].map((step, i) => (
          <div
            key={i}
            style={{ color: step.textColor, backgroundColor: step.color }} // <- ici la couleur
            className={`${step.color} flex transform flex-col justify-between rounded-lg border border-zinc-700 p-4 transition-all hover:scale-105 hover:shadow-lg`}
          >
            <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
            <p className="text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
      <SyntaxHighlighter language="tsx" style={tomorrow}>
        {`    
        const typedWords = value.trim().split(/\s+/);
        const targetWords = textToType.trim().split(/\s+/);

        let correctWords = 0;
        let errorCount = 0;
        typedWords.forEach((word, i) => {
          if (word === targetWords[i]) correctWords++;
          else errorCount++;
        });

        setWordsTyped(correctWords);
        setErrors(errorCount);
    `}
      </SyntaxHighlighter>
    </div>
  );
};

export default KeyboardGame;
