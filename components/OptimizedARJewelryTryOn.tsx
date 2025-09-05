'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Webcam from 'react-webcam';
import { useMediaPipeManager } from './MediaPipeManager';

interface JewelryItem {
  id: string;
  name: string;
  type: 'earring' | 'necklace' | 'ring';
  imageUrl?: string;
  modelUrl?: string;
  scale: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

interface ARJewelryTryOnProps {
  jewelryItems: JewelryItem[];
  onJewelrySelect?: (jewelry: JewelryItem) => void;
  selectedJewelry?: JewelryItem | null;
  enable3D?: boolean;
  className?: string;
}

// Jewelry positioning based on MediaPipe landmarks
const JEWELRY_LANDMARKS = {
  // Face landmarks for earrings (left and right ears)
  LEFT_EAR: 234,
  RIGHT_EAR: 454,
  // Face landmarks for necklaces (chin and jawline)
  CHIN: 152,
  JAW_LEFT: 172,
  JAW_RIGHT: 397,
  // Hand landmarks for rings
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_TIP: 16,
  PINKY_TIP: 20,
  THUMB_TIP: 4
};

const OptimizedARJewelryTryOn: React.FC<ARJewelryTryOnProps> = ({
  jewelryItems,
  onJewelrySelect,
  selectedJewelry,
  enable3D = false,
  className = ''
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jewelryImageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

  const [isTracking, setIsTracking] = useState(false);
  const [faceLandmarks, setFaceLandmarks] = useState<any>(null);
  const [handLandmarks, setHandLandmarks] = useState<any[]>([]);
  const [segmentationMask, setSegmentationMask] = useState<ImageData | null>(null);
  const [jewelryPositions, setJewelryPositions] = useState<Map<string, {
    x: number;
    y: number;
    z: number;
    rotation: number;
    scale: number;
    visible: boolean;
  }>>(new Map());

  // MediaPipe manager
  const { startTracking, stopTracking, isInitialized } = useMediaPipeManager({
    onFaceLandmarks: (landmarks) => {
      setFaceLandmarks(landmarks);
      setIsTracking(true);
    },
    onHandLandmarks: (hands) => {
      setHandLandmarks(hands);
    },
    onSegmentationMask: (mask) => {
      setSegmentationMask(mask);
    },
    onError: (error) => {
      console.error('MediaPipe Error:', error);
    }
  });

  // Load jewelry images
  const loadJewelryImages = useCallback(async () => {
    const promises = jewelryItems.map(async (jewelry) => {
      if (jewelry.imageUrl) {
        return new Promise<[string, HTMLImageElement]>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve([jewelry.id, img]);
          img.onerror = () => reject(new Error(`Failed to load image for ${jewelry.id}`));
          img.src = jewelry.imageUrl!;
        });
      }
      return null;
    });

    try {
      const results = await Promise.all(promises);
      results.forEach((result) => {
        if (result) {
          jewelryImageRefs.current.set(result[0], result[1]);
        }
      });
    } catch (error) {
      console.error('Failed to load jewelry images:', error);
    }
  }, [jewelryItems]);

