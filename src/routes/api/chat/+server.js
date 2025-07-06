import { json } from '@sveltejs/kit';

// IMPORTANT: Replace with your actual Gemini API key.
// It is highly recommended to use environment variables for sensitive information.
// For example, create a .env file in the root of your project and add:
// GEMINI_API_KEY="your_gemini_api_key_here"
// Then, access it via process.env.GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash"; // Or gemini-1.0-pro, etc.

import { tools, callTool } from '$lib/tools.js';

export async function POST({ request }) {
  const { message, conversationHistory } = await request.json();

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set. Please set it in your environment variables.');
    return json({ response: 'Error: Gemini API key is not configured.' }, { status: 500 });
  }

  try {
    var currentConversation = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    currentConversation.push({
      role: 'user',
      parts: [{ text: message }]
    });

    var responseData;
    var hasFunctionCall = true;

    while (hasFunctionCall) {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: currentConversation,
            tools: tools
          })
        }
      );

      responseData = await geminiResponse.json();
      console.log('Gemini API Response:', JSON.stringify(responseData, null, 2));

      if (responseData.candidates && responseData.candidates[0].content.parts) {
        const candidate = responseData.candidates[0].content;

        if (candidate.parts[0].functionCall) {
          const toolCall = candidate.parts[0].functionCall;
          try {
            const toolOutput = await callTool(toolCall);

            // If the tool output is specifically for news and contains pre-formatted HTML, send it directly
            if (toolCall.name === 'get_world_news' && toolOutput.news) {
              return json({ response: toolOutput.news });
            }

            currentConversation.push({
              role: 'model',
              parts: [{ functionCall: toolCall }]
            });
            currentConversation.push({
              role: 'function',
              parts: [{ functionResponse: { name: toolCall.name, response: toolOutput } }]
            });
            hasFunctionCall = true; // Continue loop if a function call was made
          } catch (toolError) {
            console.error('Error executing tool:', toolError);
            return json({ response: `Error: Failed to execute tool ${toolCall.name}.` }, { status: 500 });
          }
        } else if (candidate.parts[0].text) {
          hasFunctionCall = false; // Exit loop if text response is received
        } else {
          console.warn('Unexpected content parts from Gemini:', candidate.parts);
          hasFunctionCall = false;
        }
      }
      else {
        console.error('No candidates or content in Gemini response:', responseData);
        hasFunctionCall = false;
      }
    }

    if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content && responseData.candidates[0].content.parts && responseData.candidates[0].content.parts[0] && responseData.candidates[0].content.parts[0].text) {
      const finalResponseText = responseData.candidates[0].content.parts[0].text;
      return json({ response: finalResponseText });
    } else {
      console.error('Final response text is empty or undefined, or response structure is unexpected:', JSON.stringify(responseData, null, 2));
      return json({ response: 'Error: Received an empty or unexpected response from the AI. Please check the server logs for more details.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error communicating with Gemini or executing tool:', error);
    return json({ response: 'Error: Could not get response from AI or execute tool. Check your API key and network connection.' }, { status: 500 });
  }
}