'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import the Link component from next/link

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("week");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 6;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?period=${activeTab}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch leaderboard data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const currentRecords = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(data.length / recordsPerPage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        {/* Navigation Tabs */}
        <div className="flex justify-around mb-6">
          {["week", "month", "all-time"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-lg font-semibold rounded-lg transition-colors duration-300 ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-200"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab === "week" && "Tydzień"}
              {tab === "month" && "Miesiąc"}
              {tab === "all-time" && "Najlepsze"}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-lg">Ładowanie...</p>
          ) : (
            <table className="w-full table-auto text-center border-separate border-spacing-0">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">Miejsce</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">Gracz</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-700">Wynik</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentRecords.map((entry, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                    <td className="px-6 py-4 flex items-center justify-start space-x-3">
                      <img
                        src={entry.image || "/images/profiles/pepe.jpg"} // Placeholder if the image is unavailable
                        alt={entry.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <Link
                        href={`/${entry.name}/Scores`} // Use Link instead of a
                        className="text-blue-500 hover:underline font-medium"
                      >
                        {entry.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Poprzednia
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Następna
          </button>
        </div>
      </div>
    </div>
  );
}
