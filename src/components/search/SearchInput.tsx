"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      } else if (pathname === '/search') {
        router.push('/');
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, router, pathname]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10 h-9"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
