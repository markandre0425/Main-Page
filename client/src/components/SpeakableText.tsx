import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';

interface SpeakableTextProps {
  children: React.ReactNode;
  text: string;
  className?: string;
  showIcon?: boolean;
}

export function SpeakableText({ 
  children, 
  text, 
  className = '', 
  showIcon = true 
}: SpeakableTextProps) {
  const { speak, stop } = useTextToSpeech();

  const handleMouseEnter = () => {
    speak(text);
  };

  const handleMouseLeave = () => {
    stop();
  };

  return (
    <div
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showIcon && (
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Volume2 className="h-4 w-4 text-blue-500 bg-white rounded-full p-1 shadow-sm" />
        </div>
      )}
    </div>
  );
}








