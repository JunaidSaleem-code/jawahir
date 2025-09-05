'use client';

import { useEffect, useRef, useCallback } from 'react';

interface MediaPipeTrackerProps {
  webcamRef: React.RefObject<any>;
  onFaceLandmarks?: (landmarks: any) => void;
  onHandLandmarks?: (landmarks: any) => void;
  onError?: (error: string) => void;
}

const MediaPipeTracker = ({ 
  webcamRef, 
  onFaceLandmarks, 
  onHandLandmarks, 
  onError 
}: MediaPipeTrackerProps) => {
  const faceMeshRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const initializeFaceMesh = useCallback(async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      
      const faceMesh = new FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          onFaceLandmarks?.(landmarks);
        }
      });

      faceMeshRef.current = faceMesh;
    } catch (error) {
      console.error('Face mesh initialization error:', error);
      onError?.('Failed to initialize face tracking');
    }
  }, [onFaceLandmarks, onError]);

  const initializeHands = useCallback(async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { Hands } = await import('@mediapipe/hands');
      
      const hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks;
          onHandLandmarks?.(landmarks);
        }
      });

      handsRef.current = hands;
    } catch (error) {
      console.error('Hands initialization error:', error);
      onError?.('Failed to initialize hand tracking');
    }
  }, [onHandLandmarks, onError]);

  const startTracking = useCallback(async () => {
    if (!webcamRef.current?.video || isInitializedRef.current) return;

    try {
      const video = webcamRef.current.video;
      
      // Initialize MediaPipe components
      await initializeFaceMesh();
      await initializeHands();

      // Dynamic import for Camera
      const { Camera } = await import('@mediapipe/camera_utils');

      // Create camera instance
      const camera = new Camera(video, {
        onFrame: async () => {
          if (faceMeshRef.current && handsRef.current) {
            await faceMeshRef.current.send({ image: video });
            await handsRef.current.send({ image: video });
          }
        },
        width: 1280,
        height: 720
      });

      cameraRef.current = camera;
      await camera.start();
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Camera tracking error:', error);
      onError?.('Failed to start camera tracking');
    }
  }, [webcamRef, initializeFaceMesh, initializeHands, onError]);

  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
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

export default MediaPipeTracker;
