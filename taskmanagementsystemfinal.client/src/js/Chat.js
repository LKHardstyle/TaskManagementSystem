import * as signalR from "@microsoft/signalr";

let selectedChatUserId = null;

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7003/chatHub", {
        withCredentials: true
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.onclose(async () => {
    console.warn("SignalR Verbindung verloren. Versuche erneut zu verbinden...");
    setTimeout(startConnection, 5000);
});

async function startConnection() {
    try {
        await connection.start();
        console.log("SignalR verbunden");
    } catch (err) {
        console.error("SignalR Fehler:", err);
        setTimeout(startConnection, 5000);  // Wiederholen, falls Fehler
    }
}
startConnection();

// SignalR-Listener für neue Nachrichten
connection.on("ReceiveMessage", (senderId, messageText) => {
    console.log("Neue Nachricht von:", senderId, messageText);

    // Prüfen, ob der User gerade mit diesem Chat-Partner schreibt
    if (senderId === selectedChatUserId) {
        addMessageToChat(senderId, messageText, "received");
    } else {
        console.log("Nachricht empfangen, aber Chat nicht aktiv.");
    }
});;

// Status "Gelesen" setzen
connection.on("MessageRead", (messageId) => {
    const messageElement = document.querySelector(`[data-id='${messageId}']`);
    if (messageElement) {
        messageElement.classList.add("message-read"); // CSS-Klasse hinzufügen
    }
});
// Neue Nachricht im Chat anzeigen
function addMessageToChat(senderId, messageText, type) {
    const messagesContainer = document.getElementById("messagesContainer");

    const messageElement = document.createElement("div");
    messageElement.classList.add(type === "sent" ? "message-sent" : "message-received");
    messageElement.textContent = messageText;

    messagesContainer.appendChild(messageElement);

    // Automatisch ans Ende scrollen
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

(async function () {
    const contentSection = document.getElementById("content");
    const currentUserId = sessionStorage.getItem("UserId");
    

    function renderChatUI() {
        contentSection.innerHTML = `
            <div class="chat-container">
                <div class="chat-list-container">
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Suchen...">
                </div>
                <div class="chat-list" id="chatList"></div>
            </div>
                <div class="chat-window hidden" id="chatWindow">
                    <div class="messages-container" id="messagesContainer"></div>
                    <div class="chat-input">
                        <input type="text" id="messageInput" placeholder="Nachricht eingeben...">
                        <button id="sendButton">➤</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("searchInput").addEventListener("input", filterChats);
        document.getElementById("sendButton").addEventListener("click", sendMessage);

        loadChats();
    }

    async function loadChats() {
        try {
            const response = await fetch(`https://localhost:7003/api/Chat/${currentUserId}/chat-partners`);
            if (!response.ok) throw new Error("Fehler beim Laden der Chats");

            const users = await response.json();
            const chatList = document.getElementById("chatList");

            chatList.innerHTML = "";

            if (users.length === 0) {
                chatList.innerHTML = "<p>Keine Chats vorhanden</p>";
                return;
            }

            users.forEach(user => {
                const chatItem = document.createElement("div");
                chatItem.classList.add("chat-item");
                chatItem.innerHTML = `<div class="chat-name">${user.username}</div>`;
                chatItem.addEventListener("click", () => openChat(user.id));
                chatList.appendChild(chatItem);
            });
        } catch (error) {
            console.error("Fehler beim Laden der Chats:", error);
        }
    }

    function filterChats() {
        const query = document.getElementById("searchInput").value.toLowerCase();
        document.querySelectorAll(".chat-item").forEach(item => {
            const name = item.textContent.toLowerCase();
            item.style.display = name.includes(query) ? "block" : "none";
        });
    }

    async function openChat(userId) {
        selectedChatUserId = userId;
        
        document.getElementById("chatWindow").classList.remove("hidden");
        loadMessages();
    }

    async function loadMessages() {
        if (!selectedChatUserId) return;
        try {
            const response = await fetch(`https://localhost:7003/api/Chat/${currentUserId}/${selectedChatUserId}`);
            const messages = await response.json();
            const messagesContainer = document.getElementById("messagesContainer");
            messagesContainer.innerHTML = "";

            messages.forEach(msg => {
                const messageElement = document.createElement("div");
                messageElement.classList.add(msg.senderId == currentUserId ? "message-sent" : "message-received");
                messageElement.textContent = msg.messageText;
                messagesContainer.appendChild(messageElement);
            });
        } catch (error) {
            console.error("Fehler beim Laden der Nachrichten:", error);
        }
    }

    async function sendMessage() {
        const messageInput = document.getElementById("messageInput");
        const messageText = messageInput.value.trim();
        if (!messageText || !selectedChatUserId) return;

        try {
            console.log("Sende Nachricht:", {
                senderId: currentUserId,
                receiverId: selectedChatUserId,
                messageText
            });
            await fetch("https://localhost:7003/api/Chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: selectedChatUserId,
                    messageText
                })
            });

            messageInput.value = "";
            loadMessages();
        } catch (error) {
            console.error("Fehler beim Senden der Nachricht:", error);
        }
    }

    renderChatUI();
})();
