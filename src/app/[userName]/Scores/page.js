'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function UserProfile() {
  const { userName } = useParams();
  const [userData, setUserData] = useState(null);
  const [lastGame, setLastGame] = useState(null);  // Separate state for last game
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('best');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/images/profiles/pepe.jpg");
  const [canEdit, setCanEdit] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // Track the total pages available

  // Helper function to format the date in a user-friendly format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user scores with pagination and sorting based on filter
        const response = await fetch(
          `/api/userScores?user=${userName}&page=${currentPage}&limit=${resultsPerPage}&sortBy=${filter === 'best' ? 'score' : 'date'}&sortOrder=desc`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
  
        // Update profile picture
        if (data.profilePicture) {
          setSelectedImage(data.profilePicture);
        }
  
        // Check if user can edit profile
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwt.decode(token);
          if (decodedToken && decodedToken.name === userName) {
            setCanEdit(true);
          }
        }

        // Update total pages for pagination
        const totalScores = data.scores.length; // Total number of scores
        const totalPages = Math.ceil(totalScores / resultsPerPage); // Calculate total pages
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchLastGame = async () => {
      try {
        const response = await fetch(`/api/userScores?user=${userName}&limit=1&sortBy=date&sortOrder=desc`); // Fetch only the latest game
        if (!response.ok) {
          throw new Error('Failed to fetch last game');
        }
        const data = await response.json();
        setLastGame(data.scores[0] || {}); // Set the first score from the fetched data as the last game
      } catch (error) {
        console.error('Error fetching last game:', error);
      }
    };

    if (userName) {
      fetchUserData();
      fetchLastGame();  // Fetch last game separately to avoid sorting issues
    }
  }, [userName, currentPage, filter, resultsPerPage]);

  if (loading) {
    return <p className="text-center text-lg text-blue-500">Ładowanie...</p>;
  }

  if (!userData) {
    return <p className="text-center text-lg text-red-500">Nie znaleziono użytkownika</p>;
  }

  const handleImageClick = () => {
    if (canEdit) {
      setIsModalOpen(true);
    }
  };

  const handleSelectImage = async (image) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await fetch("/api/updateProfilePicture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePicture: image }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile picture");
      }

      // Update the selected image and close the modal
      setSelectedImage(image);
      setIsModalOpen(false);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Profile Section */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-xl p-6 transform transition-transform hover:scale-105">
        <div className="flex flex-col items-center">
          <img
            src={selectedImage}
            alt={userData.name}
            className={`w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg transform transition-transform hover:scale-110 cursor-pointer ${canEdit ? 'cursor-pointer' : ''}`}
            onClick={handleImageClick}
          />
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">{userData.name}</h2>
          <p className="text-lg mt-2">Coins: {userData.coins}</p> {/* Display coins */}
        </div>
        <div className="mt-6 space-y-6">
          {/* Display the Last Game info */}
          {lastGame ? (
            <p><strong>Ostatnia gra:</strong> {formatDate(lastGame.date)} <strong>Wynik:</strong> {lastGame.score}</p>
          ) : (
            <p><strong>Ostatnia gra:</strong> Brak danych</p>
          )}
          <p><strong>Najwyższy wynik:</strong> {userData.bestScore}</p>
          <p><strong>Pozycja w rankingu:</strong> #{userData.ranking}</p>
        </div>
      </div>

      {/* Scores Section */}
      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Wyniki</h2>
        {/* Filter buttons */}
        <div className="flex space-x-4 mb-4">
          <button onClick={() => setFilter('best')} className={`px-4 py-2 rounded-full ${filter === 'best' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Najlepsze wyniki</button>
          <button onClick={() => setFilter('latest')} className={`px-4 py-2 rounded-full ${filter === 'latest' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Od najnowszych</button>
        </div>

        {/* Table to display scores */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th>#</th>
                <th>Wynik</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {userData.scores.map((score, idx) => (
                <tr key={idx} className="border-b">
                  <td>{(currentPage - 1) * resultsPerPage + idx + 1}</td>
                  <td>{score.score}</td>
                  <td>{formatDate(score.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-gray-300 rounded-full"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p className="text-lg">Page {currentPage} of {totalPages}</p>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 bg-gray-300 rounded-full"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal for selecting profile picture */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 sm:w-1/2 max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Wybierz zdjęcie profilowe</h3>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
              {['pepe.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg'].map((img, idx) => (
                <div key={idx} onClick={() => handleSelectImage(`/images/profiles/${img}`)}>
                  <img src={`/images/profiles/${img}`} className="cursor-pointer w-full h-full object-cover" alt={`Profile Image ${idx + 1}`} />
                </div>
              ))}
            </div>
            <button onClick={handleCloseModal} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full w-full">Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
}
