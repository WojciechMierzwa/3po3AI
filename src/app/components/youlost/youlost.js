'use client';
import Link from 'next/link';
import { useState } from 'react';
import '@/app/globals.css'


export default function youLost({message, stats}) {
    message = "Przegrałeś";
    stats = 5;
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">{message}</h2>
                <div className="text-center text-4xl my-2">💀</div>
                <h3 className="text-2l font-bold text-center mb-4">Finalny wynik: {stats}</h3>
                <form>
                  <div className="mb-6">
                    <button
                      type="submit"
                      className="text-2xl w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                     Zacznij od nowa  🔄
                    </button>
                  </div>
                </form>
                <div className="flex flex-col items-center">
                </div>
              </div>
            </div>
    );
}