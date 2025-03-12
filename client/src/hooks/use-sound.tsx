import { useState, useEffect, useCallback } from "react";

type SoundCategories = "ui" | "game" | "achievement" | "feedback";

interface Sound {
  id: string;
  category: SoundCategories;
  url: string;
  volume?: number;
}

const sounds: Record<string, Sound> = {
  click: {
    id: "click",
    category: "ui",
    url: "https://cdn.freesound.org/previews/270/270304_5123851-lq.mp3",
    volume: 0.5,
  },
  correct: {
    id: "correct",
    category: "feedback",
    url: "https://cdn.freesound.org/previews/221/221683_1015240-lq.mp3",
    volume: 0.6,
  },
  wrong: {
    id: "wrong",
    category: "feedback",
    url: "https://cdn.freesound.org/previews/142/142608_1840739-lq.mp3",
    volume: 0.6,
  },
  achievement: {
    id: "achievement",
    category: "achievement",
    url: "https://cdn.freesound.org/previews/456/456965_9382144-lq.mp3",
    volume: 0.7,
  },
  levelUp: {
    id: "levelUp",
    category: "game",
    url: "https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3",
    volume: 0.6,
  },
};

interface UseSoundOptions {
  enabled?: boolean;
  volume?: number;
}

export function useSound(options: UseSoundOptions = {}) {
  const { enabled = true, volume = 1.0 } = options;
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  const [loaded, setLoaded] = useState(false);

  // Initialize audio elements
  useEffect(() => {
    if (!enabled) return;
    
    const elements: Record<string, HTMLAudioElement> = {};
    
    Object.values(sounds).forEach((sound) => {
      const audio = new Audio(sound.url);
      audio.volume = (sound.volume || 1) * volume;
      audio.preload = "auto";
      elements[sound.id] = audio;
    });
    
    setAudioElements(elements);
    setLoaded(true);
    
    // Cleanup
    return () => {
      Object.values(elements).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, [enabled, volume]);

  const play = useCallback((soundId: string) => {
    if (!enabled || !loaded) return;
    
    const audio = audioElements[soundId];
    if (audio) {
      // Reset and play from the beginning
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
    }
  }, [audioElements, enabled, loaded]);

  return { play };
}
