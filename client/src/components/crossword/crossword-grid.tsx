import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/use-sound";

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
}

interface CrosswordProps {
  grid: string[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  onSolve: () => void;
}

export default function CrosswordGrid({ grid, clues, onSolve }: CrosswordProps) {
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [completed, setCompleted] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    // Initialize empty user grid
    const emptyGrid = grid.map(row => row.map(cell => cell === "" ? "" : " "));
    setUserGrid(emptyGrid);
  }, [grid]);

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col] === "") return;
    
    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle direction if clicking the same cell
      setDirection(prev => prev === "across" ? "down" : "across");
    } else {
      setSelectedCell({ row, col });
    }
    
    play("click");
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === "ArrowRight") {
      moveFocus(row, col, 0, 1);
      setDirection("across");
    } else if (e.key === "ArrowLeft") {
      moveFocus(row, col, 0, -1);
      setDirection("across");
    } else if (e.key === "ArrowDown") {
      moveFocus(row, col, 1, 0);
      setDirection("down");
    } else if (e.key === "ArrowUp") {
      moveFocus(row, col, -1, 0);
      setDirection("down");
    } else if (e.key === "Backspace") {
      handleCellChange("", row, col);
      // Move to previous cell
      if (direction === "across") {
        moveFocus(row, col, 0, -1);
      } else {
        moveFocus(row, col, -1, 0);
      }
    }
  };

  const moveFocus = (row: number, col: number, rowDelta: number, colDelta: number) => {
    let newRow = row + rowDelta;
    let newCol = col + colDelta;
    
    // Make sure we stay within the grid
    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
      // Skip empty cells
      if (grid[newRow][newCol] !== "") {
        setSelectedCell({ row: newRow, col: newCol });
      } else {
        // Try to skip over empty cells
        moveFocus(newRow, newCol, rowDelta, colDelta);
      }
    }
  };

  const handleCellChange = (value: string, row: number, col: number) => {
    if (grid[row][col] === "") return;
    
    // Allow only single letters
    if (value.length > 1) {
      value = value.charAt(value.length - 1).toUpperCase();
    } else {
      value = value.toUpperCase();
    }
    
    const newGrid = [...userGrid];
    newGrid[row][col] = value;
    setUserGrid(newGrid);
    
    // Automatically move to next cell if a letter was entered
    if (value !== "" && value !== " ") {
      if (direction === "across") {
        moveFocus(row, col, 0, 1);
      } else {
        moveFocus(row, col, 1, 0);
      }
    }
    
    // Check if the crossword is completed
    checkCompletion(newGrid);
  };

  const checkCompletion = (currentGrid: string[][]) => {
    let isCompleted = true;
    
    // Check across clues
    for (const clue of clues.across) {
      let word = "";
      for (let i = 0; i < clue.answer.length; i++) {
        word += currentGrid[clue.row][clue.col + i];
      }
      if (word.replace(/\s/g, "") !== clue.answer) {
        isCompleted = false;
        break;
      }
    }
    
    // Check down clues
    if (isCompleted) {
      for (const clue of clues.down) {
        let word = "";
        for (let i = 0; i < clue.answer.length; i++) {
          word += currentGrid[clue.row + i][clue.col];
        }
        if (word.replace(/\s/g, "") !== clue.answer) {
          isCompleted = false;
          break;
        }
      }
    }
    
    if (isCompleted && !completed) {
      setCompleted(true);
      play("levelUp");
      onSolve();
    }
  };

  const getClueNumbers = () => {
    const numbers: { [key: string]: number } = {};
    
    [...clues.across, ...clues.down].forEach(clue => {
      const key = `${clue.row}-${clue.col}`;
      numbers[key] = clue.number;
    });
    
    return numbers;
  };

  const clueNumbers = getClueNumbers();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <div className="aspect-square">
              <div className="grid" style={{ 
                display: "grid", 
                gridTemplateRows: `repeat(${grid.length}, 1fr)`,
                gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
                gap: "1px",
                backgroundColor: "#000",
              }}>
                {grid.map((row, rowIndex) => (
                  row.map((cell, colIndex) => (
                    <div 
                      key={`${rowIndex}-${colIndex}`}
                      className={`relative ${
                        cell === "" ? "bg-black" : "bg-white"
                      } ${
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                          ? "bg-blue-100 border-2 border-blue-500"
                          : ""
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell !== "" && clueNumbers[`${rowIndex}-${colIndex}`] && (
                        <span className="absolute top-0 left-0 text-xs font-bold p-0.5">
                          {clueNumbers[`${rowIndex}-${colIndex}`]}
                        </span>
                      )}
                      {cell !== "" && (
                        <Input
                          type="text"
                          value={userGrid[rowIndex]?.[colIndex] || ""}
                          onChange={(e) => handleCellChange(e.target.value, rowIndex, colIndex)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                          className="h-full w-full text-center text-xl font-bold border-0 focus:ring-0"
                          maxLength={1}
                          autoFocus={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                        />
                      )}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:w-1/2">
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Across</h3>
                <ul className="space-y-2">
                  {clues.across.map((clue) => (
                    <li key={`across-${clue.number}`} className="flex">
                      <span className="font-bold w-6">{clue.number}.</span>
                      <span>{clue.clue}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Down</h3>
                <ul className="space-y-2">
                  {clues.down.map((clue) => (
                    <li key={`down-${clue.number}`} className="flex">
                      <span className="font-bold w-6">{clue.number}.</span>
                      <span>{clue.clue}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  className="w-full bg-fire-red hover:bg-red-700"
                  onClick={() => {
                    // Reset the grid
                    const emptyGrid = grid.map(row => row.map(cell => cell === "" ? "" : " "));
                    setUserGrid(emptyGrid);
                    setCompleted(false);
                  }}
                >
                  Reset Crossword
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
