import { getGenres } from '@/lib/tmdb';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

// Genre names to Unsplash keywords.
const genreImageKeywords: { [key: string]: string } = {
    'Action': 'action explosion',
    'Adventure': 'adventure landscape',
    'Animation': 'animation character',
    'Comedy': 'comedy funny',
    'Crime': 'crime detective',
    'Documentary': 'documentary nature',
    'Drama': 'drama theatre',
    'Family': 'family fun',
    'Fantasy': 'fantasy world',
    'History': 'history ancient',
    'Horror': 'horror scary',
    'Music': 'music concert',
    'Mystery': 'mystery fog',
    'Romance': 'romance couple',
    'Science Fiction': 'science fiction space',
    'TV Movie': 'tv movie',
    'Thriller': 'thriller suspense',
    'War': 'war soldier',
    'Western': 'western cowboy',
};

// Simple hashing function to get a seed for picsum.photos
function getSeed(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}


export default async function GenresPage() {
    const genres = await getGenres();

    return (
        <div className="container py-8">
            <h1 className="text-4xl font-bold mb-8">Genres</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genres.map(genre => (
                    <Link key={genre.id} href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}>
                        <Card className="h-40 flex items-center justify-center p-4 text-center font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-colors relative overflow-hidden group">
                           <Image 
                                src={`https://picsum.photos/seed/${getSeed(genre.name)}/300/200`}
                                alt={genre.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                data-ai-hint={genreImageKeywords[genre.name] || 'movie genre'}
                           />
                           <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                           <span className="relative z-10 text-white text-xl">{genre.name}</span>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
