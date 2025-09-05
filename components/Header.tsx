'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Card } from '@/components/ui/card';
import { useRuntimePublicConfig } from '@/lib/public-config';
import { buildCartWhatsAppMessage, buildWhatsAppLink, useWhatsAppTargets } from '@/lib/whatsapp';
import { useAccount } from '@/hooks/use-account';
import WhatsAppOrderForm from '@/components/WhatsAppOrderForm';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cfg = useRuntimePublicConfig();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'AR Try-On', href: '/ar-tryon' },
    { name: 'Virtual Preview', href: '/preview' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            className="text-2xl font-playfair font-bold text-charcoal"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="bg-gradient-gold bg-clip-text text-transparent">{cfg.siteName.slice(0,4)}</span>
            {cfg.siteName.slice(4)}
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gold transition-colors duration-300 font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <motion.div
              className=""
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/search" aria-label="Search" className="p-2 text-gray-700 hover:text-gold transition-colors duration-300">
                <Search size={20} />
              </Link>
            </motion.div>
            
            <motion.div
              className=""
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/wishlist" aria-label="Wishlist" className="p-2 text-gray-700 hover:text-gold transition-colors duration-300">
                <Heart size={20} />
              </Link>
            </motion.div>

            <motion.div
              className=""
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button aria-label="Account menu" className="p-2 text-gray-700 hover:text-gold transition-colors duration-300">
                    <User size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>

            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button data-testid="cart-button" onClick={() => setIsCartOpen(true)} aria-label="Open cart" className="p-2 text-gray-700 hover:text-gold transition-colors duration-300">
                <ShoppingBag size={20} />
              </button>
              {itemCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-gold transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerContent>
          <div className="max-w-7xl mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle>Your Cart</DrawerTitle>
            </DrawerHeader>
            <CartMini onOpenWhatsAppForm={() => {}} />
            <DrawerFooter>
              <Link href="/cart" className="w-full">
                <Button className="w-full bg-gradient-gold">View Cart & Checkout</Button>
              </Link>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      
    </motion.header>
  );
}

function CartMini({ onOpenWhatsAppForm }: { onOpenWhatsAppForm: () => void }) {
  const { items, total, updateQuantity, removeItem } = useCart();
  const waTargets = useWhatsAppTargets();
  const acc = useAccount();
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);
  
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
  
  const orderData = {
    items: items.map((it) => ({
      title: it.title,
      pricePkr: it.price,
      quantity: it.quantity,
      size: it.size,
      productUrl: `${origin}/product/${it.id}`,
    })),
    totals: {
      subtotalPkr: total,
      grandTotalPkr: total,
    },
    customerName: acc?.name,
    customerPhone: acc?.phone,
  };
  
  return (
    <>
      <div className="px-4 pb-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <Card key={`${it.id}-${it.size}`} className="p-3 flex items-center gap-3">
                <img src={it.image} alt={it.title} className="w-14 h-14 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-charcoal">{it.title}</div>
                  <div className="text-xs text-gray-500">{it.size}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 border rounded" onClick={() => updateQuantity(it.id, it.size, it.quantity - 1)}>-</button>
                  <span className="w-6 text-center text-sm">{it.quantity}</span>
                  <button className="px-2 border rounded" onClick={() => updateQuantity(it.id, it.size, it.quantity + 1)}>+</button>
                </div>
                <div className="w-16 text-right text-sm font-semibold">${(it.price * it.quantity).toFixed(0)}</div>
                <button className="text-xs text-red-500" onClick={() => removeItem(it.id, it.size)}>Remove</button>
              </Card>
            ))}
            <div className="flex justify-between pt-2 border-t"><span className="text-sm text-gray-600">Subtotal</span><span className="font-semibold text-charcoal">${total.toFixed(2)}</span></div>
            {waTargets.length > 0 && (
              <Button 
                size="sm" 
                onClick={() => setIsWhatsAppFormOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                📲 Order on WhatsApp
              </Button>
            )}
          </div>
        )}
      </div>
      
      <WhatsAppOrderForm
        isOpen={isWhatsAppFormOpen}
        onClose={() => setIsWhatsAppFormOpen(false)}
        orderData={orderData}
      />
    </>
  );
}