'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccountState = {
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  billingAddress: string;
  set: (patch: Partial<Omit<AccountState, 'set'>>) => void;
  reset: () => void;
};

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      name: '',
      email: '',
      phone: '',
      shippingAddress: '',
      billingAddress: '',
      set: (patch) => set((s) => ({ ...s, ...patch })),
      reset: () => set({ name: '', email: '', phone: '', shippingAddress: '', billingAddress: '' }),
    }),
    { name: 'gg-account' }
  )
);


