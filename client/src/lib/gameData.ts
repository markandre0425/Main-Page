import { Mission, MiniGame, Badge, SafetyTip, Hazard } from "@shared/schema";

// Sample mission data
export const missions: Mission[] = [];

// Sample mini-game data
export const miniGames: MiniGame[] = [];

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

// Age-appropriate safety tips for Kindergarten to Grade 3 (Ages 4-8)
export const safetyTips: SafetyTip[] = [
  // BASIC FIRE KNOWLEDGE (Kindergarten)
  {
    id: 1,
    title: "🔥 Fire is Hot!",
    content: "Fire is very hot and can hurt you. Never touch fire or play with matches and lighters. Tell a grown-up if you see fire.",
    icon: "fa-fire",
    category: "children",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/fireishotcont.mp3"
  },
  {
    id: 2,
    title: "🔥 Fire Needs Three Things",
    content: "Fire needs heat, fuel (which is something to burn), and air to keep burning. Take away any one of these and the fire will go out!",
    icon: "fa-fire",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/fireneeds3thingscont.mp3"
  },
  {
    id: 3,
    title: "🔥 Fire Makes Smoke",
    content: "Fire makes smoke that can make it hard to breathe and see. Smoke goes up, so stay low to the ground where the air is cleaner.",
    icon: "fa-smoke",
    category: "children",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/firemakessmokecont.mp3"
  },

  // EMERGENCY RESPONSE (All Ages)
  {
    id: 4,
    title: "🛑 Stop, Drop, and Roll!",
    content: "If your clothes catch fire: STOP moving, DROP to the ground, and ROLL back and forth until the fire is out. Cover your face with your hands.",
    icon: "fa-child",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/stopdropcont.mp3"
  },
  {
    id: 5,
    title: "🚨 Call 911",
    content: "If there's a fire, call 911 right away! Tell the operator your name, address, and that there's a fire. Stay calm and speak clearly.",
    icon: "fa-phone",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/call911cont.mp3"
  },
  {
    id: 6,
    title: "🚪 Get Low and Go!",
    content: "If there's smoke, crawl on your hands and knees. Smoke rises up, so the air near the floor is cleaner. Stay low and crawl to safety!",
    icon: "fa-door-open",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/getlowandgocont.mp3"
  },
  {
    id: 7,
    title: "🏃‍♂️ Get Out Fast!",
    content: "If you hear a smoke alarm or see fire, get out of the house right away! Do not stop to get toys or pets. Just get out safely!",
    icon: "fa-running",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/getoutfastcont.mp3"
  },
  {
    id: 8,
    title: "🚫 Never Hide!",
    content: "If there is a fire, never hide under the bed or in a closet. Firefighters need to find you quickly. Go outside to your meeting place.",
    icon: "fa-eye",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/neverhidecont.mp3"
  },

  // HOME SAFETY (Prevention)
  {
    id: 9,
    title: "🔥 Don't Play with Fire",
    content: "Matches, lighters, and candles are not toys. They can start fires that hurt people and homes. Only grown-ups should use them.",
    icon: "fa-ban",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/donotplaywithfirecont.mp3"
  },
  {
    id: 10,
    title: "🏠 Know Two Ways Out",
    content: "Every room should have two ways to get out. Practice finding both doors and windows. Know where your family meeting place is outside.",
    icon: "fa-home",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/know2waysoutcont.mp3"
  },
  {
    id: 11,
    title: "🚪 Close Doors Behind You",
    content: "When you leave a room during a fire, close the door behind you. This helps slow down the fire and gives you more time to escape.",
    icon: "fa-door-closed",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/closethedoorbehindcont.mp3"
  },
  {
    id: 12,
    title: "🧸 Keep Toys Away from Heat",
    content: "Keep your toys away from stoves, heaters, and fireplaces. Toys can catch fire easily, they also spread fire to other things.",
    icon: "fa-child",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/keeptoysawaycont.mp3"
  },
  {
    id: 13,
    title: "🔌 Don't Touch Electrical Outlets",
    content: "Never put your fingers or anything metal into the electrical outlets. This will hurt and injure you, cause electric shocks and start fires.",
    icon: "fa-plug",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/donttouchoutletscont.mp3"
  },
  {
    id: 14,
    title: "🕯️ Candles Need Watching",
    content: "Never leave candles burning when you are not in the room. Always blow them out when you are done. Ask grown-ups for help.",
    icon: "fa-candle",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/candlesneedcont.mp3"
  },

  // FIREFIGHTERS AND HELPERS
  {
    id: 15,
    title: "👨‍🚒 Firefighters are Helpers",
    content: "Firefighters wear special clothes and masks to help people. Don't be scared! They are here to help you and your family.",
    icon: "fa-fire-extinguisher",
    category: "children",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/firefightersarecont.mp3"
  },
  {
    id: 16,
    title: "🚒 Fire Trucks are Red",
    content: "Fire trucks are big and red with loud sirens. When you see one, move out of the way so firefighters can help people quickly.",
    icon: "fa-truck",
    category: "children",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/firetrucksarecont.mp3"
  },
  {
    id: 17,
    title: "👨‍🚒 Firefighters Have Special Tools",
    content: "Firefighters use hoses to spray water, ladders to reach high places, and axes to break things. They know how to use these tools safely.",
    icon: "fa-tools",
    category: "children",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/firefighterstoolscont.mp3"
  },

  // SMOKE ALARMS AND DETECTION
  {
    id: 18,
    title: "🚨 Smoke Alarms Save Lives",
    content: "Smoke alarms make loud beeping sounds when they detect smoke. They help wake you up if there's a fire at night.",
    icon: "fa-bell",
    category: "equipment",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/smokealarmscont.mp3"
  },
  {
    id: 19,
    title: "🔋 Test Smoke Alarms",
    content: "Ask grown-ups to test smoke alarms every month. Press the test button to make sure it makes a loud beeping sound.",
    icon: "fa-battery",
    category: "equipment",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/testsmokealarmscont.mp3"
  },

  // FAMILY SAFETY PLANS
  {
    id: 20,
    title: "🌳 Family Meeting Place",
    content: "Pick a safe place outside your house where everyone meets if there's a fire. Practice going there with your family.",
    icon: "fa-tree",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/familymeetingplacecont.mp3"
  },
  {
    id: 21,
    title: "📞 Know Your Address",
    content: "Learn your home address and phone number. If you need to call 911, you can tell them where you live so help comes faster.",
    icon: "fa-map-marker",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/knowyouraddcont.mp3"
  },
  {
    id: 22,
    title: "👨‍👩‍👧‍👦 Practice Fire Drills",
    content: "Practice fire drills with your family. Know how to get out of every room in your house quickly and safely.",
    icon: "fa-users",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/practicefiredrillscont.mp3"
  },

  // KITCHEN SAFETY
  {
    id: 23,
    title: "🍳 Kitchen Safety",
    content: "Never cook without a grown-up helping you. Keep towels and paper away from the stove. Turn pot handles away from the edge.",
    icon: "fa-utensils",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/kitchensafetycont.mp3"
  },
  {
    id: 24,
    title: "🔥 Hot Things are Dangerous",
    content: "Stoves, ovens, and hot pans can burn you. Never touch them when they're hot. Ask grown-ups to help with cooking.",
    icon: "fa-fire",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/hotthingsarecont.mp3"
  },

  // OUTDOOR FIRE SAFETY
  {
    id: 25,
    title: "🔥 Campfire Safety",
    content: "Only grown-ups should start campfires. Stay away from the fire and never throw things into it. Always put out fires completely.",
    icon: "fa-campfire",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/campfirecont.mp3"
  },
  {
    id: 26,
    title: "🌿 Don't Play with Fireworks",
    content: "Fireworks are very dangerous and it can burn and hurt you badly!. Only grown-ups should handle fireworks. Watch only from a safe distance.",
    icon: "fa-firework",
    category: "prevention",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/dontplayfireworkscont.mp3"
  },

  // SPECIAL SITUATIONS
  {
    id: 27,
    title: "🚪 Feel Doors Before Opening",
    content: "Before opening a door, feel it with the back of your hand. If it's hot, don't open it, there may be a fire behind that door! Use another way out.",
    icon: "fa-hand",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/feeldoorscont.mp3"
  },
  {
    id: 28,
    title: "🪟 Windows Can Be Exits",
    content: "If you can't use the door, try the window. Make sure grown-ups know how to open windows safely. Practice with them.",
    icon: "fa-window",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/windowscanbeexitcont.mp3"
  },
  {
    id: 29,
    title: "📱 Stay Calm and Call for Help",
    content: "If you're trapped in a room, stay calm. Close the door and go to a window. Wave and shout for help. Don't hide!",
    icon: "fa-phone",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/staycalmcont.mp3"
  },
  {
    id: 30,
    title: "🏠 Never Go Back Inside",
    content: "Once you are safely outside, do not ever go back inside a burning building. Stay at your meeting place and wait for firefighters.",
    icon: "fa-home",
    category: "escape",
    sourceName: "BFP Philippines",
    audioUrl: "/audio/nevergobackcont.mp3"
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
