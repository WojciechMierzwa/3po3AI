'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UserProfile() {
  const { userName } = useParams(); // Pobieranie dynamicznego parametru
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'best', 'latest'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/userScores?user=${userName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchUserData();
    }
  }, [userName]);

  if (loading) {
    return <p className="text-center text-lg">Ładowanie...</p>;
  }

  if (!userData) {
    return <p className="text-center text-lg text-red-500">Nie znaleziono użytkownika</p>;
  }

  // Filtrowanie wyników
  let filteredScores = userData.scores;

  if (filter === 'best') {
    filteredScores = [...userData.scores].sort((a, b) => b.score - a.score); // Sortowanie od najwyższego do najniższego
  } else if (filter === 'latest') {
    filteredScores = [...userData.scores].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sortowanie od najnowszej daty
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-6 p-6 bg-gray-100">
      {/* Lewa kolumna: Profil użytkownika */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          {/* Zdjęcie profilowe */}
          <img
            src={"/images/profiles/pepe.jpg"}
            alt={userData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          />
          {/* Imię */}
          <h2 className="text-xl font-bold mt-4">{userData.name}</h2>
        </div>

        {/* Statystyki użytkownika */}
        <div className="mt-6 space-y-4">
          <p className="text-md font-medium">
            <span className="font-bold">Ostatnia gra:</span> {userData.lastGame?.date} - {userData.lastGame?.score}
          </p>
          <p className="text-md font-medium">
            <span className="font-bold">Najwyższy wynik:</span> {userData.bestScore}
          </p>
          <p className="text-md font-medium">
            <span className="font-bold">Pozycja w rankingu:</span> #{userData.ranking}
          </p>
          
          {/* Pasek na trofea / osiągnięcia */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Osiągnięcia</h3>
            <div className="flex space-x-2 mt-2">
              {/* Tutaj można dodać trofea, np. jako ikony */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white">🏅</span>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white">🎉</span>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white">🏆</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Brak osiągnięć</p> {/* Póki co, brak osiągnięć */}
          </div>
        </div>
      </div>

      {/* Prawa kolumna: Wyniki */}
      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Wyniki</h2>

        {/* Filtry */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Wszystkie
          </button>
          <button
            onClick={() => setFilter('best')}
            className={`px-4 py-2 rounded ${
              filter === 'best' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Najlepsze wyniki
          </button>
          <button
            onClick={() => setFilter('latest')}
            className={`px-4 py-2 rounded ${
              filter === 'latest' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Od najnowszych
          </button>
        </div>

        {/* Tabela wyników */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Wynik</th>
                <th className="px-4 py-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.map((entry, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{entry.score}</td>
                  <td className="px-4 py-2">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}