// Modal-Elemente
const loginButton = document.getElementById("loginButton");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");

// Öffne das Modal
loginButton.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

// Schließe das Modal
closeModal.addEventListener("click", () => {
    loginModal.style.display = "none";
});

// Tabs wechseln
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

loginTab.addEventListener("click", () => {
    loginTab.classList.add("active-tab");
    signupTab.classList.remove("active-tab");
    loginForm.classList.add("active-section");
    signupForm.classList.remove("active-section");
});

signupTab.addEventListener("click", () => {
    signupTab.classList.add("active-tab");
    loginTab.classList.remove("active-tab");
    signupForm.classList.add("active-section");
    loginForm.classList.remove("active-section");
});
