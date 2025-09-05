'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@glamgallery.com",
      description: "Get in touch for any inquiries"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Art District, New York, NY 10001",
      description: "Our flagship gallery location"
    },
    {
      icon: Clock,
      title: "Gallery Hours",
      details: "Tue-Sun, 10AM-8PM",
      description: "Closed Mondays"
    }
  ];

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
                Get in <span className="text-gold">Touch</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Have questions about our collection? Need help choosing the perfect piece? 
                We're here to help you find art that speaks to your soul.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="p-6 text-center h-full border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <motion.div
                      className="inline-flex p-4 bg-gradient-gold rounded-2xl mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <info.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <h3 className="text-lg font-semibold text-charcoal mb-2 font-playfair">
                      {info.title}
                    </h3>
                    <p className="text-gold font-medium mb-2">{info.details}</p>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Form & Map */}
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="p-8">
                  <h2 className="text-3xl font-playfair font-bold text-charcoal mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          className="border-gray-200 focus:border-gold focus:ring-gold/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="border-gray-200 focus:border-gold focus:ring-gold/20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What can we help you with?"
                        required
                        className="border-gray-200 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                        className="border-gray-200 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-gold hover:shadow-lg hover:shadow-gold/20 transform hover:scale-105 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Map & Additional Info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Map Placeholder */}
                <Card className="p-0 overflow-hidden">
                  <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
                    <img
                      src="https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Gallery Location"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-sm font-medium text-charcoal">Our Gallery</p>
                      <p className="text-xs text-gray-600">123 Art District, NYC</p>
                    </div>
                  </div>
                </Card>

                {/* FAQ */}
                <Card className="p-6">
                  <h3 className="text-xl font-playfair font-bold text-charcoal mb-4">
                    Frequently Asked
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-charcoal mb-1">Custom sizing available?</h4>
                      <p className="text-sm text-gray-600">Yes, we offer custom sizing for most pieces.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-charcoal mb-1">Shipping timeframe?</h4>
                      <p className="text-sm text-gray-600">3-7 business days for standard orders.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-charcoal mb-1">Return policy?</h4>
                      <p className="text-sm text-gray-600">30-day satisfaction guarantee on all purchases.</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}