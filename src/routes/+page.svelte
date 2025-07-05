<script>
  import { tick } from 'svelte';
  import { marked } from 'marked';

  var message = '';
  var messages = [];
  var chatContainer; // Declare a variable to hold the chat container element
  var isThinking = false; // New state variable for thinking indicator
  var messageInput; // Declare a variable to hold the message input element

  // Function to render markdown
  function renderMarkdown(text) {
    return marked.parse(text);
  }

  async function sendMessage() {
    if (message.trim()) {
      messages = [...messages, { text: message, sender: 'user' }];
      const userMessage = message;
      message = '';
      isThinking = true; // Set thinking to true when message is sent

      await tick(); // Ensure DOM is updated before scrolling
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        console.log('User message added. ScrollTop:', chatContainer.scrollTop, 'ScrollHeight:', chatContainer.scrollHeight);
      }

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userMessage, conversationHistory: messages })
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
      } finally {
        isThinking = false; // Set thinking to false after response or error
        await tick(); // Ensure DOM is updated after AI response or error
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
          console.log('AI message added. ScrollTop:', chatContainer.scrollTop, 'ScrollHeight:', chatContainer.scrollHeight);
        }
        if (messageInput) {
          messageInput.focus();
        }
      }
    }
  }
</script>

<div class="d-flex flex-column vh-100 p-3">
  <h1 class="text-center mb-3">AI Agent</h1>
  <div class="card flex-grow-1 mx-auto" style="width: 50%;">
    <div class="card-body d-flex flex-column flex-grow-1">
      <div class="flex-grow-1 overflow-auto flex-shrink-1" style="height: 0;" bind:this={chatContainer}>
        {#each messages as msg}
          <div class="p-2 mb-2 rounded-3 text-break" class:bg-primary={msg.sender === 'user'} class:text-white={msg.sender === 'user'} class:bg-light={msg.sender === 'ai'} class:ms-auto={msg.sender === 'user'} class:me-auto={msg.sender === 'ai'} style="max-width: 80%;">
            {#if msg.sender === 'ai'}
              {@html renderMarkdown(msg.text)}
            {:else}
              {msg.text}
            {/if}
          </div>
        {/each}
        {#if isThinking}
          <div class="p-2 mb-2 rounded-3 text-break bg-light me-auto" style="max-width: 80%;">
            AI is thinking...
          </div>
        {/if}
      </div>
    </div>
    <div class="card-footer d-flex p-3">
      <input
        type="text"
        class="form-control me-2"
        placeholder="Type your message..."
        bind:value={message}
        on:keydown={(e) => {
          if (e.key === 'Enter' && !e.isComposing) {
            if (!e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }
        }}
        disabled={isThinking}
        bind:this={messageInput}
      />
      <button class="btn btn-success" on:click={sendMessage} disabled={isThinking}>Send</button>
    </div>
  </div>
</div>