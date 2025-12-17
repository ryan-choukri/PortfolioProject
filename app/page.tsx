// pages/index.tsx
import React from 'react';

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

const experiences: Experience[] = [
  {
    company: 'Awesome Startup',
    role: 'Frontend Developer',
    period: 'Jan 2023 - Present',
    description: 'Développement d’applications React/Next.js avec focus sur UI/UX et performance.',
  },
  {
    company: 'Tech Corp',
    role: 'Fullstack Developer',
    period: 'Jun 2021 - Dec 2022',
    description: 'Création d’APIs Node.js et intégration front-end moderne avec React.',
  },
  {
    company: 'Tech Corp',
    role: 'Fullstack Developer',
    period: 'Jun 2021 - Dec 2022',
    description: 'Création d’APIs Node.js et intégration front-end moderne avec React.',
  },
  {
    company: 'Tech Corp',
    role: 'Fullstack Developer',
    period: 'Jun 2021 - Dec 2022',
    description: 'Création d’APIs Node.js et intégration front-end moderne avec React.',
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
    link: 'https://johndoe.dev',
  },
  { name: 'Weather App', description: 'Application météo en React avec API OpenWeatherMap' },
];

const certifications: Certification[] = [
  { name: 'React Professional', issuer: 'Coursera', year: '2022' },
  { name: 'Node.js Mastery', issuer: 'Udemy', year: '2021' },
];

// ✅ Composant générique pour toutes les cartes avec hover
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div
    className={`transform rounded-xl bg-gray-800 p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-gradient-to-r hover:from-gray-800 hover:via-gray-900 hover:to-gray-900 hover:shadow-2xl ${className || ''}`}
  >
    {children}
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-white">
      <main className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-6xl font-bold">Ryan Choukri</h1>
          <p className="text-xl text-gray-300">Frontend & Fullstack Developer</p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left column */}
          <section className="space-y-8 md:col-span-2">
            <h2 className="mb-8 border-b border-gray-700 pb-2 text-3xl font-semibold">
              Experience
            </h2>

            <div className="relative pl-10">
              {/* ligne verticale */}
              <div className="absolute top-0 left-2.5 h-full w-px bg-gray-700" />

              {experiences.map((exp, idx) => (
                <div key={idx} className="relative mb-10">
                  {/* point */}
                  <div className="absolute top-7 left-2.5 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-400" />
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
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold text-white">
                Achievements
              </h2>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg"
                      style={{ backgroundColor: ach.color || '#6B7280' }}
                    >
                      {ach.title.split(' ')[0]}
                    </div>
                    <span className="mt-2 text-center text-xs text-gray-300">{ach.title}</span>
                  </div>
                ))}
              </div>
            </Card>

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-3xl font-semibold">
              Education
            </h2>
            {education.map((edu, idx) => (
              <Card key={idx}>
                <div className="mb-1 flex items-center justify-between font-medium text-gray-300">
                  <span>{edu.school}</span>
                  <span className="text-sm">{edu.period}</span>
                </div>
                <h3 className="mt-1 text-xl font-semibold">{edu.degree}</h3>
              </Card>
            ))}

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-3xl font-semibold">
              Projects
            </h2>
            {projects.map((proj, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-semibold">{proj.name}</h3>
                <p className="mt-2 text-gray-400">{proj.description}</p>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-blue-400 hover:underline"
                  >
                    View project
                  </a>
                )}
              </Card>
            ))}

            <h2 className="mt-12 mb-4 border-b border-gray-700 pb-2 text-3xl font-semibold">
              Certifications
            </h2>
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
          <aside className="space-y-6 md:col-span-1">
            <Card>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold">Contact</h2>
              <p className="text-gray-300">Email: john.doe@example.com</p>
              <p className="text-gray-300">Phone: +33 6 12 34 56 78</p>
              <p className="text-gray-300">Website: johndoe.dev</p>
              <p className="text-gray-300">Location: Paris, France</p>
            </Card>

            <Card>
              <h2 className="mb-4 border-b border-gray-700 pb-2 text-2xl font-semibold">Skills</h2>
              <ul className="list-inside list-disc space-y-1 text-gray-300">
                <li>React / Next.js</li>
                <li>TypeScript / JavaScript</li>
                <li>Node.js / Express</li>
                <li>CSS / Tailwind / SCSS</li>
                <li>REST / GraphQL</li>
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
