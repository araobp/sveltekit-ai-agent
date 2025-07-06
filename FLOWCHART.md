# Application Processing Flow

```
+-----------------------+
|         User          |
+-----------------------+
           |
           | Types message
           v
+-----------------------+
|   SvelteKit Frontend  |
|     (+page.svelte)    |
+-----------------------+
           |
           | POST /api/chat (message, history)
           v
+-----------------------+
|   SvelteKit Backend   |
|      (Chat API)       |
+-----------------------+
           |
           |  +---------------------------------+
           |  | Loop:                           |
           |  |                                 |
           |  | Request: generateContent        |
           |  | (conversation, tools)           |
           |  |                                 |
           |  | Response: candidate             |
           |  | (text OR functionCall)          |
           |  |                                 |
           |  | IF functionCall:                |
           |  |   - Call Tool (lib/tools.js)    |
           |  |   - Tool Output                 |
           |  |   - (Add tool output to conv.)  |
           |  |   - (Continue loop)             |
           |  | ELSE (text response):           |
           |  |   - (Exit loop)                 |
           |  +---------------------------------+
           |
           v
+-----------------------+
|   SvelteKit Backend   |
|      (Chat API)       |
+-----------------------+
           |
           | JSON Response (AI's text)
           v
+-----------------------+
|   SvelteKit Frontend  |
|     (+page.svelte)    |
+-----------------------+
           |
           | Displays AI's response
           v
+-----------------------+
|         User          |
+-----------------------+


(Initial Load of Functions - Separate Flow)

+-----------------------+
|   SvelteKit Frontend  |
|     (+page.svelte)    |
+-----------------------+
           |
           | GET /api/functions
           v
+-----------------------+
|   SvelteKit Backend   |
|    (Functions API)    |
+-----------------------+
           |
           | Read tool definitions
           v
+-----------------------+
|         Tools         |
|    (lib/tools.js)     |
+-----------------------+
           |
           | Tool definitions
           v
+-----------------------+
|   SvelteKit Backend   |
|    (Functions API)    |
+-----------------------+
           |
           | JSON Response
           v
+-----------------------+
|   SvelteKit Frontend  |
|     (+page.svelte)    |
+-----------------------+
           |
           | Displays available functions
           v
+-----------------------+
|         User          |
+-----------------------+
```