'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UserProfile() {
  const { userName } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('best');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/images/profiles/pepe.jpg"); // Domyślny obrazek

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
    return <p className="text-center text-lg text-blue-500">Ładowanie...</p>;
  }

  if (!userData) {
    return <p className="text-center text-lg text-red-500">Nie znaleziono użytkownika</p>;
  }

  // Filtrowanie wyników
  let filteredScores = userData.scores;
  if (filter === 'best') {
    filteredScores = [...userData.scores].sort((a, b) => b.score - a.score);
  } else if (filter === 'latest') {
    filteredScores = [...userData.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Paginacja
  const indexOfLastScore = currentPage * resultsPerPage;
  const indexOfFirstScore = indexOfLastScore - resultsPerPage;
  const currentScores = filteredScores.slice(indexOfFirstScore, indexOfLastScore);
  const totalPages = Math.ceil(filteredScores.length / resultsPerPage);

  // Funkcja formatowania daty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Obsługa kliknięcia na zdjęcie profilowe
  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  // Obsługa wyboru nowego obrazu
  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setIsModalOpen(false);
  };

  // Obsługa zamknięcia modalu
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Lewa kolumna: Profil użytkownika */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-xl p-6 transform transition-transform hover:scale-105">
        <div className="flex flex-col items-center">
          {/* Zdjęcie profilowe */}
          <img
            src={selectedImage}
            alt={userData.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg transform transition-transform hover:scale-110 cursor-pointer"
            onClick={handleImageClick} // Po kliknięciu otwiera modal
          />
          {/* Imię */}
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">{userData.name}</h2>
        </div>

        {/* Statystyki użytkownika */}
        <div className="mt-6 space-y-6">
          <p className="text-md font-medium">
            <span className="font-bold">Ostatnia gra:</span> {formatDate(userData.lastGame?.date)} <b>Wynik:</b> {userData.lastGame?.score}
          </p>
          <p className="text-md font-medium">
            <span className="font-bold">Najwyższy wynik:</span> {userData.bestScore}
          </p>
          <p className="text-md font-medium">
            <span className="font-bold">Pozycja w rankingu:</span> #{userData.ranking}
          </p>
        </div>
      </div>

      {/* Prawa kolumna: Wyniki */}
      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Wyniki</h2>

        {/* Filtry */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setFilter('best')}
            className={`px-4 py-2 rounded-full text-md font-semibold transition-colors transform ${filter === 'best' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Najlepsze wyniki
          </button>
          <button
            onClick={() => setFilter('latest')}
            className={`px-4 py-2 rounded-full text-md font-semibold transition-colors transform ${filter === 'latest' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Od najnowszych
          </button>
        </div>

        {/* Tabela wyników */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Wynik</th>
                <th className="px-6 py-3 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {currentScores.map((entry, index) => (
                <tr key={index} className={`transition-transform duration-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-indigo-50`}>
                  <td className="px-6 py-3">{index + 1 + (currentPage - 1) * resultsPerPage}</td>
                  <td className="px-6 py-3">{entry.score}</td>
                  <td className="px-6 py-3">{formatDate(entry.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginacja */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            disabled={currentPage === 1}
          >
            Poprzednia
          </button>
          <span className="text-lg font-medium text-gray-700">
            Strona {currentPage} z {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            disabled={currentPage === totalPages}
          >
            Następna
          </button>
        </div>
      </div>

      {/* Modal wyboru obrazu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-semibold mb-4">Wybierz zdjęcie profilowe</h3>
            <div className="grid grid-cols-3 gap-4">
              {['pepe.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg', 'image9.jpg'].map((image, index) => (
                <div key={index} className="cursor-pointer" onClick={() => handleSelectImage(`/images/profiles/${image}`)}>
                  <img src={`/images/profiles/${image}`} alt={`Profile ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                </div>
              ))}
            </div>
            <button onClick={handleCloseModal} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full">
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
