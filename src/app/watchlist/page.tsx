"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { MovieCard } from "@/components/movies/MovieCard";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableMovieItem } from "@/components/movies/SortableMovieItem";

export default function WatchlistPage() {
    const { watchlist, setWatchlist } = useWatchlist();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setWatchlist((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="container py-8">
            <h1 className="text-4xl font-bold mb-6">My Watchlist</h1>
            {watchlist.length > 0 ? (
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={watchlist.map(m => m.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                            {watchlist.map(movie => (
                                <SortableMovieItem key={movie.id} movie={movie} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <p className="text-muted-foreground text-lg mt-8 text-center">Your watchlist is empty. Add some movies to get started!</p>
            )}
        </div>
    );
}
