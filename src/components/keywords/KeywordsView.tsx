// src/components/keywords/KeywordsView.tsx
'use client';
import { getMovieKeywords, type Keyword } from '@/lib/tmdb';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface KeywordsViewProps {
  movieId: number;
}

export function KeywordsView({ movieId }: KeywordsViewProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [savedKeywords, setSavedKeywords] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchKeywords() {
      const tmdbKeywords = await getMovieKeywords(movieId);
      setKeywords(tmdbKeywords);
    }
    fetchKeywords();
  }, [movieId]);

  const processKeyword = (keyword: string) => {
    return keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim();
  };

  useEffect(() => {
    if (!user || !firestore || keywords.length === 0) return;

    const checkSavedKeywords = async () => {
      const newSavedKeywords = new Set<string>();
      for (const keyword of keywords) {
        const processedKeyword = processKeyword(keyword.name);
        const keywordRef = doc(
          firestore,
          `users/${user.uid}/keywords/${processedKeyword}`
        );
        const docSnap = await getDoc(keywordRef);
        if (docSnap.exists()) {
          newSavedKeywords.add(processedKeyword);
        }
      }
      setSavedKeywords(newSavedKeywords);
    };

    checkSavedKeywords();
  }, [user, firestore, keywords]);

  const handleAddKeyword = async (keyword: Keyword) => {
    if (!user || !firestore) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save keywords.',
        variant: 'destructive',
      });
      return;
    }

    const processedKeyword = processKeyword(keyword.name);
    if (!processedKeyword) return;

    const keywordRef = doc(
      firestore,
      `users/${user.uid}/keywords/${processedKeyword}`
    );

    try {
      await setDoc(keywordRef, {
        name: keyword.name,
        originalId: keyword.id,
        addedAt: serverTimestamp(),
      });
      setSavedKeywords((prev) => new Set(prev).add(processedKeyword));
      toast({
        title: 'Keyword Saved',
        description: `"${keyword.name}" has been added to your list.`,
      });
    } catch (error) {
      console.error('Error saving keyword:', error);
      toast({
        title: 'Error',
        description: 'Could not save keyword. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveKeyword = async (keyword: Keyword) => {
    if (!user || !firestore) return;

    const processedKeyword = processKeyword(keyword.name);
    const keywordRef = doc(
      firestore,
      `users/${user.uid}/keywords/${processedKeyword}`
    );

    try {
      await deleteDoc(keywordRef);
      setSavedKeywords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(processedKeyword);
        return newSet;
      });
      toast({
        title: 'Keyword Removed',
        description: `"${keyword.name}" has been removed from your list.`,
      });
    } catch (error) {
      console.error('Error removing keyword:', error);
      toast({
        title: 'Error',
        description: 'Could not remove keyword. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (keywords.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Keywords</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => {
          const processedKeyword = processKeyword(keyword.name);
          const isSaved = savedKeywords.has(processedKeyword);

          return (
            <div key={keyword.id} className="group relative">
              <Badge variant="secondary" className="text-base pr-8">
                {keyword.name}
              </Badge>
              {user && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    isSaved
                      ? handleRemoveKeyword(keyword)
                      : handleAddKeyword(keyword)
                  }
                >
                  {isSaved ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <PlusCircle className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
