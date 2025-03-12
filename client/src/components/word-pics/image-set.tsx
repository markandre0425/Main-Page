import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSound } from "@/hooks/use-sound";
import { HelpCircle } from "lucide-react";

interface WordPicsGameProps {
  word: string;
  imageUrls: string[];
  onSolve: () => void;
  onSkip: () => void;
}

export default function ImageSet({ word, imageUrls, onSolve, onSkip }: WordPicsGameProps) {
  const [userInput, setUserInput] = useState("");
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    // Reset state when word changes
    setUserInput("");
    setRevealedLetters([]);
    setHintCount(0);
    setIsCorrect(false);
  }, [word]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCorrect) return;
    
    // Only allow letters
    const value = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    setUserInput(value);
    
    // Check if the answer is correct
    if (value.toLowerCase() === word.toLowerCase()) {
      setIsCorrect(true);
      play("correct");
      onSolve();
    }
  };

  const getHint = () => {
    if (isCorrect || hintCount >= word.length) return;
    
    // Reveal a random letter that hasn't been revealed yet
    const unrevealed = word
      .split("")
      .map((letter, index) => ({ letter, index }))
      .filter(({ letter, index }) => !revealedLetters.includes(letter));
    
    if (unrevealed.length > 0) {
      const randomIndex = Math.floor(Math.random() * unrevealed.length);
      const letterToReveal = unrevealed[randomIndex].letter;
      
      setRevealedLetters([...revealedLetters, letterToReveal]);
      setHintCount(hintCount + 1);
      play("click");
    }
  };

  const renderWordBoxes = () => {
    return (
      <div className="flex justify-center gap-1 mb-4">
        {word.split("").map((letter, index) => (
          <div
            key={index}
            className={`h-10 w-10 sm:h-12 sm:w-12 border-2 ${
              isCorrect ? "border-green-500 bg-green-100" : "border-gray-300"
            } rounded flex items-center justify-center font-bold text-xl`}
          >
            {isCorrect ? letter.toUpperCase() : ""}
          </div>
        ))}
      </div>
    );
  };

  const renderHints = () => {
    if (!revealedLetters.length) return null;
    
    return (
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">Available letters:</p>
        <div className="flex justify-center flex-wrap gap-1 mt-1">
          {Array.from(new Set(revealedLetters)).map((letter, index) => (
            <div
              key={index}
              className="h-8 w-8 bg-blue-100 border border-blue-300 rounded flex items-center justify-center font-medium"
            >
              {letter.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-md w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-dark-navy mb-4 text-center">4 Pics 1 Word</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {imageUrls.map((url, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg border">
              <img 
                src={url} 
                alt={`Image clue ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {renderWordBoxes()}
        {renderHints()}
        
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your answer..."
              className="text-center font-medium text-lg"
              maxLength={word.length}
              disabled={isCorrect}
            />
          </div>
          
          <div className="flex justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={getHint}
                    disabled={isCorrect || hintCount >= word.length}
                    className="flex items-center"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" /> Hint ({hintCount}/{Math.min(3, Math.ceil(word.length / 2))})
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reveal a letter from the word</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              onClick={onSkip}
              variant="outline"
              className="text-gray-500"
              disabled={isCorrect}
            >
              Skip
            </Button>
            
            <Button 
              onClick={() => {
                if (isCorrect) {
                  onSkip(); // Go to next word
                } else {
                  // Check current answer
                  if (userInput.toLowerCase() === word.toLowerCase()) {
                    setIsCorrect(true);
                    play("correct");
                    onSolve();
                  } else {
                    play("wrong");
                  }
                }
              }}
              className="bg-fire-red hover:bg-red-700"
            >
              {isCorrect ? "Next Word" : "Submit"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
