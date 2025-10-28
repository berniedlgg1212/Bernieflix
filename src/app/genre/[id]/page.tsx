import { getMoviesByGenre, type Genre } from '@/lib/tmdb';
import { MovieCard } from '@/components/movies/MovieCard';
import { Suspense } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link';
import { SortFilter } from '@/components/movies/SortFilter';

interface GenrePageProps {
    params: {
        id: string;
    };
    searchParams: {
        name?: string;
        sort_by?: string;
    }
}

async function GenreResults({ genreId, genreName, sortBy }: { genreId: string; genreName: string, sortBy: string }) {
    let movies = await getMoviesByGenre(genreId);

    if (sortBy === 'vote_average.desc') {
        movies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'vote_average.asc') {
        movies.sort((a, b) => a.vote_average - b.vote_average);
    }
    
    const validMovies = movies.filter(movie => movie.poster_path);

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <h1 className="text-4xl font-bold">
                    {genreName}
                </h1>
                <SortFilter 
                    genreId={genreId} 
                    genreName={genreName}
                    currentSort={sortBy}
                />
            </div>
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
    const sortBy = searchParams.sort_by || 'popularity.desc';

    return (
        <div className="container py-8">
             <Suspense fallback={<div className="text-center">Loading movies...</div>}>
                <GenreResults genreId={genreId} genreName={genreName} sortBy={sortBy} />
            </Suspense>
        </div>
    );
}
