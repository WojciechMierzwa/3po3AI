'use client';
import React, { useState } from "react";

const GeminiPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setResponse("Please enter a valid prompt.");
      return;
    }

    setLoading(true); // Show loading state
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      // Handle error response from API
      if (res.ok && data?.text_content) {
        setResponse(data.text_content);
      } else {
        setResponse(data?.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setResponse("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div>
      <h2>Ask Gemini anything!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      <div>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default GeminiPrompt;
