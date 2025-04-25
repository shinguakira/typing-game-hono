'use client';
import React, { useEffect } from 'react';
import { useGameContext, GameMode } from '../context/GameContext';
import { Volume2, VolumeX, Sword, Zap, Bomb, Target } from 'lucide-react';
import { SOUND_OPTIONS } from '@/constants/soundEffect';
import { Button } from '@/components/ui/button';

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

  const soundEffectRef = React.useRef<HTMLAudioElement | null>(null);

  /**
   * Start Game on Enter
   * @param e 
   */
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
function handleModeChange(mode: GameMode){
    setGameMode(mode);
  };
  
  /**
   * Handle Sound Change
   * @param soundPath 
   */
  function handleSoundChange(soundPath: string) {
    soundEffectRef.current?.pause();
    
    setSelectedSound(soundPath);
    const audio = new Audio(`./sound/${soundPath}`);
    if (isSoundEnabled) {
      audio.play();
      soundEffectRef.current = audio;
    }
  }

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
        <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.343 9.657L14 2l1.414 1.414a8 8 0 11-11.314 0L6.343 9.657z"
                    />
                  </svg>
                  <label className="text-gray-300">Sound Effects ON/OFF</label>
                </div>
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
          <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <label className="text-gray-300">Background Music ON/OFF</label>
                </div>
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
        <label className="text-gray-300 ">Select Sound Effects</label>
        {isSoundEnabled && (
          <div className="flex items-center gap-2">
            {SOUND_OPTIONS.map(effect => {
              return (
                <Button
                  key={effect.value}
                  onClick={() => handleSoundChange(effect.value)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedSound === effect.value
                      ? 'bg-red-700 text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                  title={`Select ${effect.label} Sound`}
                >
                  {effect.icon && <effect.icon className="w-5 h-5" />}
                </Button>
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
