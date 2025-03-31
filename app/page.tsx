"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const questions = [
    {question:"React", image: "./monster1.jpg"},
    {question:"Typescript", image: "./monster2.jpg"},
    {question: "Next.js", image: "./monster3.jpg"},
    {question: "Hono", image: "./monster4.jpg"},
    {question: "Tailwind", image: "./monster5.jpg"}
  ]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentPosition , setCurrentPosition] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
 
  useEffect(()=>{
    const handleKeyDown = async(e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex];
      if(e.key.toLowerCase() === currentQuestion.question[currentPosition].toLowerCase()){
        setCurrentPosition((prev)=> prev + 1);
      }
      if(currentPosition === currentQuestion.question.length - 1){
        if(currentQuestionIndex === questions.length - 1){
          setIsCompleted(true);
        }else{
          setCurrentQuestionIndex((prev)=> prev + 1);
          setCurrentPosition(0);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  },[currentPosition, currentQuestionIndex]);
if(isCompleted){
  return <div>ゲーム終了</div>
}

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="text-center w-full h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${questions[currentQuestionIndex].image})`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <div>
          {questions[currentQuestionIndex].question
          .split("")
          .map((char, index) => {
            return(
            <span
            key={index}
            style={{
              color: index < currentPosition ? "#ff0000" : "white"
            }}
            >
              {char}
            </span>
            )
          })
          }

        </div>
      </div>
    </main>
  );
}
