'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Discounts', href: '/admin/discounts' },
  { label: 'Content', href: '/admin/content' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Settings', href: '/admin/settings' },
  { label: 'Security', href: '/admin/security' },
  { label: 'Reviews', href: '/admin/reviews' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav className="sticky top-28 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={cn(
                  'block px-3 py-2 rounded-md text-sm border',
                  pathname === item.href ? 'border-gold text-gold bg-gold/5' : 'border-gray-200 text-gray-700 hover:border-gold'
                )}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}


