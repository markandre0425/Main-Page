import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSound } from "@/hooks/use-sound";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentQuestion: number;
  totalQuestions: number;
  showNavigation?: boolean;
}

export default function QuizQuestion({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
  onNext,
  onPrevious,
  currentQuestion,
  totalQuestions,
  showNavigation = true,
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { play } = useSound();

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(null);
  }, [question]);

  const handleOptionChange = (value: string) => {
    if (hasAnswered) return;
    setSelectedOption(value);
  };

  const handleSubmit = () => {
    if (!selectedOption || hasAnswered) return;
    
    const correct = selectedOption === correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);
    onAnswer(correct);
    
    play(correct ? "correct" : "wrong");
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden w-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-dark-navy mb-4">{question}</h3>
        
        <RadioGroup value={selectedOption || ""} className="space-y-3 mb-6">
          {options.map((option, index) => (
            <div 
              key={index} 
              className={`flex items-center rounded-lg p-3 ${
                hasAnswered && option === correctAnswer
                  ? "bg-green-100 border border-green-300"
                  : hasAnswered && option === selectedOption && option !== correctAnswer
                  ? "bg-red-100 border border-red-300"
                  : "bg-gray-50 hover:bg-gray-100 border border-transparent"
              }`}
            >
              <RadioGroupItem 
                value={option} 
                id={`option-${index}`} 
                disabled={hasAnswered}
                onClick={() => handleOptionChange(option)}
              />
              <Label 
                htmlFor={`option-${index}`} 
                className="ml-3 text-gray-700 flex-grow cursor-pointer"
              >
                {option}
              </Label>
              {hasAnswered && option === correctAnswer && (
                <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
              )}
              {hasAnswered && option === selectedOption && option !== correctAnswer && (
                <XCircle className="h-5 w-5 text-red-600 ml-2" />
              )}
            </div>
          ))}
        </RadioGroup>
        
        {hasAnswered && explanation && (
          <Alert className={isCorrect ? "bg-green-50 border-green-200 mb-4" : "bg-orange-50 border-orange-200 mb-4"}>
            <AlertTitle>
              {isCorrect ? "Correct!" : "Not quite right"}
            </AlertTitle>
            <AlertDescription>{explanation}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between items-center">
          {showNavigation && (
            <Button 
              variant="outline" 
              onClick={onPrevious} 
              disabled={currentQuestion <= 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
          )}
          
          <div className="text-center">
            <span className="text-gray-500">Question {currentQuestion} of {totalQuestions}</span>
            <div className="w-40 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-fire-red h-2 rounded-full" 
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          {!hasAnswered ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedOption}
              className="bg-fire-red hover:bg-red-700"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="bg-fire-red hover:bg-red-700 flex items-center"
            >
              {currentQuestion === totalQuestions ? "Finish" : "Next"} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
