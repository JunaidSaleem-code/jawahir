"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => `${p.title} ${p.artist} ${p.category}`.toLowerCase().includes(term));
  }, [q]);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-playfair font-bold text-charcoal">Search</h1>
          <div className="mt-4">
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search artworks or artists..." className="max-w-xl" />
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8" layout>
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p as any} index={i} />
            ))}
          </motion.div>
          {results.length===0 && <div className="text-gray-600 mt-8">No results.</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}


