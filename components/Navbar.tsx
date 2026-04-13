'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Companies', href: '/dashboard' },
    { name: 'Billing', href: '/dashboard/billing' },
  ];

  return (
    <nav className="flex items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-800 p-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-black uppercase tracking-widest transition-colors ${
              isActive 
                ? 'text-green-500' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}