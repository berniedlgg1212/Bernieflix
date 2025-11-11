import { getMovieDetails, getMovieVideos, getImageUrl, getMovieKeywords } from '@/lib/tmdb';
import Image from 'next/image';
import { Star, Clock, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WatchlistButton } from '@/components/movies/WatchlistButton';
import { TrailerDialog } from '@/components/movies/TrailerDialog';
import { KeywordsView } from '@/components/keywords/KeywordsView';
import { Suspense } from 'react';

interface MovieDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movieId = Number(params.id);
  const movie = await getMovieDetails(movieId);
  const videos = await getMovieVideos(movieId);
  
  const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="pb-12">
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {movie.backdrop_path && (
            <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover object-top"
            priority
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl(movie.poster_path!, 'w500')}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 pt-8 md:pt-16">
            <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{movie.release_date?.split('-')[0]}</p>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                {movie.runtime > 0 && (
                    <>
                        <span className="text-muted-foreground">|</span>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{formatRuntime(movie.runtime)}</span>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genres?.map(genre => (
                <Badge key={genre.id} variant="secondary" className="text-sm">{genre.name}</Badge>
              ))}
            </div>

            <p className="mt-8 text-base md:text-lg text-foreground/80 max-w-3xl leading-relaxed">{movie.overview}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <WatchlistButton movie={movie} variant="default" />
              {trailer && <TrailerDialog trailer={trailer} />}
            </div>
          </div>
        </div>
        <div className="mt-12">
            <Suspense fallback={<div className="text-center">Loading keywords...</div>}>
                <KeywordsView movieId={movieId} />
            </Suspense>
        </div>
      </div>
    </div>
  );
}
