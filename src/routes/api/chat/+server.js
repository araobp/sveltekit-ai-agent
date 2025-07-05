import { json } from '@sveltejs/kit';

// IMPORTANT: Replace with your actual Gemini API key.
// It is highly recommended to use environment variables for sensitive information.
// For example, create a .env file in the root of your project and add:
// GEMINI_API_KEY="your_gemini_api_key_here"
// Then, access it via process.env.GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash"; // Or gemini-1.0-pro, etc.

// Define the tools available to the Gemini model
const tools = [
  {
    function_declarations: [
      {
        name: 'google_web_search',
        description: 'Performs a web search using Google Search and returns the results.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query to find information on the web.'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_current_weather',
        description: 'Gets the current weather for a specified location.',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA'
            }
          },
          required: ['location']
        }
      },
      {
        name: 'send_email',
        description: 'Sends an email to a recipient with a given subject and body.',
        parameters: {
          type: 'object',
          properties: {
            to: {
              type: 'string',
              description: 'The recipient\'s email address.'
            },
            subject: {
              type: 'string',
              description: 'The subject of the email.'
            },
            body: {
              type: 'string',
              description: 'The body content of the email.'
            }
          },
          required: ['to', 'subject', 'body']
        }
      },
      {
        name: 'create_calendar_event',
        description: 'Creates a new event on the user\'s calendar.',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the calendar event.'
            },
            start_time: {
              type: 'string',
              description: 'The start time of the event in ISO 8601 format (e.g., 2024-07-20T10:00:00Z)'
            },
            end_time: {
              type: 'string',
              description: 'The end time of the event in ISO 8601 format (e.g., 2024-07-20T11:00:00Z)'
            },
            location: {
              type: 'string',
              description: 'The location of the event.'
            }
          },
          required: ['title', 'start_time', 'end_time']
        }
      }
    ]
  }
];

// Function to execute the tool calls
async function callTool(toolCall) {
  switch (toolCall.name) {
    case 'google_web_search':
      // --- USER IMPLEMENTATION REQUIRED HERE ---
      // In a real application, you would integrate a web search API here.
      // For example, using a library like 'node-fetch' to call a search API.
      // The 'query' argument from the LLM is toolCall.function.args.query
      //
      // Example (conceptual, requires actual web search API integration):
      // const searchApiUrl = `https://api.example.com/search?q=${encodeURIComponent(toolCall.args.query)}`;
      // const response = await fetch(searchApiUrl);
      // const data = await response.json();
      // return { search_results: data.results }; // Return relevant data to the LLM
      // --- END USER IMPLEMENTATION REQUIRED HERE ---

      console.log(`Executing simulated google_web_search with query: ${toolCall.args.query}`);
      // Simulate a web search result for demonstration purposes
      return {
        search_results: `Simulated search results for "${toolCall.args.query}": Information about ${toolCall.args.query} found on Wikipedia and other sources.`
      };
    case 'get_current_weather':
      console.log(`Executing simulated get_current_weather for location: ${toolCall.args.location}`);
      return {
        weather: `The current weather in ${toolCall.args.location} is sunny with a temperature of 25°C.`
      };
    case 'send_email':
      console.log(`Executing simulated send_email to: ${toolCall.args.to}, subject: ${toolCall.args.subject}`);
      return {
        status: `Email sent successfully to ${toolCall.args.to}.`
      };
    case 'create_calendar_event':
      console.log(`Executing simulated create_calendar_event: ${toolCall.args.title} from ${toolCall.args.start_time} to ${toolCall.args.end_time} at ${toolCall.args.location}`);
      return {
        status: `Calendar event '${toolCall.args.title}' created successfully.`
      };
    default:
      throw new Error(`Tool ${toolCall.name} not found.`);
  }
}

export async function POST({ request }) {
  const { message } = await request.json();

  try {
    var conversationHistory = [
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

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
            contents: conversationHistory,
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

            conversationHistory.push({
              role: 'model',
              parts: [{ functionCall: toolCall }]
            });
            conversationHistory.push({
              role: 'function',
              parts: [{ functionResponse: { name: toolCall.name, response: toolOutput } }]
            });
            hasFunctionCall = true; // Continue loop if a function call was made
          } catch (toolError) {
            console.error('Error executing tool:', toolError);
            return json({ response: `Error: Failed to execute tool ${toolCall.function.name}.` }, { status: 500 });
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

    const finalResponseText = responseData.candidates[0].content.parts[0].text;

    if (finalResponseText) {
      return json({ response: finalResponseText });
    } else {
      console.error('Final response text is empty or undefined:', responseData);
      return json({ response: 'Error: Received an empty or unexpected response from the AI.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error communicating with Gemini or executing tool:', error);
    return json({ response: 'Error: Could not get response from AI or execute tool. Check your API key and network connection.' }, { status: 500 });
  }
}