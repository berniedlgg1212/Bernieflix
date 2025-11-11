import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_IMAGE_BASE_URL } from '@/lib/constants';

// Basic Movie Type
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: { id: number, name: string }[];
}

// Movie Details Type
export interface MovieDetails extends Movie {
  runtime: number;
}

// Video Type
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

// Genre Type
export interface Genre {
  id: number;
  name: string;
}

// Keyword Type
export interface Keyword {
  id: number;
  name: string;
}

// API Response Types
interface TmdbApiResult<T> {
  page: number;
  results: T;
  total_pages: number;
  total_results: number;
}

interface TmdbVideosResult {
    id: number;
    results: Video[];
}

interface TmdbKeywordsResult {
    id: number;
    keywords: Keyword[];
}

const fetchFromTmdb = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }

  return response.json();
};

export const getGenres = async (): Promise<Genre[]> => {
  const data = await fetchFromTmdb<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
};

export const getMoviesByGenre = async (genreId: string): Promise<Movie[]> => {
    const data = await fetchFromTmdb<TmdbApiResult<Movie[]>>('/discover/movie', { with_genres: genreId });
    return data.results;
};

export const getTrendingMovies = async (time_window: 'day' | 'week' = 'week'): Promise<Movie[]> => {
  const data = await fetchFromTmdb<TmdbApiResult<Movie[]>>(`/trending/movie/${time_window}`);
  return data.results;
};

export const getPopularMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTmdb<TmdbApiResult<Movie[]>>('/movie/popular');
    return data.results;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTmdb<TmdbApiResult<Movie[]>>('/movie/top_rated');
    return data.results;
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
    const data = await fetchFromTmdb<TmdbApiResult<Movie[]>>('/movie/now_playing');
    return data.results;
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  return fetchFromTmdb<MovieDetails>(`/movie/${id}`, { append_to_response: 'credits' });
};

export const getMovieVideos = async (id: number): Promise<Video[]> => {
    const data = await fetchFromTmdb<TmdbVideosResult>(`/movie/${id}/videos`);
    return data.results;
}

export const getMovieKeywords = async (id: number): Promise<Keyword[]> => {
    const data = await fetchFromTmdb<TmdbKeywordsResult>(`/movie/${id}/keywords`);
    return data.keywords;
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const data = await fetchFromTmdb<TmdbApiResult<Movie[]>>('/search/movie', { query });
  return data.results;
};

export const searchKeywords = async (query: string): Promise<Keyword[]> => {
  const data = await fetchFromTmdb<TmdbApiResult<Keyword[]>>('/search/keyword', { query });
  return data.results;
}

export const getMoviesByKeyword = async (keywordId: string): Promise<Movie[]> => {
    const data = await fetchFromTmdb<TmdbApiResult<Movie[]>>('/discover/movie', { with_keywords: keywordId });
    return data.results;
};

export const getMoviesByTitle = async (titles: string[]): Promise<Movie[]> => {
  const moviePromises = titles.map(async (title) => {
    const searchResults = await searchMovies(title);
    return searchResults[0];
  });
  
  const movies = await Promise.all(moviePromises);
  return movies.filter((movie): movie is Movie => !!movie);
};

export const getImageUrl = (path: string, size: 'w300' | 'w500' | 'original' = 'w500') => {
    if (!path) {
        return '/placeholder.svg';
    }
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
