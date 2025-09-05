'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { XR, useHitTest } from '@react-three/xr';
import { Plane, useTexture } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useARStore } from '@/hooks/use-ar-store';

function ArtworkPlane() {
  const { selectedArtwork, transform, setPosition } = useARStore();
  const texture = useTexture(selectedArtwork?.image ?? '');
  const groupRef = useRef<any>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = (transform.rotationDeg * Math.PI) / 180;
    groupRef.current.scale.set(transform.scale, transform.scale, 1);
  });

  return (
    <group ref={groupRef} position={[transform.position.x, transform.position.y, transform.position.z ?? 0]}>
      <Plane args={[1, 1.25]}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </Plane>
    </group>
  );
}

function PlacementHelper() {
  const { setPosition } = useARStore();
  useHitTest((hitMatrix) => {
    const position = [0, 0, 0] as any;
    hitMatrix.decompose({ x: position[0], y: position[1], z: position[2] } as any, { x: 0, y: 0, z: 0, w: 1 } as any, { x: 1, y: 1, z: 1 } as any);
    setPosition({ x: position[0], y: position[1], z: position[2] });
  });
  return null;
}

export default function ARPreview() {
  const { selectedArtwork, setScale, setRotation, reset } = useARStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!selectedArtwork) {
    return (
      <div className="p-6 text-center text-gray-600">Select an artwork to start AR preview.</div>
    );
  }

  return (
    <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border">
      <Canvas camera={{ fov: 60 }}>
        <XR>
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <ArtworkPlane />
          </Suspense>
          <PlacementHelper />
        </XR>
      </Canvas>

      <button
        aria-label="Exit AR"
        className="absolute top-4 right-4 z-10 bg-black/60 text-white px-3 py-2 rounded-full"
        onClick={reset}
      >
        Exit
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow">
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.05}
          defaultValue={1}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
        <input
          type="range"
          min={-30}
          max={30}
          step={1}
          defaultValue={0}
          onChange={(e) => setRotation(parseFloat(e.target.value))}
        />
        <Button size="icon" variant="secondary" onClick={reset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}


