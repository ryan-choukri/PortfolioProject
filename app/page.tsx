'use client';
// pages/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { TextScramble } from '../components/ui/text-scramble';

type Experience = { company: string; role: string; period: string; description: string };
type Education = { school: string; degree: string; period: string };
type Project = { name: string; description: string; link?: string };
type Certification = { name: string; issuer: string; year: string };
type Achievement = { title: string; description?: string; color?: string };

const achievements: Achievement[] = [
  { title: '100+ Projects', color: '#F97316' },
  { title: 'React Expert', color: '#3B82F6' },
  { title: 'Node.js Mastery', color: '#10B981' },
  { title: 'Open Source Contributor', color: '#F43F5E' },
];

const experiencesDev: Experience[] = [
  {
    company: 'Assoconnect',
    role: 'Développeur Full Stack',
    period: 'Avril 2020 - Février 2023',
    description: `Développement d’applications React et Next.js avec un fort focus sur l’UI/UX et la performance.`,
  },
  {
    company: 'Fastory',
    role: 'Développeur Full Stack',
    period: 'Avril 2018 - Avril 2020',
    description: `Refonte complète de l’extension Chrome Elegantt (React 16 / Node.js).
Développement, maintenance et évolution de fonctionnalités en environnement de production.
Collaboration avec les équipes produit, support et communication.
Support client et résolution de problématiques techniques.`,
  },
  {
    company: 'IONISx',
    role: 'Développeur Full Stack',
    period: 'Avril 2017 - Avril 2018',
    description: `Développement et maintenance des fonctionnalités de la plateforme e-learning.
Conception et mise en œuvre d’un outil de correction de code pour les étudiants.
Amélioration de l’expérience utilisateur et optimisation des performances.
Collaboration avec les équipes pédagogiques et techniques pour faire évoluer la plateforme.`,
  },
];

const experiencesVie: Experience[] = [
  {
    company: 'Groupe de musique',
    role: 'Bassiste Chanteur Compositeur',
    period: 'Jan 2024 - Now',
    description: `Création d’un groupe de rock/punk.
Composition et enregistrement de morceaux, organisation du travail en groupe.
Relations avec les salles et programmateurs, gestion du booking, des concerts et des tournées.`,
  },
  {
    company: 'Association SailAhead : New York',
    role: 'Bénévole / Photographe Vidéaste',
    period: 'Mai 2023 - Septembre 2023',
    description: `Engagement associatif chez SailAhead à New York : organisation d’événements favorisant l’accès aux activités nautiques pour des publics en reinsertion social.`,
  },
  {
    company: 'Road trip en Amérique',
    role: 'Construction d’un van aménagé',
    period: 'Mar 2023 - Jan 2024',
    description: 'Transformation d’un van utilitaire en habitat mobile autonome. gestion complète du projet. electricité, plomberie, isolation, aménagement intérieur.',
  },
];

const education: Education[] = [
  { school: 'Webacademie', degree: 'BAC + 2 (titre RNCP 3)', period: '2016 - 2018' },
  { school: 'Lycée', degree: 'Bac PRO SEN', period: '2015' },
];

const projects: Project[] = [
  {
    name: 'Watch Finder',
    description:
      'Application mobile de recommandation de films et séries avec système de swipe intuitif. Développée en React Native avec Redux Toolkit, animations fluides et synchronisation cloud. Optimisée pour 60fps avec 99% crash-free rate.',
    link: 'https://watch-finder.netlify.app/',
  },
  {
    name: 'Tout Va Bien',
    description:
      "Jeu mobile de réflexion et d'énigmes logiques avec 100+ niveaux progressifs. Développé en React Native avec modes de jeu variés, système de récompenses et sauvegarde cloud multi-appareils. Architecture modulaire scalable.",
    link: 'https://storyteller-clone.netlify.app/',
  },
];

const certifications: Certification[] = [
  { name: 'React Professional', issuer: 'Coursera', year: '2022' },
  { name: 'Node.js Mastery', issuer: 'Udemy', year: '2021' },
];

