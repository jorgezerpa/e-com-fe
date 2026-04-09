'use client'
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
      <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        {children}
      </div>
    </main>      
  );
}