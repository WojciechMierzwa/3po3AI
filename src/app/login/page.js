'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Emoji from '../components/emoji/emoji'

export default function Login() {
  const [name, setName] = useState('');  // Change username to name
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Inicjalizacja routera

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),  // Use name instead of username
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Save the token to localStorage
      localStorage.setItem('token', data.token);

      // Redirect to the home page after successful login
      router.push('/'); // Redirect to the home page

      // Force page reload to update the navbar
      window.location.reload();  // Force refresh to update the navbar

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const eyeball = (event) => {
      const eyes = document.querySelectorAll(".eye")
      eyes.forEach((eye) => {
        let x = eye.getBoundingClientRect().left + eye.clientWidth / 2
        let y = eye.getBoundingClientRect().top + eye.clientHeight / 2
        let radian = Math.atan2(event.pageX - x, event.pageY - y)
        let rot = (radian * (180 / Math.PI) * -1) + 270
        eye.style.transform = `rotate(${rot}deg)`
      })
    }

    document.querySelector("body").addEventListener("mousemove", eyeball)

    return () => {
      document.querySelector("body").removeEventListener("mousemove", eyeball)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="flex justify-center mb-6">
          <Emoji />
        </div>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Logowanie</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Login</label>  {/* Change username to name */}
            <input
              type="text"
              id="name"  // Change username to name
              value={name}  // Bind to name instead of username
              onChange={(e) => setName(e.target.value)}  // Update to setName
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
}
