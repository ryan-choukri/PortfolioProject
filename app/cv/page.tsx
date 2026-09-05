import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ResumeDocument } from '@/components/resume/ResumeDocument';
import styles from '@/components/resume/resume.module.css';
import '../pageAlternative.css';

export const metadata: Metadata = {
  title: 'CV 2026 — Ryan Choukri | Full Stack, Product & Automation',
  description: 'Consultez et téléchargez le CV de Ryan Choukri : développeur Full Stack, React, Next.js, IA, automatisation et produit. Plus de 5 ans d’expérience en startup et SaaS.',
};

export default function ResumePage() {
  return (
    <main className={styles.page}>
      <nav aria-label="Navigation du CV" className={styles.navigation}>
        <Link href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Retour au bureau
        </Link>
        <span>RYAN CHOUKRI · CV</span>
      </nav>
      <div className={styles.pageCard}>
        <ResumeDocument standalone />
      </div>
    </main>
  );
}
