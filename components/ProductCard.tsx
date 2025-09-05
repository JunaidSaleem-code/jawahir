'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useARStore } from '@/hooks/use-ar-store';
import { useCart } from '@/components/CartProvider';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWishlist } from '@/hooks/use-wishlist';
import { useReviews } from '@/hooks/use-reviews';
import { RatingDisplay } from '@/components/RatingStars';

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFavorited?: boolean;
}

interface ProductCardProps {
  product: Product;
  index: number;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, index, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(product.isFavorited || false);
  const selectArtwork = useARStore((s) => s.selectArtwork);
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const { getProductStats } = useReviews();
  const stats = getProductStats(product.id);

  if (viewMode === 'list') {
    return (
      <Dialog>
        <motion.div
          className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex">
            <div className="relative w-48 h-60 flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-playfair font-semibold text-xl text-charcoal mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-500 mb-4">by {product.artist}</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-charcoal">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                      Quick View
                    </Button>
                  </DialogTrigger>
                  <Button size="sm" className="bg-gradient-gold" onClick={() => {
                    addItem({ id: product.id, title: product.title, artist: product.artist, price: product.price, image: product.image, size: 'Default' });
                    toast({ title: 'Added to cart', description: `${product.title} by ${product.artist}` });
                  }}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative bg-gray-100 md:h-[28rem]">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="font-playfair text-2xl text-charcoal">{product.title}</DialogTitle>
              </DialogHeader>
              <p className="text-gray-500 mt-1">by {product.artist}</p>
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-2xl font-bold text-charcoal">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button className="bg-gold hover:bg-gold/90" onClick={() => {
                  addItem({ id: product.id, title: product.title, artist: product.artist, price: product.price, image: product.image, size: 'Default' });
                  toast({ title: 'Added to cart', description: `${product.title} by ${product.artist}` });
                }}>
                  <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
                <Link href={`/product/${product.id}`} className="text-sm text-gold hover:underline">View details</Link>
                <Link
                  href="/preview"
                  prefetch={false}
                  onClick={() => selectArtwork({ id: product.id, title: product.title, image: product.image, price: product.price })}
                  className="text-sm text-gray-700 hover:underline"
                >
                  Preview in AR
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        y: -10,
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Badge */}
      {product.isNew && (
        <motion.div
          className="absolute top-4 left-4 z-10 bg-gold text-white px-3 py-1 rounded-full text-xs font-semibold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          NEW
        </motion.div>
      )}

      {/* Favorite Button */}
      <motion.button
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle wishlist"
        onClick={() => {
          setIsFavorited(!isFavorited);
          wishlist.toggle({ id: product.id, title: product.title, artist: product.artist, price: product.price, image: product.image });
        }}
      >
        <Heart 
          size={16} 
          className={`transition-colors duration-300 ${
            wishlist.isWishlisted(product.id) || isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
          }`}
        />
      </motion.button>

      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/5]">
        <motion.img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onMouseEnter={() => {
            try {
              if (typeof window !== 'undefined') {
                const a = document.createElement('link');
                a.rel = 'prefetch';
                a.href = `/product/${product.id}`;
                document.head.appendChild(a);
              }
            } catch {}
          }}
        />
        
        {/* Overlay */}
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center gap-2 px-3 pt-8 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-black hover:bg-white transform hover:scale-105 transition-all duration-300 min-w-[110px] h-9"
              >
                <Eye size={16} className="mr-2" />
                Quick View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative bg-gray-100 md:h-[28rem]">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <DialogHeader>
                    <DialogTitle className="font-playfair text-2xl text-charcoal">{product.title}</DialogTitle>
                  </DialogHeader>
                  <p className="text-gray-500 mt-1">by {product.artist}</p>
                  <div className="flex items-center space-x-2 mt-4">
                    <span className="text-2xl font-bold text-charcoal">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Button className="bg-gold hover:bg-gold/90" onClick={() => {
                      addItem({ id: product.id, title: product.title, artist: product.artist, price: product.price, image: product.image, size: 'Default' });
                      toast({ title: 'Added to cart', description: `${product.title} by ${product.artist}` });
                    }}>
                      <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                    <Link href={`/product/${product.id}`} className="text-sm text-gold hover:underline">View details</Link>
                    <Link
                      href="/preview"
                      prefetch={false}
                      onClick={() => selectArtwork({ id: product.id, title: product.title, image: product.image, price: product.price })}
                      className="text-sm text-gray-700 hover:underline"
                    >
                      Preview in AR
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            size="sm"
            className="bg-gold hover:bg-gold/90 transform hover:scale-105 transition-all duration-300 min-w-[110px] h-9"
            onClick={() => {
              addItem({
                id: product.id,
                title: product.title,
                artist: product.artist,
                price: product.price,
                image: product.image,
                size: 'Default'
              });
              toast({
                title: 'Added to cart',
                description: `${product.title} by ${product.artist}`,
              });
            }}
          >
            <ShoppingBag size={16} className="mr-2" />
            Add to Cart
          </Button>
        </motion.div>
      </div>

      {/* Product Info */}
      <motion.div 
        className="p-6"
        animate={{
          y: isHovered ? -5 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-playfair font-semibold text-lg text-charcoal leading-tight">
              {product.title}
            </h3>
            <p className="text-gray-500 text-sm mt-1">by {product.artist}</p>
            <div className="mt-1"><RatingDisplay value={stats.average} count={stats.count} /></div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-charcoal">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            href="/preview"
            prefetch={false}
            onClick={() => selectArtwork({ id: product.id, title: product.title, image: product.image, price: product.price })}
            className="text-sm text-gold hover:underline"
          >
            Preview in your space
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}