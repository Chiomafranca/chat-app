const socket = io();

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const feedbackElement = document.getElementById("feedback");


messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});


socket.on("clients-total", (data) => {
    if (clientsTotal) {
        clientsTotal.innerHTML = `Total Clients: ${data}`;
    } else {
        console.error("Element with ID 'clients-total' not found.");
    }
});

// Send a message
function sendMessage() {
    const data = {
        name: nameInput.value || "Anonymous", 
        message: messageInput.value.trim(), 
        dateTime: new Date(),
    };

    if (!data.message) {
        console.error("Message is empty, not sending.");
        return;
    }

    socket.emit("message", data);
    addMessageToUI(true, data);
    messageInput.value = ""; 
    clearFeedback(); 
}

socket.on("chat-message", (data) => {
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
                ${data.message}
                <span>${data.name} - ${new Date(data.dateTime).toLocaleString()}</span>
            </p>
        </li>`;
    
    if (messageContainer) {
        messageContainer.innerHTML += element;
        scrollToBottom();
    } else {
        console.error("Element with ID 'message-container' not found.");
    }
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}


messageInput.addEventListener("focus", () => {
    socket.emit("feedback", {
        feedback: `${nameInput.value || "Anonymous"} is typing a message`,
    });
});

messageInput.addEventListener("keypress", () => {
    socket.emit("feedback", {
        feedback: `${nameInput.value || "Anonymous"} is typing a message`,
    });
});

messageInput.addEventListener("blur", () => {
    socket.emit("feedback", { feedback: "" });
});


socket.on("feedback", (data) => {
    if (feedbackElement) {
        feedbackElement.textContent = data.feedback;
    }
});


function clearFeedback() {
    if (feedbackElement) {
        feedbackElement.textContent = "";
    }
}
