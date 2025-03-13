export const accessibilityFeatures = {
  // Screen Reader Support
  screenReader: {
    descriptions: {
      gameInstructions: true,
      imageAlternatives: true,
      navigationCues: true
    },
    shortcuts: {
      skip: "alt+s",
      repeat: "alt+r",
      help: "alt+h"
    }
  },

  // Color Schemes
  colorSchemes: {
    default: {
      primary: "#FF4B4B",
      secondary: "#1E88E5",
      background: "#FFFFFF"
    },
    highContrast: {
      primary: "#000000",
      secondary: "#FFFFFF",
      background: "#FFFF00"
    },
    colorBlind: {
      primary: "#FFA07A",
      secondary: "#98FB98",
      background: "#F0F8FF"
    }
  },

  // Text Customization
  textOptions: {
    sizes: ["small", "medium", "large", "extra-large"],
    fonts: ["OpenDyslexic", "Arial", "Verdana"],
    lineSpacing: [1, 1.5, 2]
  }
};