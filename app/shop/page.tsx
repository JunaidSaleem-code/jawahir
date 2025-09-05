'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const products = MOCK_PRODUCTS.concat([
  { id: 9, title: 'Botanical Study', artist: 'Maria Santos', price: 189, image: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Nature' },
  { id: 10, title: 'Geometric Patterns', artist: 'Alex Thompson', price: 259, image: 'https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Abstract' },
]);

const categories = ['All', 'Abstract', 'Photography', 'Landscape', 'Minimalist', 'Nature', 'Urban'];

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Initialize from URL
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cats = searchParams.get('cats');
    const priceMin = Number(searchParams.get('priceMin') || '0');
    const priceMax = Number(searchParams.get('priceMax') || '500');
    const sort = searchParams.get('sort') || 'featured';
    const view = (searchParams.get('view') as 'grid' | 'list') || 'grid';
    setSearchTerm(q);
    setSelectedCategories(cats ? cats.split(',').filter(Boolean) : []);
    setPriceRange([isNaN(priceMin) ? 0 : priceMin, isNaN(priceMax) ? 500 : priceMax]);
    setSortBy(sort);
    const storedView = typeof window !== 'undefined' ? window.localStorage.getItem('gg-view') as 'grid' | 'list' | null : null;
    setViewMode(storedView || view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to URL (shallow replace)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set('q', searchTerm); else params.delete('q');
    if (selectedCategories.length) params.set('cats', selectedCategories.join(',')); else params.delete('cats');
    params.set('priceMin', String(priceRange[0]));
    params.set('priceMax', String(priceRange[1]));
    if (sortBy && sortBy !== 'featured') params.set('sort', sortBy); else params.delete('sort');
    if (viewMode && viewMode !== 'grid') params.set('view', viewMode); else params.delete('view');
    router.replace(`${pathname}?${params.toString()}`);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gg-view', viewMode);
    }
  }, [searchTerm, selectedCategories, priceRange, sortBy, viewMode]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        {/* Page Header */}
        <section className="py-12 bg-gradient-to-r from-cream to-warm-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-4">
                Art <span className="text-gold">Collection</span>
              </h1>
              <p className="text-lg text-gray-600">
                Discover {products.length} carefully curated pieces from talented artists worldwide
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Controls */}
          <motion.div
            className="flex flex-col lg:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search artworks or artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-gold focus:ring-gold/20"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-200 hover:border-gold"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-gold focus:ring-gold/20"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <motion.aside
              className={`w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Categories */}
              <Card className="p-6">
                <h3 className="font-semibold text-charcoal mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.slice(1).map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <label htmlFor={category} className="text-sm text-gray-600 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Price Range */}
              <Card className="p-6">
                <h3 className="font-semibold text-charcoal mb-4">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </Card>
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              <motion.div
                className="mb-6 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-gray-600">
                  Showing {sortedProducts.length} of {products.length} artworks
                </p>
              </motion.div>

              <motion.div
                className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
                layout
              >
                {sortedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </motion.div>

              {sortedProducts.length === 0 && (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No artworks found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}