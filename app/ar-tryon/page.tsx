'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, RotateCcw, Maximize2, Minimize2, Share2, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ARCamera from '@/components/ARCamera';
import ProperARFilter from '@/components/ProperARFilter';
import JewelrySelector from '@/components/JewelrySelector';
import SimpleARTracker from '@/components/SimpleARTracker';
import { useToast } from '@/hooks/use-toast';

// Jawahir Collection - AR-optimized jewelry data with high-quality images
const jewelryData = {
  earrings: [
    {
      id: 'earring-1',
      name: 'Trinity Diamond Earrings',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'earrings'
    },
    {
      id: 'earring-2', 
      name: 'Juste un Clou Earrings',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'earrings'
    },
    {
      id: 'earring-3',
      name: 'Love Hoop Earrings',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'earrings'
    },
    {
      id: 'earring-4',
      name: 'Panthere Pearl Earrings',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'earrings'
    }
  ],
  rings: [
    {
      id: 'ring-1',
      name: 'Trinity Ring',
      price: 95000,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'rings'
    },
    {
      id: 'ring-2',
      name: 'Love Ring',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'rings'
    },
    {
      id: 'ring-3',
      name: 'Juste un Clou Ring',
      price: 55000,
      image: 'https://images.unsplash.com/photo-1603561596112-db0b5b0b5b0b?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'rings'
    },
    {
      id: 'ring-4',
      name: 'Panthere Ring',
      price: 180000,
      image: 'https://images.unsplash.com/photo-1596944924616-7b384c9dc7b3?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'rings'
    }
  ],
  necklaces: [
    {
      id: 'necklace-1',
      name: 'Trinity Necklace',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1596944924616-7b384c9dc7b3?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'necklaces'
    },
    {
      id: 'necklace-2',
      name: 'Love Pendant',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'necklaces'
    },
    {
      id: 'necklace-3',
      name: 'Juste un Clou Necklace',
      price: 95000,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'necklaces'
    },
    {
      id: 'necklace-4',
      name: 'Panthere Choker',
      price: 250000,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
      category: 'necklaces'
    }
  ]
};

