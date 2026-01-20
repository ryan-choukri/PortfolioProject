'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Group } from 'three';

export function GuitarModel(props: any) {
  // Using the generated simple computer model
  const { scene } = useGLTF('/assets/iphone3d/iphone.gltf');
  const group = useRef<Group>(null);

  useEffect(() => {
    if (scene) {
      // Traverse the model to apply specific materials if needed
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.frustumCulled = false;

          // Attempt to smooth the geometry if it looks low poly
          if (mesh.geometry) {
            mesh.geometry.computeVertexNormals();
          }

          // Ensure materials are not flat shaded
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat: any) => {
              if (mat.flatShading !== undefined) mat.flatShading = false;
              // Do not override roughness/metalness here, let the GLTF define it
            });
          }
        }
      });
    }
  }, [scene]);

  return (
    <group ref={group} {...props} dispose={null} scale={[0.2, 0.2, 0.2]}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model for smoother experience
useGLTF.preload('/assets/iphone3d/iphone.gltf');
