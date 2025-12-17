/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import Image from 'next/image';

import './dome.css';

type City = {
  name: string, lat: number, lon: number, src: string;
};

type CityAndWheather = {
  time: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
} & City;

type DomeGalleryProps = {
  allCities: CityAndWheather[]; 
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
};

type ItemDef = {
  src: string;
  name: string;
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
};

type OverlayState = {
  src: string;
  name: string;
  from: DOMRect;
};


// Exemple de map pour les icônes météo
const weatherCodeMap: Record<number, string> = {
  0: '☀️', // clair
  1: '🌤️', // partiellement nuageux
  2: '⛅', // nuageux
  3: '☁️', // couvert
  45: '🌫️', // brouillard
  51: '🌦️', // pluie légère
  61: '🌧️', // pluie
  71: '❄️', // neige
  80: '⛈️', // orage
  95: '🌩️' // forte tempête
};

const DEFAULTS = {
  maxVerticalRotationDeg: 23,
  dragSensitivity: 10,
  enlargeTransitionMs: 300,
  segments: 20
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

/* Crée les "tiles" de la sphère et les positionne selon un pattern x/y. 
  Les images sont normalisées et réorganisées pour éviter doublons consécutifs. */
function buildItems(pool: CityAndWheather[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -23 + i * 2);
  console.log('xCols. : ', xCols);
  
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', name: '' }));
  }
  if (pool.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    );
  }

  console.log('pool', pool);
  
  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, name: '' };
    }
    return { src: image.src || '', name: image.name || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    name: usedImages[i].name
  }));
}

