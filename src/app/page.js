"use client";
import { useState } from "react";
import GeminiPrompt from "@/app/components/gemini/GeminiPrompt";
import Next from "@/app/components/next/next";
import YouLost from "@/app/components/youlost/youlost";

export default function Home() {
  const [gameState, setGameState] = useState("playing"); // "playing", "next", "lost"
  const [score, setScore] = useState(0); // Wynik gry
  const [enemy, setEnemy] = useState("papier"); // Aktualny przeciwnik
  const [message, setMessage] = useState(`Czym pokonasz ${enemy}`); // Pytanie
  const [fact, setFact] = useState(""); // Fakt do wyświetlenia
  const [emoji, setEmoji] = useState("");

  // Funkcja do resetowania gry
  const resetGame = () => {
    setGameState("playing"); // Powrót do stanu początkowego
    setScore(1); // Zresetowanie wyniku
    setEnemy("papier"); // Pierwszy przeciwnik
    setMessage(`Czym pokonasz papier`); // Pierwsze pytanie
    setFact(""); // Resetowanie faktu
    setEmoji("");
  };

  const handleCorrectAnswer = (newEnemy, newMessage, newFact, newEmoji) => {
    setScore((prevScore) => prevScore + 1);
    setEnemy(newEnemy);
    setMessage(newMessage);
    setFact(newFact);
    setEmoji(newEmoji);
    setGameState("next");
  };

  const handleIncorrectAnswer = () => {
    setGameState("lost");
  };

  const handleNextQuestion = () => {
    setGameState("playing");
  };

  if (gameState === "lost") {
    return <YouLost message="Przegrałeś!" stats={score} onRestart={resetGame} />;
  }

  if (gameState === "next") {
    return (
      <Next
        stats={score}
        message={message}
        fact={fact}
        emoji={emoji}
        onNext={handleNextQuestion}
      />
    );
  }

  return (
    <GeminiPrompt
      enemy={enemy}
      message={message}
      onCorrect={handleCorrectAnswer}
      onIncorrect={handleIncorrectAnswer}
    />
  );
}
