'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, Upload } from 'lucide-react';
import { useARStore } from '@/hooks/use-ar-store';

export default function StaticPreview() {
  const { selectedArtwork, transform, setScale, setRotation, setPosition, reset } = useARStore();
  const [wallImage, setWallImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setWallImage(url);
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const next = Math.min(2, Math.max(0.5, transform.scale + (e.deltaY < 0 ? 0.05 : -0.05)));
    setScale(next);
  };

  if (!selectedArtwork) {
    return <div className="p-6 text-center text-gray-600">Select an artwork to start preview.</div>;
  }

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-gray-100" onWheel={onWheel}>
        {wallImage ? (
          <img src={wallImage} alt="wall" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Upload your wall photo
          </div>
        )}

        <motion.img
          src={selectedArtwork.image}
          alt={selectedArtwork.title}
          className="absolute cursor-move"
          style={{
            left: `${(transform.position?.x ?? 50)}%`,
            top: `${(transform.position?.y ?? 50)}%`,
            transform: `rotate(${transform.rotationDeg}deg)`,
            width: `${transform.scale * 30}%`,
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            const container = (e.currentTarget as HTMLElement).closest('.aspect-[4/3]') as HTMLElement | null;
            if (!container) return;
            const target = e.currentTarget as HTMLElement;
            try { target.setPointerCapture(e.pointerId); } catch {}
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + (rect.width * (transform.position?.x ?? 50)) / 100;
            const centerY = rect.top + (rect.height * (transform.position?.y ?? 50)) / 100;
            const grabX = e.clientX - centerX;
            const grabY = e.clientY - centerY;
            const move = (ev: PointerEvent) => {
              const x = ((ev.clientX - grabX - rect.left) / rect.width) * 100;
              const y = ((ev.clientY - grabY - rect.top) / rect.height) * 100;
              setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
            };
            const up = () => {
              try { target.releasePointerCapture(e.pointerId); } catch {}
              window.removeEventListener('pointermove', move);
              window.removeEventListener('pointerup', up);
              window.removeEventListener('pointercancel', up);
            };
            window.addEventListener('pointermove', move, { passive: true });
            window.addEventListener('pointerup', up, { passive: true });
            window.addEventListener('pointercancel', up, { passive: true });
          }}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" /> Upload wall photo
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        <div className="ml-auto flex items-center gap-3 bg-white px-3 py-2 rounded-full border">
          <span className="text-xs text-gray-600">Size</span>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={transform.scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
          <Button variant="secondary" onClick={() => setRotation((transform.rotationDeg % 180 === 0) ? 90 : 0)}>
            {(transform.rotationDeg % 180 === 0) ? 'Portrait' : 'Landscape'}
          </Button>
          <Button size="icon" variant="secondary" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}


