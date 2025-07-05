<script>
  let message = '';
  let messages = [];

  async function sendMessage() {
    if (message.trim()) {
      messages = [...messages, { text: message, sender: 'user' }];
      const userMessage = message;
      message = '';

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userMessage })
        });

        if (response.ok) {
          const data = await response.json();
          messages = [...messages, { text: data.response, sender: 'ai' }];
        } else {
          messages = [...messages, { text: 'Error: Could not get response from AI.', sender: 'ai' }];
        }
      } catch (error) {
        console.error('Error sending message:', error);
        messages = [...messages, { text: 'Error: Network issue or server not reachable.', sender: 'ai' }];
      }
    }
  }
</script>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Allow it to grow and shrink */
    width: 50%;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }

  .main-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Take full viewport height */
    padding: 10px; /* Add some padding around the content */
    box-sizing: border-box; /* Include padding in height calculation */
  }

  .messages {
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #f9f9f9;
  }

  .message {
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 15px;
    max-width: 80%;
  }

  .message.user {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
    margin-left: auto;
  }

  .message.ai {
    background-color: #e2e2e2;
    color: #333;
    align-self: flex-start;
    margin-right: auto;
  }

  .input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #eee;
    background-color: #fff;
  }

  .input-area input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    margin-right: 10px;
    font-size: 16px;
  }

  .input-area button {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
  }

  .input-area button:hover {
    background-color: #218838;
  }

  h1 {
    text-align: center;
  }
</style>

<div class="main-content-wrapper">
  <h1>AI Agent</h1>
  <div class="chat-container">
    <div class="messages">
      {#each messages as msg}
        <div class="message {msg.sender}">{msg.text}</div>
      {/each}
    </div>
    <div class="input-area">
      <input
        type="text"
        placeholder="Type your message..."
        bind:value={message}
        on:keydown={(e) => { if (e.key === 'Enter') sendMessage(); }}
      />
      <button on:click={sendMessage}>Send</button>
    </div>
  </div>
</div>
