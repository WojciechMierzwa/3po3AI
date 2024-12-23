import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you have your API key in your environment variables
const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: {
          parts: [
            {
              text: `You are a helpful assistant. Please be concise and precise. 
               **Your response must always be a valid JSON object with the following structure:
      
               * **text_content:** the generated content.
              `,
            },
          ],
          role: "model",
        },
      });

      const parts = [{ text: prompt }];
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };

      
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
      });

      // Ensure result structure is as expected
      if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({
          text_content: result.response.candidates[0].content.parts[0].text,
        });
      } else {
        return res.status(500).json({ error: "Unexpected response structure" });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to get a response from Gemini" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
