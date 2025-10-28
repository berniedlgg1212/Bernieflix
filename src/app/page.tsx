import { MovieCarousel } from '@/components/movies/MovieCarousel';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getImageUrl, type Movie } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

export default async function Home() {
  const [trendingMovies, popularMovies, topRatedMovies, nowPlayingMovies] = await Promise.all([
    getTrendingMovies('week'),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies()
  ]);

  const heroMovie = trendingMovies[0];

  return (
    <div>
      {heroMovie && (
        <div className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src={getImageUrl(heroMovie.backdrop_path!, 'original')}
            alt={heroMovie.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
          <div className="container relative z-10 flex h-full flex-col justify-end pb-16">
            <h1 className="text-5xl md:text-7xl font-bold max-w-2xl">{heroMovie.title}</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground line-clamp-3">{heroMovie.overview}</p>
            <div className="mt-6 flex gap-4">
               <Button asChild size="lg" variant="default">
                <Link href={`/movie/${heroMovie.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="container pb-8">
        <MovieCarousel title="Trending This Week" movies={trendingMovies.filter(m => m.poster_path)} />
        <MovieCarousel title="Now Playing" movies={nowPlayingMovies.filter(m => m.poster_path)} />
        <MovieCarousel title="Popular" movies={popularMovies.filter(m => m.poster_path)} />
        <MovieCarousel title="Top Rated" movies={topRatedMovies.filter(m => m.poster_path)} />
      </div>
    </div>
  );
}
