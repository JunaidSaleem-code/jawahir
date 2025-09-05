'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ProperARFilterProps {
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

const ProperARFilter = ({ jewelry, webcamRef, faceLandmarks, handLandmarks, isTracking }: ProperARFilterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [jewelryImage, setJewelryImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLCanvasElement | null>(null);
  const [jewelryPosition, setJewelryPosition] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load and process jewelry image with background removal
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setJewelryImage(img);
      processImageForAR(img);
    };
    img.onerror = () => {
      // Create a simple colored shape as fallback
      createFallbackJewelry();
    };
    img.src = jewelry.image;
  }, [jewelry.image]);

  // Process image to remove background and prepare for AR overlay
  const processImageForAR = useCallback((img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the original image
    ctx.drawImage(img, 0, 0);

    // Get image data for background removal
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple background removal - remove white/light backgrounds
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      // Check if pixel is likely background (white, light gray, etc.)
      const brightness = (r + g + b) / 3;
      const isBackground = brightness > 200 && alpha > 0;

      if (isBackground) {
        data[i + 3] = 0; // Make transparent
      }
    }

    // Apply the processed image data
    ctx.putImageData(imageData, 0, 0);

    // Create a new canvas for the processed image
    const processedCanvas = document.createElement('canvas');
    const processedCtx = processedCanvas.getContext('2d');
    if (processedCtx) {
      processedCanvas.width = canvas.width;
      processedCanvas.height = canvas.height;
      processedCtx.drawImage(canvas, 0, 0);
      setProcessedImage(processedCanvas);
    }
  }, []);

  // Create fallback jewelry shape
  const createFallbackJewelry = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 100;
    canvas.width = size;
    canvas.height = size;

    // Create a gold jewelry shape
    ctx.fillStyle = '#C6A664';
    ctx.strokeStyle = '#B8941F';
    ctx.lineWidth = 3;

    if (jewelry.category === 'earrings') {
      // Draw earring shape
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (jewelry.category === 'rings') {
      // Draw ring shape
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/3, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.lineWidth = 8;
      ctx.stroke();
    } else if (jewelry.category === 'necklaces') {
      // Draw necklace shape
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    setProcessedImage(canvas);
  }, [jewelry.category]);

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
      // Position earrings on earlobes using MediaPipe landmarks
      if (faceLandmarks.landmarks && faceLandmarks.landmarks.length > 0) {
        // Use specific ear landmarks from MediaPipe
        const leftEar = faceLandmarks.landmarks[234]; // Left ear landmark
        const rightEar = faceLandmarks.landmarks[454]; // Right ear landmark
        
        if (leftEar) {
          x = leftEar.x * canvasWidth;
          y = leftEar.y * canvasHeight;
          scale = 0.6;
        }
      }
    } else if (jewelry.category === 'necklaces') {
      // Position necklace on neck/chest area
      if (faceLandmarks.landmarks && faceLandmarks.landmarks.length > 0) {
        // Use chin and neck landmarks
        const chin = faceLandmarks.landmarks[152]; // Chin landmark
        if (chin) {
          x = chin.x * canvasWidth;
          y = chin.y * canvasHeight + 50; // Below chin
          scale = 1.0;
        }
      }
    } else if (jewelry.category === 'rings') {
      // Position rings on fingers using hand landmarks
      if (handLandmarks && handLandmarks.length > 0) {
        const hand = handLandmarks[0];
        if (hand && hand.landmarks) {
          // Use finger tip landmarks
          const fingerTip = hand.landmarks[8]; // Index finger tip
          if (fingerTip) {
            x = fingerTip.x * canvasWidth;
            y = fingerTip.y * canvasHeight;
            scale = 0.4;
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

  // Render jewelry on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !processedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw jewelry with proper AR overlay
    ctx.save();
    ctx.translate(jewelryPosition.x, jewelryPosition.y);
    ctx.rotate(jewelryPosition.rotation);
    ctx.scale(jewelryPosition.scale, jewelryPosition.scale);
    
    // Draw processed jewelry image
    ctx.drawImage(
      processedImage,
      -processedImage.width / 2,
      -processedImage.height / 2,
      processedImage.width,
      processedImage.height
    );
    
    ctx.restore();
  }, [processedImage, jewelryPosition]);

  // Set canvas size to match video
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, [webcamRef]);

  // Handle mouse events for manual positioning
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
      
      {/* Debug info */}
      {isTracking && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm">
          <div className="font-bold text-green-400">✓ AR Filter Active</div>
          <div>Position: {Math.round(jewelryPosition.x)}, {Math.round(jewelryPosition.y)}</div>
          <div>Scale: {jewelryPosition.scale.toFixed(2)}</div>
          <div>Category: {jewelry.category}</div>
          <div className="text-xs text-gray-300 mt-1">
            {jewelry.category === 'earrings' ? 'Look at camera for ear positioning' : 
             jewelry.category === 'necklaces' ? 'Show your neck/chest area' : 
             'Show your hands for ring positioning'}
          </div>
        </div>
      )}
      
      {/* Manual controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
        <motion.button
          className="bg-gold text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJewelryPosition(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }))}
        >
          +
        </motion.button>
        <motion.button
          className="bg-gold text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJewelryPosition(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.3) }))}
        >
          -
        </motion.button>
        <motion.button
          className="bg-gold text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJewelryPosition(prev => ({ ...prev, rotation: prev.rotation + Math.PI / 4 }))}
        >
          ↻
        </motion.button>
        <motion.button
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
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

export default ProperARFilter;
