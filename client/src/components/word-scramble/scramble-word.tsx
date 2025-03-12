import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/use-sound";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, SkipForward } from "lucide-react";

interface WordScrambleProps {
  word: string;
  hint: string;
  category: string;
  onSolve: () => void;
  onSkip: () => void;
}

export default function ScrambleWord({ word, hint, category, onSolve, onSkip }: WordScrambleProps) {
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; index: number }[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    // Scramble the word when it changes
    scrambleWord();
  }, [word]);

  const scrambleWord = () => {
    // Reset state
    setSelectedLetters([]);
    setRevealed(false);
    setHintUsed(false);
    
    // Create a copy of the word and shuffle it
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    setScrambledLetters(letters);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (revealed) return;
    
    // Check if this letter is already selected
    const alreadySelectedIndex = selectedLetters.findIndex(item => item.index === index);
    
    if (alreadySelectedIndex !== -1) {
      // Remove from selected
      const newSelected = [...selectedLetters];
      newSelected.splice(alreadySelectedIndex, 1);
      setSelectedLetters(newSelected);
    } else {
      // Add to selected
      setSelectedLetters([...selectedLetters, { letter, index }]);
    }
    
    play("click");
  };

  const checkAnswer = () => {
    const attempt = selectedLetters.map(item => item.letter).join("");
    
    if (attempt.toLowerCase() === word.toLowerCase()) {
      setRevealed(true);
      play("correct");
      onSolve();
    } else {
      // Shake the letters to indicate wrong answer
      play("wrong");
    }
  };

  const showHint = () => {
    setHintUsed(true);
    play("click");
  };

  const isLetterSelected = (index: number) => {
    return selectedLetters.some(item => item.index === index);
  };

  return (
    <Card className="bg-white shadow-md w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-dark-navy">Word Scramble</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-gray-700">
            <span className="font-medium">Hint:</span> {hint}
          </p>
        </div>
        
        {/* Scrambled letters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {scrambledLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              disabled={revealed || isLetterSelected(index)}
              className={`
                h-12 w-12 rounded-lg font-bold text-xl flex items-center justify-center
                transform transition-transform duration-150
                ${revealed ? 'bg-green-100 border border-green-500 text-green-700' : ''}
                ${
                  isLetterSelected(index)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-orange-100 border border-orange-300 text-orange-800 hover:bg-orange-200 active:scale-95'
                }
              `}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* User's attempt */}
        <div className="mb-6">
          <div className="flex justify-center gap-1 mb-2">
            {word.split("").map((_, index) => (
              <div
                key={index}
                className={`
                  h-12 w-12 border-2 rounded-lg flex items-center justify-center font-bold text-xl
                  ${
                    revealed 
                      ? 'border-green-500 bg-green-100 text-green-800' 
                      : 'border-gray-300'
                  }
                `}
              >
                {revealed 
                  ? word[index].toUpperCase() 
                  : selectedLetters[index] 
                    ? selectedLetters[index].letter.toUpperCase() 
                    : ''}
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={showHint}
                  disabled={revealed || hintUsed}
                  className="flex items-center"
                >
                  <HelpCircle className="h-4 w-4 mr-1" /> Hint
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This will show you the hint</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            variant="outline"
            onClick={() => {
              // Reset and scramble again
              scrambleWord();
            }}
            disabled={revealed}
          >
            Shuffle
          </Button>
          
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={revealed}
            className="flex items-center"
          >
            <SkipForward className="h-4 w-4 mr-1" /> Skip
          </Button>
          
          <Button
            onClick={() => {
              if (revealed) {
                onSkip(); // Go to next word
              } else {
                checkAnswer();
              }
            }}
            className="bg-fire-red hover:bg-red-700"
            disabled={selectedLetters.length !== word.length && !revealed}
          >
            {revealed ? "Next Word" : "Check"}
          </Button>
        </div>
        
        {hintUsed && !revealed && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <span className="font-bold">First letter:</span> {word[0].toUpperCase()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
