'use client';
import React, { useEffect } from 'react';
import { useGameContext, GameMode } from '../context/GameContext';
import { Volume2, VolumeX, Sword, Zap, Bomb, Target } from 'lucide-react';

export const StartPage = () => {
  const {
    userName,
    setUserName,
    gameMode,
    setGameMode,
    startGame,
    isSoundEnabled,
    setIsSoundEnabled,
    isBgmEnabled,
    setIsBgmEnabled,
    selectedSound,
    setSelectedSound,
  } = useGameContext();

  const soundEffects = [
    { name: 'shot.mp3', icon: Target, label: 'Shot' },
    { name: 'sword_slash1.mp3', icon: Sword, label: 'Sword' },
    { name: 'thunder_spell.mp3', icon: Zap, label: 'Thunder' },
    { name: 'light_punch.mp3', icon: Bomb, label: 'Light Punch' },
  ];
  const handleKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Enter"){
      handleStart();
    }
  }

  useEffect(()=>{
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  },[userName])

  /**
   * Handle Start Game
   * Force user to input name otherwise show alert
   */
  const handleStart = () => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    startGame();
  };

  /**
   * Handle Mode Change
   */
  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center ${
        gameMode === 'monster'
          ? 'bg-[url("/monster-slayer/dragon.png")] bg-cover bg-center bg-black bg-opacity-50 bg-blend-overlay'
          : 'bg-black'
      }`}
    >
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
        <button
          className={`px-6 py-3 text-lg rounded-lg transition-colors ${
            gameMode === 'shadcn'
              ? 'bg-red-700 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          onClick={() => handleModeChange('shadcn')}
        >
          Shadcn UI
        </button>
        <button
          className={`px-6 py-3 text-lg rounded-lg transition-colors ${
            gameMode === 'monster'
              ? 'bg-red-700 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
          onClick={() => handleModeChange('monster')}
        >
          Monster Slayer
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Toggle Sound Effects"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsBgmEnabled(!isBgmEnabled)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Toggle Background Music"
          >
            {isBgmEnabled ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {isSoundEnabled && (
          <div className="flex items-center gap-2">
            {soundEffects.map(effect => {
              const Icon = effect.icon;
              return (
                <button
                  key={effect.name}
                  onClick={() => setSelectedSound(effect.name)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedSound === effect.name
                      ? 'bg-red-700 text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                  title={`Select ${effect.label} Sound`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <button
          className="flex items-center px-8 py-3 text-xl bg-red-900 hover:bg-red-800 rounded-lg transition-colors"
          onClick={handleStart}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleStart();
            }
          }}
          title="Start Game"
        >
          <kbd className="mr-4 rounded border border-gray-200  text-white px-1.5 py-0.5 text-sm">
              Enter
            </kbd>
          Start Game
        </button>
      </div>
    </main>
  );
};
