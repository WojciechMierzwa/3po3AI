'use client'
import React, { useEffect, useState } from "react";

const EnvDisplay = () => {
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    // Client-side code only runs after hydration
    setClientReady(true);
    console.log("NEXT_PUBLIC_GEMINI_API_KEY:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  }, []);

  return (
    <div>
      <h1>Zmienne środowiskowe:</h1>
      {clientReady ? (
        <p>NEXT_PUBLIC_GEMINI_API_KEY: {process.env.NEXT_PUBLIC_GEMINI_API_KEY || "Nie ustawiono"}</p>
      ) : (
        <p>Ładowanie...</p>
      )}
    </div>
  );
};

export default EnvDisplay;
