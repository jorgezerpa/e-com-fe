'use client'
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the active item from the URL path
  // e.g., /admin/team-heatmap -> 'team-heatmap'
  const activeItem = pathname.split('/').pop() || 'long-term-data-visualization';




  return (
    <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-hide">
      <Navbar />
      <div className="">
        {children}
      </div>
    </main>      
  );
}