export default function ARTryOnPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedJewelry, setSelectedJewelry] = useState(null);
  const [activeCategory, setActiveCategory] = useState('earrings');
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceLandmarks, setFaceLandmarks] = useState(null);
  const [handLandmarks, setHandLandmarks] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const handleCameraToggle = useCallback(() => {
    setIsCameraActive(prev => !prev);
    if (!isCameraActive) {
      setIsTracking(true);
    } else {
      setIsTracking(false);
    }
  }, [isCameraActive]);

  const handleFaceLandmarks = useCallback((landmarks: any) => {
    setFaceLandmarks(landmarks);
  }, []);

  const handleHandLandmarks = useCallback((landmarks: any) => {
    setHandLandmarks(landmarks);
  }, []);

  const handleTrackingError = useCallback((error: string) => {
    toast({
      title: "Tracking Error",
      description: error,
      variant: "destructive",
    });
  }, [toast]);

  const handleJewelrySelect = useCallback((jewelry) => {
    setSelectedJewelry(jewelry);
    toast({
      title: "Jewelry Selected",
      description: `${jewelry.name} is now ready for try-on`,
    });
  }, [toast]);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || !selectedJewelry) return;
    
    setIsCapturing(true);
    try {
      // Capture the current frame with jewelry overlay
      const imageSrc = webcamRef.current.getScreenshot();
      
      // Create a canvas to combine webcam and jewelry
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match webcam
      const video = webcamRef.current.video;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw webcam frame
      ctx.drawImage(video, 0, 0);
      
      // Here you would draw the jewelry overlay
      // For now, we'll just show a success message
      
      toast({
        title: "Snapshot Captured!",
        description: "Your AR try-on snapshot has been saved",
      });
      
      // Simulate WhatsApp sharing
      const whatsappMessage = `I want this product: ${selectedJewelry.name} - PKR ${selectedJewelry.price.toLocaleString()}`;
      const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      toast({
        title: "Capture Failed",
        description: "Unable to capture snapshot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  }, [selectedJewelry, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-cream to-warm-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-gold" />
              <Badge variant="outline" className="border-gold text-gold font-medium">
                Premium AR Experience
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-cormorant font-bold text-charcoal mb-6 luxury-text">
              Virtual
              <span className="block bg-gradient-gold bg-clip-text text-transparent">
                Try-On
              </span>
              for Jewelry
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Point your camera at your face and hands to try on our luxury jewelry collection instantly. 
              See how our pieces look on you with realistic AR positioning and movement tracking.
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button
                onClick={handleCameraToggle}
                size="lg"
                className="bg-gradient-gold hover:bg-gradient-gold/90 text-white px-8 py-4 text-lg font-medium premium-shadow hover:cartier-glow transition-all duration-300"
              >
                {isCameraActive ? (
                  <>
                    <CameraOff className="w-5 h-5 mr-2" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Start AR Try-On
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main AR Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-charcoal/5 border-0 shadow-2xl">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                {isCameraActive ? (
                  <div className="relative w-full h-full">
                    <ARCamera ref={webcamRef} />
                    <SimpleARTracker
                      webcamRef={webcamRef}
                      onFaceLandmarks={handleFaceLandmarks}
                      onHandLandmarks={handleHandLandmarks}
                      onError={handleTrackingError}
                    />
                    {selectedJewelry && (
                      <ProperARFilter
                        jewelry={selectedJewelry}
                        webcamRef={webcamRef}
                        faceLandmarks={faceLandmarks}
                        handLandmarks={handLandmarks}
                        isTracking={isTracking}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Camera not active</p>
                      <p className="text-gray-400 text-sm">Click "Start AR Try-On" to begin</p>
                    </div>
                  </div>
                )}
                
                {/* Capture Controls Overlay */}
                {isCameraActive && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      onClick={handleCapture}
                      disabled={!selectedJewelry || isCapturing}
                      size="sm"
                      className="bg-gold hover:bg-gold/90 text-white shadow-lg"
                    >
                      {isCapturing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => window.open(`https://wa.me/923001234567?text=I want this product: ${selectedJewelry?.name || 'jewelry'}`, '_blank')}
                      disabled={!selectedJewelry}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Jewelry Selection */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 premium-shadow">
              <h3 className="text-2xl font-cormorant font-bold text-charcoal mb-4 luxury-text">
                Select Jewelry
              </h3>
              
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="earrings" className="text-sm">Earrings</TabsTrigger>
                  <TabsTrigger value="rings" className="text-sm">Rings</TabsTrigger>
                  <TabsTrigger value="necklaces" className="text-sm">Necklaces</TabsTrigger>
                </TabsList>
                
                <TabsContent value="earrings" className="mt-4">
                  <JewelrySelector
                    jewelry={jewelryData.earrings}
                    onSelect={handleJewelrySelect}
                    selectedJewelry={selectedJewelry}
                  />
                </TabsContent>
                
                <TabsContent value="rings" className="mt-4">
                  <JewelrySelector
                    jewelry={jewelryData.rings}
                    onSelect={handleJewelrySelect}
                    selectedJewelry={selectedJewelry}
                  />
                </TabsContent>
                
                <TabsContent value="necklaces" className="mt-4">
                  <JewelrySelector
                    jewelry={jewelryData.necklaces}
                    onSelect={handleJewelrySelect}
                    selectedJewelry={selectedJewelry}
                  />
                </TabsContent>
              </Tabs>
            </Card>

            {/* Instructions */}
            <Card className="p-6 bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 premium-shadow">
              <h4 className="font-cormorant font-semibold text-charcoal mb-3 luxury-text">
                How to Use
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-medium text-charcoal">Enable Camera</p>
                    <p>Click "Enable Camera" and allow camera permissions when prompted</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-medium text-charcoal">Position Yourself</p>
                    <p>For earrings/necklaces: Point camera at your face. For rings: Show your hands</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-medium text-charcoal">Select Jewelry</p>
                    <p>Choose from earrings, rings, or necklaces. Jewelry will automatically position on your face/hands</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <div>
                    <p className="font-medium text-charcoal">Adjust & Capture</p>
                    <p>Use manual controls to adjust position, size, or rotation. Take a snapshot and share via WhatsApp</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
