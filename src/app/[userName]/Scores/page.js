'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Import the useParams hook

export default function UserScores() {
  const { userName } = useParams(); // Access dynamic param 'userName' from the URL
  const [activeTab, setActiveTab] = useState('best');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user data based on the userName from the URL
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/userScores?user=${userName}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch user scores', error);
    }
    setLoading(false);
  };

  // Fetch user data on userName change
  useEffect(() => {
    if (userName) {
      fetchUserData();
    }
  }, [userName]);

  const sortedData =
    activeTab === 'best'
      ? [...data].sort((a, b) => b.score - a.score)
      : [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
        <h1 className='text-xl font-bold mb-4'>{userName}'s Scores</h1>

        <div className='flex justify-around'>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'best' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('best')}
          >
            All Time Best
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'recent' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Games
          </button>
        </div>

        <div className='mt-4'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className='w-full table-auto'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.score}</td>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
