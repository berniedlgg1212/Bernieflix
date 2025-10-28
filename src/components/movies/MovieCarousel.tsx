import type { Movie } from '@/lib/tmdb';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { MovieCard } from './MovieCard';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: movies.length > 5,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie) => (
            <CarouselItem key={movie.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-1rem] text-foreground bg-background/50 hover:bg-background" />
        <CarouselNext className="right-[-1rem] text-foreground bg-background/50 hover:bg-background" />
      </Carousel>
    </section>
  );
}
