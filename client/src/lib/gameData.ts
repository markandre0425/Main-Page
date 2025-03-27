import { Mission, MiniGame, Badge, SafetyTip, Hazard } from "@shared/schema";

// Sample mission data
export const missions: Mission[] = [
  {
    id: 1,
    title: "Kitchen Fire Prevention",
    description: "Learn how to prevent kitchen fires by identifying hazards and safe cooking practices.",
    difficulty: "beginner",
    points: 50,
    imageUrl: "https://placehold.co/500x240/FF5722/FFFFFF/svg?text=Kitchen+Safety",
    steps: [
      { id: 1, title: "Learn", description: "Learn about common kitchen fire hazards", completed: false },
      { id: 2, title: "Identify", description: "Identify unsafe cooking practices", completed: false },
      { id: 3, title: "Practice", description: "Practice safe cooking techniques", completed: false },
      { id: 4, title: "Quiz", description: "Test your knowledge", completed: false }
    ]
  },
  {
    id: 2,
    title: "Building Escape",
    description: "Navigate through a building during a fire emergency using escape routes and safety techniques.",
    difficulty: "advanced",
    points: 75,
    imageUrl: "https://placehold.co/500x240/E91E63/FFFFFF/svg?text=Building+Escape",
    steps: [
      { id: 1, title: "Plan", description: "Create an escape plan", completed: false },
      { id: 2, title: "Locate", description: "Locate emergency exits", completed: false },
      { id: 3, title: "Practice", description: "Practice evacuation techniques", completed: false },
      { id: 4, title: "Quiz", description: "Test your knowledge", completed: false }
    ]
  },
  {
    id: 3,
    title: "Smoke Detector Check",
    description: "Learn how to inspect, test, and maintain smoke detectors to keep your home safe.",
    difficulty: "intermediate",
    points: 60,
    imageUrl: "https://placehold.co/500x240/FFC107/FFFFFF/svg?text=Smoke+Detector",
    steps: [
      { id: 1, title: "Learn", description: "Learn about smoke detector types", completed: false },
      { id: 2, title: "Inspect", description: "Inspect smoke detectors", completed: false },
      { id: 3, title: "Test", description: "Test smoke detectors", completed: false },
      { id: 4, title: "Maintain", description: "Maintain smoke detectors", completed: false }
    ]
  }
];

// Sample mini-game data
export const miniGames: MiniGame[] = [
  {
    id: 1,
    title: "Spot the Hazard",
    description: "Find all the fire hazards in the room before time runs out!",
    type: "spot-hazard",
    bestScore: 7,
    imageUrl: "https://placehold.co/500x300/2196F3/FFFFFF/svg?text=Spot+the+Hazard",
    isExternal: false,
    externalUrl: null
  },
  {
    id: 2,
    title: "Fire Extinguisher Training",
    description: "Learn the PASS method and put out virtual fires with the correct technique!",
    type: "extinguisher-training",
    bestScore: null,
    imageUrl: "https://placehold.co/500x300/FF5722/FFFFFF/svg?text=Fire+Extinguisher",
    isExternal: false,
    externalUrl: null
  },
  {
    id: 3,
    title: "NFPA Fire Prevention Games",
    description: "A collection of interactive fire safety games for kids from the National Fire Protection Association",
    type: "external",
    bestScore: null,
    imageUrl: "https://placehold.co/500x300/4CAF50/FFFFFF/svg?text=NFPA+Games",
    isExternal: true,
    externalUrl: "https://sparky.org/games"
  },
  {
    id: 4,
    title: "Fire Safety for Kids",
    description: "Interactive educational games about fire safety for younger children",
    type: "external",
    bestScore: null,
    imageUrl: "https://placehold.co/500x300/E91E63/FFFFFF/svg?text=Kids+Fire+Safety",
    isExternal: true,
    externalUrl: "https://www.firesafetyforkids.org/games.html"
  }
];

// Sample badge data
export const badges: Badge[] = [
  {
    id: 1,
    name: "Safety Scout",
    description: "Completed your first fire safety mission",
    icon: "fa-medal",
    requirement: "Complete 1 mission",
    color: "bg-[#4CAF50]"
  },
  {
    id: 2,
    name: "Fire Fighter",
    description: "Successfully used a fire extinguisher",
    icon: "fa-fire-extinguisher",
    requirement: "Complete extinguisher training",
    color: "bg-[#2196F3]"
  },
  {
    id: 3,
    name: "Locked",
    description: "This badge is still locked",
    icon: "fa-question",
    requirement: "Reach level 10",
    color: "bg-gray-300"
  },
  {
    id: 4,
    name: "Escape Expert",
    description: "Created a home fire escape plan",
    icon: "fa-route",
    requirement: "Complete the building escape mission",
    color: "bg-[#E91E63]"
  },
  {
    id: 5,
    name: "Smoke Sentry",
    description: "Learned how to maintain smoke detectors",
    icon: "fa-bell",
    requirement: "Complete smoke detector mission",
    color: "bg-[#FFC107]"
  },
  {
    id: 6,
    name: "Safety Superhero",
    description: "Completed all basic fire safety missions",
    icon: "fa-shield-alt",
    requirement: "Complete all beginner missions",
    color: "bg-[#9C27B0]"
  }
];

