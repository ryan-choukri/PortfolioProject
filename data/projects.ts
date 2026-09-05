import type { StaticImageData } from 'next/image';
import watchfinder from '@/assets/watchfinder.png';
import swipe from '@/assets/swipe.png';
import mobilegame from '@/assets/mobilegame.png';
import barbershop from '@/assets/barbershop.png';
import douglas from '@/assets/douglas.png';
import wallpaper from '@/assets/bigsur.jpg';

export const wallpaperUrl = wallpaper.src;

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string | string[];
  period?: string;
  role?: string;
  conclusion?: string;
  image: StaticImageData;
  screenshots: { image: StaticImageData; caption: string }[];
  tags: string[];
  highlights: string[];
  href?: string;
  pos: { x: number; y: number };
};

export const atelierDouglas = {
  id: 'atelier',
  title: 'Atelier Douglas',
  category: 'Projet entrepreneurial',
  period: '2026 — Aujourd’hui',
  summary: 'Création d’une micro-agence web et de son écosystème commercial automatisé.',
  description: [
    'Atelier Douglas est un projet entrepreneurial que j’ai conçu de bout en bout pour proposer des sites vitrines modernes aux TPE et PME dont la présence en ligne ne reflète plus la qualité de leur activité.',
    'Au-delà du site de l’agence, j’ai développé une véritable infrastructure de prospection : identification et qualification automatisées de prospects, centralisation des données dans Supabase, workflows n8n pour l’envoi et le suivi des campagnes, gestion des statuts et prévention des doublons.',
    'J’ai également créé plusieurs démonstrateurs sectoriels afin d’adapter l’approche commerciale à différents marchés comme les campings, conciergeries, barbers et entreprises industrielles.',
  ],
  role: 'Conception produit, développement full-stack, UI/UX, automatisation et stratégie d’acquisition.',
  image: douglas,
  screenshots: [{ image: douglas, caption: 'Le site Atelier Douglas — studio web indépendant' }],
  tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'n8n', 'Netlify', 'APIs', 'Email automation'],
  highlights: [
    'Conception et développement du site Atelier Douglas',
    'Création de landing pages et démonstrateurs métier',
    'Mise en place d’une base CRM avec Supabase / PostgreSQL',
    'Automatisation des workflows de prospection avec n8n',
    'Intégration des campagnes email et suivi des contacts',
    'Développement d’un système de qualification et de déduplication des prospects',
    'Création d’un pipeline permettant de rechercher, enrichir, stocker puis contacter automatiquement des entreprises',
    'Travail sur le positionnement, l’offre, les tarifs et les supports commerciaux',
  ],
  conclusion: 'Ce projet m’a permis de travailler sur l’ensemble de la chaîne d’un produit digital : conception, développement, infrastructure, automatisation et acquisition commerciale.',
  href: 'https://atelierdouglas.fr/',
  pos: { x: 69, y: 68 },
} satisfies Project;

// Contenus et liens repris du portfolio existant. Les visuels restent locaux.
export const projects: Project[] = [
  {
    id: 'watch-finder',
    title: 'Watch Finder',
    category: 'Application mobile',
    summary: 'Moins de temps à chercher. Plus de temps à regarder.',
    description:
      'Une application de découverte de films et de séries avec une navigation par swipe. Un projet autour des recommandations, des interactions tactiles et du soin apporté à l’expérience mobile.',
    image: watchfinder,
    screenshots: [
      { image: watchfinder, caption: 'Découvrir les films et les séries' },
      { image: swipe, caption: 'Choisir avec un swipe' },
    ],
    tags: ['React Native', 'TypeScript', 'Redux Toolkit'],
    highlights: [
      'Découverte et recommandation de films et de séries.',
      'Navigation par swipe et animations pour une utilisation intuitive.',
      'Gestion des préférences et synchronisation des données.',
    ],
    href: 'https://watch-finder.netlify.app/',
    pos: { x: 69, y: 17 },
  },
  {
    id: 'tout-va-bien',
    title: 'Tout Va Bien',
    category: 'Jeu mobile',
    summary: 'Des énigmes, un peu de logique et beaucoup de curiosité.',
    description:
      'Un jeu de réflexion où chaque niveau propose une nouvelle énigme. Une exploration des mécaniques de jeu sur mobile, de la progression et des interfaces qui donnent envie de recommencer.',
    image: mobilegame,
    screenshots: [{ image: mobilegame, caption: 'Un aperçu du jeu' }],
    tags: ['React Native', 'Jeu de réflexion', 'UX mobile'],
    highlights: ['Énigmes logiques avec une difficulté progressive.', 'Plusieurs modes de jeu et un système de récompenses.', 'Sauvegarde de la progression entre les appareils.'],
    href: 'https://storyteller-clone.netlify.app/',
    pos: { x: 84, y: 17 },
  },
  {
    id: 'barbershop',
    title: 'BarberShop',
    category: 'Projet web',
    summary: 'Une présence en ligne à l’image de chaque salon.',
    description:
      'Un template de site personnalisable pour les salons de coiffure et les barbershops. L’idée : partir d’une base commune pour présenter l’identité, les services et l’équipe de chaque établissement.',
    image: barbershop,
    screenshots: [{ image: barbershop, caption: 'Le site de démonstration du salon' }],
    tags: ['Template personnalisable', 'Responsive', 'Site vitrine'],
    highlights: [
      'Présentation du salon, de l’équipe, des services et des tarifs.',
      'Personnalisation des couleurs et de l’identité visuelle.',
      'Parcours de prise de rendez-vous et adaptation aux différents écrans.',
    ],
    href: 'https://thefrenchebarber.netlify.app/barber-240',
    pos: { x: 69, y: 43 },
  },
  atelierDouglas,
];

export const experiments = [
  { title: 'Météo Monde', description: 'Consulter la météo de différentes villes à partir de données Open-Meteo.', tags: ['API', 'Données en temps réel'] },
  { title: 'Simulation', description: 'Une population de smileys qui se déplace, se rencontre et évolue dans une grille.', tags: ['Simulation', 'Interactions'] },
  { title: '2048', description: 'Une version du jeu de tuiles avec déplacements, fusions et détection de fin de partie.', tags: ['Logique de jeu', 'React'] },
  { title: 'Keyboard', description: 'Un jeu de frappe chronométré avec analyse des mots, des erreurs et de la progression.', tags: ['Clavier', 'Temps réel'] },
  { title: 'BPM Counter', description: 'Retrouver le tempo d’un morceau en tapant son rythme.', tags: ['Musique', 'Interactions'] },
];
