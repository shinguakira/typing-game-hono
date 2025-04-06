'use client';
import React from 'react';
import { useGameContext } from '../context/GameContext';

export const StartPage = () => {
  const { userName, setUserName, setIsStarted, setStartTime } = useGameContext();

  /**
   * Handle Start Game
   * Force user to input name otherwise show alert
   */
  const handleStart = () => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    setIsStarted(true);
    setStartTime(Date.now());
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center p-8">
        <input
          type="text"
          placeholder="Enter your name..."
          className="w-64 p-3 text-lg bg-white text-gray"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
      </div>
      <div>
        <button className="px-8 py-3 text-xl bg-red-900" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </main>
  );
};
