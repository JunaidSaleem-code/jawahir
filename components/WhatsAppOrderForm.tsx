'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { buildWhatsAppLink, useWhatsAppTargets } from '@/lib/whatsapp';

interface WhatsAppOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    items: Array<{
      title: string;
      pricePkr: number;
      quantity: number;
      size?: string;
      productUrl?: string;
    }>;
    totals: {
      subtotalPkr: number;
      shippingPkr?: number;
      taxPkr?: number;
      grandTotalPkr: number;
    };
    customerName?: string;
    customerPhone?: string;
  };
}

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
  { id: 'jazzcash', label: 'JazzCash', icon: '📱' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: '💳' },
];

export default function WhatsAppOrderForm({ isOpen, onClose, orderData }: WhatsAppOrderFormProps) {
  const [formData, setFormData] = useState({
    name: orderData.customerName || '',
    phone: orderData.customerPhone || '',
    address: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const waTargets = useWhatsAppTargets();

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in your name and phone number');
      return;
    }

    setIsSubmitting(true);

    // Build structured WhatsApp message
    const message = buildStructuredMessage({
      ...orderData,
      customerName: formData.name,
      customerPhone: formData.phone,
      address: formData.address,
      paymentMethod: paymentMethods.find(p => p.id === formData.paymentMethod)?.label || 'Cash on Delivery',
    });

    const waHref = waTargets.length > 0 ? buildWhatsAppLink(waTargets[0], message) : '#';
    
    // Open WhatsApp
    window.open(waHref, '_blank');
    
    setIsSubmitting(false);
    onClose();
  };

  const buildStructuredMessage = (data: typeof orderData & { address: string; paymentMethod: string }) => {
    const lines: string[] = [];
    
    lines.push('🛒 New Order Request');
    lines.push('');
    lines.push('📌 Items:');
    
    data.items.forEach((item, index) => {
      const itemName = `${item.title}${item.size ? ` (${item.size})` : ''}`;
      lines.push(`${index + 1}) ${itemName}`);
      lines.push(`   💵 Rs. ${item.pricePkr.toLocaleString()} × ${item.quantity}`);
      if (item.productUrl) {
        lines.push(`   🔗 [View Product](${item.productUrl})`);
      }
      lines.push('');
    });
    
    lines.push('---------------------------');
    lines.push('📊 Totals:');
    lines.push(`Subtotal: Rs. ${data.totals.subtotalPkr.toLocaleString()}`);
    if (data.totals.shippingPkr) {
      lines.push(`Delivery: Rs. ${data.totals.shippingPkr.toLocaleString()}`);
    }
    if (data.totals.taxPkr) {
      lines.push(`Tax: Rs. ${data.totals.taxPkr.toLocaleString()}`);
    }
    lines.push(`Grand Total: Rs. ${data.totals.grandTotalPkr.toLocaleString()}`);
    lines.push('');
    lines.push(`👤 Customer: ${data.customerName}`);
    lines.push(`📞 Contact: ${data.customerPhone}`);
    lines.push(`📍 Address: ${data.address || 'To be filled by customer'}`);
    lines.push('');
    lines.push(`✅ Payment Method: ${data.paymentMethod}`);
    
    return encodeURIComponent(lines.join('\n'));
  };

  if (waTargets.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-green-600">📲</span>
            Order via WhatsApp
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Phone Number *
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="0300-1234567"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Delivery Address
            </label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter your complete address"
              rows={3}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                  className={`p-3 border rounded-lg text-left transition-all ${
                    formData.paymentMethod === method.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Order Summary:</div>
            <div className="text-sm">
              {orderData.items.length} item{orderData.items.length !== 1 ? 's' : ''} • 
              Rs. {orderData.totals.grandTotalPkr.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? 'Opening...' : '📲 Send to WhatsApp'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
