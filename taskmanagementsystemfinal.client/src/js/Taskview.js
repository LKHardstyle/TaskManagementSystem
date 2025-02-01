(async function () {
    loadTasks();
})();

// Aufgaben abrufen und in der <section id="content"> anzeigen
async function loadTasks() {
    try {
        const response = await fetch('https://localhost:7003/api/TaskItems');
        if (!response.ok) throw new Error("Fehler beim Laden der Aufgaben");

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Fehler:", error);
    }
}

// Aufgabenübersicht in <section id="content"> rendern
function renderTasks(tasks) {
    
    const contentSection = document.getElementById("content");
    contentSection.innerHTML = ""; // Inhalt leeren

    // Überschrift für die Aufgabenliste
    const heading = document.createElement("h2");
    heading.textContent = "Aufgabenübersicht";
    contentSection.appendChild(heading);

    // Prüfen, ob Aufgaben vorhanden sind
    if (tasks.length === 0) {
        const noTasksMessage = document.createElement("p");
        noTasksMessage.textContent = "Keine Aufgaben vorhanden.";
        contentSection.appendChild(noTasksMessage);
        return;
    }

    // Tabelle erstellen
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>DONE</th>
                <th>TASK NAME</th>
                <th>ASSIGNED TO</th>
                <th>STATUS</th>
                <th>PROGRESS</th>
                <th>PRIORITY</th>
                <th>DUE</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    tasks.forEach(task => {
        const row = document.createElement("tr");

        // Berechne Prioritätsklasse
        let priorityClass = "priority-low";
        if (task.priority === "Critical") priorityClass = "priority-critical";
        else if (task.priority === "High") priorityClass = "priority-high";
        else if (task.priority === "Medium") priorityClass = "priority-medium";

        // Fortschrittsbalken - Farbe je nach Fortschritt
        const progress = Math.max(0, Math.min(100, task.progress || 0));
        let progressClass = "progress-low";
        if (progress >= 70) progressClass = "progress-high";
        else if (progress >= 30) progressClass = "progress-medium";

        row.innerHTML = `
            <td>
                <input type="checkbox" class="toggle-status" data-id="${task.id}" ${task.isCompleted ? "checked" : ""}>
            </td>
            <td>${task.title}</td>
            <td>
                <span class="user-avatar">${task.assignedTo ? task.assignedTo[0] : "?"}</span>
            </td>
            <td>${task.status}</td>
            <td>
                <div class="progress-container">
                    <div class="progress-bar ${progressClass}" data-progress="${progress}" style="width: ${progress}%"></div>
                </div>
            </td>
            <td class="priority ${priorityClass}">${task.priority}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
        `;

        tbody.appendChild(row);
    });

    contentSection.appendChild(table); // Tabelle in <section id="content"> einfügen

    // **Setze die Progress-Bar-Breite dynamisch**
    document.querySelectorAll(".progress-bar").forEach(bar => {
        const progressValue = bar.getAttribute("data-progress");
        bar.style.width = progressValue + "%"; // Dynamisch setzen
    });

    // Event Listener für Checkboxen
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", toggleTaskStatus);
    });
}

// Aufgabe als abgeschlossen/offen markieren
async function toggleTaskStatus(event) {
    const checkbox = event.target;
    const taskId = checkbox.dataset.id;
    const isCompleted = checkbox.checked;

    try {
        const response = await fetch(`https://localhost:7003/api/TaskItems/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isCompleted })
        });

        if (!response.ok) throw new Error("Fehler beim Aktualisieren des Status");

        loadTasks(); // Tabelle neu laden
    } catch (error) {
        console.error("Fehler:", error);
    }
}
