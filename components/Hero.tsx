'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  const floatingElements = [
    { id: 1, top: '10%', left: '5%', delay: 0 },
    { id: 2, top: '20%', right: '10%', delay: 0.5 },
    { id: 3, bottom: '30%', left: '8%', delay: 1 },
    { id: 4, top: '60%', right: '5%', delay: 1.5 },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-cream via-warm-white to-white overflow-hidden">
      {/* Floating Art Pieces */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute w-20 h-24 bg-gradient-to-br from-gold/20 to-gold/40 rounded-lg shadow-lg"
          style={{
            top: element.top,
            left: element.left,
            right: element.right,
            bottom: element.bottom,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -20, 0],
          }}
          transition={{
            duration: 2,
            delay: element.delay,
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-cormorant font-bold text-charcoal leading-tight luxury-text"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Exquisite
              <span className="block bg-gradient-gold bg-clip-text text-transparent">
                Jewelry
              </span>
              & Elegant Decor
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mt-6 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Discover our curated collection of luxury jewelry and home decor pieces. 
              From precious gemstones to elegant home accents, find the perfect 
              pieces to add beauty and sophistication to your life.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-gradient-gold hover:shadow-lg hover:shadow-gold/20 transform hover:scale-105 transition-all duration-300 text-white font-semibold"
                >
                  Shop Collection
                </Button>
              </Link>
              
              <Link href="/ar-tryon">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gold text-gold hover:bg-gold hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  AR Try-On
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Featured Jewelry & Decor Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative grid grid-cols-2 gap-4">
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl card-3d"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  z: 20
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image src="https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Diamond Ring" width={600} height={600} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-semibold">Diamond Solitaire</p>
                  <p className="text-xs">PKR 45,000</p>
                </div>
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl card-3d mt-8"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5,
                  rotateX: 5,
                  z: 20
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Crystal Chandelier" width={600} height={600} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-semibold">Crystal Chandelier</p>
                  <p className="text-xs">PKR 15,000</p>
                </div>
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl card-3d -mt-4"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: -5,
                  z: 20
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image src="https://images.pexels.com/photos/3373735/pexels-photo-3373735.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Pearl Earrings" width={600} height={600} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-semibold">Pearl Earrings</p>
                  <p className="text-xs">PKR 18,000</p>
                </div>
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl card-3d mt-4"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5,
                  rotateX: -5,
                  z: 20
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image src="https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Vintage Mirror" width={600} height={600} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-semibold">Vintage Mirror</p>
                  <p className="text-xs">PKR 8,500</p>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-32 h-32 bg-gold/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 flex flex-col items-center"
          >
            <span className="text-sm mb-2">Explore Collection</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}