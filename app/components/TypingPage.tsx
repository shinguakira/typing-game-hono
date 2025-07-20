'use client';
import React, { useEffect } from 'react';
import { useGameContext } from '../context/GameContext';

export const TypingPage = () => {
  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentPosition,
    setCurrentPosition,
    setIsCompleted,
    userName,
    gameMode,
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

      if (!currentQuestion) return;

      if (e.key === 'Escape') {
        resetGame();
        return;
      }

      if (e.key === 'Backspace') {
        setCurrentPosition(prev => Math.max(0, prev - 1));
        return;
      }

      if (currentPosition < currentQuestion.question.length) {
        const expectedChar = currentQuestion.question[currentPosition].toLowerCase();
        const inputChar = e.key.toLowerCase();

        if (inputChar === expectedChar && e.key.length === 1) {
          setCurrentPosition(prev => prev + 1);

          if (currentPosition + 1 === currentQuestion.question.length) {
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
    resetGame,
    setCurrentPosition,
    setCurrentQuestionIndex,
  ]);

  const handleStartOver = () => {
    resetGame();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
        style={{
          backgroundImage:
            gameMode === 'tailwind' ? 'none' : `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: gameMode === 'tailwind' ? 'black' : 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: gameMode === 'tailwind' ? 'normal' : 'overlay',
        }}
      >
        <div className="absolute top-4 left-4">
          <button
            className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 transition-colors"
            onClick={handleStartOver}
          >
            Start from beginning
          </button>
        </div>
        <div className="text-white mb-8 text-xl">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </div>
        {gameMode === 'tailwind' && (
          <div className="flex gap-4 mb-4">
            <label>Before</label>
            <div className="w-96 h-96 border border-dashed border-gray-500 bg-gray-800 flex items-center justify-center">
              <div className={'w-full h-full'}>
                <span className="text-white">Default</span>
              </div>
            </div>
            <label>After</label>
            <div className="w-96 h-96 border border-dashed border-gray-500 bg-gray-800 flex items-center justify-center">
              <div className={`w-full h-full ${questions[currentQuestionIndex].question}`}>
                <span className="text-white">Default</span>
              </div>
            </div>
          </div>
        )}
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
