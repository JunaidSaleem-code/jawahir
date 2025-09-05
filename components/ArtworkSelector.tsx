'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const artworks = [
  {
    id: 1,
    title: "Abstract Harmony",
    artist: "Elena Rodriguez",
    price: 299,
    image: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Abstract",
  },
  {
    id: 2,
    title: "Urban Reflections",
    artist: "Marcus Chen",
    price: 249,
    image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Photography",
  },
  {
    id: 3,
    title: "Serene Mountains",
    artist: "Sarah Johnson",
    price: 199,
    image: "https://images.pexels.com/photos/1974973/pexels-photo-1974973.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Landscape",
  },
  {
    id: 4,
    title: "Golden Hour",
    artist: "David Kim",
    price: 349,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Photography",
  },
];

interface ArtworkSelectorProps {
  selectedArtwork: any;
  onArtworkSelect: (artwork: any) => void;
}

export default function ArtworkSelector({ selectedArtwork, onArtworkSelect }: ArtworkSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
            selectedArtwork?.id === artwork.id
              ? 'border-gold shadow-lg shadow-gold/20'
              : 'border-gray-200 hover:border-gold/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onArtworkSelect(artwork)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full aspect-[4/5] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <h4 className="text-white text-xs font-semibold truncate">
              {artwork.title}
            </h4>
            <p className="text-white/80 text-xs">${artwork.price}</p>
          </div>
          
          {selectedArtwork?.id === artwork.id && (
            <motion.div
              className="absolute inset-0 border-2 border-gold rounded-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}