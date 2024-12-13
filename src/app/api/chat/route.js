// app/api/chat/route.js
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';


// Create OpenAI instance with API key from environment variables
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your OpenAI key is in .env
}));

export async function POST(request) {
  try {
    const { message } = await request.json(); // Get the message from the request body

    

    // Call OpenAI's API to get a response
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // You can use other models like gpt-4
      messages: [{ role: 'user', content: message }],
    });

    // Send back the AI's response
    const aiResponse = response.data.choices[0].message.content;
    return NextResponse.json({ reply: aiResponse });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}
