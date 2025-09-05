'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useReviews } from '@/hooks/use-reviews';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminReviewsPage() {
  const { reviews, approveReview, rejectReview, deleteReview, updateReview } = useReviews();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-playfair font-bold text-charcoal mb-6">Review Moderation</h1>
          <div className="grid gap-4">
            {reviews.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{r.title || '(No title)'} • {r.rating}★</div>
                    <div className="text-sm text-gray-500">Product #{r.productId} • {r.userName} • {r.status}</div>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{r.reviewText}</p>
                  </div>
                  <div className="flex gap-2">
                    {r.status !== 'approved' && <Button onClick={()=>approveReview(r.id)}>Approve</Button>}
                    {r.status !== 'rejected' && <Button variant="outline" onClick={()=>rejectReview(r.id)}>Reject</Button>}
                    <Button variant="destructive" onClick={()=>deleteReview(r.id)}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
            {reviews.length===0 && <div className="text-gray-600">No reviews yet.</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


