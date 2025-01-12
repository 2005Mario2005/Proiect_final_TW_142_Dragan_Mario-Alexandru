let isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 
let currentUser = JSON.parse(localStorage.getItem("currentUser")); 
let allUsers = JSON.parse(localStorage.getItem("allUsers")) || []; 

document.addEventListener("DOMContentLoaded", function () {
    syncState();

    if (isLoggedIn) {
        showWelcomePage();
    } else {
        showInitialPage();
    }

    setupProtectedLinks();
});

function syncState() {
    isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
}
n
function setupProtectedLinks() {
    const protectedLinks = document.querySelectorAll(".dropdown-content a");

    protectedLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!isLoggedIn && (href === "cursuri.html" || href === "exc.html" || href === "structura.html")) {
                event.preventDefault(); 
                alert("Această pagină nu poate fi accesată decât dacă sunteți logat.");
                window.location.href = "logare.html"; 
            }
        });
    });
}

function showInitialPage() {
    document.getElementById("app").innerHTML = `
        <h1>Bun venit!</h1>
        <div class="button-container">
            <button id="log-in-btn">Log In</button>
            <button id="sign-in-btn">Sign In</button>
        </div>
    `;

    document.getElementById("log-in-btn").addEventListener("click", showLoginPage);
    document.getElementById("sign-in-btn").addEventListener("click", showSignUpPage);
}

function showLoginPage() {
    document.getElementById("app").innerHTML = `
        <h2>Log In</h2>
        <form id="log-in-form">
            <label>Email:</label>
            <input type="email" id="log-in-email" required>
            <label>Password:</label>
            <div class="password-container">
                <input type="password" id="log-in-password" required>
                <button type="button" id="reveal-login-password-btn">Reveal</button>
            </div>
            <button type="submit">Log In</button>
        </form>
    `;

    document.getElementById("log-in-form").addEventListener("submit", logIn);
    document.getElementById("reveal-login-password-btn").addEventListener("click", togglePasswordVisibility);
}

function showSignUpPage() {
    document.getElementById("app").innerHTML = `
        <h2>Sign Up</h2>
        <form id="sign-in-form">
            <label>Name:</label>
            <input type="text" id="name" required>
            <label>Email:</label>
            <input type="email" id="email" required>
            <label>Password:</label>
            <div class="password-container">
                <input type="password" id="password" required>
                <button type="button" id="reveal-password-btn">Reveal</button>
            </div>
            <label>Confirm Password:</label>
            <div class="password-container">
                <input type="password" id="confirm-password" required>
                <button type="button" id="reveal-confirm-password-btn">Reveal</button>
            </div>
            <button type="submit">Sign Up</button>
        </form>
    `;

    document.getElementById("sign-in-form").addEventListener("submit", signUp);
    document.getElementById("reveal-password-btn").addEventListener("click", togglePasswordVisibility);
    document.getElementById("reveal-confirm-password-btn").addEventListener("click", togglePasswordVisibility);
}

function showWelcomePage() {
    document.getElementById("app").innerHTML = `
        <h1>Bun venit, ${currentUser.name}!</h1>
        <p>Ești logat ca <strong>${currentUser.name}</strong></p>
        <div class="button-container">
            <button id="log-out-btn">Log Out</button>
        </div>
    `;

    document.getElementById("log-out-btn").addEventListener("click", logOut);
}

function logIn(event) {
    event.preventDefault();
    const email = document.getElementById("log-in-email").value.trim();
    const password = document.getElementById("log-in-password").value.trim();

    const user = allUsers.find(user => user.email === email);

    if (!user) {
        alert("Contul nu există. Te rog să te înregistrezi.");
        showSignUpPage();
        return;
    }

    if (user.password !== password) {
        alert("Parola este incorectă!");
        return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));
    syncState();
    alert("Te-ai logat cu succes!");
    showWelcomePage();
}

function signUp(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (allUsers.some(user => user.email === email)) {
        alert("Email-ul este deja înregistrat!");
        showLoginPage();
        return;
    }

    if (password !== confirmPassword) {
        alert("Parolele nu se potrivesc!");
        return;
    }

    const newUser = { name, email, password };
    allUsers.push(newUser);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    syncState();
    alert("Te-ai înregistrat cu succes!");
    showWelcomePage();
}

function logOut() {
    if (isLoggedIn) {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("currentUser");
        syncState();
        alert("Te-ai deconectat cu succes!");
        showInitialPage();
    } else {
        alert("Nu ești logat!");
    }
}

function togglePasswordVisibility(event) {
    const passwordField = event.target.previousElementSibling;
    if (passwordField.type === "password") {
        passwordField.type = "text";
        event.target.textContent = "Hide";
    } else {
        passwordField.type = "password";
        event.target.textContent = "Reveal";
    }
}



