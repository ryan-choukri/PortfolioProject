import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { beyondCode, education, entrepreneurialProjects, experiences, profile, skillGroups } from '@/data/portfolio';
import { experiments, projects, type Project } from '@/data/projects';
import { ResumeDocument, ResumePdfLink } from '@/components/resume/ResumeDocument';
import { ContactPanel } from './ContactPanel';

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="border-border bg-muted/60 text-muted-foreground rounded-md border px-2.5 py-1 text-xs">
          {item}
        </span>
      ))}
    </div>
  );
}

function Heading({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <header className="mb-7">
      <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase">{label}</p>
      <h2 className="text-3xl leading-tight font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{description}</p>}
    </header>
  );
}

function EntrepreneurialProjects({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {entrepreneurialProjects.map((project) => {
        const preview = projects.find((item) => item.id === project.id)?.image;
        return (
          <button key={project.id} onClick={() => onOpen(project.id)} className="border-border bg-card hover:bg-accent flex w-full items-start gap-4 rounded-xl border p-5 text-left transition-colors">
            {preview && <Image src={preview} alt="" width={80} height={64} className="mt-1 h-16 w-20 shrink-0 rounded-lg object-cover object-top" />}
            <span className="min-w-0 flex-1">
              <span className="text-accent-foreground text-[11px]">
                {project.period} · {project.role}
              </span>
              <span className="mt-2 flex items-center justify-between gap-3 text-lg font-semibold">
                {project.title}
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </span>
              <span className="text-muted-foreground mt-2 block text-sm leading-relaxed">{project.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function JourneyContent({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <>
      <Heading
        label="Expériences & formation"
        title="Mon parcours"
        description="Plus de 5 ans en startup et SaaS, puis des projets entrepreneuriaux et créatifs où se rencontrent développement, produit et automatisation."
      />
      <section className="mb-8">
        <h3 className="mb-4 text-sm font-semibold">Projets entrepreneuriaux & créatifs</h3>
        <EntrepreneurialProjects onOpen={onOpen} />
      </section>
      <h3 className="mb-5 text-sm font-semibold">Expériences professionnelles</h3>
      <div className="border-border space-y-7 border-l pl-5">
        {experiences.map((experience) => (
          <section key={experience.company} className="relative">
            <span className="bg-primary ring-window absolute top-1.5 -left-[25px] size-2 rounded-full ring-4" />
            <p className="text-muted-foreground text-xs">{experience.period}</p>
            <h3 className="mt-1 text-xl font-semibold">{experience.company}</h3>
            <p className="text-accent-foreground mt-1 text-xs font-medium">{experience.role}</p>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm leading-relaxed">
              {experience.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="border-border mt-8 border-t pt-6">
        <h2 className="mb-7 text-3xl leading-tight font-semibold tracking-tight">Formation</h2>
        <div className="space-y-4">
          {education.map((item) => (
            <div key={item.school}>
              <p className="text-muted-foreground text-xs">{item.period}</p>
              <p className="mt-1 text-sm font-medium">{item.school}</p>
              <p className="text-muted-foreground text-sm">{item.degree}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SkillsContent() {
  return (
    <>
      <Heading
        label="Outils & savoir-faire"
        title="Compétences"
        description="Développement Full Stack, IA, automatisation et conception produit : les outils que je mobilise pour concevoir, faire évoluer et livrer des produits numériques."
      />
      <div className="space-y-6">
        {skillGroups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-3 text-sm font-semibold">{group.title}</h3>
            <Tags items={group.skills} />
          </section>
        ))}
      </div>
    </>
  );
}

function ProjectBody({ project, onOpen }: { project: Project; onOpen: (id: string) => void }) {
  const paragraphs = Array.isArray(project.description) ? project.description : [project.description];
  return (
    <article className="p-5 sm:p-7">
      <section className="mb-8" aria-label={`Aperçus de ${project.title}`}>
        <div className={`grid gap-4 ${project.screenshots.length > 1 ? 'grid-cols-2' : ''}`}>
          {project.screenshots.map(({ image, caption }) => (
            <figure key={caption} className="min-w-0">
              <div className="border-border bg-card overflow-hidden rounded-xl border p-3">
                <Image src={image} alt={caption} sizes="(max-width: 767px) 80vw, 600px" className="mx-auto max-h-[400px] w-auto max-w-full rounded-md object-contain" />
              </div>
              <figcaption className="text-muted-foreground mt-2 text-center text-[11px]">{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Heading label={project.period ? `${project.category} · ${project.period}` : project.category} title={project.title} description={project.summary} />
      {!project.role && <Tags items={project.tags} />}
      <div className="text-muted-foreground mt-6 space-y-4 text-sm leading-7">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/85 mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          Voir le projet <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      )}
      {project.role && (
        <section className="border-border mt-8 border-t pt-6">
          <h3 className="mb-3 text-sm font-semibold">Mon rôle</h3>
          <p className="text-muted-foreground text-sm leading-7">{project.role}</p>
        </section>
      )}
      <section className="border-border mt-8 border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold">{project.role ? 'Réalisations' : 'Ce que j’ai développé'}</h3>
        <ul className="space-y-3">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="text-muted-foreground flex gap-3 text-sm leading-relaxed">
              <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>
      {project.role && (
        <section className="border-border mt-8 border-t pt-6">
          <h3 className="mb-4 text-sm font-semibold">Stack</h3>
          <Tags items={project.tags} />
        </section>
      )}
      {project.conclusion && <p className="text-muted-foreground mt-7 text-sm leading-7">{project.conclusion}</p>}
      {project.id === 'atelier' && (
        <button onClick={() => onOpen('contact')} className="bg-primary text-primary-foreground mt-7 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm">
          Échanger sur un projet <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      )}
    </article>
  );
}

export function WindowContent({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
  if (id === 'cv') return <ResumeDocument />;

  const project = projects.find((item) => item.id === id);
  if (project) return <ProjectBody project={project} onOpen={onOpen} />;

  if (id === 'about')
    return (
      <article className="p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-4">
          <Image src={profile.portrait} alt={profile.name} width={80} height={80} className="size-20 rounded-2xl object-cover" />
          <div>
            <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase">Enchanté, moi c’est</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">{profile.name}</h2>
            <p className="text-muted-foreground mt-1 text-xs">{profile.role}</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed font-medium">{profile.intro}</p>
        <div className="text-muted-foreground mt-5 space-y-4 text-sm leading-7">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <section className="border-border mt-8 border-t pt-7">
          <JourneyContent onOpen={onOpen} />
        </section>
        <section className="border-border mt-8 border-t pt-7">
          <SkillsContent />
        </section>
        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={() => onOpen('projects')} className="border-border hover:bg-accent rounded-lg border px-4 py-2.5 text-sm">
            Mes projets
          </button>
          <ResumePdfLink />
        </div>
      </article>
    );

  if (id === 'experience')
    return (
      <article className="p-5 sm:p-7">
        <JourneyContent onOpen={onOpen} />
        <div className="mt-7">
          <ResumePdfLink />
        </div>
      </article>
    );

  if (id === 'skills')
    return (
      <article className="p-5 sm:p-7">
        <SkillsContent />
      </article>
    );

  if (id === 'beyond')
    return (
      <article className="p-5 sm:p-7">
        <Heading
          label="Au-delà du code"
          title="Créer, construire, explorer."
          description="Un projet musical indépendant, des rencontres et des aventures qui nourrissent aussi ma façon de travailler."
        />
        <div className="space-y-5">
          {beyondCode.map((item) => (
            <section key={item.title} className="border-border bg-card rounded-xl border p-5">
              <p className="text-muted-foreground text-[11px]">{item.period}</p>
              <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
              <p className="mt-1 text-xs font-medium text-amber-300">{item.subtitle}</p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.description}</p>
            </section>
          ))}
        </div>
      </article>
    );

  if (id === 'contact') return <ContactPanel />;

  if (id === 'projects')
    return (
      <article className="p-5 sm:p-7">
        <Heading
          label="Sélection de réalisations"
          title="Mes projets"
          description="Un studio web, un projet musical et des applications. Chaque projet raconte une façon de concevoir, créer et livrer."
        />
        <section className="mb-8">
          <h3 className="mb-4 text-sm font-semibold">Entreprendre & créer</h3>
          <EntrepreneurialProjects onOpen={onOpen} />
        </section>
        <h3 className="mb-4 text-sm font-semibold">Applications & expériences</h3>
        <div className="space-y-3">
          {projects
            .filter((item) => !entrepreneurialProjects.some((entry) => entry.id === item.id))
            .map((item) => (
              <button key={item.id} onClick={() => onOpen(item.id)} className="border-border bg-card hover:bg-accent flex w-full items-center gap-4 rounded-xl border p-3 text-left transition-colors">
                <Image src={item.image} alt="" width={64} height={64} className="size-16 shrink-0 rounded-lg object-cover object-top" />
                <span className="min-w-0">
                  <span className="text-muted-foreground block text-xs">{item.category}</span>
                  <span className="mt-1 block text-base font-semibold">{item.title}</span>
                  <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">{item.summary}</span>
                </span>
                <ArrowRight className="ml-auto size-4 shrink-0" />
              </button>
            ))}
          <button onClick={() => onOpen('lab')} className="border-border hover:bg-accent flex w-full items-center justify-between rounded-xl border border-dashed p-4 text-left text-sm">
            Explorer le laboratoire <ArrowRight className="size-4" />
          </button>
        </div>
      </article>
    );

  if (id === 'lab')
    return (
      <article className="p-5 sm:p-7">
        <Heading label="Petites expériences" title="Le laboratoire" description="Des formats courts pour explorer une interaction, une API ou une mécanique de jeu." />
        <div className="space-y-4">
          {experiments.map((item, index) => (
            <section key={item.title} className="border-border bg-card rounded-xl border p-4">
              <p className="text-muted-foreground text-[10px] font-medium tracking-widest">EXPÉRIENCE {String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 mb-3 text-sm leading-relaxed">{item.description}</p>
              <Tags items={item.tags} />
            </section>
          ))}
        </div>
      </article>
    );

  if (id === 'notes')
    return (
      <article className="p-5 sm:p-7">
        <Heading label="Bienvenue sur mon bureau" title="Mode d’emploi" />
        <ul className="text-muted-foreground space-y-4 text-sm leading-relaxed">
          <li>
            <strong className="text-foreground">Ouvrir un fichier.</strong> Cliquez une fois sur ordinateur, ou touchez une fois sur mobile. Au clavier, utilisez Tab puis Entrée.
          </li>
          <li>
            <strong className="text-foreground">Organiser le bureau.</strong> Faites glisser les fichiers et dossiers avec la souris ou au doigt sur mobile. Leurs positions sont mémorisées sur cet
            appareil, séparément pour les dispositions mobile et ordinateur.
          </li>
          <li>
            <strong className="text-foreground">Déplacer une fenêtre.</strong> Utilisez sa barre de titre ; le coin inférieur droit permet de la redimensionner.
          </li>
          <li>
            <strong className="text-foreground">Gérer les fenêtres.</strong> Les pastilles ferment, réduisent et agrandissent. Recliquez sur une icône du dock pour fermer sa fenêtre ; si elle est
            réduite, le clic la restaure. Sur le bureau, un nouveau double-clic ferme la fenêtre correspondante.
          </li>
        </ul>
      </article>
    );

  return null;
}
