"use client";
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/hooks/use-reviews';

export default function AdminDashboard() {
  const { settings, setAutoApprove } = useReviews();

  return (
    <div className="min-h-[60vh]">
      <h1 className="text-3xl font-playfair font-bold text-charcoal mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col">
          <div className="font-semibold text-charcoal">Reviews Moderation</div>
          <p className="text-sm text-gray-600 mt-2">Approve, reject, or delete product reviews.</p>
          <Link href="/admin/reviews" className="mt-4">
            <Button className="bg-gradient-gold">Open Reviews</Button>
          </Link>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="font-semibold text-charcoal">Auto-Approve Reviews</div>
          <p className="text-sm text-gray-600 mt-2">When enabled, new reviews go live immediately.</p>
          <div className="mt-4 flex items-center gap-3">
            <Button variant={settings.autoApprove ? 'default' : 'outline'} onClick={()=>setAutoApprove(true)}>Enable</Button>
            <Button variant={!settings.autoApprove ? 'default' : 'outline'} onClick={()=>setAutoApprove(false)}>Disable</Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">Current: {settings.autoApprove ? 'Enabled' : 'Disabled'}</div>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="font-semibold text-charcoal">Coming Soon</div>
          <p className="text-sm text-gray-600 mt-2">Products, Orders, Users management UI.</p>
        </Card>
      </div>
    </div>
  );
}


