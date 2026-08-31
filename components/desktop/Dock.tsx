import { Instagram, Mail, StickyNote, User } from 'lucide-react';

type DockItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
};

const items: DockItem[] = [
  { id: 'about', label: 'À propos', icon: <User className="size-6" /> },
  { id: 'notes', label: 'Notes', icon: <StickyNote className="size-6" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="size-6" /> },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: <Instagram className="size-6" />,
    href: 'https://instagram.com',
  },
];

export function Dock({ onOpen, openIds }: { onOpen: (id: string) => void; openIds: string[] }) {
  return (
    <div className="fixed bottom-3 left-1/2 z-[9998] flex -translate-x-1/2 items-end gap-2 rounded-2xl border border-white/20 bg-white/15 p-2 shadow-[var(--shadow-icon)] backdrop-blur-xl">
      {items.map((item) =>
        item.href ? (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={item.label}
            className="text-window-foreground grid size-12 place-items-center rounded-xl bg-white/70 transition-transform duration-150 hover:-translate-y-1.5">
            {item.icon}
          </a>
        ) : (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            onClick={() => onOpen(item.id)}
            className="text-window-foreground relative grid size-12 place-items-center rounded-xl bg-white/70 transition-transform duration-150 hover:-translate-y-1.5">
            {item.icon}
            {openIds.includes(item.id) && <span className="absolute -bottom-1.5 size-1 rounded-full bg-white" />}
          </button>
        )
      )}
    </div>
  );
}
