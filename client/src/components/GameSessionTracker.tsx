import { useState } from 'react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example component showing how to integrate real-time data tracking
export function GameSessionTracker() {
  const { recordGameSession, recordQuizCompletion, recordMissionCompletion } = useUserProgress();
  const [gameTime, setGameTime] = useState(0);
  const [gameScore, setGameScore] = useState(0);

  const startTimer = () => {
    setGameTime(0);
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    
    // Store interval ID to clear later
    (window as any).gameTimer = interval;
  };

  const stopTimer = () => {
    if ((window as any).gameTimer) {
      clearInterval((window as any).gameTimer);
    }
  };

  const simulateGameCompletion = () => {
    stopTimer();
    
    // Record the game session
    recordGameSession({
      gameId: 'demo-game',
      gameName: 'Demo Fire Safety Game',
      score: gameScore,
      timeSpent: Math.floor(gameTime / 60), // Convert seconds to minutes
      completed: true
    });
    
    alert(`Game completed! Score: ${gameScore}%, Time: ${Math.floor(gameTime / 60)}m ${gameTime % 60}s`);
  };

  const simulateQuizCompletion = () => {
    const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
    const timeSpent = Math.floor(Math.random() * 10) + 5; // Random time 5-15 minutes
    
    recordQuizCompletion(score, timeSpent);
    alert(`Quiz completed! Score: ${score}%, Time: ${timeSpent} minutes`);
  };

  const simulateMissionCompletion = () => {
    recordMissionCompletion('demo-mission');
    alert('Mission completed!');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🎮 Game Session Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Demo Game Session</p>
          <div className="text-2xl font-bold text-blue-600">
            {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
          </div>
          <p className="text-sm text-gray-500">Time Elapsed</p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={startTimer} 
            className="w-full"
            disabled={gameTime > 0}
          >
            Start Game Timer
          </Button>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setGameScore(Math.floor(Math.random() * 40) + 60)}
              variant="outline"
              className="flex-1"
            >
              Set Random Score
            </Button>
            <Button 
              onClick={simulateGameCompletion}
              className="flex-1"
              disabled={gameTime === 0}
            >
              Complete Game
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Quick Actions:</p>
          <div className="space-y-2">
            <Button 
              onClick={simulateQuizCompletion}
              variant="outline"
              className="w-full"
            >
              Complete Quiz
            </Button>
            <Button 
              onClick={simulateMissionCompletion}
              variant="outline"
              className="w-full"
            >
              Complete Mission
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          <p>This demonstrates how to track real game data.</p>
          <p>Check your Profile page to see updated statistics!</p>
        </div>
      </CardContent>
    </Card>
  );
}





