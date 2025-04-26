'use client';
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { SOUND_OPTIONS } from '../../constants/soundEffect';

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isBgmEnabled,
    setIsBgmEnabled,
    isSoundEnabled,
    setIsSoundEnabled,
    selectedSound,
    setSelectedSound,
  } = useGameContext();

  const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSound(e.target.value);
    const audio = new Audio(`./sound/${e.target.value}`);
    if (isSoundEnabled) {
      audio.play();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center border border-red-800 transition-colors"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-red-800 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Sound Settings</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
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
                  <label className="text-gray-300">Background Music</label>
                </div>
                <button
                  onClick={() => setIsBgmEnabled(!isBgmEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isBgmEnabled ? 'bg-red-600' : 'bg-gray-600'
                  } relative`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      isBgmEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
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
                  <label className="text-gray-300">Sound Effects</label>
                </div>
                <button
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isSoundEnabled ? 'bg-red-600' : 'bg-gray-600'
                  } relative`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      isSoundEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 block">Sound Effect Type</label>
                <select
                  value={selectedSound}
                  onChange={handleSoundChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-red-600 focus:outline-none"
                >
                  {SOUND_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400">Click to preview the sound</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
