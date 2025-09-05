'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title?: string;
  reviewText: string;
  images?: string[];
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  helpfulCount: number;
  notHelpfulCount: number;
  response?: string;
}

export interface HelpfulnessVote {
  reviewId: string;
  userId: string;
  isHelpful: boolean;
}

interface ReviewsState {
  reviews: Review[];
  votes: HelpfulnessVote[];
  settings: { autoApprove: boolean };
  addReview: (r: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount' | 'notHelpfulCount' | 'status'> & { status?: ReviewStatus }) => string;
  updateReview: (id: string, patch: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  vote: (reviewId: string, userId: string, isHelpful: boolean) => void;
  getProductStats: (productId: number) => { average: number; count: number; distribution: Record<number, number>; verifiedPct: number };
  setAutoApprove: (value: boolean) => void;
  hasUserReviewed: (productId: number, userId: string) => boolean;
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useReviews = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],
      votes: [],
      settings: { autoApprove: false },
      addReview: (payload) => {
        // Prevent duplicate review by same user for product
        if (get().reviews.some(r => r.productId === payload.productId && r.userId === payload.userId)) {
          throw new Error('You have already reviewed this product.');
        }
        const id = generateId();
        const now = new Date().toISOString();
        const status: ReviewStatus = (get().settings.autoApprove ? 'approved' : (payload.status ?? 'pending'));
        const newReview: Review = {
          id,
          ...payload,
          status,
          createdAt: now,
          updatedAt: now,
          helpfulCount: 0,
          notHelpfulCount: 0,
        };
        set({ reviews: [newReview, ...get().reviews] });
        return id;
      },
      updateReview: (id, patch) => set({ reviews: get().reviews.map(r => r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r) }),
      deleteReview: (id) => set({ reviews: get().reviews.filter(r => r.id !== id) }),
      approveReview: (id) => set({ reviews: get().reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r) }),
      rejectReview: (id) => set({ reviews: get().reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r) }),
      vote: (reviewId, userId, isHelpful) => {
        const existing = get().votes.find(v => v.reviewId === reviewId && v.userId === userId);
        if (existing && existing.isHelpful === isHelpful) return; // noop
        const nextVotes = existing
          ? get().votes.map(v => v.reviewId === reviewId && v.userId === userId ? { ...v, isHelpful } : v)
          : [...get().votes, { reviewId, userId, isHelpful }];
        const helpfulCount = nextVotes.filter(v => v.reviewId === reviewId && v.isHelpful).length;
        const notHelpfulCount = nextVotes.filter(v => v.reviewId === reviewId && !v.isHelpful).length;
        set({ votes: nextVotes, reviews: get().reviews.map(r => r.id === reviewId ? { ...r, helpfulCount, notHelpfulCount } : r) });
      },
      getProductStats: (productId) => {
        const list = get().reviews.filter(r => r.productId === productId && r.status === 'approved');
        const count = list.length;
        const distribution: Record<number, number> = {1:0,2:0,3:0,4:0,5:0};
        for (const r of list) distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
        const average = count ? Number((list.reduce((s,r)=>s+r.rating,0)/count).toFixed(2)) : 0;
        const verifiedCount = list.filter(r => r.isVerifiedPurchase).length;
        const verifiedPct = count ? Math.round((verifiedCount / count) * 100) : 0;
        return { average, count, distribution, verifiedPct };
      },
      setAutoApprove: (value: boolean) => set({ settings: { ...get().settings, autoApprove: value } }),
      hasUserReviewed: (productId, userId) => get().reviews.some(r => r.productId === productId && r.userId === userId),
    }),
    { name: 'gg-reviews' }
  )
);


