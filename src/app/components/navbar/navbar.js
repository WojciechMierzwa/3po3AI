'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import routera
import { jwtDecode } from 'jwt-decode'; // Dekodowanie tokena
import '@/app/globals.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // Stan dla użytkownika
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Usuwamy token
    setUser(null); // Czyścimy stan użytkownika
    router.push('/login'); // Przekierowujemy na stronę logowania
  };

  useEffect(() => {
    // Funkcja sprawdzająca czy użytkownik jest zalogowany
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token); // Dekodowanie tokena
      setUser(decodedToken); // Ustawienie danych użytkownika
    }
  }, []); // Uruchamiamy tylko raz przy pierwszym renderze

  useEffect(() => {
    // Nasłuchujemy zmiany w localStorage
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken); // Zaktualizowanie stanu użytkownika
      } else {
        setUser(null); // Jeśli token nie istnieje, to wylogowujemy
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Sekcja po lewej stronie */}
          <div className="flex items-center justify-start w-full space-x-4">
            <Link href="/" className="text-2xl font-bold text-white">
              3po3AI
            </Link>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Strona główna
                </Link>

                {!user && (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Logowanie
                    </Link>
                    <Link
                      href="/register"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Rejestracja
                    </Link>
                  </>
                )}
                <Link
                  href="/leaderboard"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Tablica wyników
                </Link>
              </div>
            </div>
          </div>

          {/* Sekcja po prawej stronie (po zalogowaniu) */}
          {user && (
            <div className="flex items-center space-x-4 sm:ml-auto">
              <span className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Zalogowano jako {user.username}
              </span>
              <button
                onClick={logout}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Wyloguj
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                Zalogowano jako {user.username}
              </span>
              <button
                onClick={logout}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Wyloguj
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
