'use client';

import { forwardRef, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

interface ARCameraProps {
  className?: string;
}

const ARCamera = forwardRef<Webcam, ARCameraProps>(({ className }, ref) => {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user', // Front camera for selfie-style
  };

  const handleUserMedia = useCallback((stream: MediaStream) => {
    console.log('Camera stream started:', stream);
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error('Camera error:', error);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full h-full ${className}`}
    >
      <Webcam
        ref={ref}
        audio={false}
        width={videoConstraints.width}
        height={videoConstraints.height}
        videoConstraints={videoConstraints}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
        mirrored={true} // Mirror the video for selfie-style
        className="w-full h-full object-cover rounded-lg"
        screenshotFormat="image/jpeg"
        screenshotQuality={0.8}
      />
      
      {/* Camera overlay indicators */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner indicators */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gold rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gold rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold rounded-br-lg"></div>
        
        {/* Center focus indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 border-2 border-gold/50 rounded-full">
            <div className="w-4 h-4 bg-gold rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ARCamera.displayName = 'ARCamera';

export default ARCamera;
