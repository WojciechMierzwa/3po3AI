'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(''); // Przechowywanie nazwy użytkownika
  const [userId, setUserId] = useState(''); // Przechowywanie ID użytkownika

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found, redirecting to login.');
      router.push('/login');
    } else {
      try {
        // Dekodowanie tokena i pobranie danych użytkownika
        const decodedToken = jwtDecode(token); // Dekodowanie tokena
        console.log('Decoded Token:', decodedToken); // Debug: sprawdzamy zdekodowany token
        setUsername(decodedToken.username); // Ustawienie nazwy użytkownika
        setUserId(decodedToken.id); // Ustawienie ID użytkownika
        setIsLoading(false);
      } catch (error) {
        console.error('Invalid token, redirecting to login:', error);
        router.push('/login'); // Przekierowanie w przypadku błędu
      }
    }
  }, [router]);

  if (isLoading) {
    return null; // Możesz dodać loader w trakcie ładowania
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Dashboard</h2>
        <p className="text-center">Witaj, {username}!</p> {/* Wyświetlanie nazwy użytkownika */}
        <p className="text-center">Twoje ID: {userId}</p> {/* Wyświetlanie ID użytkownika */}
      </div>
    </div>
  );
}
