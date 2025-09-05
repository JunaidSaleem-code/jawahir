'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Fatima Khan",
    role: "Jewelry Designer",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 5,
    text: "The craftsmanship is absolutely stunning! I've been buying from Jawahir & Decor for years. Each piece is a work of art that I treasure. The AR try-on feature is amazing too!"
  },
  {
    id: 2,
    name: "Ahmed Ali",
    role: "Business Owner",
    image: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 5,
    text: "I bought a diamond ring for my wife's anniversary. The quality and authenticity certificate gave me complete confidence. The delivery was fast and secure across Pakistan."
  },
  {
    id: 3,
    name: "Ayesha Sheikh",
    role: "Fashion Enthusiast",
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 5,
    text: "The pearl earrings I bought are simply gorgeous! The AR try-on helped me see how they would look before purchasing. Customer service is excellent and very helpful."
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-cream to-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-charcoal mb-4 luxury-text">
            What Our <span className="text-gold">Customers</span> Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from jewelry lovers who've found their perfect pieces
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
              }}
            >
              {/* Quote Icon */}
              <motion.div
                className="absolute top-4 right-4 text-gold/20"
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Quote size={32} />
              </motion.div>

              {/* Profile */}
              <div className="flex items-center mb-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold/20"
                  />
                </motion.div>
                <div className="ml-4">
                  <h4 className="font-semibold text-charcoal font-playfair">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 text-gold fill-current" />
                  </motion.div>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}