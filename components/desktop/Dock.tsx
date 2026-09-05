import { windowItems } from '@/data/portfolio';
import { DockIcon } from './DockIcon';

const shortcuts = ['about', 'projects', 'contact', 'notes'];

export function Dock({ onToggle, openIds }: { onToggle: (id: string) => void; openIds: string[] }) {
  const visibleIds = [...shortcuts, ...openIds.filter((id) => !shortcuts.includes(id))];
  return (
    <nav aria-label="Applications du bureau" className="desktop-dock">
      <div className="desktop-dock-apps">
        {visibleIds.map((id, index) => {
          const item = windowItems.find((entry) => entry.id === id);
          if (!item) return null;
          return (
            <button
              key={id}
              type="button"
              title={item.title}
              aria-label={item.title}
              aria-pressed={openIds.includes(id)}
              data-pinned={shortcuts.includes(id)}
              onClick={() => onToggle(id)}
              className={`dock-app ${index === shortcuts.length ? 'dock-app--separated' : ''}`}
            >
              <DockIcon item={item} />
              {openIds.includes(id) && <span className="dock-app-indicator" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
