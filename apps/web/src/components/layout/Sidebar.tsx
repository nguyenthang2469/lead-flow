'use client';

import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads management', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-card hidden w-56 shrink-0 flex-col border-r md:flex">
      <div className="h-14 border-b px-4">
        <Link href="/" className="flex h-full w-fit items-center gap-2">
          <Zap className="text-primary h-5 w-5" />
          <span className="font-semibold tracking-tight">LeadFlow</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href || (pathname.startsWith(href) && href !== '/')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4 text-center text-xs text-slate-500">
        MVP Version 1.0
      </div>
    </aside>
  );
};
