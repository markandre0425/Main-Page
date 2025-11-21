import { useCallback, useRef, useEffect, useState } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const {
    rate = 0.8, // Slower for children
    pitch = 1.0,
    volume = 0.8,
    voice = null
  } = options;

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Load voices immediately
    loadVoices();

    // Also load voices when they become available
    if ('onvoiceschanged' in speechSynthesis) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('onvoiceschanged' in speechSynthesis) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    // Create new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    // Try to use a child-friendly voice
    const availableVoices = voices.length > 0 ? voices : speechSynthesis.getVoices();
    const childFriendlyVoice = availableVoices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Child') ||
      voice.name.includes('Kid') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Samantha')
    ) || availableVoices.find(voice => voice.lang.startsWith('en'));
    
    if (childFriendlyVoice) {
      utterance.voice = childFriendlyVoice;
    }

    // Add error handling
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [rate, pitch, volume, voices]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    speechRef.current = null;
  }, []);

  return { speak, stop };
}
