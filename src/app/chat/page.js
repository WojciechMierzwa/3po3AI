'use client'; // Ensures client-side interactivity

import { useState } from 'react';

export default function Chat() {
  // Define state for messages, user input, and handle changes
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) return; // Avoid empty submissions
    
    // Add the user message to the chat
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput(''); // Clear the input field
    setLoading(true); // Start loading state

    // Fetch AI response from API
    try {
      const aiMessage = await getAIResponse(input);
      
      // Add AI's response to the chat
      setMessages([...newMessages, { role: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages([...newMessages, { role: 'ai', content: "Sorry, there was an error. Please try again." }]);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Function to call the API (replace with your actual API endpoint)
  const getAIResponse = async (userInput) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI response');
    }

    const data = await response.json();
    return data.reply; // Assuming the response contains a 'reply' field
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* Display all messages */}
      {messages.map((m, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      {/* Loading indicator */}
      {loading && <div className="text-center text-gray-500">AI is thinking...</div>}

      {/* Form for user input */}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
