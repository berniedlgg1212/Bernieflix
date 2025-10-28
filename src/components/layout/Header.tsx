"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { SearchInput } from '@/components/search/SearchInput';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/genres', label: 'Genres' },
  { href: '/watchlist', label: 'My Watchlist' },
  { href: '/recommendations', label: 'For You' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
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
        <div className="flex flex-1 items-center justify-end">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
