import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FaGamepad, FaTrophy } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

interface WelcomeHeroProps {
  progress: number;
}

export default function WelcomeHero({ progress }: WelcomeHeroProps) {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg mx-4 md:mx-auto max-w-6xl mt-6">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 mb-6 md:mb-0 md:pr-8">
            <div className="flex items-center mb-2">
              <h2 className="text-3xl font-bold text-dark-navy">Welcome back, <span className="text-fire-red">{user.name}</span>!</h2>
              <div className="w-12 h-12 rounded-full ml-4 border-2 border-fire-orange flex items-center justify-center bg-gray-200 text-fire-red">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <p className="text-gray-600 mb-4">Continue your fire safety adventure and earn new achievements!</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-dark-navy">Your Progress</h3>
                <span className="text-fire-orange font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-4 bg-gray-300" />
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/games">
                <Button className="bg-fire-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center">
                  <FaGamepad className="mr-2" />
                  Continue Learning
                </Button>
              </Link>
              <Link href="/achievements">
                <Button variant="outline" className="bg-white border-2 border-fire-orange text-fire-orange hover:bg-fire-orange hover:text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center">
                  <FaTrophy className="mr-2" />
                  View Achievements
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-2/5">
            <img 
              src="https://cdn.pixabay.com/photo/2019/05/26/08/06/fire-4229478_960_720.png" 
              alt="Fire safety mascot" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
