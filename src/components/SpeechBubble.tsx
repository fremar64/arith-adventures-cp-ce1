
import React, { useEffect, useState } from 'react';

interface SpeechBubbleProps {
  text: string;
  onTextComplete?: () => void;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, onTextComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (text === displayText) {
      if (onTextComplete) onTextComplete();
      return;
    }
    
    setIsTyping(true);
    setDisplayText('');
    
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(index));
      index++;
      
      if (index >= text.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (onTextComplete) onTextComplete();
      }
    }, 30);
    
    return () => clearInterval(typingInterval);
  }, [text, onTextComplete]);

  return (
    <div className="relative bg-white p-4 rounded-lg border-2 border-gray-300 shadow-lg min-h-24 max-w-md">
      <div className="absolute bottom-0 left-10 w-6 h-6 bg-white border-r-2 border-b-2 border-gray-300 transform rotate-45 translate-y-3"></div>
      <p className="font-medium text-lg">{displayText}</p>
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
};

export default SpeechBubble;
