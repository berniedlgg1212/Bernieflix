"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/lib/tmdb";

interface SortableMovieItemProps {
    movie: Movie;
}

export function SortableMovieItem({ movie }: SortableMovieItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: movie.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <MovieCard movie={movie} />
        </div>
    );
}
