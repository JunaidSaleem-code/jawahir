'use client';

import { useRef, useCallback, useEffect } from 'react';

interface MediaPipeManagerProps {
  onFaceLandmarks?: (landmarks: any) => void;
  onHandLandmarks?: (landmarks: any) => void;
  onSegmentationMask?: (mask: ImageData) => void;
  onError?: (error: string) => void;
}

export const useMediaPipeManager = ({
  onFaceLandmarks,
  onHandLandmarks,
  onSegmentationMask,
  onError
}: MediaPipeManagerProps) => {
  const faceMeshRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const selfieSegmentationRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const initializeFaceMesh = useCallback(async () => {
    try {
      const faceMeshModule = await import('@mediapipe/face_mesh');
      const FaceMesh = faceMeshModule.FaceMesh || faceMeshModule.default?.FaceMesh;
      
      if (!FaceMesh) {
        throw new Error('FaceMesh not available');
      }

      const faceMesh = new FaceMesh({
        locateFile: (file: string) => 
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
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
      return true;
    } catch (error) {
      console.error('Failed to initialize FaceMesh:', error);
      onError?.('Face detection initialization failed');
      return false;
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
        locateFile: (file: string) => 
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const hands = results.multiHandLandmarks.map((hand: any, index: number) => ({
            landmarks: hand.map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z })),
            handedness: results.multiHandedness[index]?.label || 'Right'
          }));
          onHandLandmarks?.(hands);
        }
      });

      handsRef.current = hands;
      return true;
    } catch (error) {
      console.error('Failed to initialize Hands:', error);
      onError?.('Hand detection initialization failed');
      return false;
    }
  }, [onHandLandmarks, onError]);

  const initializeSelfieSegmentation = useCallback(async () => {
    try {
      const segmentationModule = await import('@mediapipe/selfie_segmentation');
      const SelfieSegmentation = segmentationModule.SelfieSegmentation || segmentationModule.default?.SelfieSegmentation;
      
      if (!SelfieSegmentation) {
        throw new Error('SelfieSegmentation not available');
      }

      const selfieSegmentation = new SelfieSegmentation({
        locateFile: (file: string) => 
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
      });

      selfieSegmentation.setOptions({
        modelSelection: 1,
        selfieMode: true
      });

      selfieSegmentation.onResults((results: any) => {
        if (results.segmentationMask) {
          onSegmentationMask?.(results.segmentationMask);
        }
      });

      selfieSegmentationRef.current = selfieSegmentation;
      return true;
    } catch (error) {
      console.error('Failed to initialize SelfieSegmentation:', error);
      onError?.('Segmentation initialization failed');
      return false;
    }
  }, [onSegmentationMask, onError]);

  const initializeAll = useCallback(async () => {
    if (isInitializedRef.current) return true;

    try {
      const [faceMeshSuccess, handsSuccess, segmentationSuccess] = await Promise.all([
        initializeFaceMesh(),
        initializeHands(),
        initializeSelfieSegmentation()
      ]);

      isInitializedRef.current = faceMeshSuccess && handsSuccess && segmentationSuccess;
      return isInitializedRef.current;
    } catch (error) {
      console.error('Failed to initialize MediaPipe components:', error);
      onError?.('MediaPipe initialization failed');
      return false;
    }
  }, [initializeFaceMesh, initializeHands, initializeSelfieSegmentation, onError]);

  const startTracking = useCallback(async (video: HTMLVideoElement) => {
    if (!isInitializedRef.current) {
      const initialized = await initializeAll();
      if (!initialized) return false;
    }

    try {
      const cameraModule = await import('@mediapipe/camera_utils');
      const Camera = cameraModule.Camera || cameraModule.default?.Camera;
      
      if (!Camera) {
        throw new Error('Camera not available');
      }

      const camera = new Camera(video, {
        onFrame: async () => {
          if (faceMeshRef.current && handsRef.current && selfieSegmentationRef.current) {
            await Promise.all([
              faceMeshRef.current.send({ image: video }),
              handsRef.current.send({ image: video }),
              selfieSegmentationRef.current.send({ image: video })
            ]);
          }
        },
        width: 1280,
        height: 720
      });

      cameraRef.current = camera;
      await camera.start();
      return true;
    } catch (error) {
      console.error('Failed to start tracking:', error);
      onError?.('Failed to start AR tracking');
      return false;
    }
  }, [initializeAll, onError]);

  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    stopTracking();
    faceMeshRef.current = null;
    handsRef.current = null;
    selfieSegmentationRef.current = null;
    isInitializedRef.current = false;
  }, [stopTracking]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    initializeAll,
    startTracking,
    stopTracking,
    cleanup,
    isInitialized: isInitializedRef.current
  };
};
