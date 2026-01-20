'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GuitarModel } from './GuitarModel';

export default function GuitarView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <div className="animate-pulse text-neutral-500">Initializing 3D...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[500px] w-full overflow-hidden" style={{ height: '100%', minHeight: '500px' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}>
        {/* Lighting setup without external HDRI */}
        <ambientLight intensity={0.8} />
        <hemisphereLight intensity={1} groundColor="#444444" skyColor="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        <pointLight position={[0, 5, 0]} intensity={1} />
        <pointLight position={[0, 0, 5]} intensity={1} />

        <Suspense fallback={null}>
          <GuitarModel />
        </Suspense>

        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  );
}
