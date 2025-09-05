'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Socials = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
};

type SettingsState = {
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socials: Socials;
  set: (patch: Partial<Omit<SettingsState, 'set'>>) => void;
  reset: () => void;
};

export const useAdminSettings = create<SettingsState>()(
  persist(
    (set) => ({
      siteName: undefined,
      contactEmail: undefined,
      contactPhone: undefined,
      contactAddress: undefined,
      socials: {},
      set: (patch) => set((s) => ({ ...s, ...patch })),
      reset: () => set({ siteName: undefined, contactEmail: undefined, contactPhone: undefined, contactAddress: undefined, socials: {} }),
    }),
    { name: 'gg-admin-settings' }
  )
);


