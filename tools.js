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
      }
    ]
  }
];