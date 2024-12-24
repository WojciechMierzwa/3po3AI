'use client'
import { useEffect, useState } from "react";

export default function Test() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch("/api/scores")
      .then((response) => response.json())
      .then((data) => setScores(data))
      .catch((error) => console.error("Error fetching scores:", error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Scores</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Player</th>
              <th className="border p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score._id}>
                <td className="border p-2">{score.userDetails.name}</td>
                <td className="border p-2">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
