// src/app/my-keywords/page.tsx
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, Firestore } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedKeyword {
  id: string;
  name: string;
}

export default function MyKeywordsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const keywordsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/keywords`);
  }, [user, firestore]);

  const { data: keywords, isLoading: isKeywordsLoading } = useCollection<SavedKeyword>(keywordsQuery);
  
  const handleRemoveKeyword = async (keywordId: string, keywordName: string) => {
    if (!user || !firestore) return;
    const keywordRef = doc(firestore, `users/${user.uid}/keywords/${keywordId}`);
    try {
      await deleteDoc(keywordRef);
      toast({
        title: "Keyword Removed",
        description: `"${keywordName}" has been removed from your list.`,
      });
    } catch (error) {
      console.error("Error removing keyword:", error);
      toast({
        title: "Error",
        description: "Could not remove keyword. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isUserLoading) {
    return (
        <div className="container py-8">
            <h1 className="text-4xl font-bold mb-6">My Keywords</h1>
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
            </div>
        </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-4xl font-bold mb-6">My Keywords</h1>
        <p className="text-muted-foreground text-lg">
          Please sign in to view and manage your keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">My Keywords</h1>
      
      {isKeywordsLoading && (
        <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
        </div>
      )}
      
      {!isKeywordsLoading && keywords && keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <div key={keyword.id} className="group relative">
              <Badge variant="default" className="text-base pr-8 rounded-full">
                {keyword.name}
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 right-0 transform -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                onClick={() => handleRemoveKeyword(keyword.id, keyword.name)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {!isKeywordsLoading && (!keywords || keywords.length === 0) && (
         <p className="text-muted-foreground text-lg mt-8 text-center">You haven't saved any keywords yet.</p>
      )}
    </div>
  );
}