/* Calcul la rotation de base de chaque tile selon sa position sur la sphère */
function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  allCities = [{ time: 0, temperature: 0, windspeed: 0, winddirection: 0, weathercode: 0, name: "Tokyo", lat: 35.6895, lon: 139.6917, src: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80"}],
  fit = 0.6,
  fitBasis = 'auto',
  minRadius = 50,
  maxRadius = Infinity,
  padFactor = 0.12,
  overlayBlurColor = '#060010',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '70vw',
  openedImageHeight = '60vh',
  imageBorderRadius = '20px',
  openedImageBorderRadius = '30px',
  grayscale = false
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const focusedElRef = useRef<HTMLElement | null>(null);
  const originalTilePositionRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  console.log('----------allCities----------');
  console.log(allCities);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef<number | null>(null);

  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add('dg-scroll-lock');
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.classList.remove('dg-scroll-lock');
  }, []);

  const items = useMemo(() => buildItems(allCities, segments), [allCities, segments]);

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  const lockedRadiusRef = useRef<number | null>(null);

  // Observer la taille du container et ajuster rayon / padding
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis: number;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      console.log(viewerPad);
      
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement;
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();

        const hasCustomSize = openedImageWidth && openedImageHeight;
        if (hasCustomSize) {
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`;
          document.body.appendChild(tempDiv);
          const tempRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);

          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;

          enlargedOverlay.style.left = `${centeredLeft}px`;
          enlargedOverlay.style.top = `${centeredTop}px`;
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width = openedImageWidth;
          enlargedOverlay.style.height = openedImageHeight;
        }
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight
  ]);

  // Initialisation de la transformation
  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;

      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);

      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  // Gestion du drag avec use-gesture
  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        const evt = event as PointerEvent;
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;

        const evt = event as PointerEvent;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;

        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 16) movedRef.current = true;
        }

        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);

        if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }

        if (last) {
          draggingRef.current = false;

          const [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;

          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }

          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) {
            startInertia(vx, vy);
          }

          if (movedRef.current) lastDragEndAt.current = performance.now();

          movedRef.current = false;
        }
      }
    },
    { target: mainRef, eventOptions: { passive: true } }
  );


function Overlay({
    overlay,
    frameRef,
    mainRef,
    onDone
    }: {
    overlay: OverlayState;
    frameRef: React.RefObject<HTMLDivElement>;
    mainRef: React.RefObject<HTMLDivElement>;
    onDone: () => void;
    }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !frameRef.current || !mainRef.current) return;

        const from = overlay.from;
        const to = frameRef.current.getBoundingClientRect();
        const main = mainRef.current.getBoundingClientRect();
        openStartedAtRef.current = performance.now();
        focusedElRef.current = ref.current;

        const dx = from.left - to.left;
        const dy = from.top - to.top;
        const sx = from.width / to.width;
        const sy = from.height / to.height;

        ref.current.style.transform = `
        translate(${dx}px, ${dy}px) scale(${sx}, ${sy})
        `;

        requestAnimationFrame(() => {
        ref.current!.style.opacity = '1';
        ref.current!.style.transform = 'translate(0,0) scale(1)';
        onDone();
        });
    }, [overlay, frameRef, mainRef, onDone]);
    console.log('frameRef');
    console.log(frameRef.current!.getBoundingClientRect());
    const cityData = allCities.find(c => c.name === overlay.name);
    if (!cityData) return null;
    console.log(cityData);
    const weatherIcon = weatherCodeMap[cityData.weathercode] || '🌤️';
    const displayDate = new Date(cityData.time);
    const formattedHour = displayDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <div
        ref={ref}
        className="enlarge"
        style={{
            position: 'absolute',
            left: frameRef.current!.getBoundingClientRect().left -
            mainRef.current!.getBoundingClientRect().left,
            top: frameRef.current!.getBoundingClientRect().top -
            mainRef.current!.getBoundingClientRect().top,
            width: frameRef.current!.getBoundingClientRect().width,
            height: frameRef.current!.getBoundingClientRect().height,
            opacity: 0,
            transition: 'transform 300ms ease, opacity 300ms ease',
            transformOrigin: 'top left',
            zIndex: 30
        }}
        >
        {cityData && 
            (
                <div
                style={{
                    display: 'flex',
                    gridTemplateColumns: '1fr 1fr auto',

                    background: 'rgb(37 37 37 / 60%)',
                    backdropFilter: 'blur(7px)',
                    top: '0px',
                    margin: '34px',
                    minWidth: '88%',
                    position: 'absolute',
                    padding: '12px 16px',
                    color: 'white',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                    zIndex: 40,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    fontFamily: 'sans-serif',
                    transition: 'transform 0.2s ease, opacity 0.2s ease'
                }}
                >



                <div style={{ display: 'flex', flexDirection: 'column', flex: 3, gap: '4px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{cityData.name}</div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>🕒 {formattedHour}</div>
                </div>

                {/* Colonne milieu : température, vent */}
                <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column-reverse', flex: 4, gap: '4px' }}>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    <div style={{ fontSize: '14px' }}>{cityData.temperature}°C</div>
                    💨 {cityData.windspeed} km/h {cityData.winddirection}°
                    </div>
                </div>

                {/* Colonne droite : icône météo */}
                <div style={{ fontSize: '42px', flex: 4, textAlign: 'center' }}>{weatherIcon}</div>


                    {/* <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {cityData.name}
                    </div>
                    <div style={{ color: '#cbcbcb', fontSize: '13px', marginBottom: '4px' }}>
                        {formattedHour}
                    </div>


                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                        <span>🌡️</span> {cityData.temperature}°C
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                        <span>💨</span> {cityData.windspeed} m/s
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                        <span>🧭</span> {cityData.winddirection}°
                    </div> */}

                </div>
            )
        }
        {overlay.src ? (
            <Image
                src={overlay.src}
                alt={overlay.name}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                draggable={false}
            />
            ) : null}
        {/* <img
            src={overlay.src}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            draggable={false}
        /> */}
        </div>
    );
    }



        // NOUVEAU CODE 
    const openItemFromElement = useCallback((el: HTMLElement) => {
    if (openingRef.current) return;

    openingRef.current = true;
    lockScroll();

    const parent = el.parentElement as HTMLElement;
    const src =
        parent.dataset.src ||
        (el.querySelector('img') as HTMLImageElement)?.src;

    const name =
        parent.dataset.name ||
        (el.querySelector('img') as HTMLImageElement)?.name;

    if (!src || !frameRef.current || !mainRef.current) return;
    console.log('parent.dataset');
    console.log(parent.dataset);

    const tileRect = el.getBoundingClientRect();

    setOverlay({
        name,
        src,
        from: tileRect
    });

    el.style.visibility = 'hidden';
    }, [lockScroll]);
        // NOUVEAU CODE 


  const onTileClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  const onTilePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'touch') return;
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  // Gestion de la fermeture de la frame
  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;

    const close = () => {
        console.log('PASSAGE DANS CLOSE');
                console.log(performance.now(), openStartedAtRef.current, openStartedAtRef.current < 250);

      if (performance.now() - openStartedAtRef.current < 250) return;


      const el = focusedElRef.current;
    console.log('2 PASSAGE DANS CLOSE');

      if (!el) return;
            console.log('2 PASSAGE DANS CLOSE');

      const parent = el.parentElement as HTMLElement;
      const overlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null;
      if (!overlay) return;
            console.log('3 PASSAGE DANS CLOSE');

      const refDiv = parent.querySelector('.item__image--reference') as HTMLElement | null;

      const originalPos = originalTilePositionRef.current;
                  console.log('4 PASSAGE DANS CLOSE');

      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', `0deg`);
        parent.style.setProperty('--rot-x-delta', `0deg`);
        el.style.visibility = '';
        (el.style as any).zIndex = 0;
        focusedElRef.current = null;
        rootRef.current?.removeAttribute('data-enlarging');
        openingRef.current = false;
        unlockScroll();
        return;
      }

      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current!.getBoundingClientRect();

      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height
      };

      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height
      };

      const animatingOverlay = document.createElement('div');
      animatingOverlay.className = 'enlarge-closing';
      animatingOverlay.style.cssText = `
        position: absolute;
        left: ${overlayRelativeToRoot.left}px;
        top: ${overlayRelativeToRoot.top}px;
        width: ${overlayRelativeToRoot.width}px;
        height: ${overlayRelativeToRoot.height}px;
        z-index: 9999;
        border-radius: var(--enlarge-radius, 32px);
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        transition: all ${enlargeTransitionMs}ms ease-out;
        pointer-events: none;
        margin: 0;
        transform: none;
      `;

      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const img = originalImg.cloneNode() as HTMLImageElement;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        animatingOverlay.appendChild(img);
      }

      overlay.remove();
      rootRef.current!.appendChild(animatingOverlay);

      void animatingOverlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
        animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
        animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
        animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
        animatingOverlay.style.opacity = '0';
      });

      const cleanup = () => {
        animatingOverlay.remove();
        originalTilePositionRef.current = null;

        if (refDiv) refDiv.remove();
        parent.style.transition = 'none';
        el.style.transition = 'none';

        parent.style.setProperty('--rot-y-delta', `0deg`);
        parent.style.setProperty('--rot-x-delta', `0deg`);

        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          (el.style as any).zIndex = 0;
          focusedElRef.current = null;
          rootRef.current?.removeAttribute('data-enlarging');

          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 300ms ease-out';

            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                openingRef.current = false;
                if (!draggingRef.current && rootRef.current?.getAttribute('data-enlarging') !== 'true') {
                  document.body.classList.remove('dg-scroll-lock');
                }
              }, 300);
            });
          });
        });
      };

      animatingOverlay.addEventListener('transitionend', cleanup, {
        once: true
      });
    };

    scrim.addEventListener('click', close);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      scrim.removeEventListener('click', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [enlargeTransitionMs, unlockScroll]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('dg-scroll-lock');
    };
  }, []);

  /* Animation continue de la sphère : rotation automatique constante */
  useEffect(() => {
    let raf: number;
    const animate = () => {
        rotationRef.current.y = wrapAngleSigned(rotationRef.current.y - 0.3); // vitesse en degrés par frame
        applyTransform(rotationRef.current.x, rotationRef.current.y);
        raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    }, []);


console.log(frameRef);
//openedImageHeight

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={
        {
          ['--segments-x' as any]: segments,
          ['--segments-y' as any]: segments - 4,
          ['--overlay-blur-color' as any]: overlayBlurColor,
          ['--tile-radius' as any]: imageBorderRadius,
          ['--enlarge-radius' as any]: openedImageBorderRadius,
          ['--image-filter' as any]: grayscale ? 'grayscale(1)' : 'none'
        } as React.CSSProperties
      }
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                data-name={it.name}
                style={
                  {
                    ['--offset-x' as any]: it.x,
                    ['--offset-y' as any]: it.y,
                    ['--item-size-x' as any]: it.sizeX,
                    ['--item-size-y' as any]: it.sizeY
                  } as React.CSSProperties
                }
              >
                <div className="item__image" role="button" tabIndex={0} aria-label={it.name || 'Open image'} onClick={onTileClick} onPointerUp={onTilePointerUp}>
                    {it.src ? (
                    <Image
                        src={it.src}
                        alt={it.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover', pointerEvents: 'none' }}
                    />
                    ) : null}

                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
          {overlay && frameRef && mainRef && (
            <Overlay
                overlay={overlay}
                frameRef={frameRef}
                mainRef={mainRef}
                onDone={() => rootRef.current?.setAttribute('data-enlarging', 'true')}
            />
            )}

        </div>
      </main>
    </div>
  );
}
