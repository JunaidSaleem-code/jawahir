## Project Architecture Overview

Layers:
- app/: Next.js routes and pages
- components/: Reusable UI and composites
- features/: Domain feature barrels (cart, reviews, wishlist)
- hooks/: Client state hooks (Zustand stores)
- lib/: Utilities, types, config, mock-data
- app/admin/: Admin UI (dashboard, sections)

Key modules:
- Cart: `features/cart`, global provider in `app/layout.tsx`
- Reviews: `features/reviews`, moderation at `/admin/reviews`
- Wishlist: `features/wishlist` with persisted store
- AR Try-On: `app/ar-tryon/` with MediaPipe integration

AR Try-On Architecture:
- Camera: `components/ARCamera.tsx` - react-webcam integration with mirror functionality
- Tracking: `components/MediaPipeTracker.tsx` - Face Mesh & Hands detection with dynamic imports
- Fallback Tracking: `components/SimpleMediaPipeTracker.tsx` - Basic tracking without MediaPipe
- Adaptive Tracking: `components/AdaptiveMediaPipeTracker.tsx` - Smart fallback system
- Overlay: `components/EnhancedJewelryOverlay.tsx` - Jewelry positioning & manual controls
- Debug Overlay: `components/JewelryDebugOverlay.tsx` - Visual debugging and interactive controls
- Selection: `components/JewelrySelector.tsx` - Jewelry category selection with image fallbacks
- Main Page: `app/ar-tryon/page.tsx` - Complete AR experience with Cartier-inspired UI

AR Try-On Technical Details:
- Camera Integration: Uses react-webcam with 1280x720 resolution, mirrored for selfie experience
- MediaPipe Integration: Dynamic imports to avoid SSR issues, Face Mesh for earrings/necklaces, Hands for rings
- Jewelry Positioning: Automatic placement based on facial landmarks (earlobes, neck) and hand landmarks (fingers)
- Manual Controls: Drag, resize, rotate functionality with visual feedback
- Image Handling: High-quality Unsplash images with fallback to icons/emojis on load failure
- State Management: Camera activation, selected jewelry, tracking status, landmark data
- WhatsApp Integration: Product details and pricing shared via WhatsApp API
- UI Design: Cartier-inspired luxury interface with ivory/gold color scheme and Cormorant Garamond typography

Configuration:
- Public runtime: `lib/public-config.ts` (env + admin overrides from `/admin/settings`)


