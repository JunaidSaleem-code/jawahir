'use client';

import { useMemo, useState } from 'react';
import { useReviews } from '@/hooks/use-reviews';
import { RatingDisplay, RatingInput } from '@/components/RatingStars';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ReviewsSummary({ productId }: { productId: number }) {
  const { getProductStats } = useReviews();
  const stats = getProductStats(productId);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <RatingDisplay value={stats.average} count={stats.count} />
        <span className="text-sm text-gray-600">{stats.average} out of 5</span>
      </div>
      <div className="space-y-1">
        {[5,4,3,2,1].map((star) => {
          const total = stats.count || 1;
          const pct = Math.round(((stats.distribution[star] || 0) / total) * 100);
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-10">{star}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div className="h-2 bg-gold rounded" style={{ width: pct + '%' }} />
              </div>
              <span className="w-12 text-right text-gray-500">{pct}%</span>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-500">Verified purchases: {stats.verifiedPct}%</div>
    </div>
  );
}

export function ReviewsList({ productId }: { productId: number }) {
  const { reviews, vote } = useReviews();
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [sort, setSort] = useState<'new' | 'old' | 'high' | 'low' | 'helpful'>('new');
  const list = useMemo(() => {
    let l = reviews.filter(r => r.productId === productId && r.status === 'approved');
    if (filter !== 'all') l = l.filter(r => r.rating === filter);
    switch (sort) {
      case 'old': l = [...l].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)); break;
      case 'high': l = [...l].sort((a,b)=>b.rating-a.rating); break;
      case 'low': l = [...l].sort((a,b)=>a.rating-b.rating); break;
      case 'helpful': l = [...l].sort((a,b)=> (b.helpfulCount - b.notHelpfulCount) - (a.helpfulCount - a.notHelpfulCount)); break;
      default: l = [...l].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
    }
    return l;
  }, [reviews, productId, filter, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2 text-sm">
          {["all",5,4,3,2,1].map((r) => (
            <button key={String(r)} onClick={()=>setFilter(r as any)} className={`px-3 py-1 rounded-full border ${filter===r?'border-gold text-gold':'border-gray-200 text-gray-600'}`}>{r==="all"?'All':`${r}★`}</button>
          ))}
        </div>
        <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="high">Highest Rated</option>
          <option value="low">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>
      {list.map((r) => (
        <Card key={r.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <RatingDisplay value={r.rating} />
                {r.isVerifiedPurchase && <Badge className="bg-green-600">Verified Purchase</Badge>}
              </div>
              <div className="font-medium mt-1">{r.title}</div>
              <div className="text-sm text-gray-600">by {r.userName || 'Anonymous'} • {new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <p className="mt-3 text-gray-700 whitespace-pre-wrap">{r.reviewText}</p>
          {r.images && r.images.length>0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {r.images.map((src, i)=>(<img key={i} src={src} alt="review" className="w-full h-24 object-cover rounded" />))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
            <button onClick={()=>vote(r.id,'demo-user',true)} className="hover:text-charcoal">Helpful ({r.helpfulCount})</button>
            <button onClick={()=>vote(r.id,'demo-user',false)} className="hover:text-charcoal">Not Helpful ({r.notHelpfulCount})</button>
            <button className="ml-auto text-red-500">Report</button>
          </div>
        </Card>
      ))}
      {list.length===0 && <div className="text-sm text-gray-500">No reviews yet.</div>}
    </div>
  );
}

export function ReviewForm({ productId, canReview, onSubmitted }: { productId: number; canReview: boolean; onSubmitted?: ()=>void }) {
  const { addReview, hasUserReviewed } = useReviews();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const userId = 'demo-user';
  const already = hasUserReviewed(productId, userId);
  if (!canReview) return null;

  return (
    <Card className="p-4">
      <div className="font-semibold mb-2">Write a Review</div>
      <RatingInput value={rating} onChange={setRating} />
      <input data-testid="review-title" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title (optional)" className="mt-3 w-full border rounded px-3 py-2" />
      <textarea data-testid="review-text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Share details of your experience" className="mt-2 w-full border rounded px-3 py-2 min-h-[120px]" />
      <div className="mt-3 flex gap-2">
        <input type="file" accept="image/*" multiple onChange={(e)=>{
          const files = Array.from(e.target.files || []);
          Promise.all(files.map(f=>new Promise<string>((res)=>{ const r=new FileReader(); r.onload=()=>res(String(r.result)); r.readAsDataURL(f);}))).then(imgs=>setImages(imgs));
        }} />
      </div>
      <Button className="mt-3 bg-gradient-gold" disabled={already} onClick={()=>{
        addReview({ productId, userId, userName:'Guest', rating, title, reviewText:text, images, isVerifiedPurchase:true });
        onSubmitted && onSubmitted();
      }}>Submit Review</Button>
      {already && <div className="mt-2 text-xs text-gray-500">You have already reviewed this product.</div>}
    </Card>
  );
}


