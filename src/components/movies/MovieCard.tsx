"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/lib/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { WatchlistButton } from './WatchlistButton';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      <Card className="group relative overflow-hidden rounded-lg border-0 shadow-lg h-full">
        <Link href={`/movie/${movie.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${movie.title}`} />
        <CardContent className="p-0">
          <div className="aspect-[2/3] w-full bg-muted">
            {movie.poster_path && (
              <Image
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                width={500}
                height={750}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3 text-white">
          <h3 className="font-bold text-base truncate transition-colors group-hover:text-accent">{movie.title}</h3>
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-white">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <WatchlistButton movie={movie} />
              </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
