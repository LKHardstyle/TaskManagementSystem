// Hilfsfunktion zum Formatieren von ISO-Daten in dd.MM.yyyy
function formatDateGerman(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

// IIFE: Code wird direkt nach Laden der Datei ausgeführt
(async function loadUsers() {
    const userId = sessionStorage.getItem("UserId");

    if (userId != 1) {
        getUserById(userId);
    } else {
        getUsers();
    }
})();

// **Funktion für einzelne User (User kann seine Daten bearbeiten)**
async function getUserById(id) {
    const contentSection = document.getElementById("content");
    contentSection.innerHTML = "<p>Lade Benutzerdaten...</p>";

    try {
        const response = await fetch(`https://localhost:7003/api/Users/id?id=${id}`);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const user = await response.json();
        contentSection.innerHTML = ""; // Inhalt leeren

        const userContainer = document.createElement("div");
        userContainer.className = "user-container";

        userContainer.innerHTML = `
            <h2>Mein Profil</h2>
            <p><strong>Benutzername:</strong> <span id="username">${user.username}</span></p>
            <p><strong>Email:</strong> <span id="email">${user.email}</span></p>
            <p><strong>Erstellt am:</strong> ${formatDateGerman(user.createdAt)}</p>
            <p><strong>Geändert am:</strong> <span id="updatedAt">${formatDateGerman(user.updatedAt)}</span></p>
            <button type="button" id="editProfile">Bearbeiten</button>
            <button type="button" id="saveChanges" style="display: none;">Speichern</button>
        `;

        contentSection.appendChild(userContainer);

        // Event Listener für Bearbeiten-Button
        document.getElementById("editProfile").addEventListener("click", () => {
            enableEditMode(user);
        });

        // Event Listener für Speichern-Button
        document.getElementById("saveChanges").addEventListener("click", async () => {
            await updateUser(id);
        });

    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
        contentSection.innerHTML = `<p>Fehler: ${error.message}</p>`;
    }
}

// **Bearbeiten-Modus aktivieren**
function enableEditMode(user) {
    document.getElementById("username").innerHTML = `<input type="text" id="usernameInput" value="${user.username}">`;
    document.getElementById("email").innerHTML = `<input type="email" id="emailInput" value="${user.email}">`;

    document.getElementById("editProfile").style.display = "none";
    document.getElementById("saveChanges").style.display = "inline-block";
}

// **Funktion für Admin: Alle Benutzer anzeigen, Passwort zurücksetzen möglich**
async function getUsers() {
    const contentSection = document.getElementById("content");
    contentSection.innerHTML = "<p>Lade Benutzerdaten...</p>";

    try {
        const response = await fetch("https://localhost:7003/api/Users/all");

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const users = await response.json();
        contentSection.innerHTML = "";

        const heading = document.createElement("h2");
        heading.textContent = "Benutzerübersicht (Admin)";
        contentSection.appendChild(heading);

        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Benutzername</th>
                    <th>Email</th>                    
                    <th>Erstellt am</th>
                    <th>Geändert am</th>
                    <th>Aktionen</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector("tbody");

        users.forEach(user => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>                
                <td>${formatDateGerman(user.createdAt)}</td>
                <td id="updatedAt-${user.id}">${formatDateGerman(user.updatedAt)}</td>
                <td>
                    <button class="reset-password" data-userid="${user.id}">🔄 Passwort Zurücksetzen</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        contentSection.appendChild(table);        

        // Event Listener für Passwort-Zurücksetzen-Button
        document.querySelectorAll(".reset-password").forEach(button => {
            button.addEventListener("click", async (event) => {
                const userId = event.target.dataset.userid;
                const confirmReset = confirm(`Soll das Passwort für Benutzer-ID ${userId} wirklich zurückgesetzt werden?`);
                if (confirmReset) {
                    await resetUserPassword(userId);
                }
            });
        });

    } catch (error) {
        console.error("Fehler beim Laden der Benutzer:", error);
        contentSection.innerHTML = `<p>Fehler: ${error.message}</p>`;
    }
}

// **API-Aufruf zum Zurücksetzen des Passworts**
async function resetUserPassword(userId) {
    try {
        const response = await fetch(`https://localhost:7003/api/Users/reset-password/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: "Reset123!" })
        });

        if (!response.ok) {
            throw new Error("Fehler beim Zurücksetzen des Passworts.");
        }

        alert(`Passwort für Benutzer-ID ${userId} wurde erfolgreich zurückgesetzt.`);
        document.getElementById(`password-${userId}`).textContent = "******"; // Sicherstellen, dass das Passwort verborgen bleibt
        document.getElementById(`updatedAt-${userId}`).textContent = formatDateGerman(new Date().toISOString());

    } catch (error) {
        console.error("Fehler:", error);
        alert("Fehler beim Zurücksetzen des Passworts.");
    }
}

// **Funktion zum Aktualisieren der Benutzerdaten**
async function updateUser(id) {
    const username = document.getElementById("usernameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();

    if (!username || !email) {
        alert("Bitte alle Felder ausfüllen.");
        return;
    }

    const updatedAt = new Date().toISOString();

    try {
        const response = await fetch(`https://localhost:7003/api/Users/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                email,
                updatedAt
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        alert("Änderungen erfolgreich gespeichert.");
        document.getElementById("username").textContent = username;
        document.getElementById("email").textContent = email;
        document.getElementById("updatedAt").textContent = formatDateGerman(updatedAt);

        document.getElementById("editProfile").style.display = "inline-block";
        document.getElementById("saveChanges").style.display = "none";

    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern der Änderungen.");
    }
}
