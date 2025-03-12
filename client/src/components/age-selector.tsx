import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { FaChild, FaUser, FaUserTie } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { ageGroups } from "@shared/schema";
import { useSound } from "@/hooks/use-sound";

export default function AgeSelector() {
  const { user, updateAgeGroupMutation } = useAuth();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  const { play } = useSound();
  
  useEffect(() => {
    if (user) {
      setSelectedAgeGroup(user.ageGroup);
    }
  }, [user]);
  
  const handleAgeSelect = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
    updateAgeGroupMutation.mutate({ ageGroup });
    play("click");
  };
  
  const ageGroups = [
    { id: "kids", label: "Kids", ageRange: "Ages 5-8", icon: <FaChild className="text-4xl mb-2" />, bgColor: "bg-blue-100 hover:bg-blue-200", textColor: "text-water-blue", borderColor: "border-water-blue" },
    { id: "preteens", label: "Pre-teens", ageRange: "Ages 9-12", icon: <FaChild className="text-4xl mb-2" />, bgColor: "bg-green-100 hover:bg-green-200", textColor: "text-green-600", borderColor: "border-green-600" },
    { id: "teens", label: "Teens", ageRange: "Ages 13-17", icon: <FaUser className="text-4xl mb-2" />, bgColor: "bg-orange-100 hover:bg-orange-200", textColor: "text-fire-orange", borderColor: "border-fire-orange" },
    { id: "adults", label: "Adults", ageRange: "Ages 18+", icon: <FaUserTie className="text-4xl mb-2" />, bgColor: "bg-red-100 hover:bg-red-200", textColor: "text-fire-red", borderColor: "border-fire-red" },
  ];

  return (
    <div className="mx-4 md:mx-auto max-w-6xl mt-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-dark-navy mb-4">Choose Age Group</h3>
          <div className="flex flex-wrap gap-4">
            {ageGroups.map((age) => (
              <button
                key={age.id}
                className={`age-group-btn ${age.bgColor} ${age.textColor} border-2 ${age.borderColor} rounded-lg p-4 flex flex-col items-center transition duration-300 w-full sm:w-auto flex-grow ${selectedAgeGroup === age.id ? 'ring-4 ring-offset-2' : ''}`}
                onClick={() => handleAgeSelect(age.id)}
              >
                {age.icon}
                <span className="font-bold">{age.label}</span>
                <span className="text-sm text-gray-600">{age.ageRange}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
