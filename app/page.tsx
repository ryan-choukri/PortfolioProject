// pages/index.tsx
import React from 'react';
import { TextScramble } from '../components/ui/text-scramble';
import { Waves } from '@/components/ui/wave-background';

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
    role: 'Fullstack Developpeur',
    period: 'Avril 2020 - Fevrier 2023',
    description: 'Développement d’applications React/Next.js avec focus sur UI/UX et performance.',
  },
  {
    company: 'Fastory',
    role: 'Fullstack Developpeur',
    period: 'Avr 2018 - Avr 2020',
    description: 'Création d’APIs Node.js et intégration front-end moderne avec React.',
  },
  {
    company: 'IONISx',
    role: 'Fullstack Developpeur',
    period: 'Avr 2017 - Avr 2018',
    description: 'Création d’APIs Node.js et intégration front-end moderne avec React.',
  },
];

const experiencesVie: Experience[] = [
  {
    company: 'Groupe de musique',
    role: 'Bassiste Chanteur Compositeur',
    period: 'Jan 2024 - Now',
    description: 'Création d"un groupe de musique, composition et enregistrement de morceaux.',
  },
  {
    company: 'Association SailAhead : New York',
    role: 'Photographe Vidéaste ',
    period: 'Mai 2023 - Septembre 2023',
    description: 'Création d’APIs Node.js et intégration front-end moderne avec React.',
  },
  {
    company: 'Road trip en Amérique',
    role: 'Construction d’un van aménagé',
    period: 'Mar 2023 - Jan 2024',
    description: 'Transformation d’un van utilitaire en habitat mobile autonome. gestion complète du projet. electricité, plomberie, isolation, aménagement intérieur.',
  },
];

const education: Education[] = [
  { school: 'Université de Paris', degree: 'Master Informatique', period: '2019 - 2021' },
  { school: 'Lycée Technique', degree: 'Bac STI2D', period: '2016 - 2019' },
];

const projects: Project[] = [
  {
    name: 'Portfolio Website',
    description: 'Site web perso développé en Next.js et Tailwind CSS',
    link: 'https://ryanchoukri.com',
  },
  { name: 'Weather App', description: 'Application météo en React avec API OpenWeatherMap' },
];

const certifications: Certification[] = [
  { name: 'React Professional', issuer: 'Coursera', year: '2022' },
  { name: 'Node.js Mastery', issuer: 'Udemy', year: '2021' },
];

// ✅ Composant générique pour toutes les cartes avec hover
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div
    className={`transform cursor-pointer rounded-sm bg-gray-800 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-103 hover:bg-gradient-to-r hover:from-sky-950 hover:to-gray-900 hover:shadow-2xl ${className || ''}`}>
    {children}
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-white">
      <main className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <header className="z-10 mb-12 text-center">
          <h1 className="mb-2 text-6xl font-bold">
            <TextScramble text="Ryan&nbsp;Choukri" />
          </h1>
          <p className="text-xl text-gray-300">Frontend & Fullstack Developer</p>
        </header>

        <div className="z-10 grid gap-8 md:grid-cols-3">
          {/* Left column */}
          <section className="space-y-8 md:col-span-2">
            <div className="!mb-3 md:pl-10">
              <h2 className="mb-1 border-b border-gray-700 pb-2 text-3xl font-semibold">Mes Expériences Dev</h2>
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
              <h2 className="mb-1 border-b border-gray-700 pb-2 text-3xl font-semibold">Mes Expériences Vie</h2>
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

            <Card>
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
            </Card>

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-3xl font-semibold">Formation</h2>
            {education.map((edu, idx) => (
              <Card key={idx}>
                <div className="mb-1 flex items-center justify-between font-medium text-gray-300">
                  <span>{edu.school}</span>
                  <span className="text-sm">{edu.period}</span>
                </div>
                <h3 className="mt-1 text-xl font-semibold">{edu.degree}</h3>
              </Card>
            ))}

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-3xl font-semibold">Projects</h2>
            {projects.map((proj, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-semibold">{proj.name}</h3>
                <p className="mt-2 text-gray-400">{proj.description}</p>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-blue-400 hover:underline">
                    View project
                  </a>
                )}
              </Card>
            ))}

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-3xl font-semibold">Certifications</h2>
            {certifications.map((cert, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-semibold">{cert.name}</h3>
                <p className="text-gray-400">
                  {cert.issuer} - {cert.year}
                </p>
              </Card>
            ))}
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
                <li>React / Next.js</li>
                <li>TypeScript / JavaScript</li>
                <li>Node.js / Express</li>
                <li>CSS / Tailwind / SCSS</li>
                <li>REST / MongoDB</li>
              </ul>
            </Card>
          </aside>
        </div>
        <Waves className="h-full w-full" />
      </main>
    </div>
  );
}
