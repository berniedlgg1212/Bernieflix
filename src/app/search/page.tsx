import { searchMovies, getMoviesByGenre, getGenres } from '@/lib/tmdb'; // Assuming a function to get movies by keyword name exists
import { MovieCard } from '@/components/movies/MovieCard';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

interface SearchPageProps {
    searchParams: {
        q?: string;
        keyword?: string;
    };
}

async function SearchResults({ query, keyword }: { query?: string, keyword?: string }) {
    if (!query && !keyword) {
        return <h1 className="text-3xl font-bold mb-6">Please enter a search term</h1>;
    }

    if (query) {
        const movies = await searchMovies(query);
        const validMovies = movies.filter(movie => movie.poster_path);
        return (
             <>
                <h1 className="text-3xl font-bold mb-6">
                    Search results for "{query}"
                </h1>
                {validMovies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {validMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-lg mt-8 text-center">No movies found for "{query}".</p>
                )}
            </>
        );
    }

    if (keyword) {
        const allGenres = await getGenres();
        const genre = allGenres.find(g => g.name.toLowerCase() === keyword.toLowerCase());
        
        if (!genre) {
             return <p className="text-muted-foreground text-lg mt-8 text-center">No movies found for keyword "{keyword}".</p>
        }

        const movies = await getMoviesByGenre(String(genre.id));
        const validMovies = movies.filter(movie => movie.poster_path);

         return (
             <>
                <h1 className="text-3xl font-bold mb-6">
                    Movies with keyword: "{keyword}"
                </h1>
                {validMovies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {validMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-lg mt-8 text-center">No movies found for keyword "{keyword}".</p>
                )}
            </>
        );
    }
    
    return null;
}


export default function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query, keyword } = searchParams;

    return (
        <div className="container py-8">
            <Suspense fallback={<div className="text-center">Searching...</div>}>
                <SearchResults query={query} keyword={keyword} />
            </Suspense>
        </div>
    );
}
