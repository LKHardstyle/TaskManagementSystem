// Referenzen zu Menüpunkten
const userManagement = document.getElementById("userManagement");
const taskManagement = document.getElementById("taskManagement");
const teamChat = document.getElementById("teamChat");


// Inhalt der Hauptsektion
const content = document.getElementById("content");

// Funktionen für Menüpunkte
userManagement.addEventListener("click", () => {
    loadscript("src/js/UsersManagement.js");
});

taskManagement.addEventListener("click", () => {
    loadscript("src/js/Taskview.js");
});

teamChat.addEventListener("click", () => {
    content.innerHTML = `
        <h2>Team-Chat</h2>
        <p>Echtzeit-Kommunikation mit Teammitgliedern.</p>
        <textarea placeholder="Nachricht schreiben..."></textarea>
        <button onclick="alert('Nachricht gesendet')">Senden</button>
    `;
});

function loadscript(scriptUrl) {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.defer = true;
    document.body.appendChild(script);
}