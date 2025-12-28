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
      e.preventDefault();
      clickOnValidate();
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <h1 className="mb-2 text-center text-4xl font-bold text-white">Keyboard Game</h1>
      
      {/* Game Controls */}
      <div className="mb-4 text-center">
        <button 
          onClick={handlePlay} 
          className="rounded border border-blue-500 bg-transparent px-6 py-2 font-semibold text-blue-400 transition hover:border-transparent hover:bg-blue-500 hover:text-white"
        >
          {gameActive ? 'Nouvelle Partie' : 'Commencer'}
        </button>
      </div>

      {/* Game Stats */}
      {gameActive && (
        <div className="mb-6 flex justify-center space-x-8 rounded-lg border border-white/10 bg-gray-800/50 p-4 text-center text-white">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-400">{wordsTyped}</span>
            <span className="text-xs text-gray-400">Mots corrects</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-red-400">{errors}</span>
            <span className="text-xs text-gray-400">Erreurs</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-400">{(timer / 10).toFixed(1)}s</span>
            <span className="text-xs text-gray-400">Temps restant</span>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div className="mb-6 flex flex-col items-center space-y-4">
        {/* Text to type */}
        {gameActive && (
          <div className="w-full max-w-2xl rounded-lg border border-white/20 bg-gray-900/80 p-6 text-center backdrop-blur-sm">
            <div className="text-lg leading-relaxed">
              {textToType.trim().split(/\s+/).map((val, index) => {
                const wordFromUser = userInput.trim().split(/\s+/);
                
                if (val === wordFromUser[index]) {
                  return (
                    <span className="text-green-400" key={index}>
                      {val + ' '}
                    </span>
                  );
                } else if (wordFromUser[index] && wordFromUser[index].length >= val.length) {
                  return (
                    <span className="text-red-400" key={index}>
                      {val + ' '}
                    </span>
                  );
                }
                return (
                  <span className="text-gray-300" key={index}>
                    {val + ' '}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border border-white/20 bg-gray-900/50 p-1">
            <textarea
              className="h-32 w-full resize-none rounded-md bg-gray-800 p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Commencez à taper ici..."
              value={userInput}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={!gameActive}
            />
            {gameActive && (
              <div className="flex justify-between p-2">
                <span className="text-xs text-gray-400">Appuyez sur Entrée pour valider</span>
                <button
                  onClick={clickOnValidate}
                  className="rounded bg-green-600 px-4 py-1 text-sm text-white transition hover:bg-green-700"
                >
                  Valider
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End Game Modal */}
      {gameEnding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg border border-white/20 bg-gray-900 p-8 text-center">
            <h2 className="mb-6 text-2xl font-bold text-white">Partie terminée !</h2>
            <div className="mb-6 space-y-2 text-gray-300">
              <p>Temps écoulé : <span className="font-bold text-blue-400">{(1000 - timer) / 10}s</span></p>
              <p>Mots corrects : <span className="font-bold text-green-400">{wordsTyped}</span></p>
              <p>Erreurs : <span className="font-bold text-red-400">{errors}</span></p>
              <p>Précision : <span className="font-bold text-yellow-400">{wordsTyped + errors > 0 ? Math.round((wordsTyped / (wordsTyped + errors)) * 100) : 0}%</span></p>
            </div>
            <button
              onClick={handlePlay}
              className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Rejouer
            </button>
          </div>
        </div>
      )}

      {/* Technical Explanation */}
      <section className="mt-6 text-sm">
        <div className="mx-auto w-full px-4 sm:px-8 lg:max-w-5xl lg:px-8">
          <h2 className="mb-4 text-xl font-semibold text-white">Décomposition technique du jeu de frappe</h2>
          
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Object.values(keyboardExplainData).map((block, index) => (
              <DisplayBlock key={index} {...block} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KeyboardGame;
