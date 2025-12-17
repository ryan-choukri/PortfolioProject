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
  { title: 'Open Source Contributor', color: '#F43F5E' }
];

const experiences: Experience[] = [
  { company: 'Awesome Startup', role: 'Frontend Developer', period: 'Jan 2023 - Present', description: 'Développement d’applications React/Next.js avec focus sur UI/UX et performance.' },
  { company: 'Tech Corp', role: 'Fullstack Developer', period: 'Jun 2021 - Dec 2022', description: 'Création d’APIs Node.js et intégration front-end moderne avec React.' },
  { company: 'Tech Corp', role: 'Fullstack Developer', period: 'Jun 2021 - Dec 2022', description: 'Création d’APIs Node.js et intégration front-end moderne avec React.' },
  { company: 'Tech Corp', role: 'Fullstack Developer', period: 'Jun 2021 - Dec 2022', description: 'Création d’APIs Node.js et intégration front-end moderne avec React.' }
];

const education: Education[] = [
  { school: 'Université de Paris', degree: 'Master Informatique', period: '2019 - 2021' },
  { school: 'Lycée Technique', degree: 'Bac STI2D', period: '2016 - 2019' }
];

const projects: Project[] = [
  { name: 'Portfolio Website', description: 'Site web perso développé en Next.js et Tailwind CSS', link: 'https://johndoe.dev' },
  { name: 'Weather App', description: 'Application météo en React avec API OpenWeatherMap' }
];

const certifications: Certification[] = [
  { name: 'React Professional', issuer: 'Coursera', year: '2022' },
  { name: 'Node.js Mastery', issuer: 'Udemy', year: '2021' }
];

// ✅ Composant générique pour toutes les cartes avec hover
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`bg-gray-800 p-6 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-gray-800 hover:via-gray-900 hover:to-gray-900 ${className || ''}`}>
    {children}
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen text-white font-sans">
      <main className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-6xl font-bold mb-2">John Doe</h1>
          <p className="text-gray-300 text-xl">Frontend & Fullstack Developer</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left column */}
          <section className="md:col-span-2 space-y-8">
<h2 className="text-3xl font-semibold border-b border-gray-700 pb-2 mb-8">
  Experience
</h2>

<div className="relative pl-10">
  {/* ligne verticale */}
  <div className="absolute left-2.5 top-0 h-full w-px bg-gray-700" />

  {experiences.map((exp, idx) => (
    <div key={idx} className="relative mb-10">
      {/* point */}
      <div className="absolute left-2.5 top-7 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-400 z-10" />
      <Card>
        <div className="flex justify-between items-center text-gray-300 font-medium mb-1">
          <span>{exp.company}</span>
          <span className="text-sm">{exp.period}</span>
        </div>
        <h3 className="text-xl font-semibold mt-1">{exp.role}</h3>
        <p className="text-gray-400 mt-2">{exp.description}</p>
      </Card>
    </div>
  ))}
</div>

            <Card>
              <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">Achievements</h2>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                      style={{ backgroundColor: ach.color || '#6B7280' }}
                    >
                      {ach.title.split(' ')[0]}
                    </div>
                    <span className="text-gray-300 text-xs mt-2 text-center">{ach.title}</span>
                  </div>
                ))}
              </div>
            </Card>

            <h2 className="text-3xl font-semibold border-b border-gray-700 pb-2 mt-12 mb-4">Education</h2>
            {education.map((edu, idx) => (
              <Card key={idx}>
                <div className="flex justify-between items-center text-gray-300 font-medium mb-1">
                  <span>{edu.school}</span>
                  <span className="text-sm">{edu.period}</span>
                </div>
                <h3 className="text-xl font-semibold mt-1">{edu.degree}</h3>
              </Card>
            ))}

            <h2 className="text-3xl font-semibold border-b border-gray-700 pb-2 mt-12 mb-4">Projects</h2>
            {projects.map((proj, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-semibold">{proj.name}</h3>
                <p className="text-gray-400 mt-2">{proj.description}</p>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 mt-1 inline-block hover:underline">
                    View project
                  </a>
                )}
              </Card>
            ))}

            <h2 className="text-3xl font-semibold border-b border-gray-700 pb-2 mt-12 mb-4">Certifications</h2>
            {certifications.map((cert, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-semibold">{cert.name}</h3>
                <p className="text-gray-400">{cert.issuer} - {cert.year}</p>
              </Card>
            ))}
          </section>

          {/* Right column */}
          <aside className="md:col-span-1 space-y-6">
            <Card>
              <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Contact</h2>
              <p className="text-gray-300">Email: john.doe@example.com</p>
              <p className="text-gray-300">Phone: +33 6 12 34 56 78</p>
              <p className="text-gray-300">Website: johndoe.dev</p>
              <p className="text-gray-300">Location: Paris, France</p>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Skills</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
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
