'use client';
import React from 'react';
import { useGameContext, GameMode } from '../context/GameContext';
import { Volume2, VolumeX, Sword, Zap, Bomb, Target } from 'lucide-react';
import { Button } from '../components/ui/button';

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
        <Button
          variant={gameMode === 'tech' ? 'game' : 'secondary'}
          size="lg"
          onClick={() => handleModeChange('tech')}
        >
          Tech Terms
        </Button>
        <Button
          variant={gameMode === 'tailwind' ? 'game' : 'secondary'}
          size="lg"
          onClick={() => handleModeChange('tailwind')}
        >
          Tailwind CSS
        </Button>
        <Button
          variant={gameMode === 'material' ? 'game' : 'secondary'}
          size="lg"
          onClick={() => handleModeChange('material')}
        >
          Material UI
        </Button>
        <Button
          variant={gameMode === 'shadcn' ? 'game' : 'secondary'}
          size="lg"
          onClick={() => handleModeChange('shadcn')}
        >
          Shadcn UI
        </Button>
        <Button
          variant={gameMode === 'monster' ? 'game' : 'secondary'}
          size="lg"
          onClick={() => handleModeChange('monster')}
        >
          Monster Slayer
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            title="Toggle Sound Effects"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-6 h-6" />
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsBgmEnabled(!isBgmEnabled)}
            title="Toggle Background Music"
          >
            {isBgmEnabled ? (
              <Volume2 className="w-6 h-6" />
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </Button>
        </div>

        {isSoundEnabled && (
          <div className="flex items-center gap-2">
            {soundEffects.map(effect => {
              const Icon = effect.icon;
              return (
                <Button
                  key={effect.name}
                  variant={selectedSound === effect.name ? 'game' : 'secondary'}
                  size="icon"
                  onClick={() => setSelectedSound(effect.name)}
                  title={`Select ${effect.label} Sound`}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <Button
          variant="game"
          size="lg"
          onClick={handleStart}
        >
          Start Game
        </Button>
      </div>
    </main>
  );
};
