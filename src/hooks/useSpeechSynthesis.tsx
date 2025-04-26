
import { useState, useEffect } from 'react';

interface UseSpeechSynthesisProps {
  text: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  onEnd?: () => void;
}

export const useSpeechSynthesis = ({
  text,
  rate = 1,
  pitch = 1,
  volume = 1,
  lang = 'fr-FR',
  onEnd = () => {}
}: UseSpeechSynthesisProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true);
      
      // Get voices on first load
      const getVoices = () => {
        const voiceOptions = window.speechSynthesis.getVoices();
        setVoices(voiceOptions);
      };
      
      getVoices();
      
      // Chrome and Edge load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
      }
    }
  }, []);

  const speak = (text: string) => {
    if (!supported) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a French female voice if available
    const frenchVoice = voices.find(
      voice => voice.lang.includes('fr') && voice.name.includes('female')
    ) || voices.find(voice => voice.lang.includes('fr'));
    
    if (frenchVoice) utterance.voice = frenchVoice;
    
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      onEnd();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      console.error('SpeechSynthesis error');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    return () => {
      cancel();
    };
  }, []);

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices
  };
};

export default useSpeechSynthesis;
