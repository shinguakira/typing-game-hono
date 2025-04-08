'use client';
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '../components/ui/button';

export const ResultPage = () => {
  const { userName, totalTime, score, scores, resetGame } = useGameContext();
  const [isScoreRegistered, setIsScoreRegistered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);

  /**
   * Handle Play Again
   * Reset all the states
   */
  const handlePlayAgain = () => {
    resetGame();
  };

  /**
   * Handle Score Registration
   */
  const handleRegisterScore = async () => {
    setIsScoreRegistered(true);
    setShowConfirmation(false);
  };

  /**
   * Handle Skip Registration
   */
  const handleSkipRegistration = () => {
    setShowConfirmation(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg border border-red-800 shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-red-600">Register Score?</h3>
            <p className="mb-6 text-white">
              Do you want to register your score of <span className="text-red-500">{score}</span> to
              the leaderboard?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="game"
                onClick={handleRegisterScore}
              >
                Yes, Register
              </Button>
              <Button
                variant="secondary"
                onClick={handleSkipRegistration}
              >
                No, Skip
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center p-8 bg-black/50 rounded-lg border border-red-800 shadow-2xl max-w-2xl w-full">
        <h2
          className="text-4xl font-bold mb-6 text-red-600"
          style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.7)' }}
        >
          Result
        </h2>
        <div className="mb-8 space-y-2">
          <p className="text-xl">
            Player: <span className="text-red-500">{userName}</span>
          </p>
          <p className="text-xl">
            Time: <span className="text-red-500">{(totalTime / 1000).toFixed(2)}</span> seconds
          </p>
          <p className="text-xl">
            Score: <span className="text-red-500">{score}</span>
          </p>
          {isScoreRegistered && (
            <p className="text-green-500 mt-2">✓ Score registered to leaderboard</p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-red-600">Ranking</h3>
          {scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-red-500 animate-pulse">Loading scores...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scores.map((score, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-black/30 border border-red-900/50 rounded"
                >
                  <span className={`text-lg ${score.userName === userName ? 'text-red-500' : ''}`}>
                    {index + 1}.{score.userName}
                  </span>
                  <span className="text-red-500">{score.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="game"
            size="lg"
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
        </div>
      </div>
    </main>
  );
};
