'use client';

import React, { useState } from 'react';
import OptimizedARJewelryTryOn from '@/components/OptimizedARJewelryTryOn';

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

const jewelryItems: JewelryItem[] = [
  {
    id: 'diamond-earring',
    name: 'Diamond Stud Earrings',
    type: 'earring',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'pearl-necklace',
    name: 'Pearl Choker Necklace',
    type: 'necklace',
    imageUrl: 'https://images.unsplash.com/photo-1596944924616-7b384c9dc7b3?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'gold-ring',
    name: 'Gold Wedding Ring',
    type: 'ring',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  }
];

export default function ARDemoPage() {
  const [selectedJewelry, setSelectedJewelry] = useState<JewelryItem | null>(null);
  const [enable3D, setEnable3D] = useState(false);

  const handleJewelrySelect = (jewelry: JewelryItem | null) => {
    setSelectedJewelry(jewelry);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AR Jewelry Try-On Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Experience virtual jewelry try-on with real-time face and hand tracking
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setEnable3D(!enable3D)}
              className={`px-6 py-3 rounded-lg font-medium ${
                enable3D 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {enable3D ? '3D Mode' : '2D Mode'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AR View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  AR Camera View
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedJewelry 
                    ? `Showing: ${selectedJewelry.name}` 
                    : 'Select jewelry below to see AR try-on'
                  }
                </p>
              </div>
              
              <div className="relative aspect-video bg-gray-900">
                <OptimizedARJewelryTryOn
                  jewelryItems={jewelryItems}
                  onJewelrySelect={handleJewelrySelect}
                  selectedJewelry={selectedJewelry}
                  enable3D={enable3D}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Jewelry Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Select Jewelry
              </h3>
              
              <div className="space-y-3">
                {jewelryItems.map((jewelry) => (
                  <button
                    key={jewelry.id}
                    onClick={() => handleJewelrySelect(jewelry)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedJewelry?.id === jewelry.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {jewelry.imageUrl && (
                        <img
                          src={jewelry.imageUrl}
                          alt={jewelry.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="text-left">
                        <div className="font-medium text-gray-800">
                          {jewelry.name}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {jewelry.type}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={() => handleJewelrySelect(null)}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-600"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                How to Use
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-medium text-gray-800">Allow Camera Access</p>
                    <p>Grant permission when prompted to enable AR tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-medium text-gray-800">Position Yourself</p>
                    <p>For earrings/necklaces: Look at camera. For rings: Show your hands</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-medium text-gray-800">Select Jewelry</p>
                    <p>Choose from the jewelry options to see AR try-on</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <div>
                    <p className="font-medium text-gray-800">Move Naturally</p>
                    <p>Jewelry will follow your face and hand movements in real-time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Features
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Real-time face tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Hand gesture recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Natural jewelry positioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>2D and 3D rendering modes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Mobile and desktop support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Selfie segmentation for realism</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
