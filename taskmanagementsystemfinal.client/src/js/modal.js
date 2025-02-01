document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("toggle-password")) {
            const passwordWrapper = event.target.closest(".password-wrapper"); // Finde das übergeordnete Div
            const passwordInput = passwordWrapper.querySelector("input"); // Finde das Passwort-Feld

            if (passwordInput.type === "password") {
                passwordInput.type = "text"; // Zeige das Passwort an
                event.target.innerHTML = "&#x1F440;"; // Ändere das Icon
            } else {
                passwordInput.type = "password"; // Verberge das Passwort
                event.target.innerHTML = "&#x1F441;"; // Standard-Icon zurücksetzen
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordLink = document.querySelector(".forgot-link");
    const forgotPasswordContainer = document.getElementById("forgotPasswordContainer");
    const resetPasswordBtn = document.getElementById("resetPasswordBtn");

    // "Forgot Password?" klicken → Eingabefeld für die E-Mail anzeigen
    forgotPasswordLink.addEventListener("click", function (event) {
        event.preventDefault();

        forgotPasswordContainer.classList.toggle("hidden");  

        // Falls .hidden entfernt wird, setze display explizit auf "block"
        if (!forgotPasswordContainer.classList.contains("hidden")) {
            forgotPasswordContainer.style.display = "block";
        } else {
            forgotPasswordContainer.style.display = "none";
        }
    });

    // Passwort zurücksetzen und E-Mail an API senden
    resetPasswordBtn.addEventListener("click", async function () {
        const email = document.getElementById("forgotEmail").value.trim();
        const messageBox = document.getElementById("forgotPasswordMessage");

        if (!email) {
            messageBox.textContent = "Bitte gib eine gültige E-Mail ein.";
            messageBox.style.color = "red";
            return;
        }

        try {
            const response = await fetch("https://localhost:7003/api/Email/reset-password-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error("Fehler beim Zurücksetzen des Passworts.");
            }

            messageBox.textContent = "Ein neues Passwort wurde an deine E-Mail gesendet.";
            messageBox.style.color = "green";
        } catch (error) {
            console.error("Fehler:", error);
            messageBox.textContent = "Fehler beim Zurücksetzen des Passworts.";
            messageBox.style.color = "red";
        }
    });
});
