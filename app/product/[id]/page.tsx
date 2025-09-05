'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Share2, Ruler, Truck, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import { toast } from '@/hooks/use-toast';
import { ReviewsSummary, ReviewsList, ReviewForm } from '@/components/Reviews';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAccount } from '@/hooks/use-account';
import { buildWhatsAppLink, buildWhatsAppMessage, useWhatsAppTargets } from '@/lib/whatsapp';
import { usePathname } from 'next/navigation';
import WhatsAppOrderForm from '@/components/WhatsAppOrderForm';

// Mock product data - in real app this would come from API
const product = {
  id: 1,
  title: "Abstract Harmony",
  artist: "Elena Rodriguez",
  price: 299,
  originalPrice: 399,
  images: [
    "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  category: "Abstract",
  description: "A stunning abstract piece that captures the essence of modern artistic expression. This vibrant composition features flowing forms and dynamic color relationships that create a sense of movement and energy.",
  dimensions: "24x30 inches",
  medium: "Digital Print on Canvas",
  isNew: true,
  inStock: true,
  stockCount: 5
};

const sizes = [
  { name: "Small", dimensions: "16x20 inches", price: 199 },
  { name: "Medium", dimensions: "24x30 inches", price: 299 },
  { name: "Large", dimensions: "32x40 inches", price: 399 },
  { name: "Extra Large", dimensions: "40x50 inches", price: 499 }
];

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);

  const currentPrice = sizes[selectedSize].price;
  const { addItem } = useCart();
  const acc = useAccount();
  const pathname = usePathname();
  const waTargets = useWhatsAppTargets();

  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : `https://example.com${pathname}`;
  
  const orderData = {
    items: [{
      title: product.title,
      pricePkr: currentPrice,
      quantity,
      size: sizes[selectedSize].name,
      productUrl,
    }],
    totals: {
      subtotalPkr: currentPrice * quantity,
      grandTotalPkr: currentPrice * quantity,
    },
    customerName: acc?.name,
    customerPhone: acc?.phone,
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/shop">
              <Button variant="ghost" className="text-gray-600 hover:text-gold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Collection
              </Button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Main Image */}
              <motion.div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.isNew && (
                    <Badge className="bg-gold text-white">NEW</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="destructive">SALE</Badge>
                  )}
                </div>

                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full">
                  <Eye className="w-4 h-4" />
                </div>
              </motion.div>

              {/* Thumbnail Images */}
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-gold' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      sizes="100px"
                      style={{ objectFit: 'cover' }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-2">
                  {product.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">by {product.artist}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-charcoal">
                    ${currentPrice}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <Badge variant="destructive" className="text-sm">
                      Save ${product.originalPrice - currentPrice}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-semibold text-charcoal mb-3">Size</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((size, index) => (
                    <motion.button
                      key={size.name}
                      className={`p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                        selectedSize === index
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-200 hover:border-gold/50'
                      }`}
                      onClick={() => setSelectedSize(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium text-charcoal">{size.name}</div>
                      <div className="text-sm text-gray-500">{size.dimensions}</div>
                      <div className="text-sm font-semibold text-gold">${size.price}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-charcoal mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-none"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="rounded-none"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stockCount} in stock
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-gold hover:shadow-lg hover:shadow-gold/20 transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      addItem({
                        id: product.id,
                        title: product.title,
                        artist: product.artist,
                        price: currentPrice,
                        image: product.images[0],
                        size: sizes[selectedSize].name,
                        quantity,
                      });
                      toast({
                        title: 'Added to cart',
                        description: `${product.title} · ${sizes[selectedSize].name} × ${quantity}`,
                      });
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`border-gold ${isFavorited ? 'bg-gold text-white' : 'text-gold hover:bg-gold hover:text-white'}`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {waTargets.length > 0 && (
                  <Button
                    size="lg"
                    onClick={() => setIsWhatsAppFormOpen(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  >
                    📲 Order on WhatsApp
                  </Button>
                )}

                <Link href="/virtual-preview">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-gold text-gold hover:bg-gold hover:text-white"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Preview on Your Wall
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-gold mb-2" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-gold mb-2" />
                  <p className="text-xs text-gray-600">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Ruler className="w-6 h-6 mx-auto text-gold mb-2" />
                  <p className="text-xs text-gray-600">Custom Sizing</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-8">
                <Card className="p-8">
                  <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
                    About This Artwork
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-8">
                <Card className="p-8">
                  <h3 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Artwork Details</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Medium: {product.medium}</li>
                        <li>Category: {product.category}</li>
                        <li>Artist: {product.artist}</li>
                        <li>Year: 2024</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Print Quality</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>Museum-quality archival inks</li>
                        <li>Premium canvas material</li>
                        <li>UV-resistant coating</li>
                        <li>Gallery-wrapped edges</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-8">
                <Card className="p-8">
                  <h3 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                    Shipping Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Delivery Options</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Standard Shipping: 5-7 business days ($25)</li>
                        <li>• Express Shipping: 2-3 business days ($45)</li>
                        <li>• Free shipping on orders over $200</li>
                        <li>• White-glove delivery available for large pieces</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal mb-2">Packaging</h4>
                      <p className="text-gray-600">
                        Each artwork is carefully packaged with protective materials and 
                        shipped in a custom-designed box to ensure it arrives in perfect condition.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="p-6 lg:col-span-1">
                    <ReviewsSummary productId={product.id} />
                  </Card>
                  <div className="lg:col-span-2 space-y-6">
                    <ReviewForm productId={product.id} canReview={true} onSubmitted={()=>{}} />
                    <ReviewsList productId={product.id} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      {/* Sticky Mobile Add-to-Cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-medium text-charcoal truncate">{product.title}</div>
            <div className="text-xs text-gray-500 truncate">{sizes[selectedSize].name} • ${currentPrice} × {quantity}</div>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Decrease quantity" className="px-2 py-1 border rounded" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button aria-label="Increase quantity" className="px-2 py-1 border rounded" onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}>+</button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-gradient-gold"
              onClick={() => {
                addItem({
                  id: product.id,
                  title: product.title,
                  artist: product.artist,
                  price: currentPrice,
                  image: product.images[0],
                  size: sizes[selectedSize].name,
                  quantity,
                });
                toast({ title: 'Added to cart', description: `${product.title} · ${sizes[selectedSize].name} × ${quantity}` });
              }}
            >
              Add • ${(currentPrice * quantity).toFixed(0)}
            </Button>
            {waTargets.length > 0 && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsWhatsAppFormOpen(true)}
              >
                📲
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
      
      <WhatsAppOrderForm
        isOpen={isWhatsAppFormOpen}
        onClose={() => setIsWhatsAppFormOpen(false)}
        orderData={orderData}
      />
    </div>
  );
}