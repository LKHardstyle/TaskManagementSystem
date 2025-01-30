//Hilsfunktion zum Formatieren von ISO-Daten in dd.MM.yyyy
function formateDateGerman(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

// Wir verwenden eine IIFE (Immediately Invoked Function Expression),
// sodass der Code direkt beim Laden der Datei ausgeführt wird.
(async function loadUsers() {    
    const UserId = sessionStorage.getItem("UserId");
    
    if (UserId != 1) {
        getUserById(UserId);
    }    
    else {
        getUsers();
    }    
})();


//Funktion für alle User außer Admin
async function getUserById(id) {
    // Referenz auf das Inhalts-Element holen
    const contentSection = document.getElementById("content");
    // Optional: Inhalt zunächst leeren oder "Lade..."-Status anzeigen
    contentSection.innerHTML = "<p>Lade Benutzerdaten...</p>";
    try {
        // API-Aufruf per async/await
        const response = await fetch(`https://localhost:7003/api/UsersToShow/id?id=${id}`);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        // JSON-Daten parsen
        const user = await response.json();

        // Inhalt leeren
        contentSection.innerHTML = "";

        // Überschrift
        const heading = document.createElement("h2");
        heading.textContent = "Benutzerübersicht";
        contentSection.appendChild(heading);

        // Liste oder direkt einzelne Felder ausgeben
        const userList = document.createElement("ul");
        const listItem = document.createElement("li");

        const createdAtFormatted = formateDateGerman(user.createdAt);
        const updatedAtFormatted = formateDateGerman(user.updatedAt);

        listItem.innerHTML = `            
            <strong>Benutzername:</strong> ${user.username}<br>
            <strong>Email:</strong> ${user.email}<br>
            <strong>Erstellt am:</strong> ${createdAtFormatted}<br>
            <strong>Geändert am:</strong> ${updatedAtFormatted}<br>
            `;
        userList.appendChild(listItem);

        contentSection.appendChild(userList);
    } catch (error) {
        // Fehlerbehandlung
        console.error("Fehler beim Laden der Benutzer:", error);
        contentSection.innerHTML = `<p>Fehler beim Laden der Benutzer: ${error.message}</p>`;
    }
}

//Funktion für Admin User
async function getUsers() {
    // Referenz auf das Inhalts-Element holen
    const contentSection = document.getElementById("content");
    // Optional: Inhalt zunächst leeren oder "Lade..."-Status anzeigen
    contentSection.innerHTML = "<p>Lade Benutzerdaten...</p>";
    try {
        // API-Aufruf per async/await
        const response = await fetch("https://localhost:7003/api/UsersToShow/all");

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        // JSON-Daten parsen
        const users = await response.json();

        // Inhalt leeren, bevor die Liste erzeugt wird
        contentSection.innerHTML = "";

        // Überschrift einfügen
        const heading = document.createElement("h2");
        heading.textContent = "Benutzerübersicht";
        contentSection.appendChild(heading);

        // Liste erstellen
        const userList = document.createElement("ul");

        // Jeden Benutzer in der Liste anzeigen
        users.forEach(user => {
            const listItem = document.createElement("li");

            const createdAtFormatted = formateDateGerman(user.createdAt);
            const updatedAtFormatted = formateDateGerman(user.updatedAt);

            listItem.innerHTML = `
            <strong>Benutzername:</strong> ${user.username}<br>
            <strong>Email:</strong> ${user.email}<br>
            <strong>Erstellt am:</strong> ${createdAtFormatted}<br>
            <strong>Geändert am:</strong> ${updatedAtFormatted}<br><br>
            `;
            userList.appendChild(listItem);
        });

        contentSection.appendChild(userList);

    } catch (error) {
        // Fehlerbehandlung
        console.error("Fehler beim Laden der Benutzer:", error);
        contentSection.innerHTML = `<p>Fehler beim Laden der Benutzer: ${error.message}</p>`;
    }
}