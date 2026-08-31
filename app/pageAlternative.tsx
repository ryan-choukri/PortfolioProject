'use client';
// import { createFileRoute } from '@tanstack/react-router';
// import { useState } from 'react';
// import { DesktopIcon } from '@/components/desktop/DesktopIcon';
// import { Dock } from '@/components/desktop/Dock';
// import { MenuBar } from '@/components/desktop/MenuBar';
// import { OSWindow } from '@/components/desktop/OSWindow';
// import { aboutText, projects, wallpaperUrl } from '@/data/projects';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { useWindowManager } from '@/hooks/useWindowManager';

// const TITLE = 'Stratosphère — Studio photographique, bureau interactif';
// const DESCRIPTION = "Portfolio du studio Stratosphère présenté comme un bureau d'ordinateur : ouvrez chaque projet dans sa propre fenêtre.";

// export const Route = createFileRoute('/')({
//   head: () => ({
//     meta: [
//       { title: TITLE },
//       { name: 'description', content: DESCRIPTION },
//       { property: 'og:title', content: TITLE },
//       { property: 'og:description', content: DESCRIPTION },
//       { property: 'og:type', content: 'website' },
//       { name: 'twitter:card', content: 'summary_large_image' },
//     ],
//   }),
//   component: DesktopPage,
// });

// function ProjectBody({ id }: { id: string }) {
//   const project = projects.find((p) => p.id === id);
//   if (!project) return null;
//   return (
//     <article className="px-6 pt-5 pb-6">
//       <h2 className="font-display text-4xl font-semibold tracking-tight">{project.title}</h2>
//       <p className="mt-3 text-sm leading-relaxed opacity-70">{project.description}</p>
//       <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-center text-sm">
//         <div>
//           <dt className="text-[10px] font-bold tracking-widest uppercase">Année</dt>
//           <dd className="mt-1 opacity-70">{project.year}</dd>
//         </div>
//         <div>
//           <dt className="text-[10px] font-bold tracking-widest uppercase">Type de projet</dt>
//           <dd className="mt-1 opacity-70">{project.type}</dd>
//         </div>
//         <div className="col-span-2">
//           <dt className="text-[10px] font-bold tracking-widest uppercase">Crédits</dt>
//           <dd className="mt-1 opacity-70">{project.credits}</dd>
//         </div>
//       </dl>
//       <img src={project.image} alt={project.title} loading="lazy" width={1280} height={853} className="mt-6 w-full rounded-lg object-cover" />
//     </article>
//   );
// }

// function UtilityBody({ id }: { id: string }) {
//   if (id === 'about') {
//     return (
//       <div className="px-6 pt-5 pb-6">
//         <h2 className="font-display text-3xl font-semibold tracking-tight">À propos</h2>
//         {aboutText.map((p) => (
//           <p key={p} className="mt-3 text-sm leading-relaxed opacity-70">
//             {p}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   if (id === 'notes') {
//     return (
//       <div className="px-6 pt-5 pb-6">
//         <h2 className="font-display text-3xl font-semibold tracking-tight">Notes</h2>
//         <ul className="mt-4 space-y-2 text-sm opacity-70">
//           <li>— Double-cliquez sur un fichier du bureau pour l'ouvrir.</li>
//           <li>— Déplacez les fenêtres par leur barre de titre.</li>
//           <li>— Redimensionnez-les par le coin bas-droit.</li>
//           <li>— Les pastilles ferment, réduisent ou agrandissent.</li>
//         </ul>
//       </div>
//     );
//   }
//   return (
//     <div className="px-6 pt-5 pb-6">
//       <h2 className="font-display text-3xl font-semibold tracking-tight">Contact</h2>
//       <p className="mt-3 text-sm leading-relaxed opacity-70">Pour un projet, une commande ou une collaboration :</p>
//       <a href="mailto:studio@stratosphere.fr" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
//         studio@stratosphere.fr
//       </a>
//       <p className="mt-6 text-sm opacity-70">12 rue des Panoyaux, 75020 Paris</p>
//     </div>
//   );
// }

