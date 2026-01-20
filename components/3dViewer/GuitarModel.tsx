'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Group } from 'three';
import { ThreeElements } from '@react-three/fiber';

export function GuitarModel(props: ThreeElements['group']) {
  // Using a high-quality placeholder model (Les Paul style) since we cannot generate a binary .glb file directly.
  // You can replace this URL with your own Fender Telecaster .glb file.
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

          // Attempt to smooth the geometry if it looks low poly
          if (mesh.geometry) {
            mesh.geometry.computeVertexNormals();
          }

          // Ensure materials are not flat shaded
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat: THREE.Material) => {
              if ('flatShading' in mat) (mat as THREE.MeshStandardMaterial).flatShading = false;
              // Optional: Adjust material properties for better look
              if ('roughness' in mat) (mat as THREE.MeshStandardMaterial).roughness = 0.9;
              if ('metalness' in mat) (mat as THREE.MeshStandardMaterial).metalness = 0.4;
            });
          }
        }
      });
    }
  }, [scene]);

  return (
    <group ref={group} {...props} dispose={null} scale={[4, 4, 4]}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model for smoother experience
useGLTF.preload('/assets/iphone3d/iphone.gltf');
