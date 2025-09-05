'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Maximize2, Minimize2, Move, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JewelryOverlayProps {
  jewelry: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  webcamRef: React.RefObject<any>;
}

interface JewelryPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const JewelryOverlay = ({ jewelry, webcamRef }: JewelryOverlayProps) => {
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
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; scale: number } | null>(null);
  const rotateStartRef = useRef<{ x: number; y: number; rotation: number } | null>(null);

  // Auto-position jewelry based on category
  useEffect(() => {
    if (!webcamRef.current?.video) return;
    
    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
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

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize' | 'rotate') => {
    e.preventDefault();
    e.stopPropagation();
    
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
      const scaleFactor = distance / 100; // Adjust sensitivity
      
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
  }, []);

  const rotateJewelry = useCallback(() => {
    setPosition(prev => ({
      ...prev,
      rotation: prev.rotation + Math.PI / 4
    }));
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
            {/* Placeholder for jewelry image - in production, use actual jewelry images */}
            <div className="w-24 h-24 bg-gradient-to-br from-gold/20 to-gold/40 rounded-full border-2 border-gold/50 flex items-center justify-center">
              <span className="text-gold font-bold text-sm">💎</span>
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

export default JewelryOverlay;
