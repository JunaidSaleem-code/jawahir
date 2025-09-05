'use client';

import { motion } from 'framer-motion';
import { Award, Users, Globe, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const values = [
  {
    icon: Award,
    title: "Quality Excellence",
    description: "We partner with renowned artists and use only premium materials to ensure every piece meets museum-quality standards."
  },
  {
    icon: Users,
    title: "Artist Community",
    description: "Supporting emerging and established artists worldwide, providing them with a platform to showcase their incredible talent."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Bringing beautiful art to homes across the world with secure shipping and local partnerships in over 45 countries."
  },
  {
    icon: Heart,
    title: "Passion Driven",
    description: "Every decision we make is guided by our love for art and our commitment to helping people create spaces they adore."
  }
];

const team = [
  {
    name: "Alexandra Chen",
    role: "Founder & CEO",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Former gallery director with 15 years of experience in contemporary art curation."
  },
  {
    name: "Marcus Rodriguez",
    role: "Head of Artist Relations",
    image: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Connecting with artists globally to bring diverse perspectives to our collection."
  },
  {
    name: "Sarah Kim",
    role: "Creative Director",
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Interior design expert ensuring every piece complements modern living spaces."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-cream to-warm-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-playfair font-bold text-charcoal mb-6">
                Our <span className="text-gold">Story</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Founded in 2018, GlamGallery began as a passion project to make exceptional art 
                accessible to everyone. We believe that beautiful art has the power to transform 
                not just spaces, but lives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-playfair font-bold text-charcoal mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We're on a mission to democratize art ownership and make beautiful, 
                  high-quality artwork accessible to art lovers everywhere. Through our 
                  carefully curated collection and innovative technology, we're bridging 
                  the gap between artists and art enthusiasts.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Every piece in our collection is selected not just for its aesthetic 
                  appeal, but for its ability to evoke emotion and create meaningful 
                  connections between the artwork and its new home.
                </p>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Art Gallery"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                
                {/* Floating Stats */}
                <motion.div
                  className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl font-bold text-gold">250+</div>
                  <div className="text-sm text-gray-600">Featured Artists</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-playfair font-bold text-charcoal mb-4">
                Our <span className="text-gold">Values</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                    <motion.div
                      className="inline-flex p-4 bg-gradient-gold rounded-2xl mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <value.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-charcoal mb-4 font-playfair">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-playfair font-bold text-charcoal mb-4">
                Meet Our <span className="text-gold">Team</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Passionate art enthusiasts dedicated to bringing you the finest collection
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <motion.div
                      className="relative mb-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gold/20"
                      />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-charcoal mb-2 font-playfair">
                      {member.name}
                    </h3>
                    <p className="text-gold font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}