'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Maximize2, Minimize2, Move, RotateCw, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JewelryDebugOverlayProps {
  jewelry: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  webcamRef: React.RefObject<any>;
  faceLandmarks?: any;
  handLandmarks?: any;
  isTracking?: boolean;
}

interface JewelryPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const JewelryDebugOverlay = ({ 
  jewelry, 
  webcamRef, 
  faceLandmarks, 
  handLandmarks, 
  isTracking = false 
}: JewelryDebugOverlayProps) => {
  const [position, setPosition] = useState<JewelryPosition>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isAutoTracking, setIsAutoTracking] = useState(true);
  const [trackingQuality, setTrackingQuality] = useState<'good' | 'poor' | 'none'>('none');
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; scale: number } | null>(null);
  const rotateStartRef = useRef<{ x: number; y: number; rotation: number } | null>(null);

  // Auto-position jewelry based on category
  useEffect(() => {
    if (!webcamRef.current?.video) return;
    
    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    
    // Calculate initial position based on jewelry category
    let initialX = videoWidth / 2;
    let initialY = videoHeight / 2;
    let initialScale = 0.3;
    
    switch (jewelry.category) {
      case 'earrings':
        // Position for left ear
        initialX = videoWidth * 0.25;
        initialY = videoHeight * 0.4;
        initialScale = 0.2;
        break;
      case 'rings':
        // Position for hand/finger area
        initialX = videoWidth * 0.5;
        initialY = videoHeight * 0.7;
        initialScale = 0.25;
        break;
      case 'necklaces':
        // Position for neck area
        initialX = videoWidth * 0.5;
        initialY = videoHeight * 0.3;
        initialScale = 0.4;
        break;
    }
    
    setPosition({
      x: initialX,
      y: initialY,
      scale: initialScale,
      rotation: 0
    });
  }, [jewelry.category, webcamRef]);

  // Update position based on tracking
  useEffect(() => {
    if (!isAutoTracking || !isTracking) return;

    if (faceLandmarks || handLandmarks) {
      setTrackingQuality('good');
    } else {
      setTrackingQuality('poor');
    }
  }, [faceLandmarks, handLandmarks, isAutoTracking, isTracking]);

  // Manual positioning controls
  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize' | 'rotate') => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAutoTracking(false); // Disable auto-tracking when manually adjusting
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    switch (action) {
      case 'drag':
        setIsDragging(true);
        dragStartRef.current = { x: startX, y: startY };
        break;
      case 'resize':
        setIsResizing(true);
        resizeStartRef.current = { x: startX, y: startY, scale: position.scale };
        break;
      case 'rotate':
        setIsRotating(true);
        rotateStartRef.current = { x: startX, y: startY, rotation: position.rotation };
        break;
    }
  }, [position.scale, position.rotation]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!overlayRef.current) return;
    
    const rect = overlayRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    if (isDragging && dragStartRef.current) {
      const deltaX = currentX - dragStartRef.current.x;
      const deltaY = currentY - dragStartRef.current.y;
      
      setPosition(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      dragStartRef.current = { x: currentX, y: currentY };
    }
    
    if (isResizing && resizeStartRef.current) {
      const deltaX = currentX - resizeStartRef.current.x;
      const deltaY = currentY - resizeStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const scaleFactor = distance / 100;
      
      setPosition(prev => ({
        ...prev,
        scale: Math.max(0.1, Math.min(2, resizeStartRef.current!.scale + scaleFactor))
      }));
    }
    
    if (isRotating && rotateStartRef.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angle1 = Math.atan2(rotateStartRef.current.y - centerY, rotateStartRef.current.x - centerX);
      const angle2 = Math.atan2(currentY - centerY, currentX - centerX);
      const deltaAngle = angle2 - angle1;
      
      setPosition(prev => ({
        ...prev,
        rotation: rotateStartRef.current!.rotation + deltaAngle
      }));
    }
  }, [isDragging, isResizing, isRotating]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    dragStartRef.current = null;
    resizeStartRef.current = null;
    rotateStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

  const resetPosition = useCallback(() => {
    setPosition({
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0
    });
    setIsAutoTracking(true);
  }, []);

  const rotateJewelry = useCallback(() => {
    setPosition(prev => ({
      ...prev,
      rotation: prev.rotation + Math.PI / 4
    }));
  }, []);

  const toggleAutoTracking = useCallback(() => {
    setIsAutoTracking(prev => !prev);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute inset-0 pointer-events-none"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Debug Info */}
        <div className="absolute top-4 left-4 text-white text-xs bg-black/50 p-2 rounded">
          <div>Jewelry: {jewelry.name}</div>
          <div>Position: {Math.round(position.x)}, {Math.round(position.y)}</div>
          <div>Scale: {position.scale.toFixed(2)}</div>
          <div>Tracking: {trackingQuality}</div>
        </div>

        {/* Tracking Quality Indicator */}
        {isTracking && (
          <div className="absolute top-4 right-4">
            <Badge 
              variant="outline" 
              className={`${
                trackingQuality === 'good' 
                  ? 'border-green-500 text-green-600 bg-green-50' 
                  : trackingQuality === 'poor'
                  ? 'border-yellow-500 text-yellow-600 bg-yellow-50'
                  : 'border-red-500 text-red-600 bg-red-50'
              }`}
            >
              <Target className="w-3 h-3 mr-1" />
              {trackingQuality === 'good' ? 'Tracking' : trackingQuality === 'poor' ? 'Poor Tracking' : 'No Tracking'}
            </Badge>
          </div>
        )}

        {/* Jewelry Image */}
        <motion.div
          className="absolute pointer-events-auto cursor-move"
          style={{
            left: position.x - 50,
            top: position.y - 50,
            transform: `scale(${position.scale}) rotate(${position.rotation}rad)`,
            transformOrigin: 'center',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'drag')}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative">
            {/* Jewelry Image */}
            <div className="w-24 h-24 rounded-full border-2 border-gold/50 overflow-hidden bg-white">
              <img 
                src={jewelry.image} 
                alt={jewelry.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center hidden">
                <span className="text-gold font-bold text-sm">💎</span>
              </div>
            </div>
            
            {/* Jewelry name badge */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-charcoal/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {jewelry.name}
            </div>
          </div>
        </motion.div>

        {/* Control Buttons */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 flex gap-2 pointer-events-auto"
            >
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white border-gold text-gold"
                onClick={resetPosition}
              >
                <Move className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white border-gold text-gold"
                onClick={rotateJewelry}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white border-gold text-gold"
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant={isAutoTracking ? "default" : "outline"}
                className={`${
                  isAutoTracking 
                    ? "bg-gold hover:bg-gold/90 text-white" 
                    : "bg-white/90 hover:bg-white border-gold text-gold"
                }`}
                onClick={toggleAutoTracking}
              >
                <Target className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resize Handle */}
        <div
          className="absolute w-4 h-4 bg-gold rounded-full border-2 border-white shadow-lg pointer-events-auto cursor-se-resize"
          style={{
            left: position.x + (50 * position.scale) - 8,
            top: position.y + (50 * position.scale) - 8,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'resize')}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default JewelryDebugOverlay;
