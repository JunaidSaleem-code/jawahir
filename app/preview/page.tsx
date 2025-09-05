'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StaticPreview from '@/components/StaticPreview';
import CameraPreview from '@/components/CameraPreview';
import { useARStore } from '@/hooks/use-ar-store';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import ArtworkSelector from '@/components/ArtworkSelector';

export default function PreviewPage() {
  const { reset, selectedArtwork, selectArtwork } = useARStore();
  const [mode, setMode] = useState<'camera' | 'photo'>('camera');

  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Preview in your space</h1>
            <Button variant="outline" onClick={reset}>
              <X className="w-4 h-4 mr-2" /> Exit
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {!selectedArtwork && (
                <div className="p-6 text-center text-gray-600 border rounded-lg">
                  Select an artwork from the right to start the preview.
                </div>
              )}
              {selectedArtwork && mode === 'camera' && <CameraPreview />}
              {selectedArtwork && mode === 'photo' && <StaticPreview />}
            </div>
            <div>
              <h2 className="font-medium mb-3">Choose artwork</h2>
              <ArtworkSelector selectedArtwork={selectedArtwork as any} onArtworkSelect={(art) => selectArtwork(art)} />
              <div className="mt-6 space-x-2">
                <Button variant={mode === 'camera' ? 'default' : 'outline'} onClick={() => setMode('camera')}>Camera</Button>
                <Button variant={mode === 'photo' ? 'default' : 'outline'} onClick={() => setMode('photo')}>Photo</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


