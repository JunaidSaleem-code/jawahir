# Jawahir & Decor - Luxury Jewelry & Home Decor E-commerce

A premium e-commerce platform for luxury jewelry and elegant home decor featuring an innovative AR try-on experience. Built with Next.js 15, TypeScript, and cutting-edge computer vision technology.

## ✨ Key Features

### 🎯 AR Try-On Experience
- **Real-time Camera Integration** - Mirror-mode selfie experience
- **MediaPipe Tracking** - Automatic face and hand landmark detection
- **Smart Jewelry Positioning** - Auto-placement for earrings, rings, and necklaces
- **Manual Controls** - Drag, resize, and rotate jewelry with precision
- **WhatsApp Sharing** - Capture and share try-on images with product details

### 🛍️ E-commerce Platform
- **Jewelry Collection** - Exquisite rings, earrings, necklaces, and bracelets
- **Home Decor** - Elegant lighting, mirrors, vases, and decorative pieces
- **Shopping Cart** - Persistent cart with mini-cart drawer
- **Reviews & Ratings** - Customer feedback with moderation system
- **Wishlist** - Save favorite items for later
- **Admin Panel** - Complete CMS for managing products and orders

### 🎨 Premium Design
- **Cartier-Inspired UI** - Luxury design with ivory and gold accents
- **Responsive Layout** - Optimized for all devices
- **Smooth Animations** - Framer Motion powered interactions
- **Accessibility** - WCAG compliant with keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecom-whatsapp-main
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Public configuration
   NEXT_PUBLIC_SITE_NAME="Jawahir & Decor"
   NEXT_PUBLIC_CONTACT_EMAIL="info@jawahirdecor.com"
   NEXT_PUBLIC_CONTACT_PHONE="+92-300-1234567"
   
   # Admin access (optional)
   ADMIN_USER="admin"
   ADMIN_PASS="password"
   
   # Stripe (optional)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 AR Try-On Usage

1. **Navigate to AR Try-On**
   - Click "AR Try-On" in the main navigation
   - Or visit `/ar-tryon` directly

2. **Enable Camera**
   - Click "Start AR Try-On"
   - Allow camera permissions when prompted

3. **Select Jewelry**
   - Choose from earrings, rings, or necklaces
   - Browse available pieces with pricing

4. **Try On Virtually**
   - Position yourself in the camera frame
   - Jewelry will automatically track your face/hands
   - Use manual controls to fine-tune positioning

5. **Capture & Share**
   - Take a snapshot of your try-on
   - Share via WhatsApp with product details

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Smooth animations

### AR & Computer Vision
- **react-webcam** - Camera integration
- **MediaPipe** - Face mesh and hand tracking
- **Canvas API** - Image processing and overlay

### State Management
- **Zustand** - Lightweight state management
- **localStorage** - Client-side persistence

### Development Tools
- **ESLint** - Code linting
- **Playwright** - E2E testing
- **Prisma** - Database ORM (prepared)

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── ar-tryon/          # AR try-on experience
│   ├── shop/              # Product catalog
│   ├── product/[id]/      # Product detail pages
│   ├── admin/             # Admin panel
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── ARCamera.tsx      # Camera integration
│   ├── MediaPipeTracker.tsx # Face/hand tracking
│   └── ...
├── hooks/                # Zustand stores
├── lib/                  # Utilities and config
├── docs/                 # Documentation
└── public/               # Static assets
    └── jewelry/          # Jewelry images
```

## 🎯 AR Try-On Components

### Core Components
- **`ARCamera`** - Camera integration with react-webcam
- **`MediaPipeTracker`** - Face mesh and hand tracking
- **`EnhancedJewelryOverlay`** - Jewelry positioning and controls
- **`JewelrySelector`** - Category and product selection

### Features
- **Auto-tracking** - Jewelry follows facial features and hands
- **Manual controls** - Drag, resize, rotate when needed
- **Quality indicators** - Visual feedback for tracking status
- **WhatsApp integration** - Easy sharing with product details

## 🔧 Configuration

### Environment Variables
See `.env.example` for all available configuration options.

### Admin Panel
Access the admin panel at `/admin` with the credentials set in your environment variables.

### MediaPipe Models
Face mesh and hand tracking models are loaded from CDN. Ensure stable internet connection for optimal performance.

## 🧪 Testing

### E2E Tests
```bash
pnpm test:e2e
```

### Run with UI
```bash
pnpm test:e2e:ui
```

## 📚 Documentation

- **[Project Overview](docs/PROJECT_OVERVIEW.md)** - Complete technical overview
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture details
- **[AR Try-On Feature](docs/AR_TRYON_FEATURE.md)** - Detailed AR implementation guide
- **[Tests](docs/TESTS.md)** - Testing strategy and coverage

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Future Enhancements

### Planned Features
- **3D Jewelry Models** - Three.js integration for realistic 3D try-on
- **Multiple Jewelry Items** - Try on multiple pieces simultaneously
- **Advanced Lighting** - Dynamic lighting effects for better realism
- **Voice Commands** - Hands-free control of AR experience
- **Social Sharing** - Instagram and Facebook integration

### Technical Improvements
- **Performance Optimization** - WebGL acceleration for tracking
- **Mobile App** - React Native version with native camera
- **Offline Support** - PWA capabilities for mobile users
- **Analytics** - User behavior tracking and conversion optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: info@jawahirdecor.com
- Phone: +92-300-1234567
- Documentation: [docs/](docs/)

---

## AdminJS + Prisma Setup (Planned)

This project is prepared with a Prisma schema for Reviews/Orders/Products to integrate AdminJS.

Steps to complete (to be run locally):

1. Create a `.env` with a SQLite URL:

```
DATABASE_URL="file:./dev.db"
```

2. Install deps:

```
pnpm i -D prisma @prisma/client adminjs @adminjs/express @adminjs/prisma express
```

3. Generate and migrate:

```
npx prisma generate
npx prisma migrate dev --name init
```

4. Add an Express server for AdminJS (e.g., `admin.server.ts`) and run it alongside Next.js.

5. Point AdminJS resources to Prisma models: `Product`, `Review`, `User`, `Order`, `OrderItem`, `ReviewHelpfulness`.

6. Secure AdminJS with basic auth or session.


