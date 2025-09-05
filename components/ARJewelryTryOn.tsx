'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Webcam from 'react-webcam';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

interface JewelryItem {
  id: string;
  name: string;
  type: 'earring' | 'necklace' | 'ring';
  imageUrl?: string;
  modelUrl?: string;
  scale: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

interface FaceLandmarks {
  landmarks: Array<{ x: number; y: number; z: number }>;
  mesh: Array<{ x: number; y: number; z: number }>;
}

interface HandLandmarks {
  landmarks: Array<{ x: number; y: number; z: number }>;
  handedness: 'Left' | 'Right';
}

interface ARJewelryTryOnProps {
  jewelryItems: JewelryItem[];
  onJewelrySelect?: (jewelry: JewelryItem) => void;
  selectedJewelry?: JewelryItem | null;
  enable3D?: boolean;
  className?: string;
}

// 3D Jewelry Component
const Jewelry3D: React.FC<{
  jewelry: JewelryItem;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
}> = ({ jewelry, position, rotation, scale }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Add subtle animation
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial
        color={jewelry.type === 'earring' ? '#FFD700' : jewelry.type === 'necklace' ? '#C0C0C0' : '#FF6B6B'}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

// 2D Jewelry Overlay Component
const Jewelry2D: React.FC<{
  jewelry: JewelryItem;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}> = ({ jewelry, position, scale, rotation, canvasRef }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (jewelry.imageUrl && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageRef.current = img;
        drawJewelry();
      };
      img.src = jewelry.imageUrl;
    }
  }, [jewelry.imageUrl]);

  const drawJewelry = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous jewelry
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Move to jewelry position
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // Draw jewelry image
    const img = imageRef.current;
    const imgWidth = img.width * 0.1; // Scale down
    const imgHeight = img.height * 0.1;
    
    ctx.drawImage(
      img,
      -imgWidth / 2,
      -imgHeight / 2,
      imgWidth,
      imgHeight
    );

    // Restore context
    ctx.restore();
  }, [position, scale, rotation, canvasRef]);

  useEffect(() => {
    drawJewelry();
  }, [drawJewelry]);

  return null;
};

