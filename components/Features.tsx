'use client';

import { motion } from 'framer-motion';
import { Gem, Shield, Truck, Award } from 'lucide-react';

const features = [
  {
    icon: Gem,
    title: "Handcrafted Excellence",
    description: "Each jewelry piece is meticulously crafted by master artisans using traditional techniques and modern precision.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    description: "All jewelry comes with certificates of authenticity and gemstone certification. 100% genuine materials.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Truck,
    title: "Free Pakistan Delivery",
    description: "Secure packaging and free delivery across Pakistan for orders over PKR 50,000. Express delivery available.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Award,
    title: "Premium Materials",
    description: "Only the finest gold, silver, diamonds, and gemstones. Each piece designed to last generations.",
    color: "from-orange-500 to-red-500"
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-charcoal mb-4 luxury-text">
            Why Choose <span className="text-gold">Jawahir & Decor</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the finest jewelry and decor collection with unmatched craftsmanship
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`} />
                
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-charcoal mb-3 font-playfair">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}