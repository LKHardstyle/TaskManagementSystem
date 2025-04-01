// Referenzen zu Menüpunkten
const userManagement = document.getElementById("userManagement");
const taskManagement = document.getElementById("taskManagement");
const teamChat = document.getElementById("teamChat");


// Funktionen für Menüpunkte
userManagement.addEventListener("click", () => {
    loadscript("src/js/UsersManagement.js");
});

taskManagement.addEventListener("click", () => {
    loadscript("src/js/Taskview.js");
});

teamChat.addEventListener("click", () => {
    loadscript("src/js/Chat.js");
});

function loadscript(scriptUrl) {
    //Falls es sich um Chat.js handelt, einen cache busting parameter anhängen
    if (scriptUrl.includes("Chat.js")) {
        scriptUrl += "?t=" + new Date().getTime();
    }

    // Falls das Skript schon existiert, lösche es vorher
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
        existingScript.remove();
    }

    // Neues Skript-Tag erstellen & laden
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.defer = true;

    // Prüfen, ob es sich um Chat.js handelt → Dann als `module` laden
    if (scriptUrl.includes("Chat.js")) {
        script.type = "module";
    }

    document.body.appendChild(script);
}