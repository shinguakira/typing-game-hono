'use client';
import { useEffect, useRef, useState } from 'react';
import { questions as allQuestions } from '@/constants/page';

type Score = {
  userName: string;
  score: number;
};

export default function Home() {
  const [questions, setQuestions] = useState(() => {
    // Randomly select 5 questions from all questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false); // if true, game is completed
  const [userName, setUserName] = useState<string>(''); // username
  const [isStarted, setIsStarted] = useState<boolean>(false); // if true, game is
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [scores, setScores] = useState<Score[]>([]); // scores for ranking
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const shotSoundRef = useRef<HTMLAudioElement | null>(null);

  /**
   * 
   * @param userName 
   * @param startTime 
   * @returns 
   */
  async function addResult(userName: string, startTime: number) {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const timeInSeconds = totalTime / 1000;
    const baseScore = 10000;
    const timeDeduction = Math.floor(timeInSeconds * 100);
    const score = Math.max(1000, baseScore - timeDeduction);

    await fetch("/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: score,
        userName: userName,
      }),
    });

    return { totalTime, score };
  };

  async function fetchScores(){
    const res = await fetch("/api/result");
    const data = await res.json();
    return data.results;
  };


  useEffect(() => {
    bgmRef.current = new Audio("./bgm.mp3");
    bgmRef.current.loop = true;
    shotSoundRef.current = new Audio("./shot.mp3");
  }, []);

  useEffect(() => {
    if (isStarted && bgmRef.current) {
      bgmRef.current.play();
    }
    if (isCompleted && bgmRef.current) {
      bgmRef.current.pause();
    }
  }, [isStarted, isCompleted]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      if (e.key.toLowerCase() === currentQuestion.question[currentPosition].toLowerCase()) {
        setCurrentPosition(prev => prev + 1);
      }
      if (currentPosition === currentQuestion.question.length - 1) {
        if (currentQuestionIndex === questions.length - 1) {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }

          const {totalTime, score} = await addResult(userName, startTime);
          setTotalTime(totalTime);
          setScore(score);
          setIsCompleted(true);

          const scores = await fetchScores();
          setScores(scores);
        } else {
          if (shotSoundRef.current) {
            shotSoundRef.current.currentTime = 0;
            shotSoundRef.current.play();
          }
          setCurrentQuestionIndex(prev => prev + 1);
          setCurrentPosition(0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPosition, currentQuestionIndex]);

  /**
   * Handle Play Again
   * reset all the states
   * @param void
   * @returns void
   */
  const handlePlayAgain = () => {
    // Reshuffle questions for new game
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
    setIsStarted(false);
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setCurrentPosition(0);
    setStartTime(0);
    setTotalTime(0);
    setScore(0);
  }
  /**
   * Handle Start Game
   * force user to input name otherwise show alert
   * @param void
   * @returns void
   */
  const handleStart = () => {
    if(!userName){
      alert("Please enter your name");
      return;
    }
    setIsStarted(true);
    setStartTime(Date.now());
  }
  /**
   * while entering user name
   * the questions accept entering user input.
   * this is a problem. need to be solved.
   * e.g. the second is shown if userName is React or somehow enter "React"
   */
  if (!isStarted) {
    return(
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
  }
  /**
   * screen after game completed should be move to other file
   */
  if (isCompleted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center p-8 bg-black/50 rounded-lg border border-red-800 shadow-2xl max-w-2xl w-full">
        <h2
          className="text-4xl font-bold mb-6 text-red-600"
          style={{ textShadow: "0 0 10px rgba(255, 0, 0, 0.7)" }}
        >
          Result
        </h2>
        <div className="mb-8 space-y-2">
          <p className="text-xl">
            Player: <span className="text-red-500">{userName}</span>
          </p>
          <p className="text-xl">
            Time:{" "}
            <span className="text-red-500">
              {(totalTime / 1000).toFixed(2)}
            </span>{" "}
            seconds
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
              <p className="mt-4 text-red-500 animate-pulse">
                Loading scores...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scores.map((score, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-black/30 border border-red-900/50 rounded"
                >
                  <span
                    className={`text-lg ${
                      score.userName === userName ? "text-red-500" : ""
                    }`}
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
          <button
            className="px-8 py-3 text-xl bg-red-900"
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
        </div>
        {/* 
        TODO: Add Play Again with the same name
        */}
      </div>
    </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="text-white mb-8 text-xl">
          問題 {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div
          style={{
            fontSize: "48px",
            margin: "20px 0",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
          className="text-white"
        >
          {questions[currentQuestionIndex].question
            .split("")
            .map((char, index) => (
              <span
                key={index}
                style={{
                  color: index < currentPosition ? "#ff0000" : "white",
                  textShadow:
                    index < currentPosition
                      ? "0 0 10px rgba(255, 0, 0, 0.7)"
                      : "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {char}
              </span>
            ))}
        </div>
      </div>
    </main>
  );
}
