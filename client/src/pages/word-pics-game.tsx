import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import ImageSet from "@/components/word-pics/image-set";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { gameTypes } from "@shared/schema";
import { CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";

export default function WordPicsGame() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const wordPicId = parseInt(params.id);
  
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { play } = useSound();
  
  // Fetch word pic data
  const { data: wordPic, isLoading, error } = useQuery({
    queryKey: [`/api/word-pics/${wordPicId}`],
    queryFn: async () => {
      const res = await fetch(`/api/word-pics/${wordPicId}`);
      if (!res.ok) throw new Error("Failed to fetch 4 Pics 1 Word game");
      return res.json();
    }
  });
  
  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data: { completed: boolean; score: number }) => {
      return apiRequest("POST", "/api/progress", {
        gameType: gameTypes.WORD_PICS,
        gameId: wordPicId,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    }
  });
  
  const handleWordSolved = () => {
    setScore(100);
    setCompleted(true);
    
    saveProgressMutation.mutate({
      completed: true,
      score: 100
    });
    
    play("achievement");
  };
  
  const handleSkip = () => {
    // Navigate back to games
    navigate("/games");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !wordPic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load 4 Pics 1 Word game. Please try again."}
            </AlertDescription>
          </Alert>
          <Button variant="outline" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-baloo font-bold text-dark-navy">4 Pics 1 Word: Fire Safety</h1>
          <Button variant="outline" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
        </div>
        
        <p className="text-gray-600 mb-8">
          Look at the four images and guess the fire safety-related word they all have in common. 
          The word has {wordPic.word.length} letters.
        </p>
        
        {completed && (
          <Card className="bg-green-50 border-green-200 mb-8">
            <CardContent className="p-6 flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 mr-4" />
              <div>
                <h3 className="font-bold text-green-800">Word Guessed Correctly!</h3>
                <p className="text-green-700">The word was: <span className="font-bold">{wordPic.word.toUpperCase()}</span></p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <ImageSet 
          word={wordPic.word}
          imageUrls={wordPic.imageUrls}
          onSolve={handleWordSolved}
          onSkip={handleSkip}
        />
      </main>
      
      <Footer />
    </div>
  );
}
