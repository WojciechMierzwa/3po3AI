'use client';
import { useState } from 'react';
import Head from 'next/head';

export default function Share({ stats, closePopup }) {
  // Message for Facebook
  const message = `Wykręciłem/am niezły wynik!!!\nAż (づ ᴗ _ᴗ)づ 🏅 ${stats} ✅ odpowiedzi. Może kolej na ciebie?`;
  const messageWhatsapp = `Wykręciłem/am niezły wynik!!!\nAż (づ ᴗ _ᴗ)づ ${stats} poprawnych odpowiedzi. Może kolej na ciebie?`;
  const link = "https://3po3ai.pl";
  const imageUrl = "images/celebrate.gif"; // Możesz zmienić na własny obrazek

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=test`,
      image: '/images/logos/facebook-logo.png',
      color: 'bg-blue-600 hover:bg-blue-700', // Facebook blue color
    },
    {
      name: 'X',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(message)}`,
      image: '/images/logos/x-logo.png',
      color: 'bg-black hover:bg-gray-800', // Kolor X (dawniej Twitter)
    },
    {
      name: 'Whatsapp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(messageWhatsapp + link)}`,
      image: '/images/logos/whatsapp-logo.png',
      color: 'bg-green-600 hover:bg-green-700', // Kolor WhatsAppa
    },
  ];

  return (
    <>
      <Head>
        <title>Udostępnij Wynik</title>
        <meta property="og:title" content="Amazing Content!" />
        <meta property="og:description" content={message} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={link} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 relative">
          <button
            onClick={closePopup}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
          <h2 className="text-xl font-semibold text-center mb-4">
            Wykręciłeś niezły wynik. <br />
            {stats} ✔️ odpowiedzi‼️ <br />
            Czas się tym podzielić ze znajomymi
          </h2>

          <img
            src={imageUrl}
            alt="Share Preview"
            className="w-full h-auto rounded-md mb-4"
          />
          <ul className="space-y-4">
            {shareLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md transition ${link.color}`}
                >
                  <img
                    src={link.image}
                    alt={link.name}
                    className="w-12 h-12"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
