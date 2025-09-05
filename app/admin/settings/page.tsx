"use client";

import { Card } from '@/components/ui/card';
import { useAdminSettings } from '@/hooks/use-admin-settings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  const admin = useAdminSettings();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal mb-4">Settings</h1>
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Site Name</div>
            <Input value={admin.siteName || ''} onChange={(e)=>admin.set({ siteName: e.target.value })} placeholder="GlamGallery" />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Contact Email</div>
            <Input value={admin.contactEmail || ''} onChange={(e)=>admin.set({ contactEmail: e.target.value })} placeholder="hello@example.com" />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Contact Phone</div>
            <Input value={admin.contactPhone || ''} onChange={(e)=>admin.set({ contactPhone: e.target.value })} placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Address</div>
            <Input value={admin.contactAddress || ''} onChange={(e)=>admin.set({ contactAddress: e.target.value })} placeholder="New York, NY 10001" />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Instagram URL</div>
            <Input value={admin.socials.instagram || ''} onChange={(e)=>admin.set({ socials: { ...admin.socials, instagram: e.target.value } })} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Facebook URL</div>
            <Input value={admin.socials.facebook || ''} onChange={(e)=>admin.set({ socials: { ...admin.socials, facebook: e.target.value } })} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Twitter URL</div>
            <Input value={admin.socials.twitter || ''} onChange={(e)=>admin.set({ socials: { ...admin.socials, twitter: e.target.value } })} placeholder="https://x.com/..." />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={()=>admin.reset()}>Reset</Button>
          <Button className="bg-gradient-gold" onClick={()=>{ /* persisted automatically */ }}>Save</Button>
        </div>
      </Card>
    </div>
  );
}


