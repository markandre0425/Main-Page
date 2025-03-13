export const educationalContent = {
  scenarios: [
    {
      id: "kitchen_fire",
      title: "Kitchen Fire Safety",
      simulation: {
        steps: ["identify_hazard", "assess_situation", "choose_extinguisher", "execute_PASS"],
        outcomes: {
          success: "Fire contained safely",
          failure: "Kitchen damage increased"
        },
        learningPoints: ["Never use water on grease fires", "Keep pot handles turned inward"]
      }
    }
  ],
  
  interactiveElements: {
    HOME_INSPECTION: {
      zones: ["kitchen", "bedroom", "living_room", "garage"],
      hazards: ["blocked_exits", "overloaded_outlets", "flammable_storage"],
      tips: ["Install smoke alarms", "Create evacuation plan", "Store fire extinguisher"]
    }
  },
  
  progressionTracks: {
    BASIC_SAFETY: ["fire_triangle", "evacuation_basics", "call_emergency"],
    HOME_SAFETY: ["kitchen_safety", "electrical_safety", "storage_safety"],
    ADVANCED: ["fire_chemistry", "extinguisher_types", "emergency_planning"]
  }
};