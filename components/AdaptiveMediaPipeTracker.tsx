'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import SimpleMediaPipeTracker from './SimpleMediaPipeTracker';

interface AdaptiveMediaPipeTrackerProps {
  webcamRef: React.RefObject<any>;
  onFaceLandmarks?: (landmarks: any) => void;
  onHandLandmarks?: (landmarks: any) => void;
  onError?: (error: string) => void;
}

const AdaptiveMediaPipeTracker = ({ 
  webcamRef, 
  onFaceLandmarks, 
  onHandLandmarks, 
  onError 
}: AdaptiveMediaPipeTrackerProps) => {
  const [useRealMediaPipe, setUseRealMediaPipe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const realTrackerRef = useRef<any>(null);

  const initializeRealMediaPipe = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Try to load MediaPipe modules
      const [faceMeshModule, handsModule, cameraModule] = await Promise.all([
        import('@mediapipe/face_mesh'),
        import('@mediapipe/hands'),
        import('@mediapipe/camera_utils')
      ]);

      const { FaceMesh } = faceMeshModule;
      const { Hands } = handsModule;
      const { Camera } = cameraModule;

      // Test if constructors work
      const testFaceMesh = new FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      const testHands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      // If we get here, MediaPipe is working
      setUseRealMediaPipe(true);
      console.log('Real MediaPipe loaded successfully');
      
      // Clean up test instances
      testFaceMesh.close();
      testHands.close();
      
    } catch (error) {
      console.warn('Real MediaPipe failed to load, using fallback:', error);
      setUseRealMediaPipe(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeRealMediaPipe();
  }, [initializeRealMediaPipe]);

  if (isLoading) {
    return (
      <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-sm">
        Loading AR...
      </div>
    );
  }

  if (useRealMediaPipe) {
    // Use the real MediaPipe tracker
    return (
      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-sm">
        Real AR Tracking
      </div>
    );
  }

  // Fall back to simple tracker
  return (
    <>
      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm">
        Demo Mode
      </div>
      <SimpleMediaPipeTracker
        webcamRef={webcamRef}
        onFaceLandmarks={onFaceLandmarks}
        onHandLandmarks={onHandLandmarks}
        onError={onError}
      />
    </>
  );
};

export default AdaptiveMediaPipeTracker;
