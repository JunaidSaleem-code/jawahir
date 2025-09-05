'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface EnhancedMediaPipeTrackerProps {
  webcamRef: React.RefObject<any>;
  onFaceLandmarks?: (landmarks: any) => void;
  onHandLandmarks?: (landmarks: any) => void;
  onError?: (error: string) => void;
}

const EnhancedMediaPipeTracker = ({
  webcamRef,
  onFaceLandmarks,
  onHandLandmarks,
  onError
}: EnhancedMediaPipeTrackerProps) => {
  const faceMeshRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const [isTracking, setIsTracking] = useState(false);

  const initializeFaceMesh = useCallback(async () => {
    try {
      const faceMeshModule = await import('@mediapipe/face_mesh');
      const FaceMesh = faceMeshModule.FaceMesh || faceMeshModule.default?.FaceMesh;
      
      if (!FaceMesh) {
        throw new Error('FaceMesh not available');
      }
      
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
          setIsTracking(true);
        } else {
          setIsTracking(false);
        }
      });

      faceMeshRef.current = faceMesh;
    } catch (error) {
      console.error('Failed to initialize FaceMesh:', error);
      onError?.('Face detection initialization failed');
    }
  }, [onFaceLandmarks, onError]);

  const initializeHands = useCallback(async () => {
    try {
      const handsModule = await import('@mediapipe/hands');
      const Hands = handsModule.Hands || handsModule.default?.Hands;
      
      if (!Hands) {
        throw new Error('Hands not available');
      }
      
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
          onHandLandmarks?.(results.multiHandLandmarks);
        }
      });

      handsRef.current = hands;
    } catch (error) {
      console.error('Failed to initialize Hands:', error);
      onError?.('Hand detection initialization failed');
    }
  }, [onHandLandmarks, onError]);

  const startTracking = useCallback(async () => {
    if (!webcamRef.current?.video || isInitializedRef.current) return;

    try {
      const video = webcamRef.current.video;

      await initializeFaceMesh();
      await initializeHands();

      const cameraModule = await import('@mediapipe/camera_utils');
      const Camera = cameraModule.Camera || cameraModule.default?.Camera;
      
      if (!Camera) {
        throw new Error('Camera not available');
      }
      
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
      
      console.log('Enhanced MediaPipe tracking started');
    } catch (error) {
      console.error('Failed to start tracking:', error);
      onError?.('Failed to start AR tracking');
    }
  }, [webcamRef, initializeFaceMesh, initializeHands, onError]);

  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    isInitializedRef.current = false;
    setIsTracking(false);
    console.log('Enhanced MediaPipe tracking stopped');
  }, []);

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  return null;
};

export default EnhancedMediaPipeTracker;
