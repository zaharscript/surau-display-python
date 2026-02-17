import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const loginBtn = document.getElementById("loginBtn");
        const errorMessage = document.getElementById("errorMessage");

        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Log Masuk...';
        errorMessage.style.display = "none";

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // On successful login, redirect will be handled by onAuthStateChanged if needed,
            // or we can manually redirect here.
            window.location.href = "index.html";
        } catch (error) {
            console.error("Login Error:", error);
            errorMessage.textContent = "Gagal log masuk. Sila semak e-mel dan kata laluan anda.";
            errorMessage.style.display = "block";
            loginBtn.disabled = false;
            loginBtn.textContent = "Log Masuk";
        }
    });
}

// Universal Auth Guard
onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split("/").pop();
    const protectedPages = ["activity_form.html", "ad_form.html"];

    if (user) {
        // User is logged in
        // console.log("User logged in:", user.email);

        // Show protected elements, hide guest elements
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "block");
        document.querySelectorAll(".guest-only").forEach(el => el.style.display = "none");

        if (currentPage === "login.html") {
            window.location.href = "index.html";
        }
    } else {
        // User is logged out
        if (protectedPages.includes(currentPage)) {
            window.location.href = "login.html";
        }

        // Hide protected elements, show guest elements
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
        document.querySelectorAll(".guest-only").forEach(el => el.style.display = "block");
    }
});

// Logout Function
export async function logout() {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout Error:", error);
        alert("Gagal log keluar.");
    }
}

// Add logout event listeners if buttons exist
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".logout-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    });
});
