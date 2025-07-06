# SvelteKit AI Agent with Sequential Function Calling

## Overview

This entire project was built without writing a single line of code, thanks to the Gemini CLI.

This project is a Proof of Concept (PoC) for an AI agent application that utilizes a Large Language Model (LLM) via a REST API and is designed to run smoothly even on low-spec client PCs.

To reduce development costs and enable rapid prototyping, the entire application, including the backend, is developed monolithically with SvelteKit.

## Background and Purpose

Many AI applications, especially AI agents, can require significant client-side processing or dedicated libraries. However, these approaches are not feasible in environments with the following constraints:

*   **Limited LLM Access:** While an LLM is available, it can only be accessed via a REST API, with no direct SDK integration permitted.
*   **Poor Client Resources:** End-user PCs have low specifications and cannot handle heavy client-side processing.

This project aims to make an AI agent application viable under these constraints. By adopting an architecture where the server-side handles the communication with the LLM and the primary logic, while the client focuses solely on rendering the UI and user interactions, we can minimize the load on the client PC.

## Tech Stack

*   **Framework:** SvelteKit
*   **Language:** JavaScript
*   **LLM Integration:** REST API

## Architecture

1.  **Client (Browser):** The UI built with SvelteKit runs here. It accepts user input and displays the results.
2.  **Backend (SvelteKit):** Leveraging SvelteKit's server-side capabilities, it receives requests from the client. This backend communicates with the LLM's REST API to execute the AI agent's thinking and processing.
3.  **LLM:** An external Large Language Model provided as a REST API.

This configuration ensures that all computationally intensive processing is completed on the server-side, keeping the client lightweight.

## Application Flow Diagram

For a detailed ASCII flowchart explaining the application's processing flow, please refer to [FLOWCHART.md](FLOWCHART.md).

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/sveltekit-ai-agents.git

# Change into the directory
cd sveltekit-ai-agents

# Install dependencies
npm install

# Set your Gemini API Key (replace with your actual key)
export GEMINI_API_KEY="your_gemini_api_key_here"
# For persistent setting, add the above line to your shell's profile file (~/.bashrc, ~/.zshrc, etc.)
```

### Starting the Development Server

```bash
npm run dev
```

This will start the local development environment.

## Example Usage

```
Input:
Search for information about Dubai online. Then, check the weather there. Summarize the content and send it via email.

Gemini API Response: {
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "functionCall": {
              "name": "send_email",
              "args": {
                "to": "aaa@example.com",
                "body": "This is the information I found about Dubai and the current weather.\n\nDubai is one of the emirates that make up the United Arab Emirates, and is a leading global city in the Middle East. It is known as a center for finance, tourism, and commerce.\n\nThe current weather in Dubai is sunny with a temperature of 25°C.",
                "subject": "dubai"
              }
            }
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 588,
    "candidatesTokenCount": 103,
    "totalTokenCount": 821,
    "promptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 588
      }
    ],
    "thoughtsTokenCount": 130
  },
  "modelVersion": "gemini-2.5-flash",
  "responseId": "yQ5paNa0D7HkqtsPrayt8Qc"
}
```

---

*Note: This README was created with the assistance of the Gemini CLI.*