// Main AR Component
const ARJewelryTryOn: React.FC<ARJewelryTryOnProps> = ({
  jewelryItems,
  onJewelrySelect,
  selectedJewelry,
  enable3D = false,
  className = ''
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const selfieSegmentationRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [faceLandmarks, setFaceLandmarks] = useState<FaceLandmarks | null>(null);
  const [handLandmarks, setHandLandmarks] = useState<HandLandmarks[]>([]);
  const [segmentationMask, setSegmentationMask] = useState<ImageData | null>(null);
  const [jewelryPositions, setJewelryPositions] = useState<Map<string, { x: number; y: number; z: number; rotation: number; scale: number }>>(new Map());

  // Initialize MediaPipe components
  const initializeMediaPipe = useCallback(async () => {
    try {
      // Initialize Face Mesh
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      faceMeshRef.current = new FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMeshRef.current.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          setFaceLandmarks({
            landmarks: landmarks.map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z })),
            mesh: results.multiFaceLandmarks[0]
          });
          setIsTracking(true);
        } else {
          setIsTracking(false);
        }
      });

      // Initialize Hands
      const { Hands } = await import('@mediapipe/hands');
      handsRef.current = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      handsRef.current.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      handsRef.current.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const hands = results.multiHandLandmarks.map((hand: any, index: number) => ({
            landmarks: hand.map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z })),
            handedness: results.multiHandedness[index]?.label || 'Right'
          }));
          setHandLandmarks(hands);
        }
      });

      // Initialize Selfie Segmentation
      const { SelfieSegmentation } = await import('@mediapipe/selfie_segmentation');
      selfieSegmentationRef.current = new SelfieSegmentation({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
      });

      selfieSegmentationRef.current.setOptions({
        modelSelection: 1, // General model
        selfieMode: true
      });

      selfieSegmentationRef.current.onResults((results: any) => {
        if (results.segmentationMask) {
          setSegmentationMask(results.segmentationMask);
        }
      });

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize MediaPipe:', error);
    }
  }, []);

  // Start camera and tracking
  const startTracking = useCallback(async () => {
    if (!webcamRef.current?.video || !isInitialized) return;

    const video = webcamRef.current.video;
    
    const { Camera } = await import('@mediapipe/camera_utils');
    cameraRef.current = new Camera(video, {
      onFrame: async () => {
        if (faceMeshRef.current && handsRef.current && selfieSegmentationRef.current) {
          await faceMeshRef.current.send({ image: video });
          await handsRef.current.send({ image: video });
          await selfieSegmentationRef.current.send({ image: video });
        }
      },
      width: 1280,
      height: 720
    });

    await cameraRef.current.start();
  }, [isInitialized]);

  // Calculate jewelry positions based on landmarks
  const calculateJewelryPositions = useCallback(() => {
    if (!faceLandmarks && handLandmarks.length === 0) return;

    const newPositions = new Map<string, { x: number; y: number; z: number; rotation: number; scale: number }>();

    // Calculate positions for each jewelry item
    jewelryItems.forEach((jewelry) => {
      if (jewelry.type === 'earring' && faceLandmarks) {
        // Use ear landmarks (approximate positions)
        const leftEar = faceLandmarks.landmarks[234]; // Left ear
        const rightEar = faceLandmarks.landmarks[454]; // Right ear
        
        if (leftEar) {
          newPositions.set(`${jewelry.id}-left`, {
            x: leftEar.x * (canvasRef.current?.width || 1280),
            y: leftEar.y * (canvasRef.current?.height || 720),
            z: leftEar.z,
            rotation: 0,
            scale: 0.8
          });
        }
        
        if (rightEar) {
          newPositions.set(`${jewelry.id}-right`, {
            x: rightEar.x * (canvasRef.current?.width || 1280),
            y: rightEar.y * (canvasRef.current?.height || 720),
            z: rightEar.z,
            rotation: 0,
            scale: 0.8
          });
        }
      } else if (jewelry.type === 'necklace' && faceLandmarks) {
        // Use chin/jawline landmarks
        const chin = faceLandmarks.landmarks[152]; // Chin
        if (chin) {
          newPositions.set(jewelry.id, {
            x: chin.x * (canvasRef.current?.width || 1280),
            y: (chin.y + 0.1) * (canvasRef.current?.height || 720), // Below chin
            z: chin.z,
            rotation: 0,
            scale: 1.2
          });
        }
      } else if (jewelry.type === 'ring' && handLandmarks.length > 0) {
        // Use finger landmarks
        handLandmarks.forEach((hand, handIndex) => {
          const fingerTip = hand.landmarks[8]; // Index finger tip
          if (fingerTip) {
            newPositions.set(`${jewelry.id}-hand-${handIndex}`, {
              x: fingerTip.x * (canvasRef.current?.width || 1280),
              y: fingerTip.y * (canvasRef.current?.height || 720),
              z: fingerTip.z,
              rotation: 0,
              scale: 0.6
            });
          }
        });
      }
    });

    setJewelryPositions(newPositions);
  }, [faceLandmarks, handLandmarks, jewelryItems]);

  // Update jewelry positions when landmarks change
  useEffect(() => {
    calculateJewelryPositions();
  }, [calculateJewelryPositions]);

  // Initialize MediaPipe on mount
  useEffect(() => {
    initializeMediaPipe();
  }, [initializeMediaPipe]);

  // Start tracking when camera is ready
  useEffect(() => {
    if (isInitialized) {
      startTracking();
    }
  }, [isInitialized, startTracking]);

  // Set canvas size to match video
  useEffect(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Camera Feed */}
      <Webcam
        ref={webcamRef}
        audio={false}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user"
        }}
        mirrored={true}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 3D Scene */}
      {enable3D && (
        <div className="absolute inset-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="studio" />
            
            {selectedJewelry && jewelryPositions.has(selectedJewelry.id) && (
              <Jewelry3D
                jewelry={selectedJewelry}
                position={new THREE.Vector3(
                  jewelryPositions.get(selectedJewelry.id)?.x || 0,
                  jewelryPositions.get(selectedJewelry.id)?.y || 0,
                  jewelryPositions.get(selectedJewelry.id)?.z || 0
                )}
                rotation={new THREE.Euler(
                  jewelryPositions.get(selectedJewelry.id)?.rotation || 0,
                  0,
                  0
                )}
                scale={jewelryPositions.get(selectedJewelry.id)?.scale || 1}
              />
            )}
          </Canvas>
        </div>
      )}

      {/* 2D Jewelry Overlay */}
      {!enable3D && selectedJewelry && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

      {/* 2D Jewelry Rendering */}
      {!enable3D && selectedJewelry && jewelryPositions.has(selectedJewelry.id) && (
        <Jewelry2D
          jewelry={selectedJewelry}
          position={{
            x: jewelryPositions.get(selectedJewelry.id)?.x || 0,
            y: jewelryPositions.get(selectedJewelry.id)?.y || 0
          }}
          scale={jewelryPositions.get(selectedJewelry.id)?.scale || 1}
          rotation={jewelryPositions.get(selectedJewelry.id)?.rotation || 0}
          canvasRef={canvasRef}
        />
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm">
          <div>Status: {isTracking ? 'Tracking' : 'Not Tracking'}</div>
          <div>Face Landmarks: {faceLandmarks?.landmarks.length || 0}</div>
          <div>Hand Landmarks: {handLandmarks.length}</div>
          <div>Jewelry Positions: {jewelryPositions.size}</div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
        <button
          onClick={() => onJewelrySelect?.(jewelryItems[0])}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Select Earring
        </button>
        <button
          onClick={() => onJewelrySelect?.(jewelryItems[1])}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Select Necklace
        </button>
        <button
          onClick={() => onJewelrySelect?.(jewelryItems[2])}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Select Ring
        </button>
        <button
          onClick={() => onJewelrySelect?.(null)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ARJewelryTryOn;
