'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function RatingDisplay({ value, count }: { value: number; count?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const active = i < full || (i === full && half);
    return (
      <Star key={i} className={`w-4 h-4 ${active ? 'fill-gold text-gold' : 'text-gray-300'}`} />
    );
  });
  return (
    <div className="flex items-center gap-1">
      {stars}
      {count !== undefined && <span className="text-xs text-gray-500">({count})</span>}
    </div>
  );
}

export function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onChange(i + 1)}
          whileHover={{ scale: 1.1 }}
          className="p-1"
          aria-label={`Rate ${i + 1} star${i ? 's' : ''}`}
        >
          <Star className={`w-5 h-5 ${i < value ? 'fill-gold text-gold' : 'text-gray-300'}`} />
        </motion.button>
      ))}
    </div>
  );
}


