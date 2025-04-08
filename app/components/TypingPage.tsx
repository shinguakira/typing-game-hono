'use client';
import React, { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/button';

export const TypingPage = () => {
  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentPosition,
    setCurrentPosition,
    setIsCompleted,
    userName,
    startTime,
    shotSoundRef,
    setTotalTime,
    setScore,
    addResult,
    fetchScores,
    resetGame,
    isSoundEnabled,
  } = useGameContext();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      const expectedChar = currentQuestion.question[currentPosition].toLowerCase();
      const inputChar = e.key.toLowerCase();

      if (inputChar === expectedChar) {
        setCurrentPosition(prev => prev + 1);

        // Check if word is completed
        if (currentPosition === currentQuestion.question.length - 1) {
          // Play sound only when completing a question
          if (shotSoundRef.current && isSoundEnabled) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }

          if (currentQuestionIndex === questions.length - 1) {
            const { totalTime, score } = await addResult(userName, startTime);
            setTotalTime(totalTime);
            setScore(score);
            setIsCompleted(true);
            await fetchScores();
          } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentPosition(0);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentPosition,
    currentQuestionIndex,
    questions,
    userName,
    startTime,
    shotSoundRef,
    isSoundEnabled,
    addResult,
    setTotalTime,
    setScore,
    setIsCompleted,
    fetchScores,
  ]);

  const handleStartOver = () => {
    resetGame();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute top-4 left-4">
          <Button
            variant="game"
            onClick={handleStartOver}
          >
            Start from beginning
          </Button>
        </div>
        <div className="text-white mb-8 text-xl">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div
          style={{
            fontSize: '48px',
            margin: '20px 0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            fontWeight: 'bold',
            letterSpacing: '2px',
          }}
          className="text-white"
        >
          {questions[currentQuestionIndex].question.split('').map((char, index) => (
            <span
              key={index}
              style={{
                color: index < currentPosition ? '#ff0000' : 'white',
                textShadow:
                  index < currentPosition
                    ? '0 0 10px rgba(255, 0, 0, 0.7)'
                    : '2px 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
};
