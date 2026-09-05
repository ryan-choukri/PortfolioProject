'use client';

import { useEffect, useRef, useState } from 'react';

const HERO_WIDTH = 32;
const HERO_HEIGHT = 48;
const MOVE_SPEED = 190;
const GROUND_ACCELERATION = 1_900;
const AIR_ACCELERATION = 1_150;
const GROUND_FRICTION = 2_300;
const GRAVITY = 1_500;
const JUMP_SPEED = 720;
const MAX_FALL_SPEED = 920;
const COYOTE_TIME = 120;
const JUMP_BUFFER = 130;
const PLANE_WIDTH = 80;
const PLANE_HEIGHT = 48;
const PLANE_SURFACE = 4;
const PLANE_CRUISE_SPEED = 145;
const PLANE_MAX_SPEED = 260;
const PLANE_VERTICAL_SPEED = 150;
const PLANE_RESPAWN_DELAY = 2_200;
const PLATFORM_HINT_DELAY = 2_000;
const PLATFORM_HINT_DURATION = 7_000;

type Motion = 'idle' | 'walk' | 'jump' | 'fall' | 'ride';
type Action = 'left' | 'right' | 'up' | 'down' | 'action';
type Direction = 'left' | 'right';
type PlanePhase = 'ready' | 'ridden' | 'autopilot' | 'exploded';

type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  grounded: boolean;
  direction: Direction;
  motion: Motion;
  lastGroundedAt: number;
  jumpRequestedAt: number;
};

type Plane = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  direction: Direction;
  phase: PlanePhase;
  respawnAt: number;
};

const moveToward = (value: number, target: number, amount: number) => {
  if (value < target) return Math.min(value + amount, target);
  return Math.max(value - amount, target);
};

const wrapHorizontally = (x: number, width: number) => {
  if (x <= -width) return window.innerWidth;
  if (x >= window.innerWidth) return -width;
  return x;
};

const isTypingTarget = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));

const getAction = (event: KeyboardEvent): Action | null => {
  const key = event.key.toLowerCase();
  if (event.key === 'ArrowLeft' || key === 'q' || event.code === 'KeyQ' || event.code === 'KeyA') return 'left';
  if (event.key === 'ArrowRight' || key === 'd' || event.code === 'KeyD') return 'right';
  if (event.key === 'ArrowUp' || key === 'z' || event.code === 'KeyZ' || event.code === 'KeyW') return 'up';
  if (event.key === 'ArrowDown' || key === 's' || event.code === 'KeyS') return 'down';
  if (event.code === 'Space') return 'action';
  return null;
};

function SpiderSprite() {
  return (
    <svg className="pixel-spider__sprite" viewBox="0 0 16 24" shapeRendering="crispEdges" aria-hidden="true">
      <g className="pixel-spider__arm pixel-spider__arm--back">
        <path fill="#251b25" d="M2 7h3v2H4v5H3v2H1v-3h1V7Z" />
        <path fill="#e63843" d="M3 8h1v5H3v2H2v-2h1V8Z" />
      </g>

      <g className="pixel-spider__leg pixel-spider__leg--back">
        <path fill="#251b25" d="M8 14h4v4h-1v5H7v-2h1v-7Z" />
        <path fill="#2258a8" d="M9 15h2v3h-1v3H8v-1h1v-5Z" />
        <path fill="#e63843" d="M8 21h3v1H8z" />
      </g>

      <path fill="#251b25" d="M4 7h8v1h1v7h-3v1H6v-1H3V8h1V7Z" />
      <path fill="#e63843" d="M5 8h6v4h-1v2H6v-2H5V8Z" />
      <path fill="#2258a8" d="M4 12h2v2h4v-2h2v3H4v-3Z" />
      <path fill="#691f32" d="M7 9h2v1h1v1H9v2H7v-2H6v-1h1V9Z" />
      <path fill="#f05a57" d="M5 8h2v1H5z" />

      <g className="pixel-spider__leg pixel-spider__leg--front">
        <path fill="#251b25" d="M4 14h4v7h1v2H5v-1H3v-2h1v-6Z" />
        <path fill="#2258a8" d="M5 15h2v6h1v1H5v-1H4v-1h1v-5Z" />
        <path fill="#e63843" d="M4 21h4v1H4z" />
      </g>

      <g className="pixel-spider__arm pixel-spider__arm--front">
        <path fill="#251b25" d="M11 7h3v6h1v3h-2v-2h-1V9h-1V7Z" />
        <path fill="#e63843" d="M12 8h1v5h1v2h-1v-1h-1V8Z" />
      </g>

      <g className="pixel-spider__head">
        <path fill="#251b25" d="M5 0h6v1h1v6h-1v1H5V7H4V1h1V0Z" />
        <path fill="#e63843" d="M6 1h4v1h1v4h-1v1H6V6H5V2h1V1Z" />
        <path fill="#fff8dc" d="M6 2h2v3H7v1H6V2Zm3 0h1v4H9V5H8V3h1V2Z" />
        <path fill="#722033" d="M8 1h1v5H8zM5 4h1v1H5zm5 0h1v1h-1z" />
      </g>
    </svg>
  );
}

