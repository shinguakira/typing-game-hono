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
    startTime,
    shotSoundRef,
    setTotalTime,
    setScore,
    setScores,
    addResult,
    fetchScores,
  } = useGameContext();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      if (e.key.toLowerCase() === currentQuestion.question[currentPosition].toLowerCase()) {
        setCurrentPosition(prev => prev + 1);
      }
      if (currentPosition === currentQuestion.question.length - 1) {
        if (currentQuestionIndex === questions.length - 1) {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }

          const { totalTime, score } = await addResult(userName, startTime);
          setTotalTime(totalTime);
          setScore(score);
          setIsCompleted(true);

          await fetchScores();
        } else {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          setCurrentQuestionIndex(prev => prev + 1);
          setCurrentPosition(0);
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
    setCurrentPosition,
    setCurrentQuestionIndex,
    setIsCompleted,
    setTotalTime,
    setScore,
    setScores,
    addResult,
    fetchScores
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: 'overlay',
        }}
      >
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
