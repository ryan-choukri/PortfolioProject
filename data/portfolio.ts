import portrait from '@/assets/ryan.jpg';
import { atelierDouglas, projects } from './projects';

const roleLines = ['Développeur Full Stack', 'Product & Automation · IA'];

export const profile = {
  name: 'Ryan Choukri',
  role: roleLines.join(' · '),
  roleLines,
  focus: 'Web · IA · Automatisation · Produit',
  location: 'Paris, France',
  email: 'ryanchoukri@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ryan-choukri',
  portrait,
  intro: 'Développeur Full Stack avec plus de 5 ans d’expérience en startup et SaaS, je conçois et fais évoluer des produits numériques.',
  about: [
    'Mon parcours passe par le e-learning chez IONISx, l’extension Chrome Elegantt chez Fastory et la plateforme SaaS d’AssoConnect. Mon fil conducteur : des interfaces utiles, performantes et agréables à utiliser.',
    'Je travaille avec React, Next.js, TypeScript et Node.js, en associant UI/UX, automatisation et IA. De la conception produit à la livraison, je m’intéresse autant à l’expérience utilisateur qu’à la qualité technique.',
    'Depuis 2026, je développe Atelier Douglas, un studio web indépendant. J’ai aussi fondé et piloté un projet musical : identité de marque, communication, coordination d’équipe et plus de 50 concerts.',
  ],
};

export const experiences = [
  {
    company: 'AssoConnect',
    role: 'Développeur Full Stack',
    period: 'Avril 2020 — Février 2023',
    details: [
      'Développement et évolution de la plateforme React / Next.js : UI/UX, performance et Core Web Vitals.',
      'Réduction de la dette technique et structuration des composants.',
      'Tests automatisés avec React Testing Library et Cypress ; CI/CD avec Azure DevOps.',
    ],
  },
  {
    company: 'Fastory',
    role: 'Développeur Full Stack',
    period: 'Avril 2018 — Avril 2020',
    details: [
      'Refonte complète de l’extension Chrome Elegantt avec React 16 et Node.js.',
      'Développement et maintenance de fonctionnalités en production.',
      'Support utilisateur et collaboration avec les équipes Produit, Support et Communication.',
    ],
  },
  {
    company: 'IONISx',
    role: 'Développeur Full Stack',
    period: 'Avril 2017 — Avril 2018',
    details: [
      'Développement et maintenance de la plateforme e-learning.',
      'Conception d’un outil de correction automatisée de code.',
      'Collaboration avec les équipes pédagogiques et techniques autour des outils et de l’expérience utilisateur.',
    ],
  },
];

export const education = [{ school: 'Web@cadémie / Epitech', degree: 'Certification Niveau 3 · Développeur Web Full Stack', period: '2016 — 2018' }];

export const skillGroups = [
  { title: 'Développement', skills: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js'] },
  { title: 'IA & automatisation', skills: ['n8n', 'LLM', 'ChatGPT', 'Claude', 'Cursor', 'Intégrations API'] },
  { title: 'Produit & design', skills: ['UI/UX', 'Figma', 'Performance', 'SEO', 'Analytics', 'Prototypage'] },
  { title: 'Qualité & livraison', skills: ['Git', 'CI/CD', 'Azure DevOps', 'Netlify', 'Cypress', 'React Testing Library'] },
];

export const entrepreneurialProjects = [
  {
    id: atelierDouglas.id,
    title: atelierDouglas.title,
    period: atelierDouglas.period,
    role: atelierDouglas.category,
    description: atelierDouglas.summary,
    skills: atelierDouglas.tags,
  },
  {
    id: 'beyond',
    title: 'Projet musical indépendant',
    period: '2024 — 2026',
    role: 'Fondateur & chef de projet',
    description: 'Développement d’un projet artistique : identité de marque, communication, événements, booking, coordination d’équipe, communauté et merchandising.',
    skills: ['Plus de 50 concerts', 'Festivals', 'Partenariats', 'Création de contenu'],
  },
];

export const beyondCode = [
  {
    title: entrepreneurialProjects[1].title,
    period: entrepreneurialProjects[1].period,
    subtitle: entrepreneurialProjects[1].role,
    description: `${entrepreneurialProjects[1].description} Plus de 50 concerts, des festivals, des partenariats et de la création de contenu.`,
  },
  {
    title: 'SailAhead, New York',
    period: 'Mai — Septembre 2023',
    subtitle: 'Bénévolat, photo & vidéo',
    description: 'Un engagement associatif autour d’événements nautiques favorisant la réinsertion sociale. Une autre manière de contribuer, de rencontrer et de raconter.',
  },
  {
    title: 'Un van, un road trip',
    period: 'Mars 2023 — Janvier 2024',
    subtitle: 'Construire et voyager',
    description: 'Transformation d’un utilitaire en habitat mobile autonome : électricité, plomberie, isolation et aménagement. Un projet mené de la conception à la route.',
  },
];

export type FileSymbol = 'user' | 'briefcase' | 'code' | 'music' | 'mail' | 'folder' | 'flask' | 'help' | 'file';
export type DesktopItem = {
  id: string;
  title: string;
  subtitle: string;
  symbol: FileSymbol;
  tone: 'blue' | 'violet' | 'amber' | 'green' | 'rose' | 'red' | 'lime' | 'cyan' | 'teal' | 'orange';
  image?: string;
  pos: { x: number; y: number };
};

const projectTones: Record<string, DesktopItem['tone']> = {
  'watch-finder': 'cyan',
  'tout-va-bien': 'lime',
  barbershop: 'orange',
  atelier: 'teal',
};

export const desktopItems: DesktopItem[] = [
  { id: 'about', title: 'À propos', subtitle: 'Présentation', symbol: 'user', tone: 'amber', pos: { x: 10, y: 17 } },
  { id: 'experience', title: 'Parcours', subtitle: 'Expériences & formation', symbol: 'briefcase', tone: 'violet', pos: { x: 9, y: 36 } },
  { id: 'projects', title: 'Mes projets', subtitle: 'Une sélection de réalisations', symbol: 'folder', tone: 'blue', pos: { x: 9, y: 55 } },
  { id: 'contact', title: 'Contact', subtitle: 'Discutons ensemble', symbol: 'mail', tone: 'red', pos: { x: 18, y: 55 } },
  { id: 'cv', title: 'Mon CV', subtitle: 'CV 2026 · PDF', symbol: 'file', tone: 'rose', pos: { x: 18, y: 36 } },
  ...projects.map((project): DesktopItem => ({
    id: project.id,
    title: project.title,
    subtitle: project.category,
    symbol: 'folder',
    tone: projectTones[project.id] ?? 'blue',
    image: project.image.src,
    pos: project.pos,
  })),
  { id: 'lab', title: 'Laboratoire', subtitle: 'Petites expériences', symbol: 'flask', tone: 'green', pos: { x: 89, y: 55 } },
];

export const utilityItems: DesktopItem[] = [
  { id: 'skills', title: 'Compétences', subtitle: 'Outils & savoir-faire', symbol: 'code', tone: 'violet', pos: { x: 0, y: 0 } },
  { id: 'beyond', title: 'Au-delà du code', subtitle: 'Musique & aventures', symbol: 'music', tone: 'amber', pos: { x: 0, y: 0 } },
  { id: 'notes', title: 'Mode d’emploi', subtitle: 'Explorer ce bureau', symbol: 'help', tone: 'amber', pos: { x: 0, y: 0 } },
];

export const windowItems = [...desktopItems, ...utilityItems];
