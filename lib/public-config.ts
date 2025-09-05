import { useAdminSettings } from '@/hooks/use-admin-settings';

export const publicConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Jawahir & Decor',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@jawahirdecor.com',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92-300-1234567',
  contactAddress: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Karachi, Pakistan',
  socials: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#',
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#',
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || '#',
  },
};

export function useRuntimePublicConfig() {
  const admin = useAdminSettings();
  return {
    siteName: admin.siteName || publicConfig.siteName,
    contactEmail: admin.contactEmail || publicConfig.contactEmail,
    contactPhone: admin.contactPhone || publicConfig.contactPhone,
    contactAddress: admin.contactAddress || publicConfig.contactAddress,
    socials: {
      instagram: admin.socials.instagram || publicConfig.socials.instagram,
      facebook: admin.socials.facebook || publicConfig.socials.facebook,
      twitter: admin.socials.twitter || publicConfig.socials.twitter,
    },
  };
}


