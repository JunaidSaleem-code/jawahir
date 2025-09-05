"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-playfair font-bold text-charcoal">Wishlist</h1>
            {items.length > 0 && (
              <Button variant="outline" onClick={clear}>Clear All</Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-gray-600" data-testid="wishlist-empty">No items saved yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it) => (
                <div key={it.id} className="border rounded-xl p-4 flex flex-col" data-testid="wishlist-item">
                  <div className="relative w-full h-48">
                    <Image src={it.image} alt={it.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover rounded-md" />
                  </div>
                  <div className="mt-3 font-medium">{it.title}</div>
                  <div className="text-sm text-gray-500">by {it.artist}</div>
                  <div className="mt-2 font-semibold">${it.price}</div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/product/${it.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-gold">View</Button>
                    </Link>
                    <Button variant="outline" onClick={() => remove(it.id)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


