'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';

interface JewelrySelectorProps {
  jewelry: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  }>;
  onSelect: (jewelry: any) => void;
  selectedJewelry: any;
}

const JewelrySelector = ({ jewelry, onSelect, selectedJewelry }: JewelrySelectorProps) => {
  return (
    <div className="space-y-3">
      {jewelry.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedJewelry?.id === item.id 
                ? 'ring-2 ring-gold bg-gold/5 border-gold/20' 
                : 'hover:border-gold/30 border-gray-200'
            }`}
            onClick={() => onSelect(item)}
          >
            <div className="flex items-center gap-4">
              {/* Jewelry Image */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-gold/30 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/40 flex items-center justify-center hidden">
                    <Crown className="w-8 h-8 text-gold" />
                  </div>
                </div>
                {selectedJewelry?.id === item.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              
              {/* Jewelry Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-playfair font-semibold text-charcoal text-sm mb-1 truncate">
                  {item.name}
                </h4>
                <p className="text-gold font-bold text-lg">
                  PKR {item.price.toLocaleString()}
                </p>
                <Badge 
                  variant="outline" 
                  className="text-xs border-gold/30 text-gold mt-1"
                >
                  {item.category}
                </Badge>
              </div>
              
              {/* Select Button */}
              <Button
                size="sm"
                variant={selectedJewelry?.id === item.id ? "default" : "outline"}
                className={
                  selectedJewelry?.id === item.id
                    ? "bg-gold hover:bg-gold/90 text-white"
                    : "border-gold text-gold hover:bg-gold/10"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
              >
                {selectedJewelry?.id === item.id ? 'Selected' : 'Select'}
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
      
      {jewelry.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Crown className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No jewelry available in this category</p>
        </div>
      )}
    </div>
  );
};

export default JewelrySelector;
