'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface SimpleARTrackerProps {
  webcamRef: React.RefObject<any>;
  onFaceLandmarks?: (landmarks: any) => void;
  onHandLandmarks?: (landmarks: any) => void;
  onError?: (error: string) => void;
}

const SimpleARTracker = ({
  webcamRef,
  onFaceLandmarks,
  onHandLandmarks,
  onError
}: SimpleARTrackerProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startSimpleTracking = useCallback(() => {
    if (!webcamRef.current?.video) return;

    console.log("Simple AR tracking started");
    setIsTracking(true);

    // Clear any previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Simulate face and hand landmarks for basic positioning
    const simulateLandmarks = () => {
      const video = webcamRef.current?.video;
      if (!video) return;

      const videoWidth = video.videoWidth || 1280;
      const videoHeight = video.videoHeight || 720;

      // Simulate face landmarks (simplified face detection)
      const mockFaceLandmarks = {
        landmarks: [
          // Left ear area (simplified)
          { x: 0.2, y: 0.4, z: 0 },
          // Right ear area (simplified)  
          { x: 0.8, y: 0.4, z: 0 },
          // Chin area (for necklaces)
          { x: 0.5, y: 0.7, z: 0 },
          // More face points for better tracking
          { x: 0.3, y: 0.3, z: 0 },
          { x: 0.7, y: 0.3, z: 0 },
          { x: 0.5, y: 0.5, z: 0 }
        ]
      };

      // Simulate hand landmarks (simplified hand detection)
      const mockHandLandmarks = [
        {
          landmarks: [
            // Finger tips for ring positioning
            { x: 0.6, y: 0.6, z: 0 }, // Index finger tip
            { x: 0.65, y: 0.65, z: 0 }, // Middle finger tip
            { x: 0.7, y: 0.6, z: 0 }, // Ring finger tip
            { x: 0.75, y: 0.65, z: 0 }, // Pinky tip
            { x: 0.55, y: 0.65, z: 0 } // Thumb tip
          ]
        }
      ];

      onFaceLandmarks?.(mockFaceLandmarks);
      onHandLandmarks?.(mockHandLandmarks);
    };

    // Run simulation immediately
    simulateLandmarks();

    // Update landmarks periodically
    intervalRef.current = setInterval(simulateLandmarks, 100);
  }, [webcamRef, onFaceLandmarks, onHandLandmarks]);

  const stopSimpleTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    console.log("Simple AR tracking stopped");
  }, []);

  useEffect(() => {
    startSimpleTracking();
    return () => {
      stopSimpleTracking();
    };
  }, [startSimpleTracking, stopSimpleTracking]);

  return null;
};

export default SimpleARTracker;
