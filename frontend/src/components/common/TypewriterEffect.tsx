import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  words: string[];
  prefix?: string;
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetween?: number;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  prefix = '',
  className = '',
  typeSpeed = 24,
  deleteSpeed = 15,
  delayBetween = 2500
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // Initialize with the full first phrase so the entire headline is 100% visible on first paint
  const [currentText, setCurrentText] = useState(() => (words && words.length > 0 ? words[0] : ''));
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const fullText = words[currentWordIndex] || '';

    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, typeSpeed);
      } else {
        // Full word is visible: pause so user can read, then begin delete cycle
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetween);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, deleteSpeed);
      } else {
        // Finished deleting: move to next word and start typing
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typeSpeed, deleteSpeed, delayBetween]);

  return (
    <span className={`inline-block ${className}`}>
      {prefix && <span className="text-white mr-2">{prefix}</span>}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-indigo-100 font-extrabold drop-shadow-sm">
        {currentText}
      </span>
      <span 
        className="inline-block w-[3px] h-[0.9em] ml-1 bg-gradient-to-b from-cyan-400 to-indigo-500 align-middle rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        aria-hidden="true"
      />
    </span>
  );
};
