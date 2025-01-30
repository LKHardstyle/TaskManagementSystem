﻿
document.getElementById("login").addEventListener("click", async function (event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    // Felder auslesen    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginmodal = document.getElementById("loginModal");
    
    
    // Fehlerfelder
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");

    // Fehlerstatus zurücksetzen
    usernameError.textContent = "";
    passwordError.textContent = "";

    // Validierung
    let valid = true;
    if (!username) {
        usernameError.textContent = "Username is required.";
        valid = false;
    }
    if (!password) {
        passwordError.textContent = "Password is required.";
        valid = false;
    }

    if (!valid) return;
    
    // API-Aufruf
    try {
        const response = await fetch("https://localhost:7003/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            let errorMessage = "Login Failed";
            try {                           
                const errorData = await response.json();
                if (errorData.message)
                    errorMessage = errorMessage.message;
            }
            catch (err)
            {
                console.warn("Failed to parse error response as JSON" + err);
            }
            throw new Error(errorMessage);
        }               

        const data = await response.json();

        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("UserId", data.id);

        updatePageForLoggedInUser();        

        loginmodal.style.display = "none";        
    }
    catch (error) {
        alert(`Error: ${error.message}`);
    }
});

function updatePageForLoggedInUser() {    
    const loginbutton = document.getElementById("loginButton");
    const contentarea = document.getElementById("content");

    loginbutton.style.display = "none";
    contentarea.style.display = "block";

    loadscript("src/js/Dashboard.js");    
}

function loadscript(scriptUrl) {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.defer = true;
    document.body.appendChild(script);
}

window.onload = () => {
    const loggedIn = sessionStorage.getItem("loggedIn");

    if (loggedIn) {
        updatePageForLoggedInUser();
    }
}

