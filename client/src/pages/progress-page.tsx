
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gameTypes, ageGroups } from "@shared/schema";
import { gameInfo, formatProgress } from "@/lib/data";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Fetch user progress with auto-refresh
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: async () => {
      const res = await fetch('/api/progress');
      if (!res.ok) throw new Error("Failed to fetch user progress");
      return res.json();
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true // Refetch when tab gets focus
  });

  // Fetch all games with auto-refresh
  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["/api/quizzes"],
    queryFn: async () => {
      const res = await fetch(`/api/quizzes`);
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      return res.json();
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true
  });

  const { data: crosswords, isLoading: crosswordsLoading } = useQuery({
    queryKey: ["/api/crosswords"],
    queryFn: async () => {
      const res = await fetch(`/api/crosswords`);
      if (!res.ok) throw new Error("Failed to fetch crosswords");
      return res.json();
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true
  });

  const { data: wordScrambles, isLoading: wordScramblesLoading } = useQuery({
    queryKey: ["/api/word-scrambles"],
    queryFn: async () => {
      const res = await fetch(`/api/word-scrambles`);
      if (!res.ok) throw new Error("Failed to fetch word scrambles");
      return res.json();
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true
  });

  const { data: wordPics, isLoading: wordPicsLoading } = useQuery({
    queryKey: ["/api/word-pics"],
    queryFn: async () => {
      const res = await fetch(`/api/word-pics`);
      if (!res.ok) throw new Error("Failed to fetch word pics");
      return res.json();
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true
  });

  const isLoading = progressLoading || quizzesLoading || crosswordsLoading || wordScramblesLoading || wordPicsLoading;

  // Calculate progress for each game type
  const calculateGameTypeProgress = (gameType: string) => {
    if (!userProgress) return 0;

    const progressForType = userProgress.filter(p => p.gameType === gameType);
    if (progressForType.length === 0) return 0;

    const completed = progressForType.filter(p => p.completed).length;
    const totalScore = progressForType.reduce((sum, p) => sum + p.score, 0);

    return Math.round(totalScore / progressForType.length);
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!userProgress || userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, p) => sum + p.score, 0);
    return Math.round(totalScore / userProgress.length);
  };

  // Get games by type
  const getGamesByType = (type: string) => {
    switch (type) {
      case gameTypes.QUIZ:
        return quizzes || [];
      case gameTypes.CROSSWORD:
        return crosswords || [];
      case gameTypes.WORD_SCRAMBLE:
        return wordScrambles || [];
      case gameTypes.WORD_PICS:
        return wordPics || [];
      default:
        return [];
    }
  };

  // Get progress for specific game
  const getProgressForGame = (gameType: string, gameId: number) => {
    if (!userProgress) return null;
    return userProgress.find(p => p.gameType === gameType && p.gameId === gameId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-baloo text-dark-navy mb-2">
              My Progress
            </h1>
            <p className="text-gray-600">
              Track your learning journey and see how far you've come
            </p>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="crosswords">Crosswords</TabsTrigger>
            <TabsTrigger value="word-games">Word Games</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {isLoading ? (
                Array(4).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Overall Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatProgress(calculateOverallProgress())}%</div>
                      <Progress value={calculateOverallProgress()} className="h-2 mt-2" />
                      <p className="text-xs text-muted-foreground pt-2">
                        {userProgress?.filter(p => p.completed).length || 0} of {userProgress?.length || 0} activities completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Quiz Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatProgress(calculateGameTypeProgress(gameTypes.QUIZ))}%</div>
                      <Progress value={calculateGameTypeProgress(gameTypes.QUIZ)} className="h-2 mt-2" />
                      <p className="text-xs text-muted-foreground pt-2">
                        {userProgress?.filter(p => p.gameType === gameTypes.QUIZ && p.completed).length || 0} of {quizzes?.length || 0} quizzes completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Crossword Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatProgress(calculateGameTypeProgress(gameTypes.CROSSWORD))}%</div>
                      <Progress value={calculateGameTypeProgress(gameTypes.CROSSWORD)} className="h-2 mt-2" />
                      <p className="text-xs text-muted-foreground pt-2">
                        {userProgress?.filter(p => p.gameType === gameTypes.CROSSWORD && p.completed).length || 0} of {crosswords?.length || 0} crosswords completed
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Word Games Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatProgress(
                          (calculateGameTypeProgress(gameTypes.WORD_SCRAMBLE) + 
                           calculateGameTypeProgress(gameTypes.WORD_PICS)) / 2
                        )}%
                      </div>
                      <Progress 
                        value={
                          (calculateGameTypeProgress(gameTypes.WORD_SCRAMBLE) + 
                           calculateGameTypeProgress(gameTypes.WORD_PICS)) / 2
                        } 
                        className="h-2 mt-2" 
                      />
                      <p className="text-xs text-muted-foreground pt-2">
                        {userProgress?.filter(p => (p.gameType === gameTypes.WORD_SCRAMBLE || p.gameType === gameTypes.WORD_PICS) && p.completed).length || 0} of {(wordScrambles?.length || 0) + (wordPics?.length || 0)} word games completed
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <h2 className="text-xl font-bold font-baloo text-dark-navy mb-4">
              Recent Activities
            </h2>

            {isLoading ? (
              Array(3).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full mb-4" />
              ))
            ) : userProgress && userProgress.length > 0 ? (
              <div className="space-y-4">
                {[...userProgress]
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((progress) => {
                    const gamesList = getGamesByType(progress.gameType);
                    const game = gamesList.find(g => g.id === progress.gameId);
                    
                    return game ? (
                      <Card key={`${progress.gameType}-${progress.gameId}`}>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{game.title}</h3>
                            <p className="text-sm text-gray-500">{gameInfo[progress.gameType].label}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatProgress(progress.score)}%</div>
                            <p className="text-xs text-gray-500">{progress.completed ? "Completed" : "In progress"}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null;
                  })}
              </div>
            ) : (
              <p className="text-gray-500">No activities completed yet. Start playing to track your progress!</p>
            )}
          </TabsContent>

          <TabsContent value="quizzes">
            <h2 className="text-xl font-bold font-baloo text-dark-navy mb-4">
              Quiz Progress
            </h2>
            
            {isLoading ? (
              Array(3).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full mb-4" />
              ))
            ) : quizzes && quizzes.length > 0 ? (
              <div className="space-y-4">
                {quizzes.map((quiz) => {
                  const progress = getProgressForGame(gameTypes.QUIZ, quiz.id);
                  return (
                    <Card key={quiz.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">{quiz.description.substring(0, 60)}...</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatProgress(progress?.score || 0)}%</div>
                            <p className="text-xs text-gray-500">{progress?.completed ? "Completed" : progress?.score ? "In progress" : "Not started"}</p>
                          </div>
                          <Link to={`/quiz/${quiz.id}`}>
                            <Button variant="outline" size="sm">
                              {progress?.completed ? "Review" : progress?.score ? "Continue" : "Start"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No quizzes available yet.</p>
            )}
          </TabsContent>

          <TabsContent value="crosswords">
            <h2 className="text-xl font-bold font-baloo text-dark-navy mb-4">
              Crossword Progress
            </h2>
            
            {isLoading ? (
              Array(3).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full mb-4" />
              ))
            ) : crosswords && crosswords.length > 0 ? (
              <div className="space-y-4">
                {crosswords.map((crossword) => {
                  const progress = getProgressForGame(gameTypes.CROSSWORD, crossword.id);
                  return (
                    <Card key={crossword.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{crossword.title}</h3>
                          <p className="text-sm text-gray-500">{crossword.description.substring(0, 60)}...</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatProgress(progress?.score || 0)}%</div>
                            <p className="text-xs text-gray-500">{progress?.completed ? "Completed" : progress?.score ? "In progress" : "Not started"}</p>
                          </div>
                          <Link to={`/crossword/${crossword.id}`}>
                            <Button variant="outline" size="sm">
                              {progress?.completed ? "Review" : progress?.score ? "Continue" : "Start"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No crosswords available yet.</p>
            )}
          </TabsContent>

          <TabsContent value="word-games">
            <h2 className="text-xl font-bold font-baloo text-dark-navy mb-4">
              Word Scrambles
            </h2>
            
            {isLoading ? (
              Array(2).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full mb-4" />
              ))
            ) : wordScrambles && wordScrambles.length > 0 ? (
              <div className="space-y-4 mb-8">
                {wordScrambles.map((wordScramble) => {
                  const progress = getProgressForGame(gameTypes.WORD_SCRAMBLE, wordScramble.id);
                  return (
                    <Card key={wordScramble.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Word Scramble: {wordScramble.category}</h3>
                          <p className="text-sm text-gray-500">Difficulty: {wordScramble.difficulty}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatProgress(progress?.score || 0)}%</div>
                            <p className="text-xs text-gray-500">{progress?.completed ? "Completed" : progress?.score ? "In progress" : "Not started"}</p>
                          </div>
                          <Link to={`/word-scramble/${wordScramble.id}`}>
                            <Button variant="outline" size="sm">
                              {progress?.completed ? "Review" : progress?.score ? "Continue" : "Start"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 mb-8">No word scrambles available yet.</p>
            )}

            <h2 className="text-xl font-bold font-baloo text-dark-navy mb-4">
              Word Pictures
            </h2>
            
            {isLoading ? (
              Array(2).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full mb-4" />
              ))
            ) : wordPics && wordPics.length > 0 ? (
              <div className="space-y-4">
                {wordPics.map((wordPic) => {
                  const progress = getProgressForGame(gameTypes.WORD_PICS, wordPic.id);
                  return (
                    <Card key={wordPic.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Word Pictures: {wordPic.word}</h3>
                          <p className="text-sm text-gray-500">Difficulty: {wordPic.difficulty}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatProgress(progress?.score || 0)}%</div>
                            <p className="text-xs text-gray-500">{progress?.completed ? "Completed" : progress?.score ? "In progress" : "Not started"}</p>
                          </div>
                          <Link to={`/word-pics/${wordPic.id}`}>
                            <Button variant="outline" size="sm">
                              {progress?.completed ? "Review" : progress?.score ? "Continue" : "Start"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No word pictures available yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
