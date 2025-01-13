// Obținem elementul canvas și contextul 2d
const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

// Setăm dimensiunile canvasului
canvas.width = 800;
canvas.height = 300;

// Setăm dimensiunea inimii și textul ce urmează a fi desenat
const heartSize = 80; 
const text = "INFORMATICA"; 
let progress = 0;  // Progresul desenării textului
let heartProgress = 0; // Progresul animației inimii
let isAnimating = false;  // Verificăm dacă animația este în desfășurare
let isDisplaying = false;  // Verificăm dacă textul este deja afișat
let isDeleting = false;  // Verificăm dacă textul este în proces de ștergere

// Splităm textul în litere pentru a le desena individual
const letters = text.split('');

// Verificăm dacă utilizatorul este autentificat
function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";  // Verificăm dacă utilizatorul este logat
    if (!isLoggedIn) {  // Dacă nu este logat
        alert("Această pagină nu poate fi accesată decât dacă sunteți logat. Veți fi redirecționat către pagina de logare.");
        window.location.href = "logare.html";  // Redirecționăm la pagina de logare
    }
}

// Apelăm funcția de autentificare la început
checkAuth();

// Desenează umbra pentru text și inimă
function drawShadow() {
    const totalTextWidth = letters.length * 25;  // Lățimea totală a textului
    const textX = canvas.width / 2 - totalTextWidth / 2 + 80;  // Calculăm poziția X a textului
    const textY = canvas.height / 2 + 20 - 5;  // Calculăm poziția Y a textului

    // Desenăm inima cu umbră
    drawHeart(canvas.width / 2 - heartSize / 2 - 80, canvas.height / 2 - heartSize / 2, heartSize, 'rgba(85, 85, 85, 1)');

    // Desenăm fiecare literă cu umbra
    letters.forEach((letter, index) => {
        ctx.fillStyle = 'rgba(85, 85, 85, 1)';  // Setăm culoarea pentru umbră
        ctx.font = '40px "Courier New", monospace';  // Setăm fontul pentru text
        ctx.fillText(letter, textX + index * 25, textY);  // Desenăm litera la poziția corespunzătoare
    });
}

// Desenează inima la o poziție dată, cu dimensiuni și culoare date
function drawHeart(x, y, size, color) {
    ctx.fillStyle = color;  // Setăm culoarea inimii
    ctx.beginPath();  // Începem să desenăm forma inimii
    ctx.moveTo(x, y);  // Mergem la punctul de start
    // Trasează curbele pentru inimă
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    ctx.closePath();  // Închidem forma
    ctx.fill();  // Umplem forma cu culoare
}

// Desenează textul pe canvas, cu opacitate variabilă
function drawText() {
    const totalTextWidth = letters.length * 25;  // Lățimea totală a textului
    const textX = canvas.width / 2 - totalTextWidth / 2 + 80;  // Calculăm poziția X
    const textY = canvas.height / 2 + 20 - 5;  // Calculăm poziția Y

    // Desenăm fiecare literă cu opacitate progresivă
    letters.forEach((letter, index) => {
        const opacity = index < progress ? 1 : 0;  // Setăm opacitatea pe măsură ce literele sunt desenate
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;  // Setăm culoarea textului cu opacitate
        ctx.font = '40px "Courier New", monospace';  // Setăm fontul pentru text
        ctx.fillText(letter, textX + index * 25, textY);  // Desenăm litera
    });
}

// Funcția principală pentru a începe animația
function animate() {
    if (isAnimating || isDisplaying) return;  // Nu porni animația dacă este deja în desfășurare

    isAnimating = true;
    isDisplaying = true;

    // Intervalul pentru desenarea textului
    const textInterval = setInterval(() => {
        if (progress >= letters.length) {  // Dacă am desenat toate literele
            clearInterval(textInterval);  // Oprirea intervalului de text
            startHeartAnimation();  // Pornirea animației pentru inimă
        } else {
            progress++;  // Avansăm progresul
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Curățăm canvasul
            drawShadow();  // Desenăm umbra
            drawText();  // Desenăm textul
        }
    }, 100);  // Interval de 100ms între fiecare pas
}

// Funcția pentru a începe animația inimii
function startHeartAnimation() {
    const heartX = canvas.width / 2 - heartSize / 2 - 80;  // Poziția X a inimii
    const heartY = canvas.height / 2 - heartSize / 2;  // Poziția Y a inimii

    // Intervalul pentru animația inimii
    const heartInterval = setInterval(() => {
        if (heartProgress >= 1) {  // Dacă animația inimii este completă
            clearInterval(heartInterval);  // Oprirea animației inimii
            isAnimating = false;  // Setăm animarea ca fiind completă
        } else {
            heartProgress += 0.02;  // Creștem progresul animației inimii
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Curățăm canvasul
            drawShadow();  // Desenăm umbra
            drawHeart(heartX, heartY, heartSize, `rgba(255, 0, 0, ${heartProgress})`);  // Desenăm inima cu transparență progresivă
            drawText();  // Desenăm textul
        }
    }, 50);  // Interval de 50ms între fiecare pas al animației inimii
}

// Funcția pentru a șterge logo-ul
function deleteLogo() {
    if (isAnimating || !isDisplaying || isDeleting) return;  // Dacă animația este în desfășurare, nu putem șterge

    isDeleting = true;

    // Intervalul pentru ștergerea textului
    const textInterval = setInterval(() => {
        if (progress <= 0) {  // Dacă am șters toate literele
            clearInterval(textInterval);  // Oprirea intervalului de ștergere a textului
            isDeleting = false;
            isDisplaying = false;
            progress = 0;  // Resetăm progresul
            heartProgress = 0;  // Resetăm progresul inimii
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Curățăm canvasul
            drawShadow();  // Desenăm umbra din nou
        } else {
            progress--;  // Înapoi progresul pentru ștergerea textului
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Curățăm canvasul
            drawShadow();  // Desenăm umbra
            drawHeart(canvas.width / 2 - heartSize / 2 - 80, canvas.height / 2 - heartSize / 2, heartSize, `rgba(255, 0, 0, ${heartProgress})`);  // Desenăm inima
            drawText();  // Desenăm textul
        }
    }, 100);  // Interval de 100ms între fiecare pas de ștergere
}

// Funcția care se ocupă de apăsarea tastelor
function handleKeydown(event) {
    if (event.key === '+') {  // Dacă este apăsată tasta "+"
        if (!isAnimating && !isDisplaying) {  // Dacă nu există animație în desfășurare
            animate();  // Pornim animația
        }
    } else if (event.key === '-') {  // Dacă este apăsată tasta "-"
        if (!isAnimating && isDisplaying && !isDeleting) {  // Dacă animația este în desfășurare și textul este deja afișat
            deleteLogo();  // Ștergem logo-ul
        }
    }
}

// Desenăm umbra inițială
drawShadow();

// Ascultăm evenimentul de apăsare a tastelor
window.addEventListener('keydown', handleKeydown);
