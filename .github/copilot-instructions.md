# AI Coding Guidelines for Outils Project

## Project Overview
**Outils** is a Next.js 16 portfolio + interactive tools application with a fixed sidebar navigation and multiple specialized components. The project showcases a portfolio dashboard alongside utility applications (keyboard game, 2048, BPM counter, weather app).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Three.js/React Three Fiber, styled-components, MUI, Emotion

## Architecture Patterns

### Multi-Route Page Structure
- **Routing**: Uses Next.js App Router with nested routes in `app/` directory
- **Pattern**: Each tool (e.g., `keyboard/`, `bpmcounter/`, `wheather/`) has its own `page.tsx`
- **Navigation**: Centralized sidebar (`app/components/Sidebar/`) driven by `SIDEBAR_DATA` in [Data.tsx](app/components/Data.tsx)
- **Layout**: Root layout wraps children with Sidebar using composition pattern (see [layout.tsx](app/layout.tsx#L32))

### Component Organization
- **Smart Components**: Hooks-heavy (useRef, useCallback, useEffect, useMemo, useGesture)
- **Styling Methods**: Mix of Tailwind CSS, styled-components, inline styles, and CSS modules
  - Example: [DomeGallery](app/components/DomeGallery/index.tsx) uses all three approaches
  - CSS Variables for dynamic theming (e.g., `--radius`, `--segments-x`, `--overlay-blur-color`)
  - Prefer inline styles for calculated/dynamic values, CSS modules for complex animations
- **External Refs Pattern**: Heavy use of useRef for DOM manipulation and state persistence
  - `frameRef`, `sphereRef`, `rotationRef`, `focusedElRef` in DomeGallery track animation and interaction state

### Data Flow in Complex Components
**DomeGallery Example** (weather photo sphere):
1. **Input**: `allCities: CityAndWheather[]` (cities with weather data)
2. **Layout Calculation**: `buildItems()` creates grid pattern to avoid consecutive duplicates
3. **3D Transform**: CSS 3D transforms applied via `applyTransform()` and `--radius` CSS variable
4. **Gesture Detection**: `@use-gesture/react` handles drag, inertia, velocity
5. **State Management**: Refs track rotation (`rotationRef`), dragging state (`draggingRef`), overlay positioning
6. **Animation**: `requestAnimationFrame` for continuous rotation + transition animations for modal open/close

## Key Developer Workflows

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000 (hot reload)
npm run build        # Production build
npm start            # Run production server
npm run lint         # Run ESLint
```

### Adding New Routes
1. Create folder under `app/` (e.g., `app/newfeature/`)
2. Add `page.tsx` inside
3. Update `SIDEBAR_DATA` in [Data.tsx](app/components/Data.tsx) with new entry
4. Sidebar automatically renders new link (responsive: hides on mobile < 468px)

### Image Optimization
- Next.js `Image` component required for all images (see [DomeGallery](app/components/DomeGallery/index.tsx#L854))
- Unsplash domain pre-configured in [next.config.ts](next.config.ts#L5)
- Use `fill` prop with `sizes` for responsive images; `objectFit: 'cover'` standard pattern

## Project-Specific Conventions

### Interaction State Management
- **Multi-ref Pattern**: Avoid Redux; use multiple useRef hooks for independent state tracking
  - `draggingRef.current`, `movedRef.current` to prevent conflicting handlers
  - `focusedElRef` to lock interactions during animations
- **Guard Clauses**: Always check handler guards early (see [DomeGallery](app/components/DomeGallery/index.tsx#L793))
  ```tsx
  if (draggingRef.current) return;
  if (movedRef.current) return;
  if (openingRef.current) return;
  ```

### Animation Patterns
- **3D Transforms**: Use CSS transforms with CSS variables for dynamic calculations
- **Scroll Lock**: Add/remove `dg-scroll-lock` class on `document.body` to prevent background scroll during overlays
- **Transition Cleanup**: Always clean up requestAnimationFrame and event listeners in useEffect return
  ```tsx
  useEffect(() => {
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);
  ```

### Type Safety
- **Strict TypeScript**: enabled in [tsconfig.json](tsconfig.json); avoid `any` type
- **Custom Types at Top**: Define component-specific types before the component (see [DomeGallery](app/components/DomeGallery/index.tsx#L9-L44))
- **RefObject Typing**: `useRef<HTMLDivElement>(null)` is standard; extract with `.current`

### Responsive Design
- **Mobile Breakpoint**: Sidebar logic checks `window.innerWidth < 468` (see [Sidebar](app/components/Sidebar/index.tsx#L21))
- **Tailwind Breakpoints**: Use `md:` prefix for 768px breakpoint in grid/layout classes
- **Dynamic Visibility**: Toggle sidebar on mobile; always use ResizeObserver for adaptive sizing

### CSS Custom Properties Pattern
Preferred for dynamic calculations that span multiple render cycles:
```tsx
root.style.setProperty('--radius', `${radius}px`);
root.style.setProperty('--viewer-pad', `${viewerPad}px`);
```

## External Dependencies & Integration Points

| Dependency | Purpose | Example |
|-----------|---------|---------|
| `@use-gesture/react` | Drag/gesture detection | Sphere rotation in DomeGallery |
| `@react-three/fiber`, `three` | 3D rendering | Potential for future 3D components |
| `next/image` | Image optimization | All Image components use Next.js Image |
| `styled-components` | CSS-in-JS styling | Sidebar animations (SidebarStyles.tsx) |
| Tailwind CSS | Utility-first CSS | Layout, spacing, colors throughout |

## Common Pitfalls to Avoid

1. **Don't use inline `img` tags** — use Next.js `Image` component for optimization
2. **Don't forget guard clauses** — interaction handlers need state checks to prevent race conditions
3. **Don't mix responsive detection** — use ResizeObserver, not just CSS media queries, for JS-driven logic
4. **Don't leave dangling animations** — always cancel RAF/clear timeouts in useEffect cleanup
5. **Don't hardcode colors** — use CSS variables defined on root element for theme consistency

## File Structure Reference
- **Pages**: `app/{2048,bpmcounter,keyboard,wheather}/page.tsx`
- **Shared Components**: `app/components/{Sidebar,DomeGallery,KeyBoardGame}/`
- **Styling**: `app/components/{*/}*.css` + inline Tailwind classes + styled-components
- **Config**: `tsconfig.json`, `next.config.ts`, `tailwind.config.js`, `components.json`
- **Utilities**: `lib/utils.ts` (empty; add shared functions here)

---

**Last Updated:** December 2025 | **Version:** 1.0
