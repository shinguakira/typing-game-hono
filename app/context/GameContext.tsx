'use client';
import React, { createContext, useState, useContext, useRef, useEffect, ReactNode } from 'react';
import {
  techQuestions,
  tailwindQuestions,
  materialQuestions,
  shadcnQuestions,
  monsterQuestions,
} from '../../constants/page';

type Score = {
  userName: string;
  score: number;
};

export type GameMode = 'tech' | 'tailwind' | 'material' | 'shadcn' | 'monster';

interface GameContextProps {
  userName: string;
  setUserName: (name: string) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  questions: { question: string; image: string }[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  currentPosition: number;
  setCurrentPosition: React.Dispatch<React.SetStateAction<number>>;
  isStarted: boolean;
  startGame: () => void;
  isCompleted: boolean;
  setIsCompleted: (isCompleted: boolean) => void;
  startTime: number;
  setStartTime: (time: number) => void;
  totalTime: number;
  setTotalTime: (time: number) => void;
  score: number;
  setScore: (score: number) => void;
  scores: Score[];
  setScores: (scores: Score[]) => void;
  bgmRef: React.MutableRefObject<HTMLAudioElement | null>;
  shotSoundRef: React.MutableRefObject<HTMLAudioElement | null>;
  addResult: (userName: string, startTime: number) => Promise<{ totalTime: number; score: number }>;
  fetchScores: () => Promise<void>;
  resetGame: () => void;
  isBgmEnabled: boolean;
  setIsBgmEnabled: (enabled: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
}

const GameContext = createContext<GameContextProps | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('tech');
  const [questions, setQuestions] = useState(() => {
    const questionSet = gameMode === 'tech' ? techQuestions : tailwindQuestions;
    const shuffled = [...questionSet].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [isBgmEnabled, setIsBgmEnabled] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [selectedSound, setSelectedSound] = useState<string>('shot.mp3');

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const shotSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgmRef.current = new Audio('./bgm.mp3');
    bgmRef.current.loop = true;
    shotSoundRef.current = new Audio(`./sound/${selectedSound}`);
  }, [selectedSound]);

  useEffect(() => {
    if (isStarted && bgmRef.current && isBgmEnabled) {
      bgmRef.current.play();
    }
    if ((isCompleted || !isBgmEnabled) && bgmRef.current) {
      bgmRef.current.pause();
    }
  }, [isStarted, isCompleted, isBgmEnabled]);

  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = isBgmEnabled ? 1 : 0;
    }
  }, [isBgmEnabled]);

  useEffect(() => {
    if (shotSoundRef.current) {
      shotSoundRef.current.volume = isSoundEnabled ? 1 : 0;
    }
  }, [isSoundEnabled]);

  useEffect(() => {
    let questionSet;
    switch (gameMode) {
      case 'tech':
        questionSet = techQuestions;
        break;
      case 'tailwind':
        questionSet = tailwindQuestions;
        break;
      case 'material':
        questionSet = materialQuestions;
        break;
      case 'shadcn':
        questionSet = shadcnQuestions;
        break;
      case 'monster':
        questionSet = monsterQuestions;
        break;
      default:
        questionSet = techQuestions;
    }
    const shuffled = [...questionSet].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, [gameMode]);

  const startGame = () => {
    if (userName.trim()) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
  };

  async function addResult(userName: string, startTime: number) {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = totalTime / 1000;
    const baseScore = 10000;
    const timeDeduction = Math.floor(timeInSeconds * 100);
    const score = Math.max(1000, baseScore - timeDeduction);

    await fetch('/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score: score,
        userName: userName,
      }),
    });

    return { totalTime, score };
  }

  async function fetchScores() {
    const res = await fetch('/api/result');
    const data = await res.json();
    setScores(data.results);
  }

  const resetGame = () => {
    let questionSet;
    switch (gameMode) {
      case 'tech':
        questionSet = techQuestions;
        break;
      case 'tailwind':
        questionSet = tailwindQuestions;
        break;
      case 'material':
        questionSet = materialQuestions;
        break;
      case 'shadcn':
        questionSet = shadcnQuestions;
        break;
      case 'monster':
        questionSet = monsterQuestions;
        break;
      default:
        questionSet = techQuestions;
    }
    const shuffled = [...questionSet].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setIsStarted(false);
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setCurrentPosition(0);
    setStartTime(0);
    setTotalTime(0);
    setScore(0);
  };

  return (
    <GameContext.Provider
      value={{
        userName,
        setUserName,
        gameMode,
        setGameMode,
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentPosition,
        setCurrentPosition,
        isStarted,
        startGame,
        isCompleted,
        setIsCompleted,
        startTime,
        setStartTime,
        totalTime,
        setTotalTime,
        score,
        setScore,
        scores,
        setScores,
        bgmRef,
        shotSoundRef,
        addResult,
        fetchScores,
        resetGame,
        isBgmEnabled,
        setIsBgmEnabled,
        isSoundEnabled,
        setIsSoundEnabled,
        selectedSound,
        setSelectedSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
