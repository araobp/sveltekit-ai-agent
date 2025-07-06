export const tools = [
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
      },
      {
        name: 'play_system_sound',
        description: 'Plays a system sound on the server\'s macOS machine.',
        parameters: {
          type: 'object',
          properties: {
            sound_name: {
              type: 'string',
              description: 'The name of the system sound to play (e.g., "Basso", "Frog", "Purr").'
            }
          },
          required: ['sound_name']
        }
      },
      {
        name: 'open_browser',
        description: 'Opens a specific URL in the default web browser on the server\'s macOS machine.',
        parameters: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to open (e.g., "https://www.google.com").'
            }
          },
          required: ['url']
        }
      },
      {
        name: 'get_world_news',
        description: 'Retrieves the latest world news headlines.',
        parameters: {
          type: 'object',
          properties: {}
        }
      }
    ]
  }
];

import { exec } from 'child_process';
import fetch from 'node-fetch';

export async function callTool(toolCall) {
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
      try {
        const location = toolCall.args.location;

        // Step 1: Geocoding using OpenStreetMap Nominatim
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
        const geocodingResponse = await fetch(geocodingUrl, {
          headers: {
            'User-Agent': 'SvelteKit-AI-Agent/1.0 (https://github.com/your-username/sveltekit-ai-agents)' // Replace with your actual app name and URL
          }
        });
        const geocodingData = await geocodingResponse.json();

        if (!geocodingResponse.ok || geocodingData.length === 0) {
          throw new Error(`Could not find coordinates for ${location}`);
        }

        const { lat, lon, display_name } = geocodingData[0];

        // Step 2: Get weather using Open-Meteo.com
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok || !weatherData.current_weather) {
          throw new Error(`Could not retrieve weather for ${display_name}`);
        }

        const { temperature, weathercode, windspeed, winddirection } = weatherData.current_weather;

        // Basic weather code interpretation (you can expand this)
        let weatherDescription = 'Unknown';
        if (weathercode === 0) weatherDescription = 'Clear sky';
        else if (weathercode > 0 && weathercode < 4) weatherDescription = 'Partly cloudy';
        else if (weathercode >= 4 && weathercode < 10) weatherDescription = 'Fog';
        else if (weathercode >= 10 && weathercode < 20) weatherDescription = 'Drizzle';
        else if (weathercode >= 20 && weathercode < 30) weatherDescription = 'Rain';
        else if (weathercode >= 30 && weathercode < 40) weatherDescription = 'Snow';
        else if (weathercode >= 40 && weathercode < 50) weatherDescription = 'Thunderstorm';

        const fullWeatherDescription = `Current weather in ${display_name}: ${weatherDescription}, Temperature: ${temperature}°C, Wind: ${windspeed} km/h (${winddirection}°).`;

        console.log(`Executing get_current_weather for ${location}: ${fullWeatherDescription}`);
        return { weather: fullWeatherDescription };
      } catch (error) {
        console.error('Error in get_current_weather:', error);
        return { weather: `Failed to get weather for ${toolCall.args.location}: ${error.message}` };
      }
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
    case 'play_system_sound':
      const soundPath = `/System/Library/Sounds/${toolCall.args.sound_name}.aiff`;
      return new Promise((resolve, reject) => {
        exec(`afplay "${soundPath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error playing sound: ${error.message}`);
            reject({ status: `Error playing sound: ${error.message}` });
            return;
          }
          if (stderr) {
            console.error(`afplay stderr: ${stderr}`);
          }
          console.log(`Playing system sound: ${toolCall.args.sound_name}`);
          resolve({ status: `Played sound: ${toolCall.args.sound_name}` });
        });
      });
    case 'open_browser':
      return new Promise((resolve, reject) => {
        exec(`open "${toolCall.args.url}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error opening browser: ${error.message}`);
            reject({ status: `Error opening browser: ${error.message}` });
            return;
          }
          if (stderr) {
            console.error(`open stderr: ${stderr}`);
          }
          console.log(`Opening browser to: ${toolCall.args.url}`);
          resolve({ status: `Opened browser to: ${toolCall.args.url}` });
        });
      });
    case 'get_world_news':
      try {
        const gdeltUrl = 'https://www.gdeltproject.org/data/dailyupdates/today.json'; // GDELT daily updates
        console.log(`Fetching news from: ${gdeltUrl}`);
        const response = await fetch(gdeltUrl);
        console.log(`GDELT API Response Status: ${response.status}`);
        const data = await response.json();
        console.log('GDELT API Raw Data:', JSON.stringify(data, null, 2));

        if (!response.ok || !data || !data.articles) {
          throw new Error('Could not retrieve news from GDELT or unexpected data format.');
        }

        // Extracting headlines and URLs from the first few articles
        const news = data.articles.slice(0, 5).map(article => ({
          title: article.title,
          url: article.url
        }));

        let newsSummary = 'Latest World News:\n';
        news.forEach((item, index) => {
          newsSummary += `${index + 1}. ${item.title} - ${item.url}\n`;
        });

        console.log('Executing get_world_news.');
        return { news: newsSummary };
      } catch (error) {
        console.error('Error in get_world_news:', error);
        return { news: `Failed to get world news: ${error.message}` };
      }