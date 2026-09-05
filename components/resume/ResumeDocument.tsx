import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { resume } from '@/data/resume';
import styles from './resume.module.css';

export function ResumePdfLink({ className = styles.primaryAction }: { className?: string }) {
  return (
    <a href={resume.pdf} target="_blank" rel="noopener noreferrer" className={className}>
      <FileText size={16} aria-hidden="true" />
      Voir mon CV en PDF
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}

export function ResumeDocument({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? 'h1' : 'h2';

  return (
    <article className={styles.document}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Curriculum vitæ · {resume.year}</p>
        <Heading>{profile.name}</Heading>
        <p className={styles.role}>{profile.role}</p>
        <p className={styles.description}>Mon parcours, mes compétences et mes projets, réunis dans un document.</p>
      </header>
      <div className={styles.actions}>
        <ResumePdfLink />
        <a href={resume.pdf} download={resume.filename} className={styles.secondaryAction}>
          <Download size={16} aria-hidden="true" /> Télécharger
        </a>
      </div>
      <div className={styles.fileInfo}>
        <span>PDF · 1 page · Français</span>
        {!standalone && (
          <Link href="/cv">
            Ouvrir la page du CV <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        )}
      </div>
      <a href={resume.pdf} target="_blank" rel="noopener noreferrer" className={styles.preview} aria-label="Ouvrir le CV de Ryan Choukri en PDF dans un nouvel onglet">
        <Image
          src={resume.preview}
          alt="Aperçu du CV 2026 de Ryan Choukri : profil, compétences, expériences professionnelles, projets entrepreneuriaux et formation."
          width={1489}
          height={2105}
          sizes="(max-width: 767px) 90vw, 900px"
          priority
        />
      </a>
    </article>
  );
}
