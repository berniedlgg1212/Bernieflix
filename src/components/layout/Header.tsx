// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { Search } from '@/components/search/Search';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/UserNav';
import { Suspense } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/genres', label: 'Genres' },
  { href: '/watchlist', label: 'My Watchlist' },
  { href: '/my-keywords', label: 'My Keywords'},
  { href: '/recommendations', label: 'For You' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6 ml-4">
          <Logo />
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                pathname === link.href && 'text-foreground bg-accent/20'
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Suspense fallback={<div className="w-full max-w-xs h-9" />}>
            <Search />
          </Suspense>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
