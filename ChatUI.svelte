<script>
  import { onMount } from 'svelte';

  var message = '';
  var messages = [];
  var availableFunctions = [];
  var selectedTab = 'chat'; // New variable for tab selection

  onMount(async () => {
    try {
      const response = await fetch('/api/functions');
      if (response.ok) {
        const data = await response.json();
        availableFunctions = data[0].function_declarations; // Assuming the structure
        console.log('Available Functions:', availableFunctions);
      } else {
        console.error('Failed to fetch functions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching functions:', error);
    }
  });

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

<div class="d-flex flex-column vh-100 p-3">
  <h1 class="text-center mb-3">AI Agent</h1>

  <ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link" class:active={selectedTab === 'chat'} on:click={() => selectedTab = 'chat'} type="button" role="tab" aria-controls="chat-tab-pane" aria-selected={selectedTab === 'chat'}>Chat</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" class:active={selectedTab === 'functions'} on:click={() => selectedTab = 'functions'} type="button" role="tab" aria-controls="functions-tab-pane" aria-selected={selectedTab === 'functions'}>Functions</button>
    </li>
  </ul>

  <div class="tab-content flex-grow-1">
    <div class="tab-pane fade h-100 d-flex flex-column" class:show={selectedTab === 'chat'} class:active={selectedTab === 'chat'} id="chat-tab-pane" role="tabpanel" aria-labelledby="chat-tab" tabindex="0">
      <div class="card flex-grow-1 mx-auto h-100 w-50">
        <div class="card-body d-flex flex-column flex-grow-1">
          <div class="flex-grow-1 overflow-auto flex-shrink-1" style="height: 0;">
            {#each messages as msg}
              <div class="p-2 mb-2 rounded-3 text-break" class:bg-primary={msg.sender === 'user'} class:text-white={msg.sender === 'user'} class:bg-light={msg.sender === 'ai'} class:ms-auto={msg.sender === 'user'} class:me-auto={msg.sender === 'ai'} style="max-width: 80%;">
                {msg.text}
              </div>
            {/each}
          </div>
        </div>
        <div class="card-footer d-flex p-3 gap-2">
          <input
            type="text"
            class="form-control flex-grow-1 w-100"
            placeholder="Type your message..."
            bind:value={message}
            on:keydown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button class="btn btn-success flex-shrink-0" on:click={sendMessage}>Send</button>
        </div>
      </div>
    </div>
    <div class="tab-pane fade h-100 d-flex flex-column" class:show={selectedTab === 'functions'} class:active={selectedTab === 'functions'} id="functions-tab-pane" role="tabpanel" aria-labelledby="functions-tab" tabindex="0">
      <div class="mx-auto w-50">
        <h2 class="text-center my-0 py-0">Available Functions</h2>
        {#if availableFunctions.length > 0}
          <ul class="list-group mt-0 pt-0">
            {#each availableFunctions as func}
              <li class="list-group-item my-0 py-1">
                <strong>{func.name}</strong>: {func.description}
                {#if func.parameters && func.parameters.properties}
                  <br>Parameters:
                  <ul>
                    {#each Object.entries(func.parameters.properties) as [paramName, paramDetails]}
                      <li>{paramName} ({paramDetails.type}): {paramDetails.description}</li>
                    {/each}
                  </ul>
                {/if}
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-center">No functions available.</p>
        {/if}
      </div>
    </div>
  </div>
</div>