  // Calculate jewelry positions based on landmarks
  const calculateJewelryPositions = useCallback(() => {
    if (!selectedJewelry) {
      setJewelryPositions(new Map());
      return;
    }

    const newPositions = new Map<string, {
      x: number;
      y: number;
      z: number;
      rotation: number;
      scale: number;
      visible: boolean;
    }>();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (selectedJewelry.type === 'earring' && faceLandmarks) {
      // Calculate positions for both ears
      const leftEar = faceLandmarks[JEWELRY_LANDMARKS.LEFT_EAR];
      const rightEar = faceLandmarks[JEWELRY_LANDMARKS.RIGHT_EAR];

      if (leftEar) {
        newPositions.set(`${selectedJewelry.id}-left`, {
          x: leftEar.x * canvasWidth,
          y: leftEar.y * canvasHeight,
          z: leftEar.z,
          rotation: 0,
          scale: 0.8,
          visible: true
        });
      }

      if (rightEar) {
        newPositions.set(`${selectedJewelry.id}-right`, {
          x: rightEar.x * canvasWidth,
          y: rightEar.y * canvasHeight,
          z: rightEar.z,
          rotation: 0,
          scale: 0.8,
          visible: true
        });
      }
    } else if (selectedJewelry.type === 'necklace' && faceLandmarks) {
      // Calculate position for necklace using chin and jawline
      const chin = faceLandmarks[JEWELRY_LANDMARKS.CHIN];
      const jawLeft = faceLandmarks[JEWELRY_LANDMARKS.JAW_LEFT];
      const jawRight = faceLandmarks[JEWELRY_LANDMARKS.JAW_RIGHT];

      if (chin) {
        // Position necklace below chin, following jawline curve
        const jawCenterX = jawLeft && jawRight ? 
          (jawLeft.x + jawRight.x) / 2 : chin.x;
        
        newPositions.set(selectedJewelry.id, {
          x: jawCenterX * canvasWidth,
          y: (chin.y + 0.05) * canvasHeight, // Slightly below chin
          z: chin.z,
          rotation: 0,
          scale: 1.2,
          visible: true
        });
      }
    } else if (selectedJewelry.type === 'ring' && handLandmarks.length > 0) {
      // Calculate positions for rings on each hand
      handLandmarks.forEach((hand, handIndex) => {
        const fingerTip = hand.landmarks[JEWELRY_LANDMARKS.INDEX_FINGER_TIP];
        if (fingerTip) {
          newPositions.set(`${selectedJewelry.id}-hand-${handIndex}`, {
            x: fingerTip.x * canvasWidth,
            y: fingerTip.y * canvasHeight,
            z: fingerTip.z,
            rotation: 0,
            scale: 0.6,
            visible: true
          });
        }
      });
    }

    setJewelryPositions(newPositions);
  }, [selectedJewelry, faceLandmarks, handLandmarks]);

  // Render jewelry on canvas
  const renderJewelry = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedJewelry) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply segmentation mask if available
    if (segmentationMask) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.putImageData(segmentationMask, 0, 0);
    }

    // Render jewelry
    jewelryPositions.forEach((position, key) => {
      if (!position.visible) return;

      const jewelryImage = jewelryImageRefs.current.get(selectedJewelry.id);
      if (!jewelryImage) return;

      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(position.rotation);
      ctx.scale(position.scale, position.scale);

      // Draw jewelry with proper blending
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(
        jewelryImage,
        -jewelryImage.width * 0.05, // Scale down
        -jewelryImage.height * 0.05,
        jewelryImage.width * 0.1,
        jewelryImage.height * 0.1
      );

      ctx.restore();
    });
  }, [selectedJewelry, jewelryPositions, segmentationMask]);

  // Update jewelry positions when landmarks change
  useEffect(() => {
    calculateJewelryPositions();
  }, [calculateJewelryPositions]);

  // Render jewelry when positions change
  useEffect(() => {
    renderJewelry();
  }, [renderJewelry]);

  // Start tracking when camera is ready
  useEffect(() => {
    const video = webcamRef.current?.video;
    if (video && isInitialized) {
      startTracking(video);
    }

    return () => {
      stopTracking();
    };
  }, [isInitialized, startTracking, stopTracking]);

  // Load jewelry images on mount
  useEffect(() => {
    loadJewelryImages();
  }, [loadJewelryImages]);

  // Set canvas size to match video
  useEffect(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const resizeCanvas = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      };

      resizeCanvas();
      video.addEventListener('loadedmetadata', resizeCanvas);
      
      return () => {
        video.removeEventListener('loadedmetadata', resizeCanvas);
      };
    }
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Camera Feed */}
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user"
        }}
        mirrored={true}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Jewelry Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm">
          <div>Status: {isTracking ? '🟢 Tracking' : '🔴 Not Tracking'}</div>
          <div>Face Landmarks: {faceLandmarks?.length || 0}</div>
          <div>Hand Landmarks: {handLandmarks.length}</div>
          <div>Jewelry Positions: {jewelryPositions.size}</div>
          <div>Selected: {selectedJewelry?.name || 'None'}</div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
        {jewelryItems.map((jewelry) => (
          <button
            key={jewelry.id}
            onClick={() => onJewelrySelect?.(jewelry)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedJewelry?.id === jewelry.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            {jewelry.name}
          </button>
        ))}
        
        <button
          onClick={() => onJewelrySelect?.(null)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-white hover:bg-gray-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default OptimizedARJewelryTryOn;
