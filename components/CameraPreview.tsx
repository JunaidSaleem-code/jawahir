'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useARStore } from '@/hooks/use-ar-store';

export default function CameraPreview() {
  const { selectedArtwork, transform, setRotation, setPosition, setScale } = useARStore() as any;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartCenterRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const grabOffsetRef = useRef<{ x: number; y: number } | null>(null);

  const setCenteredPositionFromPoint = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    setPosition({ x: clampedX, y: clampedY });
  }, [setPosition]);
  const [streamError, setStreamError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setStreamError(null);
    try {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      if (videoRef.current && stream) {
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream as any;
        await new Promise<void>((resolve) => {
          const v = videoRef.current!;
          const onLoaded = () => {
            v.removeEventListener('loadedmetadata', onLoaded);
            resolve();
          };
          v.addEventListener('loadedmetadata', onLoaded);
        });
        await videoRef.current.play().catch(() => {});
      }
    } catch (e: any) {
      setStreamError(e?.message ?? 'Unable to access camera');
    }
  }, []);

  useEffect(() => {
    if (!('mediaDevices' in navigator)) {
      setStreamError('Camera not available in this browser');
      return;
    }
    startCamera();
    return () => {
      const tracks = (videoRef.current?.srcObject as MediaStream | null)?.getTracks();
      tracks?.forEach((t) => t.stop());
    };
  }, [startCamera]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    // draw overlay artwork roughly centered with scale and rotation
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedArtwork?.image ?? '';
    img.onload = () => {
      // Match UI sizing: width is 30% of container width scaled by transform.scale
      const baseW = w * (0.30 * (transform.scale ?? 1));
      const baseH = baseW * 0.625;
      // place at current transform.position as TOP-LEFT percent of container
      const px = Math.max(0, Math.min(100, transform.position?.x ?? 50));
      const py = Math.max(0, Math.min(100, transform.position?.y ?? 50));
      const left = (px / 100) * w;
      const top = (py / 100) * h;
      // rotate around the artwork center
      const cx = left + baseW / 2;
      const cy = top + baseH / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((transform.rotationDeg * Math.PI) / 180);
      ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
      ctx.restore();
      const link = document.createElement('a');
      link.download = 'art-preview.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  if (!selectedArtwork) {
    return <div className="p-6 text-center text-gray-600">Select an artwork to start camera preview.</div>;
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg border bg-black aspect-video">
        {streamError ? (
          <div className="aspect-[3/4] flex items-center justify-center text-white/80 p-6 text-center">
            {streamError}
          </div>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
        )}
        {!streamError && (
          <button
            className="absolute bottom-3 right-3 bg-white/80 text-black text-xs px-2 py-1 rounded-md"
            onClick={startCamera}
          >
            Restart camera
          </button>
        )}

        <motion.img
          src={selectedArtwork.image}
          alt={selectedArtwork.title}
          className="absolute select-none cursor-move"
          style={{
            left: `${(transform.position?.x ?? 50)}%`,
            top: `${(transform.position?.y ?? 50)}%`,
            transform: `rotate(${transform.rotationDeg}deg)`,
            width: `${transform.scale * 30}%`,
            opacity: transform.opacity ?? 1,
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            const target = e.currentTarget as HTMLElement;
            try { target.setPointerCapture(e.pointerId); } catch {}
            setIsDragging(true);
            // compute pointer offset relative to current element top-left
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              const startLeft = rect.left + (rect.width * (transform.position?.x ?? 50)) / 100;
              const startTop = rect.top + (rect.height * (transform.position?.y ?? 50)) / 100;
              grabOffsetRef.current = { x: e.clientX - startLeft, y: e.clientY - startTop };
            }
            const onMove = (ev: PointerEvent) => {
              const off = grabOffsetRef.current ?? { x: 0, y: 0 };
              setCenteredPositionFromPoint(ev.clientX - off.x, ev.clientY - off.y);
            };
            const onUp = () => {
              setIsDragging(false);
              try { target.releasePointerCapture(e.pointerId); } catch {}
              grabOffsetRef.current = null;
              window.removeEventListener('pointermove', onMove);
              window.removeEventListener('pointerup', onUp);
              window.removeEventListener('pointercancel', onUp);
            };
            window.addEventListener('pointermove', onMove, { passive: true });
            window.addEventListener('pointerup', onUp, { passive: true });
            window.addEventListener('pointercancel', onUp, { passive: true });
          }}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full border">
          <span className="text-xs text-gray-600">Size</span>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={transform.scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
          <Button
          variant="secondary"
          onClick={() => setRotation((transform.rotationDeg % 180 === 0) ? 90 : 0)}
        >
          {(transform.rotationDeg % 180 === 0) ? 'Portrait' : 'Landscape'}
          </Button>
        </div>
        <Button onClick={capture} className="ml-auto">
          <Download className="w-4 h-4 mr-2" /> Save snapshot
        </Button>
      </div>
    </div>
  );
}


