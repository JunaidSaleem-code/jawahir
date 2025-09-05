'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ARFilterOverlayProps {
  jewelry: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  webcamRef: React.RefObject<any>;
  faceLandmarks: any;
  handLandmarks: any;
  isTracking: boolean;
}

const ARFilterOverlay = ({ jewelry, webcamRef, faceLandmarks, handLandmarks, isTracking }: ARFilterOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [jewelryPosition, setJewelryPosition] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [jewelryImage, setJewelryImage] = useState<HTMLImageElement | null>(null);

  // Load jewelry image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setJewelryImage(img);
    img.onerror = () => {
      // Fallback to a simple colored circle if image fails
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#C6A664';
        ctx.beginPath();
        ctx.arc(50, 50, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#B8941F';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      setJewelryImage(canvas as any);
    };
    img.src = jewelry.image;
  }, [jewelry.image]);

  // Calculate jewelry position based on face landmarks
  const calculateJewelryPosition = useCallback(() => {
    if (!faceLandmarks || !webcamRef.current?.video) return;

    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const canvasWidth = canvasRef.current?.width || 1280;
    const canvasHeight = canvasRef.current?.height || 720;

    const scaleX = canvasWidth / videoWidth;
    const scaleY = canvasHeight / videoHeight;

    let x = 0, y = 0, scale = 1;

    if (jewelry.category === 'earrings') {
      // Position earrings on earlobes
      if (faceLandmarks.landmarks && faceLandmarks.landmarks.length > 0) {
        // Use MediaPipe face landmarks for ear positioning
        // Landmark 234 and 454 are approximate ear positions
        const leftEar = faceLandmarks.landmarks[234];
        const rightEar = faceLandmarks.landmarks[454];
        
        if (leftEar && rightEar) {
          x = (leftEar.x * canvasWidth) - 30; // Offset for earring size
          y = (leftEar.y * canvasHeight) - 20;
          scale = 0.8;
        }
      }
    } else if (jewelry.category === 'necklaces') {
      // Position necklace on neck/chest area
      if (faceLandmarks.landmarks && faceLandmarks.landmarks.length > 0) {
        // Use chin landmarks for necklace positioning
        const chin = faceLandmarks.landmarks[152]; // Approximate chin position
        if (chin) {
          x = (chin.x * canvasWidth) - 50;
          y = (chin.y * canvasHeight) + 30;
          scale = 1.2;
        }
      }
    } else if (jewelry.category === 'rings') {
      // Position rings on fingers using hand landmarks
      if (handLandmarks && handLandmarks.length > 0) {
        const hand = handLandmarks[0]; // First detected hand
        if (hand && hand.landmarks) {
          // Use finger tip landmarks for ring positioning
          const fingerTip = hand.landmarks[8]; // Index finger tip
          if (fingerTip) {
            x = (fingerTip.x * canvasWidth) - 25;
            y = (fingerTip.y * canvasHeight) - 25;
            scale = 0.6;
          }
        }
      }
    }

    setJewelryPosition({ x, y, scale, rotation: 0 });
  }, [faceLandmarks, handLandmarks, jewelry.category, webcamRef]);

  // Update position when landmarks change
  useEffect(() => {
    if (isTracking && !isDragging) {
      calculateJewelryPosition();
    }
  }, [faceLandmarks, handLandmarks, isTracking, isDragging, calculateJewelryPosition]);

  // Handle mouse/touch events for manual positioning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - jewelryPosition.x,
        y: e.clientY - rect.top - jewelryPosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;
      setJewelryPosition(prev => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Render jewelry on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !jewelryImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw jewelry
    ctx.save();
    ctx.translate(jewelryPosition.x, jewelryPosition.y);
    ctx.rotate(jewelryPosition.rotation);
    ctx.scale(jewelryPosition.scale, jewelryPosition.scale);
    
    // Draw jewelry image
    if (jewelryImage) {
      ctx.drawImage(
        jewelryImage,
        -jewelryImage.width / 2,
        -jewelryImage.height / 2,
        jewelryImage.width,
        jewelryImage.height
      );
    }
    
    ctx.restore();
  }, [jewelryImage, jewelryPosition]);

  // Set canvas size to match video
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, [webcamRef]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Debug info overlay */}
      {isTracking && (
        <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded text-xs">
          <div>Tracking: {isTracking ? 'Active' : 'Inactive'}</div>
          <div>Position: {Math.round(jewelryPosition.x)}, {Math.round(jewelryPosition.y)}</div>
          <div>Scale: {jewelryPosition.scale.toFixed(2)}</div>
          <div>Category: {jewelry.category}</div>
        </div>
      )}
      
      {/* Manual controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
        <motion.button
          className="bg-gold text-white px-3 py-1 rounded text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJewelryPosition(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }))}
        >
          +
        </motion.button>
        <motion.button
          className="bg-gold text-white px-3 py-1 rounded text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJewelryPosition(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.3) }))}
        >
          -
        </motion.button>
        <motion.button
          className="bg-gold text-white px-3 py-1 rounded text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJewelryPosition(prev => ({ ...prev, rotation: prev.rotation + Math.PI / 4 }))}
        >
          ↻
        </motion.button>
        <motion.button
          className="bg-gold text-white px-3 py-1 rounded text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={calculateJewelryPosition}
        >
          Auto
        </motion.button>
      </div>
    </div>
  );
};

export default ARFilterOverlay;
