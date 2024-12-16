"use client";
import Link from 'next/link';
import { useState } from 'react';
import '@/app/globals.css';

export default function Next({ message, fact, stats, emoji, onNext }) {
  const match = fact.match(/"text_content":\s*"([^"]+)"/);
  const factText = match ? match[1] : '';
  const receivedPrompt = factText.split("#")
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-center mb-4">Twój aktualny wynik: {stats}</h3>
        <h2 className="text-l font-bold text-center mb-4">{receivedPrompt[0]}</h2>
        <h2 className="text-5xl font-bold text-center mb-4">{receivedPrompt[1]}</h2>
        <button
          onClick={onNext} // Wywołanie funkcji przejścia do następnego pytania
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Następne pytanie
        </button>
      </div>
    </div>
  );
}
