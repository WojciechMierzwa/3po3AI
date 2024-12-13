'use client'

import Emoji from '../components/emoji/emoji'
import { useState, useEffect } from 'react'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted', { username, password, email })
  }

  const handleDiscordRegister = () => {
    console.log('Register via Discord')
  }

  const handleGmailRegister = () => {
    console.log('Register via Gmail')
  }

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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Login</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Zarejestruj się
            </button>
          </div>
        </form>

        <div className="flex flex-col items-center">
          <button
            onClick={handleDiscordRegister}
            className="w-full mb-2 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <img src="images/discord.png" alt="Discord" className="h-5 w-5 mr-2" />
            Zarejestruj się przez Discord
          </button>
          <button
              onClick={handleGmailRegister}
              className="w-full bg-gray-100 text-black py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center justify-center"
            >
              <img src="images/gmail.png" alt="Gmail" className="h-5 w-5 mr-2" />
              Zarejestruj się przez Gmail
            </button>

        </div>
      </div>
    </div>
  )
}
