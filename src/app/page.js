"use client";
import { useState, useEffect } from "react";
import GeminiPrompt from "@/app/components/gemini/GeminiPrompt";
import Next from "@/app/components/next/next";
import YouLost from "@/app/components/youlost/youlost";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [gameState, setGameState] = useState("playing"); // "playing", "next", "lost"
  const [score, setScore] = useState(0); // Wynik gry
  const [enemy, setEnemy] = useState("papier"); // Aktualny przeciwnik
  const [message, setMessage] = useState(`Czym pokonasz ${enemy}`); // Pytanie
  const [fact, setFact] = useState(""); // Fakt do wyświetlenia
  const [emoji, setEmoji] = useState("");
  const [answers, setAnswers] = useState(new Set());
  
  useEffect(() => {
    setAnswers((prevAnswers) => new Set(prevAnswers).add(enemy));
  }, [enemy]);

  // Funkcja do resetowania gry
  const resetGame = () => {
    setGameState("playing"); // Powrót do stanu początkowego
    setScore(0); // Zresetowanie wyniku
    setEnemy("papier"); // Pierwszy przeciwnik
    setMessage(`Czym pokonasz papier`); // Pierwsze pytanie
    setFact(""); // Resetowanie faktu
    setEmoji("");
  };

  const handleCorrectAnswer = (newEnemy, newMessage, newFact, newEmoji) => {
    setScore(answers.size);
    setEnemy(newEnemy);
    setMessage(newMessage);
    setFact(newFact);
    setEmoji(newEmoji);
    setGameState("next");
  };

  const handleIncorrectAnswer = async () => {
    
    // Update the answers set
    setAnswers((prevAnswers) => new Set(prevAnswers).add(enemy));
    setAnswers(new Set());
  
    // Call API to insert the score with "Test User"

    //jesli niezalogowany a jesli zalogowany

    const token = localStorage.getItem('token');

    if (!token) {
      try {
        const response = await fetch("/api/insertScore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score,
            date: new Date().toISOString(),
            user_id: "676c27cd62fdd79627a35feb", // Replace this with the actual user ID
          }),
        });
    
        if (!response.ok) {
          console.error("Failed to insert score:", await response.text());
        }
      } catch (error) {
        console.error("Error inserting score:", error);
      }
    
    } else {
      try {
        // Dekodowanie tokena i pobranie danych użytkownika
        const decodedToken = jwtDecode(token); // Dekodowanie tokena
        try {
          const response = await fetch("/api/insertScore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              score,
              date: new Date().toISOString(),
              user_id: decodedToken.id, // Replace this with the actual user ID
            }),
          });
      
          if (!response.ok) {
            console.error("Failed to insert score:", await response.text());
          }
        } catch (error) {
          console.error("Error inserting score:", error);
        }
      
      } catch (error) {
        console.error('Invalid token, redirecting to login:', error);
        router.push('/login'); // Przekierowanie w przypadku błędu
      }
    }
   
    // Change game state to "lost"
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
    <div className="relative">
  {/* Background answers */}
  <div className="absolute inset-0 z-0 flex space-x-4 opacity-20 pointer-events-none">
    {[...answers].map((answer, index) => (
      <div key={index} className="px-2 py-2 text-base font-arial">
        {answer}
      </div>
    ))}
  </div>

  {/* Foreground content */}
  <div className="relative z-10">
    <GeminiPrompt
      enemy={enemy}
      message={message}
      onCorrect={handleCorrectAnswer}
      onIncorrect={handleIncorrectAnswer}
    />
  </div>
  <div className="flex space-x-4">
      {[...answers].map((answer, index) => (
        <div key={index} className="px-4 py-2 border rounded bg-gray-200 text-base font-normal">
          {answer}
        </div>
      ))}
    </div>
</div>


  );
}
