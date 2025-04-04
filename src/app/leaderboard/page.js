'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("week");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 5;

  // Fetch leaderboard data
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

  // Run fetchData whenever activeTab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const currentRecords = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(data.length / recordsPerPage);

  // Function to change page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {/* Navigation Tabs */}
        <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full">
              <nav>
                <ul
                  role="tablist"
                  className="flex justify-center items-center gap-4 p-1 rounded-lg bg-blue-gray-50 bg-opacity-60"
                >
                  {["week", "month", "all-time"].map((tab) => (
                    <li
                      key={tab}
                      role="tab"
                      className={`relative flex items-center justify-center px-4 py-2 font-sans text-base font-normal leading-relaxed text-center bg-transparent cursor-pointer rounded-lg ${
                        activeTab === tab
                          ? "text-blue-gray-900 bg-white shadow-md"
                          : "text-blue-gray-500"
                      }`}
                      onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    >
                      {tab === "week" && "Tydzień" }
                      {tab === "month" && "Miesiąc"}
                      {tab === "all-time" && "Najlepsze"}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="p-6 px-0 overflow-scroll">
          {loading ? (
            <p className="text-center text-lg">Ładowanie...</p>
            ) : data.length === 0 ? (
              <p className="text-center text-lg">Brak wyników</p>
            ) : (
            <table className="w-full mt-4 text-left table-auto min-w-max">
              <thead>
                <tr>
                  <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Miejsce
                    </p>
                  </th>
                  <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Gracz
                    </p>
                  </th>
                  <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Wynik
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentRecords.map((entry, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-start space-x-3">
                      <img
                        src={entry.image || "/images/profiles/pepe.jpg"}
                        alt={entry.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <Link
                        href={`/${entry.name}/Scores`}
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
        <div className="flex items-center justify-between border-blue-gray-50">
          <button
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Poprzednia
          </button>

          <button
            className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Następna
          </button>
        </div>
      </div>
    </div>
  );
}
