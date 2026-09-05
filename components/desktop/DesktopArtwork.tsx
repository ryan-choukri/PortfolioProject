import Image from 'next/image';
import type { DesktopItem } from '@/data/portfolio';
import { getItemIcon } from './DockIcon';

export function DesktopArtwork({ item }: { item: DesktopItem }) {
  const { Glyph } = getItemIcon(item);
  const shape = item.symbol === 'folder' ? 'desktop-folder' : 'desktop-file';
  const artwork = (
    <span className={`desktop-artwork ${shape} desktop-tone--${item.tone}`}>
      <span className="desktop-artwork-stitch" />
      <Glyph className="desktop-artwork-glyph" strokeWidth={2.8} />
    </span>
  );

  return (
    <span className="desktop-artwork-stage" aria-hidden="true">
      {item.symbol === 'folder' && item.image ? (
        <span className="desktop-folder-stack">
          <span className="desktop-folder-photo">
            <Image src={item.image} alt="" width={160} height={120} sizes="52px" draggable={false} className="desktop-folder-image" />
          </span>
          {artwork}
        </span>
      ) : (
        artwork
      )}
    </span>
  );
}
