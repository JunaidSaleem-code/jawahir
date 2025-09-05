'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

const products = MOCK_PRODUCTS;

const categories = ['All', 'Abstract', 'Photography', 'Landscape', 'Minimalist', 'Nature', 'Urban'];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleProducts, setVisibleProducts] = useState(8);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  return (
    <section id="collections" className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-4">
            Featured <span className="text-gold">Collection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked masterpieces from renowned artists around the world
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gold text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          layout
        >
          {displayedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </motion.div>

        {/* Load More Button */}
        {visibleProducts < filteredProducts.length && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white transform hover:scale-105 transition-all duration-300"
              onClick={() => setVisibleProducts(prev => prev + 4)}
            >
              Load More Artworks
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}