'use client';
import React from 'react';
import { useGameContext } from '../context/GameContext';

export const ResultPage = () => {
  const { userName, totalTime, score, scores, resetGame } = useGameContext();

  /**
   * Handle Play Again
   * Reset all the states
   */
  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
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
                  <span
                    className={`text-lg ${score.userName === userName ? 'text-red-500' : ''}`}
                  >
                    {index + 1}.{score.userName}
                  </span>
                  <span className="text-red-500">{score.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button className="px-8 py-3 text-xl bg-red-900" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
        {/* 
        TODO: Add Play Again with the same name
        */}
      </div>
    </main>
  );
};
