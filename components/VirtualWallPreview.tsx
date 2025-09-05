'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, RotateCcw } from 'lucide-react';

interface VirtualWallPreviewProps {
  wallImage: string;
  selectedArtwork: any;
  artworkSize: number;
  artworkPosition: { x: number; y: number };
  lighting: number;
  perspective: number;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function VirtualWallPreview({
  wallImage,
  selectedArtwork,
  artworkSize,
  artworkPosition,
  lighting,
  perspective,
  onPositionChange,
}: VirtualWallPreviewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetPreview = () => {
    // no-op placeholder to avoid runtime errors if not provided
  };

  const handleImageUpload = () => {
    // no-op placeholder to avoid runtime errors if not implemented
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedArtwork) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onPositionChange({
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const lightingFilter = `brightness(${0.7 + (lighting / 100) * 0.6}) contrast(${0.9 + (lighting / 100) * 0.2})`;
  const perspectiveTransform = `perspective(1000px) rotateY(${perspective}deg)`;

  return (
    <Card className="relative overflow-hidden bg-gray-100 aspect-[4/3] min-h-[600px]">
      {/* Wall Background */}
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-crosshair"
        style={{
          backgroundImage: `url(${wallImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: lightingFilter,
          transform: perspectiveTransform,
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Room Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
        
        {/* Artwork Preview */}
        <AnimatePresence>
          {selectedArtwork && (
            <motion.div
              className="absolute cursor-move"
              style={{
                left: `${artworkPosition.x}%`,
                top: `${artworkPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${artworkSize}%`,
                maxWidth: '400px',
                aspectRatio: '4/5',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              onMouseDown={handleMouseDown}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, rotate: 2 }}
            >
              {/* Frame Shadow */}
              <div className="absolute inset-0 bg-black/20 blur-lg transform translate-y-2 translate-x-2" />
              
              {/* Frame */}
              <div className="relative bg-white p-2 shadow-2xl rounded-sm">
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Glass Reflection Effect */}
                <div className="absolute inset-2 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Artwork Info Tooltip */}
              <motion.div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {selectedArtwork.title} - ${selectedArtwork.price}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Overlay for Positioning */}
        {selectedArtwork && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full opacity-20">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-gold" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-gold" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gold" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gold" />
            </div>
          </div>
        )}

        {/* Instructions Overlay */}
        {!selectedArtwork && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center text-white">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gold/20 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-8 h-8 text-gold" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Select an Artwork</h3>
              <p className="text-gray-300">Choose from our collection to preview on your wall</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
          onClick={resetPreview}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </Card>
  );
}