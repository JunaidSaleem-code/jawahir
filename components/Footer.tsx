'use client';

import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRuntimePublicConfig } from '@/lib/public-config';

const footerLinks: Record<string, { label: string; href: string }[]> = {
  'Shop': [
    { label: 'All Artworks', href: '/shop' },
    { label: 'Abstract', href: '/shop/abstract' },
    { label: 'Photography', href: '/shop/photography' },
    { label: 'Minimalist', href: '/shop/minimalist' },
    { label: 'Custom Orders', href: '/shop/custom-orders' }
  ],
  'Support': [
    { label: 'FAQ', href: '/support/faq' },
    { label: 'Shipping Info', href: '/support/shipping' },
    { label: 'Returns', href: '/support/returns' },
    { label: 'Size Guide', href: '/support/size-guide' },
    { label: 'Contact Us', href: '/contact' }
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Our Artists', href: '/company/artists' },
    { label: 'Press', href: '/company/press' },
    { label: 'Careers', href: '/company/careers' },
    { label: 'Blog', href: '/company/blog' }
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/legal/privacy-policy' },
    { label: 'Terms of Service', href: '/legal/terms-of-service' },
    { label: 'Cookie Policy', href: '/legal/cookie-policy' },
    { label: 'Refund Policy', href: '/legal/refund-policy' }
  ]
};

// moved inside component to use runtime config

export default function Footer() {
  const cfg = useRuntimePublicConfig();
  const socialLinks = [
    { icon: Instagram, href: cfg.socials.instagram || '#', label: 'Instagram' },
    { icon: Facebook, href: cfg.socials.facebook || '#', label: 'Facebook' },
    { icon: Twitter, href: cfg.socials.twitter || '#', label: 'Twitter' },
  ];
  return (
    <footer className="bg-charcoal text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-3xl font-playfair font-bold mb-4">
              <span className="bg-gradient-gold bg-clip-text text-transparent">Glam</span>
              Gallery
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transforming spaces with curated wall art collections. 
              Discover masterpieces that speak to your soul.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-gold" />
                <span>{cfg.contactEmail}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-gold" />
                <span>{cfg.contactPhone}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-gold" />
                <span>{cfg.contactAddress}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-3 bg-white/10 rounded-full hover:bg-gold transition-colors duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 + 0.2 }}
            >
              <h4 className="font-semibold text-gold mb-4 font-playfair text-lg">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li key={link}>
                    <motion.div
                      className="text-gray-300 hover:text-gold transition-colors duration-300 text-sm"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.1 + linkIndex * 0.05 + 0.4 }}
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 GlamGallery. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm text-gray-400">
            <motion.div className="hover:text-gold transition-colors duration-300" whileHover={{ y: -2 }}>
              <Link href="/legal/privacy-policy">Privacy Policy</Link>
            </motion.div>
            <motion.div className="hover:text-gold transition-colors duration-300" whileHover={{ y: -2 }}>
              <Link href="/legal/terms-of-service">Terms of Service</Link>
            </motion.div>
            <motion.div className="hover:text-gold transition-colors duration-300" whileHover={{ y: -2 }}>
              <Link href="/legal/cookie-policy">Cookie Policy</Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}