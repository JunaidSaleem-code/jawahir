'use client';

import { useEffect, useRef, useCallback } from 'react';

interface SimpleMediaPipeTrackerProps {
  webcamRef: React.RefObject<any>;
  onFaceLandmarks?: (landmarks: any) => void;
  onHandLandmarks?: (landmarks: any) => void;
  onError?: (error: string) => void;
}

const SimpleMediaPipeTracker = ({ 
  webcamRef, 
  onFaceLandmarks, 
  onHandLandmarks, 
  onError 
}: SimpleMediaPipeTrackerProps) => {
  const isInitializedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // Mock face landmarks for demonstration
  const generateMockFaceLandmarks = useCallback(() => {
    if (!webcamRef.current?.video) return null;
    
    const video = webcamRef.current.video;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    
    // Generate mock face landmarks (simplified face mesh)
    const landmarks = [];
    for (let i = 0; i < 468; i++) {
      landmarks.push({
        x: 0.5 + (Math.random() - 0.5) * 0.2, // Center face area
        y: 0.4 + (Math.random() - 0.5) * 0.3, // Upper face area
        z: (Math.random() - 0.5) * 0.1
      });
    }
    
    return landmarks;
  }, [webcamRef]);

  // Mock hand landmarks for demonstration
  const generateMockHandLandmarks = useCallback(() => {
    if (!webcamRef.current?.video) return null;
    
    const video = webcamRef.current.video;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    
    // Generate mock hand landmarks (simplified hand mesh)
    const landmarks = [];
    for (let i = 0; i < 21; i++) {
      landmarks.push({
        x: 0.6 + (Math.random() - 0.5) * 0.3, // Right side of face
        y: 0.7 + (Math.random() - 0.5) * 0.2, // Lower face area
        z: (Math.random() - 0.5) * 0.1
      });
    }
    
    return [landmarks]; // Return array of hands
  }, [webcamRef]);

  const startTracking = useCallback(async () => {
    if (!webcamRef.current?.video || isInitializedRef.current) return;

    try {
      console.log('Starting simple tracking (mock mode)');
      isInitializedRef.current = true;

      const trackFrame = () => {
        if (!webcamRef.current?.video) return;

        // Generate mock landmarks
        const faceLandmarks = generateMockFaceLandmarks();
        const handLandmarks = generateMockHandLandmarks();

        // Call callbacks with mock data
        if (faceLandmarks) {
          onFaceLandmarks?.(faceLandmarks);
        }
        
        if (handLandmarks) {
          onHandLandmarks?.(handLandmarks);
        }

        // Continue tracking
        animationFrameRef.current = requestAnimationFrame(trackFrame);
      };

      // Start tracking loop
      trackFrame();
    } catch (error) {
      console.error('Simple tracking error:', error);
      onError?.('Failed to start simple tracking');
    }
  }, [webcamRef, generateMockFaceLandmarks, generateMockHandLandmarks, onFaceLandmarks, onHandLandmarks, onError]);

  const stopTracking = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    isInitializedRef.current = false;
  }, []);

  useEffect(() => {
    if (webcamRef.current?.video) {
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [webcamRef, startTracking, stopTracking]);

  // Expose methods for external control
  useEffect(() => {
    if (webcamRef.current) {
      (webcamRef.current as any).startTracking = startTracking;
      (webcamRef.current as any).stopTracking = stopTracking;
    }
  }, [startTracking, stopTracking]);

  return null; // This component doesn't render anything
};

export default SimpleMediaPipeTracker;
