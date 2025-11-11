"use client";

import type { Movie } from '@/lib/tmdb';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const initialWatchlist: Movie[] = [
    {
        "id": 299534,
        "title": "Avengers: Endgame",
        "poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        "backdrop_path": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        "overview": "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
        "release_date": "2019-04-24",
        "vote_average": 8.3,
        "genre_ids": [12, 878, 28]
    },
    {
        "id": 155,
        "title": "The Dark Knight",
        "poster_path": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        "backdrop_path": "/nMKdUUQPEd2biTe4iS0M5dBC7hE.jpg",
        "overview": "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
        "release_date": "2008-07-16",
        "vote_average": 8.5,
        "genre_ids": [18, 28, 80, 53]
    },
    {
        "id": 680,
        "title": "Pulp Fiction",
        "poster_path": "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        "backdrop_path": "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
        "overview": "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
        "release_date": "1994-09-10",
        "vote_average": 8.5,
        "genre_ids": [53, 80]
    }
];


export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('cinestream_watchlist');
      if (storedWatchlist) {
        const parsed = JSON.parse(storedWatchlist);
        if (parsed.length > 0) {
            setWatchlist(parsed);
        } else {
            setWatchlist(initialWatchlist);
            updateLocalStorage(initialWatchlist);
        }
      } else {
        setWatchlist(initialWatchlist);
        updateLocalStorage(initialWatchlist);
      }
    } catch (error) {
      console.error("Could not parse watchlist from localStorage", error);
      setWatchlist(initialWatchlist);
    }
  }, []);

  const updateLocalStorage = (updatedWatchlist: Movie[]) => {
    try {
      localStorage.setItem('cinestream_watchlist', JSON.stringify(updatedWatchlist));
    } catch (error) {
      console.error("Could not save watchlist to localStorage", error);
    }
  };

  const addToWatchlist = (movie: Movie) => {
    setWatchlist(prevWatchlist => {
      if (prevWatchlist.some(m => m.id === movie.id)) {
        return prevWatchlist;
      }
      const updatedWatchlist = [...prevWatchlist, movie];
      updateLocalStorage(updatedWatchlist);
      return updatedWatchlist;
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(prevWatchlist => {
      const updatedWatchlist = prevWatchlist.filter(movie => movie.id !== movieId);
      updateLocalStorage(updatedWatchlist);
      return updatedWatchlist;
    });
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
