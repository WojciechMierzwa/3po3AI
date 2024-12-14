'use client';
import React, { useState } from "react";

const GeminiPrompt = () => {

  const [enemy, setEnemy] = useState("papier")
  const [answer, setAnswer] = useState(""); // Stan dla odpowiedzi użytkownika
  const [response, setResponse] = useState(""); // Stan dla odpowiedzi na główne zapytanie
  const [fact, setFact] = useState(""); // Stan dla losowego faktu
  const [loading, setLoading] = useState(false); // Stan ładowania
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!answer.trim()) {
      setResponse("Please enter a valid answer.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Czy ${answer} pokona ${enemy}? Zwróc true jeśli ${answer} wygrywa`
        }),
      });
  
      const data = await res.json();
  
      console.log(data.text_content);
      if (res.ok && data?.text_content) {
        setResponse(data.text_content); // Ustawienie odpowiedzi na zapytanie, czy pokona
        if (data.text_content == '{"text_content": "true"}') {
          // Jeśli odpowiedź to true, zapytamy o losowy fakt
          setEnemy(answer);
          const factRes = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: `Zwróć losowy fakt na temat ${answer}`
            }),
          });

          const factData = await factRes.json();
          if (factRes.ok && factData?.text_content) {
            setFact(factData.text_content); // Ustawienie losowego faktu
          } else {
            setFact(factData?.error || "An error occurred while fetching a random fact.");
          }
        }
      } else {
        setResponse(data?.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Czym pokonasz {enemy}?</h2>
        <h3 className="text-xl font-bold text-center mb-4">Sprawdź swoją odpowiedź</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              placeholder={`Czym pokonasz ${enemy}?`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)} // Ustawianie odpowiedzi użytkownika
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300"
            >
              {loading ? "Sprawdzam..." : "Sprawdzam"}
            </button>
          </div>
        </form>
        <div>
          <h3 className="font-bold">Odpowiedź:</h3>
          <p>{response}</p>
          
          {/* Wyświetlanie losowego faktu, jeśli dostępny */}
          {fact && (
            <div>
              <h3 className="font-bold">Losowy fakt:</h3>
              <p>{fact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiPrompt;