function PlaneSprite() {
  return (
    <>
      <span className="pixel-plane__vehicle" aria-hidden="true">
        <span className="pixel-plane__smoke">
          <i />
          <i />
          <i />
        </span>
        <span className="pixel-plane__pilot">
          <svg viewBox="0 0 8 10" shapeRendering="crispEdges">
            <path fill="#251b25" d="M2 0h4v1h1v5H6v1H2V6H1V1h1V0Z" />
            <path fill="#e63843" d="M3 1h2v1h1v3H5v1H3V5H2V2h1V1Z" />
            <path fill="#fff8dc" d="M2 2h2v2H3v1H2V2Zm3 0h1v3H5V4H4V3h1V2Z" />
            <path fill="#2258a8" d="M2 7h4v3H2z" />
          </svg>
        </span>
        <svg className="pixel-plane__sprite" viewBox="0 0 40 24" shapeRendering="crispEdges">
          <path fill="#251b25" d="M2 8h3V6h6l3-2h7l3 2h9l3-5h3v10h1v5h-2v2h-8l-3 2H14l-6-4H3v-2H1v-4h1V8Z" />
          <path fill="#ffd34e" d="M3 9h3V7h5l3-2h6l3 2h11l3-4h1v9h1v3h-2v1h-8l-3 2H15l-6-4H3V9Z" />
          <path fill="#f3a02e" d="M2 10h5v4H2z" />
          <path fill="#3793cf" d="M6 7h4v9H6l-3-2V9l3-2Z" />
          <path fill="#65b9df" d="M7 8h2v7H7z" />
          <path fill="#3183bd" d="M9 14h20l-3 4H15l-6-4Z" />
          <path fill="#65b9df" d="M10 14h13l2 2H14l-4-2Z" />

          <path fill="#251b25" d="M13 6h3v5h-3V6Zm8 0h3v5h-3V6Z" />
          <path fill="#c96b45" d="M14 7h2v3h-2zm8 0h1v3h-1z" />

          <path fill="#251b25" d="M10 12h14l9 6v2H18l-9-5v-2h1v-1Z" />
          <path fill="#ffd34e" d="M11 13h12l8 5H19l-8-4v-1Z" />
          <path fill="#f3a02e" d="M12 14h11l3 2H16l-4-2Z" />
          <path fill="#65b9df" d="M27 17h4v2h-8l4-2Z" />

          <path fill="#251b25" d="M31 9h3v3h-3zM26 9h3v3h-3z" />
          <path fill="#3793cf" d="M32 10h1v1h-1zM27 10h1v1h-1z" />

          <path fill="#3793cf" d="M35 4h2v7h-2z" />
          <path fill="#65b9df" d="M37 3h1v7h-1z" />
          <path fill="#f3a02e" d="M35 12h4v3h-4z" />

          <path fill="#251b25" d="M13 17h2v2h3v4h-5v-4h1v-2Zm9 1h2v2h3v4h-5v-4h1v-2Z" />
          <path fill="#60748b" d="M14 20h3v2h-3zm9 1h3v2h-3z" />
          <path fill="#b9d1df" d="M15 20h1v1h-1zm9 1h1v1h-1z" />
        </svg>
        <span className="pixel-plane__propeller" />
      </span>
      <span className="pixel-plane__explosion" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => (
          <i key={index} />
        ))}
      </span>
    </>
  );
}