// const titleFor = (id: string) => projects.find((p) => p.id === id)?.title ?? ({ about: 'À propos', notes: 'Notes', contact: 'Contact' } as Record<string, string>)[id] ?? id;

// type Pos = { x: number; y: number };
// const POSITIONS_KEY = 'stratosphere-icon-positions';

// function loadPositions(): Record<string, Pos> {
//   const defaults = Object.fromEntries(projects.map((p) => [p.id, p.pos]));
//   try {
//     const raw = localStorage.getItem(POSITIONS_KEY);
//     if (!raw) return defaults;
//     return { ...defaults, ...JSON.parse(raw) };
//   } catch {
//     return defaults;
//   }
// }

// function DesktopPage() {
//   const wm = useWindowManager();
//   const isMobile = useIsMobile();
//   const [selected, setSelected] = useState<string | null>(null);
//   const [positions, setPositions] = useState<Record<string, Pos>>(loadPositions);

//   const moveIcon = (id: string, dx: number, dy: number) => {
//     setPositions((prev) => {
//       const cur = prev[id] ?? projects.find((p) => p.id === id)?.pos ?? { x: 10, y: 10 };
//       const next = {
//         ...prev,
//         [id]: {
//           x: Math.min(95, Math.max(1, cur.x + (dx / window.innerWidth) * 100)),
//           y: Math.min(88, Math.max(4, cur.y + (dy / window.innerHeight) * 100)),
//         },
//       };
//       try {
//         localStorage.setItem(POSITIONS_KEY, JSON.stringify(next));
//       } catch {
//         // stockage indisponible : on garde juste l'état en mémoire
//       }
//       return next;
//     });
//   };

//   return (
//     <main
//       className="font-display relative h-screen w-screen overflow-hidden bg-neutral-800 bg-cover bg-center"
//       style={{ backgroundImage: `url(${wallpaperUrl})` }}
//       onPointerDown={(e) => {
//         if (e.target === e.currentTarget) setSelected(null);
//       }}>
//       <MenuBar />

//       {isMobile ? (
//         <div className="grid grid-cols-3 gap-3 px-4 pt-12 pb-32">
//           {projects.map((p) => (
//             <DesktopIcon
//               key={p.id}
//               title={p.title}
//               image={p.image}
//               selected={selected === p.id}
//               onSelect={() => {
//                 setSelected(p.id);
//                 wm.toggle(p.id);
//               }}
//               onOpen={() => wm.toggle(p.id)}
//               className="w-full"
//             />
//           ))}
//         </div>
//       ) : (
//         projects.map((p) => {
//           const pos = positions[p.id] ?? p.pos;
//           return (
//             <DesktopIcon
//               key={p.id}
//               title={p.title}
//               image={p.image}
//               selected={selected === p.id}
//               onSelect={() => setSelected(p.id)}
//               onOpen={() => wm.toggle(p.id)}
//               onDragBy={(dx, dy) => moveIcon(p.id, dx, dy)}
//               style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%` }}
//             />
//           );
//         })
//       )}

//       {wm.windows.map((w) => (
//         <OSWindow
//           key={w.id}
//           state={w}
//           title={titleFor(w.id)}
//           isMobile={isMobile}
//           onClose={() => wm.close(w.id)}
//           onMinimize={() => wm.minimize(w.id)}
//           onToggleMaximize={() => wm.toggleMaximize(w.id)}
//           onFocus={() => wm.focus(w.id)}
//           onMove={(x, y) => wm.move(w.id, x, y)}
//           onResize={(width, height) => wm.resize(w.id, width, height)}>
//           {projects.some((p) => p.id === w.id) ? <ProjectBody id={w.id} /> : <UtilityBody id={w.id} />}
//         </OSWindow>
//       ))}

//       <Dock onOpen={(id) => wm.toggle(id)} openIds={wm.windows.map((w) => w.id)} />
//     </main>
//   );
// }
export default function Home() {
  return <div>Alternative Page</div>;
}
