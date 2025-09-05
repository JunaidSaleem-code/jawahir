'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail('');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-charcoal to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex p-4 bg-gold/20 rounded-full mb-8"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Mail className="w-8 h-8 text-gold" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
            Stay Inspired with <span className="text-gold">New Arrivals</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Be the first to discover new collections, exclusive offers, and artist spotlights. 
            Join our community of art enthusiasts.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div 
              className="flex-1"
              whileFocus={{ scale: 1.02 }}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 backdrop-blur-sm focus:border-gold focus:ring-gold/20"
                required
              />
            </motion.div>
            
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-gold hover:shadow-lg hover:shadow-gold/20 transform hover:scale-105 transition-all duration-300 h-12 px-8"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center"
                >
                  ✓ Subscribed!
                </motion.div>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}