import { BriefcaseBusiness, Clapperboard, CodeXml, Compass, FileText, FlaskConical, FolderCode, Gamepad2, Mail, Music2, Scissors, UserRound, type LucideIcon } from 'lucide-react';
import type { DesktopItem, FileSymbol } from '@/data/portfolio';

type DockIconKind = 'profile' | 'folder' | 'contact' | 'guide' | 'work' | 'terminal' | 'music' | 'lab' | 'cinema' | 'game' | 'scissors' | 'resume';

const symbolKinds: Record<FileSymbol, DockIconKind> = {
  user: 'profile',
  folder: 'folder',
  mail: 'contact',
  help: 'guide',
  briefcase: 'work',
  code: 'terminal',
  music: 'music',
  flask: 'lab',
  file: 'resume',
};

const projectKinds: Record<string, DockIconKind> = { 'watch-finder': 'cinema', 'tout-va-bien': 'game', barbershop: 'scissors', atelier: 'terminal' };

const glyphs: Record<DockIconKind, LucideIcon> = {
  profile: UserRound,
  folder: FolderCode,
  contact: Mail,
  guide: Compass,
  work: BriefcaseBusiness,
  terminal: CodeXml,
  music: Music2,
  lab: FlaskConical,
  cinema: Clapperboard,
  game: Gamepad2,
  scissors: Scissors,
  resume: FileText,
};

export function getItemIcon(item: DesktopItem) {
  const kind = projectKinds[item.id] ?? symbolKinds[item.symbol];
  return { kind, Glyph: glyphs[kind] };
}

export function DockIcon({ item }: { item: DesktopItem }) {
  const { kind, Glyph } = getItemIcon(item);

  return (
    <span className={`dock-icon dock-icon--${kind}`} aria-hidden="true">
      <span className="dock-icon-glyph">
        <Glyph strokeWidth={2.8} />
      </span>
    </span>
  );
}
