
document.getElementById("register").addEventListener("click", async function (event) {
    event.preventDefault();

    //Felder auslesen
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const email = document.getElementById("signupEmail").value.trim();

    //Fehlerfelder
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");
    const emailError = document.getElementById("emailError");

    //Fehlerstatus zurücksetzen
    usernameError.textContent = "";
    passwordError.textContent = "";
    emailError.textContent = "";

    //Validierung
    let valid = true;
    if (!username) {
        usernameError.textContent = "Username is required.";
        valid = false;
    }
    if (!password) {
        passwordError.textContent = "Password is required.";
        valid = false;
    }
    if (!email) {
        emailError.textContent = "E-mail is required.";
        valid = false;
    }
    if (!valid) return;

    //API-Aufruf
    try {
        const response = await fetch("https://localhost:7003/api/Auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to Register";
            try {
                const errorData = await response.json();
                if (errorData.message)
                    errorMessage = errorMessage.message;
            }
            catch (err) {
                console.warn("Failed to parse error response as JSON" + err);
            }
            throw new Error(errorMessage);
        }

        window.location.href = "../index.html";
    }
    catch (error) {
        alert(`Error: ${error.message}`);
    }
});