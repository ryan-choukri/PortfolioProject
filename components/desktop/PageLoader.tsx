'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/data/portfolio';
import { projects, wallpaperUrl } from '@/data/projects';

type Props = {
  ready: boolean;
  onComplete: () => void;
};

const previewImages = [wallpaperUrl, profile.portrait.src, ...projects.map((project) => project.image.src)];
const bootSteps = [
  { label: 'Montage du bureau virtuel', threshold: 36 },
  { label: 'Connexion des modules', threshold: 72 },
  { label: 'Session Ryan chargée', threshold: 100 },
];
const segmentCount = 40;

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export function PageLoader({ ready, onComplete }: Props) {
  const [phase, setPhase] = useState<'loading' | 'ready' | 'revealing'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ready || phase !== 'loading') return;

    let cancelled = false;
    let assetsReady = false;
    let frame: number;
    let deadlineTimer: number;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startedAt = performance.now();
    const duration = reducedMotion ? 0 : 2400;
    const deadline = new Promise<void>((resolve) => {
      deadlineTimer = window.setTimeout(resolve, 4500);
    });
    const assets = Promise.allSettled([...previewImages.map(preloadImage), document.fonts.ready]);

    // On prépare les vrais visuels, avec une limite pour ne jamais bloquer l’entrée.
    void Promise.race([assets, deadline]).then(() => {
      assetsReady = true;
    });

    const advance = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startedAt;
      if (assetsReady && elapsed >= duration) {
        setProgress(100);
        setPhase('ready');
        return;
      }
      // La séquence visuelle s’arrête à 94 % tant que les ressources se préparent.
      setProgress(duration === 0 ? 94 : Math.min(94, Math.floor((elapsed / duration) * 100)));
      frame = window.requestAnimationFrame(advance);
    };
    frame = window.requestAnimationFrame(advance);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(deadlineTimer);
    };
  }, [ready, phase]);

  useEffect(() => {
    if (phase !== 'ready') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setPhase('revealing'), reducedMotion ? 0 : 320);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(onComplete, reducedMotion ? 180 : 900);
    return () => window.clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <section className="page-loader" data-phase={phase} data-crt="on" aria-label="Ouverture du portfolio">
      <div className="page-loader-shutter page-loader-shutter--top" aria-hidden="true" />
      <div className="page-loader-shutter page-loader-shutter--bottom" aria-hidden="true" />

      <div className="page-loader-frame">
        <header className="page-loader-header">
          <span>
            RYAN CHOUKRI<span className="page-loader-header-separator"> / </span>PORTFOLIO
          </span>
          <span className="page-loader-signal">
            <span />
            SIGNAL CRT
          </span>
        </header>

        <div className="page-loader-center">
          <div className="page-loader-terminal">
            <span className="page-loader-corner page-loader-corner--tl" aria-hidden="true" />
            <span className="page-loader-corner page-loader-corner--tr" aria-hidden="true" />
            <span className="page-loader-corner page-loader-corner--bl" aria-hidden="true" />
            <span className="page-loader-corner page-loader-corner--br" aria-hidden="true" />
            <span className="page-loader-terminal-prompt" aria-hidden="true">
              ↳
            </span>
            <div className="page-loader-os-heading">
              <h2>Ryan OS</h2>
              <span>v1.0.1</span>
            </div>
            <div className="page-loader-boot-label">
              <span>Initialisation du système</span>
              <span aria-hidden="true">{String(progress).padStart(2, '0')} %</span>
            </div>
            <div className="page-loader-progress" role="progressbar" aria-label="Initialisation de Ryan OS" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              {Array.from({ length: segmentCount }, (_, index) => (
                <span key={index} data-filled={index < Math.floor((progress / 100) * segmentCount)} />
              ))}
            </div>
            <ol className="page-loader-tasks" aria-label="Étapes du démarrage">
              {bootSteps.map((step, index) => {
                const done = progress >= step.threshold;
                const active = !done && (index === 0 || progress >= bootSteps[index - 1].threshold);
                const state = done ? 'done' : active ? 'active' : 'pending';
                return (
                  <li key={step.label} data-state={state} aria-label={`${step.label} : ${done ? 'terminée' : active ? 'en cours' : 'en attente'}`}>
                    <span className="page-loader-task-prompt" aria-hidden="true">
                      &gt;
                    </span>
                    <span className="page-loader-task-label">{step.label}</span>
                    <span className="page-loader-task-result" aria-hidden="true">
                      [ {done ? 'OK' : active ? '···' : '—'} ]
                    </span>
                  </li>
                );
              })}
            </ol>
            <span className="page-loader-scan" aria-hidden="true" />
          </div>

          <p className="page-loader-status" role="status" aria-live="polite">
            <span aria-hidden="true">↓</span>
            {phase === 'loading' ? 'Préparation de l’environnement' : 'Bureau prêt. Bienvenue, visiteur.'}
            <span aria-hidden="true">↑</span>
          </p>
        </div>

        <footer className="page-loader-footer">
          <span>DU CODE. DES IDÉES. UN PEU DE MOI.</span>
          <button type="button" onClick={() => setPhase('revealing')} disabled={phase !== 'loading'} className="page-loader-skip">
            Passer l’animation <span aria-hidden="true">↗</span>
          </button>
        </footer>
      </div>

      <div className="crt-overlay" aria-hidden="true" />
    </section>
  );
}
