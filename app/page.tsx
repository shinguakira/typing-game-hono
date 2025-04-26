'use client';
import React from 'react';
import { GameProvider } from './context/GameContext';
import { StartPage } from './components/StartPage';
import { TypingPage } from './components/TypingPage';
import { ResultPage } from './components/ResultPage';
import { useGameContext } from './context/GameContext';
import Navigation from './components/Navigation';

function GameContent() {
  const { isStarted, isCompleted } = useGameContext();

  if (!isStarted)
    return (
      <>
        <Navigation />
        <StartPage />
      </>
    );
  if (isCompleted)
    return (
      <>
        <Navigation />
        <ResultPage />
      </>
    );
  return <TypingPage />;
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
