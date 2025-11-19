"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import type { Movie } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, MinusCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface WatchlistButtonProps {
  movie: Movie;
  variant?: 'icon' | 'default';
}

export function WatchlistButton({ movie, variant = 'icon' }: WatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const iconVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: 'spring', stiffness: 400, damping: 15 } },
    exit: { scale: 0 },
  };

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 hover:text-white rounded-full relative"
              onClick={handleToggleWatchlist}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={inWatchlist ? "check" : "plus"}
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute"
                  onAnimationComplete={() => setIsAnimating(false)}
                >
                  {inWatchlist ? (
                    <CheckCircle className="h-5 w-5 text-accent" />
                  ) : (
                    <PlusCircle className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span className="sr-only">{inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{inWatchlist ? 'In Watchlist' : 'Add to watchlist'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={inWatchlist ? "secondary" : "default"}
      onClick={handleToggleWatchlist}
      className="w-full md:w-auto"
      size="lg"
    >
      {inWatchlist ? (
        <>
          <MinusCircle className="mr-2 h-4 w-4" />
          Remove from Watchlist
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
