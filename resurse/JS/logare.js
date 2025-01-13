// Obține informațiile despre utilizatorul curent și starea de autentificare din localStorage
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 
let currentUser = JSON.parse(localStorage.getItem("currentUser")); 
let allUsers = JSON.parse(localStorage.getItem("allUsers")) || []; 

// Așteaptă încărcarea completă a paginii pentru a sincroniza starea și a afișa pagina corespunzătoare
document.addEventListener("DOMContentLoaded", function () {
    syncState(); // Sincronizează informațiile despre utilizator și starea de autentificare

    // Dacă utilizatorul este autentificat, arată pagina de bun venit, altfel arată pagina inițială
    if (isLoggedIn) {
        showWelcomePage();
    } else {
        showInitialPage();
    }

    setupProtectedLinks(); // Configurarea linkurilor protejate (pentru paginile care necesită autentificare)
});

// Funcția care sincronizează starea curentă a autentificării și datele utilizatorilor
function syncState() {
    // Actualizează valorile din variabilele globale pe baza datelor din localStorage
    isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
}

// Funcția care configurează linkurile care sunt protejate de autentificare
function setupProtectedLinks() {
    // Selectează toate linkurile care se află în meniul drop-down
    const protectedLinks = document.querySelectorAll(".dropdown-content a");

    // Adaugă un eveniment de click fiecărui link pentru a verifica dacă utilizatorul este logat
    protectedLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href"); // Obține URL-ul linkului pe care utilizatorul încearcă să-l acceseze

            // Dacă utilizatorul nu este logat și încearcă să acceseze o pagină protejată, previne navigarea și îl redirecționează la logare
            if (!isLoggedIn && (href === "cursuri.html" || href === "exc.html" || href === "structura.html")) {
                event.preventDefault(); 
                alert("Această pagină nu poate fi accesată decât dacă sunteți logat.");
                window.location.href = "logare.html"; 
            }
        });
    });
}

// Funcția care afișează pagina inițială (pentru utilizatorii care nu sunt logați)
function showInitialPage() {
    // Modifică HTML-ul pentru a arăta butoanele de logare și înregistrare
    document.getElementById("app").innerHTML = `
        <h1>Bun venit!</h1>
        <div class="button-container">
            <button id="log-in-btn">Log In</button>
            <button id="sign-in-btn">Sign In</button>
        </div>
    `;

    // Adaugă evenimentele de click pentru butoanele de logare și înregistrare
    document.getElementById("log-in-btn").addEventListener("click", showLoginPage);
    document.getElementById("sign-in-btn").addEventListener("click", showSignUpPage);
}

// Funcția care afișează formularul de logare
function showLoginPage() {
    // Modifică HTML-ul pentru a afișa formularul de logare
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

    // Adaugă evenimentul de submit pentru formularul de logare
    document.getElementById("log-in-form").addEventListener("submit", logIn);
    document.getElementById("reveal-login-password-btn").addEventListener("click", togglePasswordVisibility);
}

// Funcția care afișează formularul de înregistrare
function showSignUpPage() {
    // Modifică HTML-ul pentru a afișa formularul de înregistrare
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

    // Adaugă evenimentele de submit și pentru cele două butoane de "reveal" pentru parole
    document.getElementById("sign-in-form").addEventListener("submit", signUp);
    document.getElementById("reveal-password-btn").addEventListener("click", togglePasswordVisibility);
    document.getElementById("reveal-confirm-password-btn").addEventListener("click", togglePasswordVisibility);
}

// Funcția care afișează pagina de bun venit pentru utilizatorul logat
function showWelcomePage() {
    // Modifică HTML-ul pentru a arăta mesajul de bun venit și informațiile utilizatorului
    document.getElementById("app").innerHTML = `
        <h1>Bun venit, ${currentUser.name}!</h1>
        <p>Ești logat ca <strong>${currentUser.name}</strong></p>
        <div class="button-container">
            <button id="log-out-btn">Log Out</button>
        </div>
    `;

    // Adaugă evenimentul de click pentru butonul de logout
    document.getElementById("log-out-btn").addEventListener("click", logOut);
}

// Funcția care gestionează procesul de logare
function logIn(event) {
    event.preventDefault();
    const email = document.getElementById("log-in-email").value.trim();
    const password = document.getElementById("log-in-password").value.trim();

    // Căutăm utilizatorul în lista de utilizatori
    const user = allUsers.find(user => user.email === email);

    // Dacă utilizatorul nu există, afișăm un mesaj și redirecționăm la pagina de înregistrare
    if (!user) {
        alert("Contul nu există. Te rog să te înregistrezi.");
        showSignUpPage();
        return;
    }

    // Verificăm dacă parola este corectă
    if (user.password !== password) {
        alert("Parola este incorectă!");
        return;
    }

    // Setăm utilizatorul ca fiind logat în localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));
    syncState();
    alert("Te-ai logat cu succes!");
    showWelcomePage();
}

// Funcția care gestionează procesul de înregistrare
function signUp(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    // Verificăm dacă email-ul este deja înregistrat
    if (allUsers.some(user => user.email === email)) {
        alert("Email-ul este deja înregistrat!");
        showLoginPage();
        return;
    }

    // Verificăm dacă parolele corespund
    if (password !== confirmPassword) {
        alert("Parolele nu se potrivesc!");
        return;
    }

    // Creăm un nou utilizator și îl adăugăm în lista de utilizatori
    const newUser = { name, email, password };
    allUsers.push(newUser);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    syncState();
    alert("Te-ai înregistrat cu succes!");
    showWelcomePage();
}

// Funcția care gestionează deconectarea utilizatorului
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

// Funcția care gestionează vizibilitatea parolei în formulare
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
