import { searchMovies } from '@/lib/tmdb';
import { MovieCard } from '@/components/movies/MovieCard';
import { Suspense } from 'react';

interface SearchPageProps {
    searchParams: {
        q?: string;
    };
}

async function SearchResults({ query }: { query: string }) {
    const movies = query ? await searchMovies(query) : [];
    const validMovies = movies.filter(movie => movie.poster_path);

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">
                {query ? `Search results for "${query}"` : 'Please enter a search term'}
            </h1>
            {validMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {validMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                query && <p className="text-muted-foreground text-lg mt-8 text-center">No movies found for "{query}".</p>
            )}
        </>
    );
}


export default function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || '';

    return (
        <div className="container py-8">
            <Suspense fallback={<div className="text-center">Searching...</div>}>
                <SearchResults query={query} />
            </Suspense>
        </div>
    );
}
