import Link from 'next/link';
import { Film } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="CineStream Home">
      <Film className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">
        CineStream
      </span>
    </Link>
  );
}
