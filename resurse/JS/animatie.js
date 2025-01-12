const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 300;

const heartSize = 80; 
const text = "INFORMATICA"; 
let progress = 0;  
let heartProgress = 0; 
let isAnimating = false; 
let isDisplaying = false; 
let isDeleting = false;  

const letters = text.split('');

function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
        alert("Această pagină nu poate fi accesată decât dacă sunteți logat. Veți fi redirecționat către pagina de logare.");
        window.location.href = "logare.html";
    }
}

checkAuth();

function drawShadow() {
    const totalTextWidth = letters.length * 25; 
    const textX = canvas.width / 2 - totalTextWidth / 2 + 80; 
    const textY = canvas.height / 2 + 20 - 5; 

    drawHeart(canvas.width / 2 - heartSize / 2 - 80, canvas.height / 2 - heartSize / 2, heartSize, 'rgba(85, 85, 85, 1)');

    letters.forEach((letter, index) => {
        ctx.fillStyle = 'rgba(85, 85, 85, 1)'; 
        ctx.font = '40px "Courier New", monospace';
        ctx.fillText(letter, textX + index * 25, textY); 
    });
}

function drawHeart(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    ctx.closePath();
    ctx.fill();
}

function drawText() {
    const totalTextWidth = letters.length * 25; 
    const textX = canvas.width / 2 - totalTextWidth / 2 + 80; 
    const textY = canvas.height / 2 + 20 - 5; 

    letters.forEach((letter, index) => {
        const opacity = index < progress ? 1 : 0; 
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`; 
        ctx.font = '40px "Courier New", monospace';
        ctx.fillText(letter, textX + index * 25, textY);
    });
}

function animate() {
    if (isAnimating || isDisplaying) return; 

    isAnimating = true;
    isDisplaying = true;

    const textInterval = setInterval(() => {
        if (progress >= letters.length) {
            clearInterval(textInterval);
            startHeartAnimation(); 
        } else {
            progress++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawShadow(); 
            drawText(); 
        }
    }, 100);
}

function startHeartAnimation() {
    const heartX = canvas.width / 2 - heartSize / 2 - 80; 
    const heartY = canvas.height / 2 - heartSize / 2;

    const heartInterval = setInterval(() => {
        if (heartProgress >= 1) {
            clearInterval(heartInterval);
            isAnimating = false; 
        } else {
            heartProgress += 0.02;
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            drawShadow(); 
            drawHeart(heartX, heartY, heartSize, `rgba(255, 0, 0, ${heartProgress})`); 
            drawText(); 
        }
    }, 50);
}

function deleteLogo() {
    if (isAnimating || !isDisplaying || isDeleting) return; 

    isDeleting = true;

    const textInterval = setInterval(() => {
        if (progress <= 0) {
            clearInterval(textInterval);
            isDeleting = false;
            isDisplaying = false;
            progress = 0; 
            heartProgress = 0; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawShadow(); 
        } else {
            progress--;
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            drawShadow(); 
            drawHeart(canvas.width / 2 - heartSize / 2 - 80, canvas.height / 2 - heartSize / 2, heartSize, `rgba(255, 0, 0, ${heartProgress})`); 
            drawText(); 
        }
    }, 100);
}

function handleKeydown(event) {
    if (event.key === '+') {
        if (!isAnimating && !isDisplaying) {
            animate(); 
        }
    } else if (event.key === '-') {
        if (!isAnimating && isDisplaying && !isDeleting) {
            deleteLogo(); 
        }
    }
}

drawShadow();

window.addEventListener('keydown', handleKeydown);
