import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import QuizQuestion from "@/components/quiz/quiz-question";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { gameTypes } from "@shared/schema";
import { CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";

export default function QuizGame() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const quizId = parseInt(params.id);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { play } = useSound();
  
  // Fetch quiz data
  const { data: quiz, isLoading, error } = useQuery({
    queryKey: [`/api/quizzes/${quizId}`],
    queryFn: async () => {
      const res = await fetch(`/api/quizzes/${quizId}`);
      if (!res.ok) throw new Error("Failed to fetch quiz");
      return res.json();
    }
  });
  
  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data: { completed: boolean; score: number }) => {
      return apiRequest("POST", "/api/progress", {
        gameType: gameTypes.QUIZ,
        gameId: quizId,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    }
  });
  
  useEffect(() => {
    // Save progress whenever answers change
    if (quiz && answers.length > 0 && !quizCompleted) {
      const score = Math.round((answers.filter(Boolean).length / quiz.questions.length) * 100);
      
      saveProgressMutation.mutate({
        completed: false,
        score: score
      });
    }
  }, [answers, quiz, quizCompleted]);
  
  const handleAnswer = (isCorrect: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = isCorrect;
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      completeQuiz();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const completeQuiz = () => {
    setQuizCompleted(true);
    const score = Math.round((answers.filter(Boolean).length / quiz!.questions.length) * 100);
    
    saveProgressMutation.mutate({
      completed: true,
      score: score
    });
    
    play("levelUp");
  };
  
  const calculateScore = () => {
    if (!quiz) return 0;
    return Math.round((answers.filter(Boolean).length / quiz.questions.length) * 100);
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
  
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load quiz. Please try again."}
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
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-baloo font-bold text-dark-navy">{quiz.title}</h1>
          <Button variant="outline" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
        </div>
        
        <p className="text-gray-600 mb-8">{quiz.description}</p>
        
        {quizCompleted ? (
          <Card className="bg-white rounded-xl shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-gray-600">
                  You scored {answers.filter(Boolean).length} out of {quiz.questions.length} questions correctly.
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Your Score</h3>
                  <span className="text-xl font-bold text-fire-orange">{calculateScore()}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-fire-orange to-fire-red h-4 rounded-full"
                    style={{ width: `${calculateScore()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button className="w-full" onClick={() => setQuizCompleted(false)}>
                  Review Answers
                </Button>
                <Button className="w-full bg-fire-red" onClick={() => navigate("/games")}>
                  Find More Games
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <QuizQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
