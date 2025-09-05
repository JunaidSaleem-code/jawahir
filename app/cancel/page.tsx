'use client';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-playfair font-bold text-charcoal">Payment canceled</h1>
            <p className="mt-2 text-gray-600">You can review your cart and try again when you're ready.</p>
            <Link href="/cart" className="inline-block mt-6">
              <Button className="bg-gradient-gold">Return to Cart</Button>
            </Link>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}



