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
  typeSpeed = 28,
  deleteSpeed = 16,
  delayBetween = 2200
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const fullText = words[currentWordIndex];

    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        // First character appears instantaneously (0ms) on load/reset, subsequent characters type briskly
        const speed = currentText.length === 0 ? 0 : typeSpeed;
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, speed);
      } else {
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
