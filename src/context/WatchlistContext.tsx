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

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('cinestream_watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Could not parse watchlist from localStorage", error);
      setWatchlist([]);
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
