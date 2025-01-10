'use client'
import { useState, useEffect } from 'react';
import Emoji from '../components/emoji/emoji'

export default function Register() {
  const [name, setName] = useState('');  // Change username to name
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),  // Update the body to use name
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage('Registration successful!');
      setName('');  // Reset name instead of username
      setPassword('');
    } catch (error) {
      setMessage(error.message);
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
        <h2 className="text-2xl font-bold text-center mb-4">Rejestracja</h2>
        {message && <p className={`mb-4 text-center ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Login</label>  {/* Change 'username' to 'name' */}
            <input
              type="text"
              id="name"  // Change 'username' to 'name'
              value={name}  // Bind to 'name' instead of 'username'
              onChange={(e) => setName(e.target.value)}  // Update to setName
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
}
