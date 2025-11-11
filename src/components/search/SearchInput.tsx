"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Film, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (type: 'movie' | 'keyword') => {
    if (!query) return;
    if (type === 'movie') {
        router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
        router.push(`/search?keyword=${encodeURIComponent(query)}`);
    }
    setShowDropdown(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearch('movie');
    }
  };

  return (
    <div className="relative w-full max-w-xs" ref={searchContainerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10 h-9"
        value={query}
        onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(!!e.target.value);
        }}
        onFocus={() => setShowDropdown(!!query)}
        onKeyDown={handleKeyDown}
      />
      {showDropdown && (
         <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-md shadow-lg z-50">
            <button 
                onClick={() => handleSearch('movie')}
                className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2"
            >
                <Film className="w-4 h-4 text-muted-foreground"/>
                <span>Search for movie: <strong>{query}</strong></span>
            </button>
            <button 
                onClick={() => handleSearch('keyword')}
                className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2"
            >
                <Tag className="w-4 h-4 text-muted-foreground"/>
                <span>Search for keyword: <strong>{query}</strong></span>
            </button>
         </div>
      )}
    </div>
  );
}
