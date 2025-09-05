'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { toast } from '@/hooks/use-toast';
import { buildCartWhatsAppMessage, buildWhatsAppLink, useWhatsAppTargets } from '@/lib/whatsapp';
import { useAccount } from '@/hooks/use-account';
import { usePathname } from 'next/navigation';
import WhatsAppOrderForm from '@/components/WhatsAppOrderForm';

async function createStripeCheckout(items: any[]) {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items, successPath: '/success', cancelPath: '/cancel' }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url as string;
    } else {
      throw new Error('No checkout URL');
    }
  } catch (e: any) {
    toast({ title: 'Checkout failed', description: e?.message || 'Please try again.' });
  }
}

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, total: cartTotal } = useCart();
  const acc = useAccount();
  const waTargets = useWhatsAppTargets();
  const pathname = usePathname();

  const [promoCode, setPromoCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);
  const subtotal = cartTotal;
  const shipping = subtotal > 200 ? 0 : 25;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shipping + tax;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
  
  const orderData = {
    items: cartItems.map((it) => ({
      title: it.title,
      pricePkr: it.price,
      quantity: it.quantity,
      size: it.size,
      productUrl: `${origin}/product/${it.id}`,
    })),
    totals: {
      subtotalPkr: subtotal,
      shippingPkr: shipping,
      taxPkr: tax,
      grandTotalPkr: grandTotal,
    },
    customerName: acc?.name,
    customerPhone: acc?.phone,
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const itemsPayload = cartItems.map((it) => ({
      id: it.id,
      title: it.title,
      size: it.size,
      price: it.price,
      quantity: it.quantity,
    }));
    await createStripeCheckout(itemsPayload);
    setIsCheckingOut(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/shop">
              <Button variant="ghost" className="text-gray-600 hover:text-gold mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-4xl font-playfair font-bold text-charcoal">
              Shopping <span className="text-gold">Cart</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-gray-300 mb-6">
                <ShoppingBag className="w-24 h-24 mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Discover amazing artworks to fill your space</p>
              <Link href="/shop">
                <Button size="lg" className="bg-gradient-gold hover:shadow-lg hover:shadow-gold/20">
                  Browse Collection
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex gap-6">
                          <motion.div
                            className="relative w-32 h-40 rounded-lg overflow-hidden flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-charcoal font-playfair">
                                  {item.title}
                                </h3>
                                <p className="text-gray-500">by {item.artist}</p>
                                <p className="text-sm text-gray-400 mt-1">{item.size}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id, item.size)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-bold text-charcoal">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ${item.price} each
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="p-6 sticky top-32">
                  <h2 className="text-xl font-semibold text-charcoal mb-6 font-playfair">
                    Order Summary
                  </h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="border-gray-200 focus:border-gold focus:ring-gold/20"
                      />
                      <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-white">
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-gold">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                      <p className="text-sm text-blue-700">
                        Add ${(200 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-gradient-gold hover:shadow-lg hover:shadow-gold/20 transform hover:scale-105 transition-all duration-300"
                  >
                    {isCheckingOut ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Secure Checkout
                      </>
                    )}
                  </Button>

                  {waTargets.length > 0 && (
                    <Button
                      size="lg"
                      onClick={() => setIsWhatsAppFormOpen(true)}
                      className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    >
                      📲 Checkout via WhatsApp
                    </Button>
                  )}

                  <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                    <Lock className="w-3 h-3 mr-1" />
                    SSL Secured Checkout
                  </div>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      <WhatsAppOrderForm
        isOpen={isWhatsAppFormOpen}
        onClose={() => setIsWhatsAppFormOpen(false)}
        orderData={orderData}
      />
    </div>
  );
}