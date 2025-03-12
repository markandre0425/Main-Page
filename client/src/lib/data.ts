import { ageGroups, gameTypes } from "@shared/schema";

// Game information
export const gameInfo = {
  [gameTypes.QUIZ]: {
    title: "Fire Safety Quiz",
    description: "Test your knowledge with multiple-choice questions about fire safety!",
    imageUrl: "https://cdn.pixabay.com/photo/2017/01/31/22/00/boy-2027570_960_720.png",
  },
  [gameTypes.CROSSWORD]: {
    title: "Fire Crossword",
    description: "Solve crossword puzzles with fire safety-themed words and clues!",
    imageUrl: "https://cdn.pixabay.com/photo/2014/12/21/23/38/crossword-575177_960_720.png",
  },
  [gameTypes.WORD_PICS]: {
    title: "4 Pics 1 Word",
    description: "Guess the fire safety word from four different related images!",
    imageUrl: "https://cdn.pixabay.com/photo/2017/01/31/21/41/puzzle-2027714_960_720.png",
  },
  [gameTypes.WORD_SCRAMBLE]: {
    title: "Word Scramble",
    description: "Unscramble letters to form fire safety-related vocabulary!",
    imageUrl: "https://cdn.pixabay.com/photo/2019/04/25/10/33/word-tiles-4154735_960_720.png",
  }
};

// Age group information
export const ageGroupInfo = [
  { id: ageGroups.KIDS, label: "Kids", ageRange: "Ages 5-8", bgColor: "bg-blue-100 hover:bg-blue-200", textColor: "text-water-blue", borderColor: "border-water-blue" },
  { id: ageGroups.PRETEENS, label: "Pre-teens", ageRange: "Ages 9-12", bgColor: "bg-green-100 hover:bg-green-200", textColor: "text-green-600", borderColor: "border-green-600" },
  { id: ageGroups.TEENS, label: "Teens", ageRange: "Ages 13-17", bgColor: "bg-orange-100 hover:bg-orange-200", textColor: "text-fire-orange", borderColor: "border-fire-orange" },
  { id: ageGroups.ADULTS, label: "Adults", ageRange: "Ages 18+", bgColor: "bg-red-100 hover:bg-red-200", textColor: "text-fire-red", borderColor: "border-fire-red" }
];

// Format progress percentage
export function formatProgress(progress: number): number {
  return Math.min(100, Math.max(0, Math.round(progress)));
}

// Achievement icon mapper
export const achievementIconMap = {
  'award': 'FaAward',
  'fire-extinguisher': 'FaFireExtinguisher',
  'puzzle-piece': 'FaPuzzlePiece',
  'images': 'FaImages',
  'graduation-cap': 'FaGraduationCap'
};

// Default quiz for preview
export const sampleQuizQuestion = {
  question: "What should you do if your clothes catch fire?",
  options: [
    "Run outside for help",
    "Stop, drop, and roll",
    "Take off your clothes immediately",
    "Find water to pour on yourself"
  ],
  correctAnswer: "Stop, drop, and roll",
  explanation: "Stop, drop, and roll is the safest way to extinguish flames on your clothing."
};
