document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

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
});
