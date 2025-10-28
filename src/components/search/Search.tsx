// src/components/search/Search.tsx
import { Suspense } from 'react';
import { SearchInput } from './SearchInput';

export function Search() {
  return (
    <Suspense fallback={<div className="relative w-full max-w-xs h-9" />}>
      <SearchInput />
    </Suspense>
  );
}
