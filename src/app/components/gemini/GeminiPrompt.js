"use client";
import React, { useState } from "react";

const GeminiPrompt = ({ enemy, message, onCorrect, onIncorrect }) => {
  const [answer, setAnswer] = useState(""); // State for the user's answer
  const [response, setResponse] = useState(""); // State for the response message
  const [fact, setFact] = useState("Sprawdź swoją odpowiedź"); // State for the random fact
  const [loading, setLoading] = useState(false); // State for loading state
  const [showGif, setShowGif] = useState(false); // State for showing the thinking GIF

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!answer.trim()) {
      setResponse("Proszę wpisać poprawną odpowiedź.");
      console.log("Brak odpowiedzi.");
      return;
    }

    setLoading(true);
    setShowGif(true); // Show the thinking GIF when submitting
    setResponse(""); // Clear any previous responses

    console.log("Rozpoczynanie zapytania do API...");

    try {
      console.log("Wysyłam zapytanie do API Gemini...");
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Czy ${answer} pokona ${enemy}? Zwróć true jeśli ${answer} wygrywa`,
        }),
      });

      const data = await res.json();
      console.log("Odpowiedź z API Gemini:", data);

      if (data.text_content === '{"text_content": "true"}') {
        setResponse("Dobra odpowiedź!");
        console.log("Poprawna odpowiedź!");

        const nextEnemy = answer; // Assume the answer is the next opponent
        console.log("Pobieram losowy fakt...");

        const factRes = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Zwróć losowy fakt na temat ${answer}`,
          }),
        });

        const factData = await factRes.json();
        console.log("Odpowiedź z API faktu:", factData);

        if (factRes.ok && factData?.text_content) {
          setFact(factData.text_content); // Set the fact locally
          onCorrect(nextEnemy, `Czym pokonasz ${nextEnemy}?`, factData.text_content); // Pass the fact to the parent
        } else {
          setFact("Nie udało się pobrać faktu. Spróbuj ponownie.");
          setResponse("Nie udało się pobrać faktu. Spróbuj ponownie.");
          console.log("Nie udało się pobrać faktu.");
        }
      } else {
        setResponse("Zła odpowiedź!");
        console.log("Zła odpowiedź.");
        onIncorrect();
      }
    } catch (error) {
      console.error("Błąd w zapytaniu:", error);
      setResponse("Wystąpił błąd. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
      setShowGif(false); // Hide the thinking GIF
      console.log("Koniec zapytania do API.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Czym pokonasz {enemy}?</h2>
        <h3 className="text-xl font-bold text-center mb-4">{fact}</h3>
        
        {/* Conditionally render form or GIF */}
        {showGif ? (
          <div className="flex justify-center items-center">
            <img src="images/thinking.gif" alt="Thinking" className="h-24 w-24" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                placeholder={`Czym pokonasz ${enemy}?`}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
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
        )}
        
        <div>
          <p>{response}</p>
        </div>
      </div>
    </div>
  );
};

export default GeminiPrompt;
