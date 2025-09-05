'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RotateCcw, Download, ArrowLeft, Maximize2, Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import VirtualWallPreview from '@/components/VirtualWallPreview';
import ArtworkSelector from '@/components/ArtworkSelector';

export default function VirtualPreviewPage() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [wallImage, setWallImage] = useState('/api/placeholder/800/600');
  const [artworkSize, setArtworkSize] = useState([60]);
  const [artworkPosition, setArtworkPosition] = useState({ x: 50, y: 50 });
  const [lighting, setLighting] = useState([50]);
  const [perspective, setPerspective] = useState([0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWallImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const resetPreview = () => {
    setSelectedArtwork(null);
    setArtworkSize([60]);
    setArtworkPosition({ x: 50, y: 50 });
    setLighting([50]);
    setPerspective([0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.header
        className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gold">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Gallery
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-playfair font-bold text-charcoal">
                  Virtual <span className="text-gold">Preview</span>
                </h1>
                <p className="text-sm text-gray-500">See how art looks on your wall</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Wall
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPreview}
                className="text-gray-600 hover:text-charcoal"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Artwork Selection */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center">
                <Maximize2 className="w-5 h-5 mr-2 text-gold" />
                Select Artwork
              </h3>
              <ArtworkSelector
                selectedArtwork={selectedArtwork}
                onArtworkSelect={setSelectedArtwork}
              />
            </Card>

            {/* Size Control */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal mb-4">Size</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Small</span>
                  <span>Large</span>
                </div>
                <Slider
                  value={artworkSize}
                  onValueChange={setArtworkSize}
                  max={100}
                  min={20}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 text-center">
                  {artworkSize[0]}% of wall width
                </p>
              </div>
            </Card>

            {/* Lighting Control */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal mb-4">Lighting</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Dim</span>
                  <span>Bright</span>
                </div>
                <Slider
                  value={lighting}
                  onValueChange={setLighting}
                  max={100}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Perspective Control */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center">
                <Move3D className="w-5 h-5 mr-2 text-gold" />
                Perspective
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Left</span>
                  <span>Center</span>
                  <span>Right</span>
                </div>
                <Slider
                  value={perspective}
                  onValueChange={setPerspective}
                  max={30}
                  min={-30}
                  step={5}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-gradient-gold hover:shadow-lg hover:shadow-gold/20">
                <Camera className="w-4 h-4 mr-2" />
                Save Preview
              </Button>
              <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          </motion.div>

          {/* Preview Area */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <VirtualWallPreview
              wallImage={wallImage}
              selectedArtwork={selectedArtwork}
              artworkSize={artworkSize[0]}
              artworkPosition={artworkPosition}
              lighting={lighting[0]}
              perspective={perspective[0]}
              onPositionChange={setArtworkPosition}
            />
          </motion.div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}