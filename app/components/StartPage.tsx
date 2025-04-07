'use client';
import React from 'react';
import { useGameContext, GameMode } from '../context/GameContext';

export const StartPage = () => {
  const { 
    userName, 
    setUserName, 
    gameMode, 
    setGameMode, 
    setIsStarted, 
    setStartTime 
  } = useGameContext();

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

  /**
   * Handle Mode Change
   */
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <h1 className="text-4xl font-bold text-white mb-8">Typing Game</h1>
      
      <div className="text-center p-4 mb-6">
        <input
          type="text"
          placeholder="Enter your name..."
          className="w-64 p-3 text-lg bg-white text-gray-800 rounded"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button 
          className={`px-6 py-3 text-lg rounded-lg transition-colors ${
            gameMode === 'tech' 
              ? 'bg-red-700 text-white' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          onClick={() => handleModeChange('tech')}
        >
          Tech Terms
        </button>
        <button 
          className={`px-6 py-3 text-lg rounded-lg transition-colors ${
            gameMode === 'tailwind' 
              ? 'bg-red-700 text-white' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          onClick={() => handleModeChange('tailwind')}
        >
          Tailwind CSS
        </button>
        <button 
          className={`px-6 py-3 text-lg rounded-lg transition-colors ${
            gameMode === 'material' 
              ? 'bg-red-700 text-white' 
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          onClick={() => handleModeChange('material')}
        >
          Material UI
        </button>
      </div>
      
      <div>
        <button 
          className="px-8 py-3 text-xl bg-red-900 hover:bg-red-800 rounded-lg transition-colors" 
          onClick={handleStart}
        >
          Start Game
        </button>
      </div>
    </main>
  );
};
