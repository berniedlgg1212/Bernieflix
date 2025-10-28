// src/components/movies/SortFilter.tsx
"use client";

import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SortFilterProps {
    genreId: string;
    genreName: string;
    currentSort: string;
}

export function SortFilter({ genreId, genreName, currentSort }: SortFilterProps) {
    const router = useRouter();

    const handleSortChange = (value: string) => {
        router.push(`/genre/${genreId}?name=${encodeURIComponent(genreName)}&sort_by=${value}`);
    };

    return (
         <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <Select onValueChange={handleSortChange} defaultValue={currentSort}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="popularity.desc">Popularity</SelectItem>
                    <SelectItem value="vote_average.desc">Rating</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
