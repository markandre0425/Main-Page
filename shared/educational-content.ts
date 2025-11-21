// BFP-Aligned Educational Content for Kindergarten to Grade 3
export const educationalContent = {
  // Core BFP Fire Safety Principles for Children
  corePrinciples: [
    {
      id: 1,
      title: "Fire Prevention",
      description: "Never play with matches, lighters, or candles",
      ageGroup: "kindergarten-grade3",
      bfpStandard: "Fire Prevention Education for Children"
    },
    {
      id: 2,
      title: "Emergency Response", 
      description: "Call 911 immediately when there's a fire",
      ageGroup: "kindergarten-grade3",
      bfpStandard: "Emergency Communication Skills"
    },
    {
      id: 3,
      title: "Escape Planning",
      description: "Know two ways out of every room",
      ageGroup: "kindergarten-grade3",
      bfpStandard: "Fire Escape Planning"
    },
    {
      id: 4,
      title: "Smoke Safety",
      description: "Get low and crawl under smoke",
      ageGroup: "kindergarten-grade3",
      bfpStandard: "Smoke Inhalation Prevention"
    }
  ],

  // Age-appropriate learning objectives aligned with BFP curriculum
  learningObjectives: {
    kindergarten: [
      "Recognize fire as dangerous",
      "Identify firefighters as helpers",
      "Know to tell adults about fire", 
      "Understand 'Stop, Drop, and Roll'"
    ],
    grade1: [
      "Know emergency number 911",
      "Identify fire hazards in home",
      "Practice fire escape routes",
      "Understand smoke alarm sounds"
    ],
    grade2: [
      "Create family escape plan",
      "Know meeting place outside",
      "Practice crawling under smoke",
      "Identify safe vs unsafe behaviors"
    ],
    grade3: [
      "Lead family fire drills",
      "Help younger siblings escape",
      "Know fire prevention rules",
      "Understand firefighter equipment"
    ]
  },

  // BFP-approved fire safety scenarios for children
  scenarios: [
    {
      id: "home_fire_drill",
      title: "Home Fire Drill Practice",
      simulation: {
        steps: ["hear_alarm", "get_low", "crawl_to_exit", "meet_outside"],
        outcomes: {
          success: "Everyone escaped safely",
          failure: "Someone got left behind"
        },
        learningPoints: ["Practice makes perfect", "Stay calm during drills"]
      }
    },
    {
      id: "stop_drop_roll",
      title: "Stop, Drop, and Roll Practice",
      simulation: {
        steps: ["stop_moving", "drop_to_ground", "roll_back_forth", "cover_face"],
        outcomes: {
          success: "Fire extinguished safely",
          failure: "Clothes still burning"
        },
        learningPoints: ["Cover your face", "Roll until fire is out"]
      }
    }
  ],

  // Interactive elements for young children
  interactiveElements: {
    HOME_INSPECTION: {
      zones: ["bedroom", "living_room", "kitchen"],
      hazards: ["blocked_exits", "toy_near_stove", "candle_near_curtain"],
      tips: ["Keep toys away from stove", "Never block doors", "Ask adults about candles"]
    }
  },

  // Progression tracks aligned with BFP curriculum
  progressionTracks: {
    BASIC_SAFETY: ["fire_is_hot", "stop_drop_roll", "call_911", "firefighters_help"],
    HOME_SAFETY: ["two_ways_out", "meeting_place", "smoke_alarm_sound", "never_hide"],
    ADVANCED: ["fire_drill_leader", "help_siblings", "prevention_rules", "firefighter_equipment"]
  }
};