export function PixelSpider({ active }: { active: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [platformHintPhase, setPlatformHintPhase] = useState<'waiting' | 'visible' | 'done'>('waiting');

  useEffect(() => {
    if (!active) return;

    const movementKeys = new Set<Action>();
    let revealTimer = 0;
    let hideTimer = 0;
    let hintShown = false;

    const startHintTimer = (event: KeyboardEvent) => {
      if (hintShown || isTypingTarget(event.target)) return;
      const action = getAction(event);
      if (!action) return;
      movementKeys.add(action);
      if (revealTimer) return;
      revealTimer = window.setTimeout(() => {
        hintShown = true;
        revealTimer = 0;
        setPlatformHintPhase('visible');
        hideTimer = window.setTimeout(() => setPlatformHintPhase('done'), PLATFORM_HINT_DURATION);
      }, PLATFORM_HINT_DELAY);
    };

    const pauseHintTimer = (event: KeyboardEvent) => {
      const action = getAction(event);
      if (!action) return;
      movementKeys.delete(action);
      if (movementKeys.size > 0 || !revealTimer) return;
      window.clearTimeout(revealTimer);
      revealTimer = 0;
    };

    const cancelHintTimer = () => {
      movementKeys.clear();
      if (!revealTimer) return;
      window.clearTimeout(revealTimer);
      revealTimer = 0;
    };

    window.addEventListener('keydown', startHintTimer);
    window.addEventListener('keyup', pauseHintTimer);
    window.addEventListener('blur', cancelHintTimer);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideTimer);
      window.removeEventListener('keydown', startHintTimer);
      window.removeEventListener('keyup', pauseHintTimer);
      window.removeEventListener('blur', cancelHintTimer);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const element = heroRef.current;
    const planeElement = planeRef.current;
    if (!element) return;

    const keys = new Set<Action>();
    const now = performance.now();
    const dockRect = document.querySelector<HTMLElement>('.desktop-dock')?.getBoundingClientRect();
    const startingX = dockRect ? dockRect.left + 18 : window.innerWidth / 2 - HERO_WIDTH / 2;
    const startingY = dockRect ? dockRect.top - HERO_HEIGHT - 44 : 64;
    const player: Player = {
      x: Math.max(12, Math.min(startingX, window.innerWidth - HERO_WIDTH - 12)),
      y: Math.max(34, startingY),
      vx: 0,
      vy: 0,
      grounded: false,
      direction: 'right',
      motion: 'fall',
      lastGroundedAt: now,
      jumpRequestedAt: -Infinity,
    };
    const getPlaneSpawn = () => ({
      x: Math.max(12, window.innerWidth - PLANE_WIDTH - 36),
      y: Math.max(72, window.innerHeight - PLANE_HEIGHT - 104),
    });
    const planeSpawn = getPlaneSpawn();
    const plane: Plane = {
      ...planeSpawn,
      vx: 0,
      vy: 0,
      direction: 'left',
      phase: planeElement ? 'ready' : 'exploded',
      respawnAt: Infinity,
    };
    let animationFrame = 0;
    let previousTime = now;

    const updateAppearance = (motion: Motion) => {
      if (player.motion !== motion) {
        player.motion = motion;
        element.dataset.motion = motion;
      }
      element.dataset.direction = player.direction;
      element.style.transform = `translate3d(${Math.round(player.x)}px, ${Math.round(player.y)}px, 0)`;
    };

    const updatePlaneAppearance = () => {
      if (!planeElement) return;
      planeElement.dataset.state = plane.phase;
      planeElement.dataset.direction = plane.direction;
      planeElement.style.transform = `translate3d(${Math.round(plane.x)}px, ${Math.round(plane.y)}px, 0)`;
    };

    const resetPlane = () => {
      const spawn = getPlaneSpawn();
      plane.x = spawn.x;
      plane.y = spawn.y;
      plane.vx = 0;
      plane.vy = 0;
      plane.direction = 'left';
      plane.phase = 'ready';
      plane.respawnAt = Infinity;
      updatePlaneAppearance();
    };

    const leavePlane = () => {
      if (plane.phase !== 'ridden') return;
      const direction = plane.direction === 'right' ? 1 : -1;
      plane.phase = 'autopilot';
      plane.vx = direction * Math.max(Math.abs(plane.vx), PLANE_CRUISE_SPEED * 1.55);
      plane.vy *= 0.3;
      player.x = plane.x + (PLANE_WIDTH - HERO_WIDTH) / 2;
      player.y = plane.y - HERO_HEIGHT + PLANE_SURFACE - 2;
      player.vx = plane.vx * 0.28;
      player.vy = -JUMP_SPEED * 0.64;
      player.grounded = false;
      player.lastGroundedAt = -Infinity;
      player.jumpRequestedAt = -Infinity;
      updatePlaneAppearance();
    };

    const getPlatforms = () => {
      const nodes = document.querySelectorAll<HTMLElement>('.desktop-artwork-stage, .desktop-dock');
      return Array.from(nodes, (node) => node.getBoundingClientRect()).filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 28 && rect.top < window.innerHeight);
    };

    const press = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const action = getAction(event);
      if (!action) return;
      event.preventDefault();
      keys.add(action);
      if (!event.repeat && plane.phase !== 'ridden' && action === 'left') player.vx = Math.min(player.vx, -MOVE_SPEED);
      if (!event.repeat && plane.phase !== 'ridden' && action === 'right') player.vx = Math.max(player.vx, MOVE_SPEED);
      if (!event.repeat && plane.phase !== 'ridden' && (action === 'up' || action === 'action')) player.jumpRequestedAt = performance.now();
      if (!event.repeat && plane.phase === 'ridden' && action === 'action') leavePlane();
    };

    const release = (event: KeyboardEvent) => {
      const action = getAction(event);
      if (!action) return;
      keys.delete(action);
      if (plane.phase !== 'ridden' && (action === 'up' || action === 'action') && player.vy < -260) player.vy *= 0.58;
    };

    const clearKeys = () => keys.clear();

    const frame = (time: number) => {
      const delta = Math.min(Math.max((time - previousTime) / 1_000, 0), 0.034);
      previousTime = time;

      const input = Number(keys.has('right')) - Number(keys.has('left'));

      if (plane.phase === 'exploded' && time >= plane.respawnAt) resetPlane();

      if (plane.phase === 'autopilot') {
        plane.x += plane.vx * delta;
        plane.y += plane.vy * delta;
        plane.vy = moveToward(plane.vy, 0, 36 * delta);
        const reachesEdge = plane.x <= 0 || plane.x + PLANE_WIDTH >= window.innerWidth || plane.y <= 28 || plane.y + PLANE_HEIGHT >= window.innerHeight;

        if (reachesEdge) {
          plane.x = Math.min(Math.max(0, plane.x), window.innerWidth - PLANE_WIDTH);
          plane.y = Math.min(Math.max(28, plane.y), window.innerHeight - PLANE_HEIGHT);
          plane.phase = 'exploded';
          plane.vx = 0;
          plane.vy = 0;
          plane.respawnAt = time + PLANE_RESPAWN_DELAY;
        }
        updatePlaneAppearance();
      }

      if (plane.phase === 'ridden') {
        if (input !== 0) plane.direction = input < 0 ? 'left' : 'right';
        const direction = plane.direction === 'right' ? 1 : -1;
        const targetSpeed = input === 0 ? direction * PLANE_CRUISE_SPEED : input * PLANE_MAX_SPEED;
        const verticalInput = Number(keys.has('down')) - Number(keys.has('up'));
        const targetVerticalSpeed = verticalInput === 0 ? 18 : verticalInput * PLANE_VERTICAL_SPEED;

        plane.vx = moveToward(plane.vx, targetSpeed, 620 * delta);
        plane.vy = moveToward(plane.vy, targetVerticalSpeed, 520 * delta);
        plane.x = wrapHorizontally(plane.x + plane.vx * delta, PLANE_WIDTH);
        plane.y = Math.min(Math.max(48, plane.y + plane.vy * delta), Math.max(48, window.innerHeight - PLANE_HEIGHT - 64));

        player.x = plane.x + (PLANE_WIDTH - HERO_WIDTH) / 2;
        player.y = plane.y - HERO_HEIGHT + PLANE_SURFACE;
        player.vx = plane.vx;
        player.vy = plane.vy;
        player.grounded = true;
        player.direction = plane.direction;
        player.lastGroundedAt = time;

        updatePlaneAppearance();
        updateAppearance('ride');
        animationFrame = requestAnimationFrame(frame);
        return;
      }

      if (input !== 0) {
        player.direction = input < 0 ? 'left' : 'right';
        player.vx = moveToward(player.vx, input * MOVE_SPEED, (player.grounded ? GROUND_ACCELERATION : AIR_ACCELERATION) * delta);
      } else {
        player.vx = moveToward(player.vx, 0, (player.grounded ? GROUND_FRICTION : AIR_ACCELERATION * 0.16) * delta);
      }

      if (player.grounded) player.lastGroundedAt = time;
      const canJump = player.grounded || time - player.lastGroundedAt <= COYOTE_TIME;
      if (time - player.jumpRequestedAt <= JUMP_BUFFER && canJump) {
        player.vy = -JUMP_SPEED;
        player.grounded = false;
        player.lastGroundedAt = -Infinity;
        player.jumpRequestedAt = -Infinity;
      }

      const previousBottom = player.y + HERO_HEIGHT;
      const nextX = wrapHorizontally(player.x + player.vx * delta, HERO_WIDTH);

      player.vy = Math.min(player.vy + GRAVITY * delta, MAX_FALL_SPEED);
      if (!player.grounded && keys.has('down') && player.vy > -120) {
        player.vy = Math.min(player.vy + GRAVITY * 1.15 * delta, MAX_FALL_SPEED);
      }
      let nextY = player.y + player.vy * delta;
      let landingTop = window.innerHeight - 4;

      if (player.vy >= 0) {
        const nextBottom = nextY + HERO_HEIGHT;

        if (plane.phase === 'ready') {
          const planeTop = plane.y + PLANE_SURFACE;
          const overlapsPlane = nextX + HERO_WIDTH - 4 > plane.x && nextX + 4 < plane.x + PLANE_WIDTH;
          const crossesPlane = previousBottom <= planeTop + 5 && nextBottom >= planeTop;
          if (overlapsPlane && crossesPlane) {
            plane.phase = 'ridden';
            plane.vx = 0;
            plane.vy = 0;
            player.x = plane.x + (PLANE_WIDTH - HERO_WIDTH) / 2;
            player.y = planeTop - HERO_HEIGHT;
            player.vx = 0;
            player.vy = 0;
            player.grounded = true;
            player.direction = plane.direction;
            player.lastGroundedAt = time;
            updatePlaneAppearance();
            updateAppearance('ride');
            animationFrame = requestAnimationFrame(frame);
            return;
          }
        }

        for (const platform of getPlatforms()) {
          const overlapsHorizontally = nextX + HERO_WIDTH - 5 > platform.left && nextX + 5 < platform.right;
          const crossesTop = previousBottom <= platform.top + 4 && nextBottom >= platform.top;
          if (overlapsHorizontally && crossesTop) landingTop = Math.min(landingTop, platform.top);
        }

        if (nextBottom >= landingTop) {
          nextY = landingTop - HERO_HEIGHT;
          player.vy = 0;
          player.grounded = true;
          player.lastGroundedAt = time;
        } else {
          player.grounded = false;
        }
      } else {
        player.grounded = false;
      }

      player.x = nextX;
      player.y = Math.max(30, nextY);

      const motion: Motion = !player.grounded ? (player.vy < 0 ? 'jump' : 'fall') : Math.abs(player.vx) > 18 ? 'walk' : 'idle';
      updateAppearance(motion);
      updatePlaneAppearance();
      animationFrame = requestAnimationFrame(frame);
    };

    element.dataset.motion = player.motion;
    updateAppearance(player.motion);
    updatePlaneAppearance();
    window.addEventListener('keydown', press, { passive: false });
    window.addEventListener('keyup', release);
    window.addEventListener('blur', clearKeys);
    animationFrame = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('keydown', press);
      window.removeEventListener('keyup', release);
      window.removeEventListener('blur', clearKeys);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={planeRef} className="pixel-plane" data-direction="left" data-state="ready" role="img" aria-label="Petit avion en pixel art sur lequel Spider-Man peut sauter">
        <span className="pixel-plane__hint pixel-plane__hint--ready" aria-hidden="true">
          Saute dessus
        </span>
        <span className="pixel-plane__hint pixel-plane__hint--ridden" aria-hidden="true">
          Espace : éjection
        </span>
        <PlaneSprite />
      </div>

      <div ref={heroRef} className="pixel-spider" data-direction="right" data-motion="fall" role="img" aria-label="Petit Spider-Man en pixel art contrôlable avec les flèches, ZQSD et la barre espace">
        {platformHintPhase === 'waiting' && (
          <span className="pixel-spider__hint" aria-hidden="true">
            ← → ou Q D · Z / espace
          </span>
        )}
        {platformHintPhase === 'visible' && (
          <span className="pixel-spider__platform-hint" role="status">
            Déplace les fichiers pour que le personnage puisse sauter dessus !
          </span>
        )}
        <span className="pixel-spider__shadow" aria-hidden="true" />
        <span className="pixel-spider__body">
          <SpiderSprite />
        </span>
      </div>
    </>
  );
}
