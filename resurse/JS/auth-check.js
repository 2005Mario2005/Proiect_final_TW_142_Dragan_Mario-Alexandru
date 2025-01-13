// La încărcarea paginii, verificăm dacă utilizatorul este logat
document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";  // Verificăm dacă utilizatorul este logat

    // Selectăm toate linkurile protejate (care necesită autentificare)
    const protectedLinks = document.querySelectorAll(".dropdown-content a");

    // Adăugăm un event listener pentru fiecare link protejat
    protectedLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");  // Obținem href-ul linkului

            // Dacă utilizatorul nu este logat și încearcă să acceseze o pagină protejată
            if (!isLoggedIn && (href === "cursuri.html" || href === "exc.html" || href === "structura.html")) {
                event.preventDefault();  // Prevenim redirecționarea
                alert("Această pagină nu poate fi accesată decât dacă sunteți logat.");  // Afișăm un mesaj de alertă
                window.location.href = "logare.html";  // Redirecționăm utilizatorul la pagina de logare
            }
        });
    });
});
