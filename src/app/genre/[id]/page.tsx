import { getMoviesByGenre, type Genre } from '@/lib/tmdb';
import { MovieCard } from '@/components/movies/MovieCard';
import { Suspense } from 'react';

interface GenrePageProps {
    params: {
        id: string;
    };
    searchParams: {
        name?: string;
    }
}

async function GenreResults({ genreId, genreName }: { genreId: string; genreName: string }) {
    const movies = await getMoviesByGenre(genreId);
    const validMovies = movies.filter(movie => movie.poster_path);

    return (
        <>
            <h1 className="text-4xl font-bold mb-8">
                {genreName}
            </h1>
            {validMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {validMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-lg mt-8 text-center">No movies found for this genre.</p>
            )}
        </>
    );
}

export default function GenrePage({ params, searchParams }: GenrePageProps) {
    const genreId = params.id;
    const genreName = searchParams.name || 'Genre';

    return (
        <div className="container py-8">
             <Suspense fallback={<div className="text-center">Loading movies...</div>}>
                <GenreResults genreId={genreId} genreName={genreName} />
            </Suspense>
        </div>
    );
}
