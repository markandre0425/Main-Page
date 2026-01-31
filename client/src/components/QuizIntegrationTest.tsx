import { useUserProgress } from '@/hooks/useUserProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Simple component to test quiz integration
export function QuizIntegrationTest() {
  const { recordQuizCompletion } = useUserProgress();

  const testQuizCompletion = () => {
    // Simulate completing a quiz with random score and time
    const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
    const timeSpent = Math.floor(Math.random() * 10) + 5; // Random time 5-15 minutes
    
    recordQuizCompletion(score, timeSpent);
    
    alert(`Quiz completed! Score: ${score}%, Time: ${timeSpent} minutes\n\nCheck your Profile page to see the updated statistics!`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🧪 Quiz Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          This button simulates completing a quiz to test the real-time data integration.
        </p>
        
        <Button 
          onClick={testQuizCompletion}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Complete Test Quiz
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          <p>After clicking, check your Profile page to see:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Quizzes Taken count increase</li>
            <li>Highest Score update</li>
            <li>Total Time Spent increase</li>
            <li>Achievement progress</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}





