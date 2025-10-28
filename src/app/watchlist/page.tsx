"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { MovieCard } from "@/components/movies/MovieCard";

export default function WatchlistPage() {
    const { watchlist } = useWatchlist();

    return (
        <div className="container py-8">
            <h1 className="text-4xl font-bold mb-6">My Watchlist</h1>
            {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {watchlist.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-lg mt-8 text-center">Your watchlist is empty. Add some movies to get started!</p>
            )}
        </div>
    );
}
