import { getGenres } from '@/lib/tmdb';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default async function GenresPage() {
    const genres = await getGenres();

    return (
        <div className="container py-8">
            <h1 className="text-4xl font-bold mb-8">Genres</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genres.map(genre => (
                    <Link key={genre.id} href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}>
                        <Card className="h-24 flex items-center justify-center p-4 text-center font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                            {genre.name}
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