// ✅ Composant générique pour toutes les cartes avec hover
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div
    className={`font-oswald transform cursor-pointer rounded-sm bg-gray-950/50 p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-103 hover:bg-gradient-to-r hover:from-sky-950 hover:to-gray-950 hover:shadow-2xl sm:p-5 ${className || ''}`}>
    {children}
  </div>
);

const CareerGraph = () => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to center (-1 to 1)
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      // Apply more pronounced tilt (max 25 degrees) in opposite direction
      const maxTilt = 12;
      const computeX = -mouseX * maxTilt;
      const computeY = mouseY * maxTilt;
      // console.log('mouseX, mouseY', mouseY * maxTilt);
      if (Math.abs(computeY) > 40) return;
      //Allow max possible X rotate on 32 on computeY
      setTilt({
        rotateY: computeX, // Opposite horizontal tilt
        rotateX: computeY, // Opposite vertical tilt
      });
    };

    // Add global mouse move listener
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  // Configuration de la hauteur
  const branchHeight = 80; // Hauteur entre la base et le haut des branches
  const baseY = 120;
  const svgWidth = 600;
  const svgHeight = 150;

  // Données chronologiques de 2020 à 2026
  const experiences = [
    { name: 'IONISx', startX: -22, endX: 70, color: '#ebe575ff', heightRatio: 0.3, year: '2018-2020', depth: 6 },
    { name: 'Fastory', startX: 50, endX: 198, color: '#ff67b3ff', heightRatio: 0.5, year: '2018-2020', depth: 4 },
    { name: 'Assoconnect', startX: 190, endX: 380, color: '#428bffff', heightRatio: 0.7, year: '2020-2023', depth: 6 },
    { name: 'Sail Ahead', startX: 370, endX: 430, color: '#3ce6b6ff', heightRatio: 0.4, year: '2023-2024', depth: 4 },
    { name: 'Musicien', startX: 420, endX: 550, color: '#f37d38ff', heightRatio: 0.5, year: '2024-2025', depth: 5 },
    { name: 'La Suite !\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0', startX: 530, endX: 622, color: '#f8d577ff', heightRatio: 0.7, year: '2025-2026', depth: 3 },
  ];

  // Années pour la timeline
  const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  const yearSpacing = (svgWidth - 40) / (years.length - 1);

  return (
    <div
      ref={containerRef}
      className="svg-container relative mb-3 flex h-[120px] justify-center sm:h-[120px] md:mb-4 lg:h-[190px]"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transformStyle: 'preserve-3d',
      }}>
      {/* Background Layer - Base timeline (pushed back) */}
      <div
        className="absolute inset-0 flex justify-center"
        style={{
          transform: 'translateZ(-20px)',
          transformStyle: 'preserve-3d',
        }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ maxWidth: '700px', height: 'auto' }}>
          {/* Base line representing life timeline */}
          <line x1="20" y1={baseY} x2={svgWidth - 20} y2={baseY} stroke="#bec5ceff" strokeWidth="4" />

          {/* Start circle */}
          <circle cx="20" cy={baseY} r="5" fill="#bec5ceff" />

          {/* End circle */}
          <circle cx={svgWidth - 20} cy={baseY} r="5" fill="#bec5ceff" />

          {/* Years timeline */}
          {years.map((year, index) => (
            <text key={year} x={20 + index * yearSpacing} y={baseY + 17} fontSize="12" fill="#64748B" textAnchor="middle" fontWeight="400">
              {year}
            </text>
          ))}
        </svg>
      </div>

      {/* Back Layer - Depth 1-2 experiences */}
      <div
        className="absolute inset-0 flex justify-center"
        style={{
          transform: 'translateZ(-15px)',
          transformStyle: 'preserve-3d',
        }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ maxWidth: '700px', height: 'auto' }}>
          {experiences
            .filter((exp) => exp.depth <= 2)
            .map((exp, index) => {
              const { startX, endX, color, heightRatio, name } = exp;
              const y = baseY - branchHeight * heightRatio;
              const midX = (startX + endX) / 2;
              const originalIndex = experiences.findIndex((e) => e.name === exp.name);

              return (
                <g key={index}>
                  <path d={`M ${startX} ${baseY} L ${startX + 20} ${y} L ${endX - 20} ${y} L ${endX} ${baseY}`} stroke={color} strokeWidth="3" fill="none" strokeLinejoin="round" />
                  {originalIndex !== 0 && originalIndex !== experiences.length - 1 && (
                    <>
                      <circle cx={startX + 20} cy={y} r="3" fill={color} />
                      <circle cx={endX - 20} cy={y} r="3" fill={color} />
                    </>
                  )}
                  <circle cx={startX} cy={baseY} r="4" fill={color} />
                  <circle cx={endX} cy={baseY} r="4" fill={color} />
                  <text x={midX} y={y - 15} fontSize="11" fontWeight="400" fill={color} textAnchor="middle">
                    {name}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Middle Layer - Depth 3-4 experiences */}
      <div
        className="absolute inset-0 flex justify-center"
        style={{
          transform: 'translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ maxWidth: '700px', height: 'auto' }}>
          {experiences
            .filter((exp) => exp.depth >= 3 && exp.depth <= 4)
            .map((exp, index) => {
              const { startX, endX, color, heightRatio, name } = exp;
              const y = baseY - branchHeight * heightRatio;
              const midX = (startX + endX) / 2;
              const originalIndex = experiences.findIndex((e) => e.name === exp.name);

              return (
                <g key={index}>
                  <path d={`M ${startX} ${baseY} L ${startX + 20} ${y} L ${endX - 20} ${y} L ${endX} ${baseY}`} stroke={color} strokeWidth="4" fill="none" strokeLinejoin="round" />
                  {originalIndex !== 0 && originalIndex !== experiences.length - 1 && (
                    <>
                      <circle cx={startX + 20} cy={y} r="4" fill={color} />
                      <circle cx={endX - 20} cy={y} r="4" fill={color} />
                    </>
                  )}
                  <circle cx={startX} cy={baseY} r="5" fill={color} />
                  <circle cx={endX} cy={baseY} r="5" fill={color} />
                  <text x={midX} y={y - 15} fontSize="12" fontWeight="500" fill={color} textAnchor="middle" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {name}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Front Layer - Depth 5-6 experiences (pulled forward) */}
      <div
        className="absolute inset-0 flex justify-center"
        style={{
          transform: 'translateZ(25px)',
          transformStyle: 'preserve-3d',
        }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ maxWidth: '700px', height: 'auto' }}>
          {experiences
            .filter((exp) => exp.depth >= 5)
            .map((exp, index) => {
              const { startX, endX, color, heightRatio, name } = exp;
              const y = baseY - branchHeight * heightRatio;
              const midX = (startX + endX) / 2;
              const originalIndex = experiences.findIndex((e) => e.name === exp.name);

              return (
                <g key={index}>
                  <path
                    d={`M ${startX} ${baseY} L ${startX + 20} ${y} L ${endX - 20} ${y} L ${endX} ${baseY}`}
                    stroke={color}
                    strokeWidth="5"
                    fill="none"
                    strokeLinejoin="round"
                    filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
                  />
                  {originalIndex !== 0 && originalIndex !== experiences.length - 1 && (
                    <>
                      <circle cx={startX + 20} cy={y} r="5" fill={color} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                      <circle cx={endX - 20} cy={y} r="5" fill={color} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                    </>
                  )}
                  <circle cx={startX} cy={baseY} r="6" fill={color} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                  <circle cx={endX} cy={baseY} r="6" fill={color} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                  <text
                    x={midX}
                    y={y - 15}
                    fontSize="13"
                    fontWeight="600"
                    fill={color}
                    textAnchor="middle"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    }}>
                    {name}
                  </text>

                  {/* Enhanced glow for front elements */}
                  <path d={`M ${startX} ${baseY} L ${startX + 20} ${y} L ${endX - 20} ${y} L ${endX} ${baseY}`} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" filter="blur(3px)" />
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/5 to-purple-900/9">
      <main className="mx-auto max-w-6xl p-4">
        {/* Header */}
        <header className="z-10 text-center">
          <h1 className="mb-2 h-[67px] text-[16vw] leading-[1] font-bold sm:text-7xl lg:h-full lg:text-8xl lg:leading-[0.8]">
            <TextScramble text="RYAN&nbsp;CHOUKRI" />
          </h1>
          <p className="text-sm text-gray-300 sm:text-xl">Frontend & Fullstack Developer</p>
        </header>
        <CareerGraph />
        <div className="z-10 grid gap-8 md:grid-cols-3">
          {/* Left column */}
          <section className="space-y-8 md:col-span-2">
            <div className="!mb-3 md:pl-10">
              <h2 className="mb-1 border-b border-gray-700 pb-2 text-xl font-semibold sm:text-2xl">Mes Expériences Dev</h2>
            </div>

            <div className="relative pl-0 md:pl-10">
              {/* ligne verticale */}
              <div className="absolute top-0 left-2.5 hidden h-full w-px bg-gray-700 md:block" />
              {experiencesDev.map((exp, idx) => (
                <div key={idx} className="relative mb-4">
                  {/* point */}
                  <Card>
                    <div className="mb-1 flex items-center justify-between font-medium text-gray-300">
                      <span>{exp.company}</span>
                      <span className="text-sm">{exp.period}</span>
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{exp.role}</h3>
                    <p className="mt-2 text-gray-400">{exp.description}</p>
                  </Card>
                </div>
              ))}
            </div>
            <div className="!mb-3 md:pl-10">
              <h2 className="mb-1 border-b border-gray-700 pb-2 text-xl font-semibold sm:text-2xl">Mes Expériences Vie</h2>
            </div>
            <div className="relative pl-0 md:pl-10">
              {/* ligne verticale */}
              <div className="absolute top-0 left-2.5 hidden h-full w-px bg-gray-700 md:block" />
              {experiencesVie.map((exp, idx) => (
                <div key={idx} className="relative mb-4">
                  {/* point */}
                  <Card>
                    <div className="mb-1 flex items-center justify-between font-medium text-gray-300">
                      <span>{exp.company}</span>
                      <span className="text-sm">{exp.period}</span>
                    </div>
                    <h3 className="mt-1 text-xl font-semibold">{exp.role}</h3>
                    <p className="mt-2 text-gray-400">{exp.description}</p>
                  </Card>
                </div>
              ))}
            </div>

            {/* <Card>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-white">Achievements</h2>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg" style={{ backgroundColor: ach.color || '#6B7280' }}>
                      {ach.title.split(' ')[0]}
                    </div>
                    <span className="mt-2 text-center text-xs text-gray-300">{ach.title}</span>
                  </div>
                ))}
              </div>
            </Card> */}

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-xl font-semibold sm:text-2xl">Formation</h2>
            {education.map((edu, idx) => (
              <Card key={idx}>
                <div className="mb-1 flex items-center justify-between font-medium text-gray-300">
                  <span>{edu.school}</span>
                  <span className="text-sm">{edu.period}</span>
                </div>
                <h3 className="mt-1 text-xl font-semibold">{edu.degree}</h3>
              </Card>
            ))}

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-xl font-semibold sm:text-2xl">Projets</h2>
            {projects.map((proj, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-semibold">{proj.name}</h3>
                <p className="mt-2 text-gray-400">{proj.description}</p>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-blue-400 hover:underline">
                    Voir le projet
                  </a>
                )}
              </Card>
            ))}

            {/* <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-xl font-semibold sm:text-2xl">Certifications</h2>
            {certifications.map((cert, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-semibold">{cert.name}</h3>
                <p className="text-gray-400">
                  {cert.issuer} - {cert.year}
                </p>
              </Card>
            ))} */}
          </section>

          {/* Right column */}
          <aside className="space-y-4 md:col-span-1">
            <Card>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold">Contact</h2>
              <p className="text-gray-300">Email: ryanchoukri@gmail.com</p>
              <p className="text-gray-300">Paris, France</p>
            </Card>

            <Card>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold">Skills</h2>
              <ul className="list-inside list-disc space-y-1 text-gray-300">
                <li>React / Next.js / Vite</li>
                <li>TypeScript / JavaScript</li>
                <li>Node.js / Express / NestJS</li>
                <li>Bonnes pratiques & patterns de sécurité</li>
                <li>Expérience en environnement de production</li>
                <li>Jest / Playwright</li>
                <li>Git / Agent IA</li>
                <li>API REST / MongoDB / PostgreSQL</li>
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