// Sample safety tips
export const safetyTips: SafetyTip[] = [
  {
    id: 1,
    title: "Check Smoke Detectors Monthly",
    content: "Test your smoke detectors every month by pressing the test button. Replace batteries at least once a year or when you hear the low-battery warning.",
    icon: "fa-lightbulb",
    category: "equipment",
    sourceName: "NFPA"
  },
  {
    id: 2,
    title: "Create a Fire Escape Plan",
    content: "Make sure everyone in your home knows two ways out of each room and has a meeting place outside. Practice your escape plan twice a year.",
    icon: "fa-door-open",
    category: "escape",
    sourceName: "Fire Safety Heroes"
  },
  {
    id: 3,
    title: "Keep a Fire Extinguisher Handy",
    content: "Have a fire extinguisher in your kitchen and learn how to use it. Remember the PASS technique: Pull, Aim, Squeeze, Sweep.",
    icon: "fa-fire-extinguisher",
    category: "equipment",
    sourceName: "Red Cross"
  },
  {
    id: 4,
    title: "Never Leave Cooking Unattended",
    content: "Stay in the kitchen when frying, grilling, or broiling food. If you leave the kitchen, turn off the stove.",
    icon: "fa-utensils",
    category: "cooking",
    sourceName: "Fire Safety Heroes"
  },
  {
    id: 5,
    title: "Test and Dust Smoke Alarms",
    content: "In addition to monthly testing, dust your smoke alarms at least once a year to ensure they function properly. Dust can interfere with sensors.",
    icon: "fa-bell",
    category: "home",
    sourceName: "U.S. Fire Administration"
  },
  {
    id: 6,
    title: "Keep Flammable Items Away From Heat",
    content: "Store flammable items like oven mitts, wooden utensils, and paper towels at least three feet away from the stovetop and other heat sources.",
    icon: "fa-fire",
    category: "prevention",
    sourceName: "Fire Safety Heroes"
  },
  {
    id: 7,
    title: "Check Electrical Cords",
    content: "Regularly inspect cords for damage. Replace any that are frayed, cracked, or otherwise damaged to prevent electrical fires.",
    icon: "fa-bolt",
    category: "electrical",
    sourceName: "NFPA"
  },
  {
    id: 8,
    title: "Teach Children Fire Safety",
    content: "Educate children about the dangers of fire and make sure they know to never play with matches, lighters, or candles.",
    icon: "fa-child",
    category: "children",
    sourceName: "Fire Safety Heroes"
  },
  {
    id: 9,
    title: "Close Doors at Night",
    content: "Sleeping with bedroom doors closed can slow the spread of fire and smoke, giving you more time to escape in case of emergency.",
    icon: "fa-door-closed",
    category: "escape",
    sourceName: "Close Your Door Campaign"
  },
  {
    id: 10,
    title: "Keep Fire Extinguishers Accessible",
    content: "Store fire extinguishers in easily accessible locations and make sure everyone in the household knows how to use them.",
    icon: "fa-fire-extinguisher",
    category: "equipment",
    sourceName: "Fire Safety Heroes"
  }
];

// Sample hazards for the "Spot the Hazard" game
export const hazards: Hazard[] = [
  {
    id: 1,
    name: "Overloaded Outlet",
    description: "Too many plugs in one outlet can cause overheating and fire.",
    location: "living-room",
    xPosition: 25,
    yPosition: 50,
    imageUrl: "https://placehold.co/100x100/FF5722/FFFFFF/svg?text=Outlet"
  },
  {
    id: 2,
    name: "Unattended Candle",
    description: "Never leave burning candles unattended.",
    location: "living-room",
    xPosition: 65,
    yPosition: 30,
    imageUrl: "https://placehold.co/100x100/FFC107/FFFFFF/svg?text=Candle"
  },
  {
    id: 3,
    name: "Blocked Exit",
    description: "Keep exits clear of furniture and clutter.",
    location: "living-room",
    xPosition: 80,
    yPosition: 70,
    imageUrl: "https://placehold.co/100x100/E91E63/FFFFFF/svg?text=Exit"
  },
  {
    id: 4,
    name: "Frayed Cable",
    description: "Damaged electrical cords can cause fires.",
    location: "living-room",
    xPosition: 15,
    yPosition: 85,
    imageUrl: "https://placehold.co/100x100/2196F3/FFFFFF/svg?text=Cable"
  }
];
