'use client';

import React, { useState } from "react";
import { leaderboardData } from "./leaderboard";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("week");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div >
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
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === "week" && "Tydzień"}
                        {tab === "month" && "Miesiąc"}
                        {tab === "all-time" && "Najlepsze"}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div className="p-6 px-0 overflow-scroll">
            <table className="w-full mt-4 text-left table-auto min-w-max">
              <thead>
                <tr>
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
              <tbody>
                {leaderboardData[activeTab].map((entry, index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-${index +
                            1}.jpg`}
                          alt={entry.player}
                          className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                        />
                        <div className="flex flex-col">
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {entry.player}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {entry.score}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
