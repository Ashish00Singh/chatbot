const sendChatBtn = document.querySelector(".chat-input span");
const chatbotToggler = document.querySelector(".chatbot-toggler");

// sendChatBtn.addEventListener("click", handleChat);
// closeBtn.addEventListener("click", () =>
//   document.body.classList.remove("show-chatbot")
// );
chatbotToggler.addEventListener("click", () =>
  // console.log("clicked")
  document.body.classList.toggle("show_bot")
);

document.addEventListener("DOMContentLoaded", () => {
  const chatBotBody = document.getElementById("chatBot_body");
  const chatBotInput = document.getElementById("chatBot_input");
  const clearHistoryButton = document.getElementById("clearHistory");
  const chatBotSend = document.getElementById("chatBot_send");
  const CHAT_HISTORY_KEY = "chatHistory";
  let typingIndicator = null;

  // Function to get the current timestamp in h:mm AM/PM format
  function getCurrentTimestamp() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
    return `${hours}:${minutes} ${ampm}`;
  }

  // Function to append a message to the chat body
  function appendMessage(type, message, timestamp) {
    const messageDiv = document.createElement("div");
    messageDiv.className = type === "user" ? "user_message" : "chatBot_message";
    const alignStyle = type === "user" ? "left" : "right";
    const icon =
      type === "user"
        ? '<i class="fa-solid fa-user ps-1" style="color: blue;"></i>'
        : '<i class="fa-solid fa-robot pe-1" style="color: blue;"></i>';

    messageDiv.innerHTML = `
      ${type === "bot" ? icon : ""}
      <div class="messageText">
        <p>${message}</p>
        <p style="text-align: ${alignStyle};">${timestamp}</p>
      </div>
      ${type === "user" ? icon : ""}
    `;
    chatBotBody.appendChild(messageDiv);
    chatBotBody.scrollTop = chatBotBody.scrollHeight;
  }

  // Save chat history to localStorage
  function saveChatHistory(message, type) {
    const chatHistory =
      JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY)) || [];
    chatHistory.push({ type, message, timestamp: getCurrentTimestamp() });
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
  }

  // Load chat history from localStorage
  function loadChatHistory() {
    const chatHistory =
      JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY)) || [];
    chatHistory.forEach(({ type, message, timestamp }) => {
      appendMessage(type, message, timestamp);
    });
  }

  // Show typing indicator
  function showTypingIndicator() {
    if (!typingIndicator) {
      typingIndicator = document.createElement("div");
      typingIndicator.className = "chatBot_message";
      typingIndicator.innerHTML = `
        <i class="fa-solid fa-robot pe-1" style="color: blue;"></i>
        <div class="messageText">
          <p>
          <div class="ms-3">
    <div class="snippet" data-title="dot-pulse">
      <div class="stage">
        <div class="dot-pulse"></div>
      </div>
    </div>
  </div>
          </p>
        </div>
      `;
      chatBotBody.appendChild(typingIndicator);
      chatBotBody.scrollTop = chatBotBody.scrollHeight;
    }
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    if (typingIndicator) {
      chatBotBody.removeChild(typingIndicator);
      typingIndicator = null;
    }
  }

  // Event listener for send button click
  chatBotSend.addEventListener("click", () => {
    const userInput = chatBotInput.value.trim();
    if (userInput) {
      appendMessage("user", userInput, getCurrentTimestamp());
      saveChatHistory(userInput, "user");
      chatBotInput.value = ""; // Clear input field

      // Simulated bot response with typing indicator
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        const botResponse = "Got it! Let me help you with that.";
        appendMessage("bot", botResponse, getCurrentTimestamp());
        saveChatHistory(botResponse, "bot");
      }, 1000);
    }
  });

  // clear chat history
  clearHistoryButton.addEventListener("click", () => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    chatBotBody.innerHTML = `
      <div class="chatBot_message">
        <i class="fa-solid fa-robot pe-1" style="color: blue;"></i>
        <div class="messageText">
          <p>Hi! I'm a chatbot. How can I help you today?</p>
          <p style="text-align: right;">${getCurrentTimestamp()}</p>
        </div>
      </div>
    `; // Reset chat body with default bot message
  });

  // Allow sending message with Enter key
  chatBotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      chatBotSend.click();
    }
  });

  // Load chat histery on page load
  loadChatHistory();
});
