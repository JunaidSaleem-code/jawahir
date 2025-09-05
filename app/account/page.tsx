"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAccount } from '@/hooks/use-account';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function AccountPage() {
  const acc = useAccount();
  // Ensure inputs initialize from persisted state immediately after mount to avoid hydration races
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('gg-account');
      if (!raw) return;
      const parsed = JSON.parse(raw || '{}');
      const state = parsed?.state || {};
      const patch: any = {};
      if (!acc.name && state.name) patch.name = state.name;
      if (!acc.email && state.email) patch.email = state.email;
      if (!acc.phone && state.phone) patch.phone = state.phone;
      if (!acc.shippingAddress && state.shippingAddress) patch.shippingAddress = state.shippingAddress;
      if (!acc.billingAddress && state.billingAddress) patch.billingAddress = state.billingAddress;
      if (Object.keys(patch).length > 0) acc.set(patch);
    } catch {}
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-playfair font-bold text-charcoal">Account</h1>
          <p className="text-gray-600 mt-2">Manage your profile and addresses.</p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Name</div>
              <Input data-testid="account-name" value={acc.name} onChange={(e)=>acc.set({ name: e.target.value })} placeholder="John Doe" />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Email</div>
              <Input data-testid="account-email" type="email" value={acc.email} onChange={(e)=>acc.set({ email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Phone</div>
              <Input data-testid="account-phone" value={acc.phone} onChange={(e)=>acc.set({ phone: e.target.value })} placeholder="+1 (555) 123-4567" />
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium mb-1">Shipping Address</div>
              <Textarea data-testid="account-shipping" rows={5} value={acc.shippingAddress} onChange={(e)=>acc.set({ shippingAddress: e.target.value })} placeholder={`John Doe\n123 Example St\nNew York, NY 10001`} />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Billing Address</div>
              <Textarea data-testid="account-billing" rows={5} value={acc.billingAddress} onChange={(e)=>acc.set({ billingAddress: e.target.value })} placeholder={`John Doe\n456 Billing Ave\nNew York, NY 10002`} />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button className="bg-gradient-gold">Save</Button>
            <Button variant="outline" onClick={()=>acc.reset()}>Reset</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


