import { getGenres, getMoviesByGenre, getImageUrl } from '@/lib/tmdb';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';


export default async function GenresPage() {
    const genres = await getGenres();

    const genresWithImages = await Promise.all(
        genres.map(async (genre) => {
            const movies = await getMoviesByGenre(String(genre.id));
            const firstMovieWithImage = movies.find(m => m.backdrop_path);
            return {
                ...genre,
                imageUrl: firstMovieWithImage ? getImageUrl(firstMovieWithImage.backdrop_path!, 'w500') : null,
                imageHint: `${genre.name} movie`
            };
        })
    );


    return (
        <div className="container py-8">
            <h1 className="text-4xl font-bold mb-8">Genres</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genresWithImages.map(genre => (
                    <Link key={genre.id} href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}>
                        <Card className="h-40 flex items-center justify-center p-4 text-center font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-colors relative overflow-hidden group">
                           {genre.imageUrl ? (
                                <Image 
                                    src={genre.imageUrl}
                                    alt={genre.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    data-ai-hint={genre.imageHint}
                               />
                           ) : (
                                <div className="w-full h-full bg-muted" />
                           )}
                           <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                           <span className="relative z-10 text-white text-xl">{genre.name}</span>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
