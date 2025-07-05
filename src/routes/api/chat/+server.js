import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Replace with your actual Gemini API key.
// It is highly recommended to use environment variables for sensitive information.
// For example, create a .env file in the root of your project and add:
// GEMINI_API_KEY="your_gemini_api_key_here"
// Then, access it via process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST({ request }) {
  const { message } = await request.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return json({ response: text });
  } catch (error) {
    console.error('Error communicating with Gemini:', error);
    return json({ response: 'Error: Could not get response from AI. Check your API key and network connection.' }, { status: 500 });
  }
}
