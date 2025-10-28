"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { generatePersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { getMoviesByTitle, type Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/movies/MovieCard';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsPage() {
    const { watchlist } = useWatchlist();
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetRecommendations = useCallback(async () => {
        if (watchlist.length === 0) {
            setError("Add movies to your watchlist to get personalized recommendations.");
            setRecommendations([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const viewingHistory = watchlist.map(m => m.title).join(', ');
            
            const aiResponse = await generatePersonalizedRecommendations({
                viewingHistory: viewingHistory,
                numberOfRecommendations: 6,
            });

            if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
                const recommendedMovies = await getMoviesByTitle(aiResponse.recommendations);
                const validMovies = recommendedMovies.filter(m => m && m.poster_path);
                setRecommendations(validMovies);
            } else {
                 setError("Could not generate recommendations at this time. Please try again.");
            }

        } catch (err) {
            console.error(err);
            setError("An error occurred while generating recommendations. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [watchlist]);
    
    useEffect(() => {
        // Automatically fetch recommendations on load if watchlist is not empty
        handleGetRecommendations();
    }, [handleGetRecommendations]);


    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-4xl font-bold">For You</h1>
                <Button onClick={handleGetRecommendations} disabled={isLoading || watchlist.length === 0} size="lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    {isLoading ? 'Generating...' : 'Refresh Recommendations'}
                </Button>
            </div>

            {error && <p className="text-destructive text-lg mt-8 text-center">{error}</p>}
            
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] w-full">
                            <Skeleton className="w-full h-full rounded-lg bg-muted/50" />
                        </div>
                    ))}
                </div>
            )}
            
            {!isLoading && recommendations.length > 0 && (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {recommendations.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}

            {!isLoading && !error && recommendations.length === 0 && watchlist.length > 0 && (
                <p className="text-muted-foreground text-lg mt-8 text-center">We are having trouble generating recommendations. Please try again.</p>
            )}
        </div>
    );
}
