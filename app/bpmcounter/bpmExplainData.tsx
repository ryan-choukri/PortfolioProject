export const bpmExplainData = {
  createComponent: {
    title: 'Création du composant',
    description: 'J’ai commencé par créer un composant React simple pour le compteur BPM. ' + 'Il affiche un bouton TAP et un compteur dynamique en fonction du nombre de clics et du temps écoulé.',
    code: `const [displayBpm, setDisplayBpm] = useState(0);
const [numberOfClick, setNumberOfClick] = useState(0);

{ /* Rendu du composant */ }
<button onClick={handleClick} >
  TAP
</button>`,
  },

  startCounting: {
    title: 'Détection du clic',
    description: 'À chaque clic sur le bouton, le compteur se met à jour. Si c’est le premier clic, un timer démarre pour mesurer le temps écoulé.',
    code: `const handleClick = () => {
  if (!isInCount) {
    timerRef.current = setInterval(() => setTimer(prev => prev + 1), 100);
    setIsInCount(true);
  }
  const newCount = numberOfClick + 1;
  const seconds = timer / 10 || 0.1;
  setDisplayBpm(Math.round((newCount / seconds) * 60));
  setNumberOfClick(prev => prev + 1);
};`,
  },

  bpmCalculation: {
    title: 'Calcul du BPM',
    description: 'Le BPM est calculé en prenant le nombre de clics par seconde et en le multipliant par 60 pour obtenir le nombre de battements par minute.',
    code: `const seconds = timer / 10 || 0.1;
const bpm = Math.round((numberOfClick / seconds) * 60);
setDisplayBpm(bpm);`,
  },

  styleDisplay: {
    title: 'Affichage dynamique',
    description: 'Le style du compteur change selon le BPM mesuré, grâce à une liste de styles prédéfinis. ' + 'Chaque tranche de BPM correspond à un label et un gradient de couleur.',
    code: `const BPM_STYLES = [
  { label: 'Ambient', min: 40, max: 70, color: 'from-blue-400 to-blue-600' },
  { label: 'Hip-Hop', min: 70, max: 95, color: 'from-purple-400 to-purple-600' },
  // ...
];

const style = BPM_STYLES.find(style => bpm >= style.min && bpm <= style.max) || { label: 'Unknown', color: 'from-zinc-500 to-zinc-700' };`,
  },
};
