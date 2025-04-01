'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const questions = [
    { question: 'React', image: './monster1.jpg' },
    { question: 'Typescript', image: './monster2.jpg' },
    { question: 'Next.js', image: './monster3.jpg' },
    { question: 'Hono', image: './monster4.jpg' },
    { question: 'Tailwind', image: './monster5.jpg' },
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false); // if true, game is completed
  const [userName, setUserName] = useState<string>(''); // username
  const [isStarted, setIsStarted] = useState<boolean>(false); // if true, game is
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  /**
   * 
   * @param userName 
   * @param startTime 
   * @returns 
   */
  async function addResult(userName: string, startTime: number) {
    const endTime: number = Date.now();
    const timeInSeconds: number = (endTime - startTime) / 1000;
    const baseScore: number = 10000;
    const timeDeduction: number = timeInSeconds * 100;
    const score: number = baseScore - timeDeduction;

    await fetch("/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
        userName,
      }),
    });

    return {totalTime, score};
  }

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      if (e.key.toLowerCase() === currentQuestion.question[currentPosition].toLowerCase()) {
        setCurrentPosition(prev => prev + 1);
      }
      if (currentPosition === currentQuestion.question.length - 1) {
        if (currentQuestionIndex === questions.length - 1) {
          const {totalTime, score} = await addResult(userName, startTime);
          setTotalTime(totalTime);
          setScore(score);
          setIsCompleted(true);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setCurrentPosition(0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPosition, currentQuestionIndex]);

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

  if (isCompleted) {
    return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center p-8">
        <h2>Result</h2>
        <div className="mb-8 space-y-2">
          <p>Player: {userName}</p>
          <p>
            Time
            <span>{(totalTime / 1000).toFixed(2)}</span>
            seconds
          </p>
          <p>Score: {score}</p>
        </div>
      </div>
      ゲーム終了
    </main>);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div
        className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <div>
          {questions[currentQuestionIndex].question.split('').map((char, index) => {
            return (
              <span
                key={index}
                style={{
                  color: index < currentPosition ? '#ff0000' : 'white',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </main>
  );
}
