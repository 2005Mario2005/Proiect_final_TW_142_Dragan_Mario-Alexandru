// La încărcarea paginii, verificăm dacă utilizatorul este logat
document.addEventListener("DOMContentLoaded", () => {
    // Verificăm dacă utilizatorul este logat
    function checkAuth() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";  // Verificăm autentificarea
        if (!isLoggedIn) {  // Dacă utilizatorul nu este logat
            alert("Această pagină nu poate fi accesată decât dacă sunteți logat. Veți fi redirecționat către pagina de logare.");
            window.location.href = "logare.html";  // Redirecționăm utilizatorul la pagina de logare
        }
    }

    // Apelăm funcția de autentificare la început
    checkAuth();

    // Selectăm opțiunile pentru fiecare întrebare
    const options = document.querySelectorAll(".option");
    const submitButton = document.getElementById("submitButton");  // Selectăm butonul de trimitere
    const scoreDisplay = document.getElementById("scoreDisplay");  // Selectăm locul unde afișăm scorul

    scoreDisplay.classList.add("hidden");  // Ascundem scorul inițial

    // Răspunsurile corecte pentru fiecare întrebare
    const correctAnswers = {
        "question1": ["A", "C", "D"],
        "question2": ["B", "D"],
        "question3": ["A", "D"],
        "question4": ["B"],
        "question5": ["B", "D"],
        "question6": ["A", "D"],
        "question7": ["C"],
        "question8": ["A", "B", "D"],
        "question9": ["A"],
        "question10": ["A"]
    };

    // Adăugăm un event listener pentru fiecare opțiune, pentru a o marca sau demarca
    options.forEach(option => {
        option.addEventListener("click", () => {
            option.classList.toggle("selected");  // Toggle pentru a marca sau demarca opțiunea
        });
    });

    // Funcția pentru a calcula scorul
    function calculateScore() {
        let totalScore = 0;
        const questions = document.querySelectorAll(".question");  // Selectăm toate întrebările

        questions.forEach(question => {
            const questionId = question.id;  // Obținem ID-ul întrebării
            const correctAnswersForQuestion = correctAnswers[questionId];  // Răspunsurile corecte pentru întrebarea respectivă
            const selectedOptions = Array.from(question.querySelectorAll(".option.selected")).map(opt =>
                opt.getAttribute("data-answer")  // Obținem opțiunile selectate
            );

            // Calculăm câte răspunsuri corecte și incorecte sunt selectate
            let correctSelected = selectedOptions.filter(answer => correctAnswersForQuestion.includes(answer)).length;
            let incorrectSelected = selectedOptions.filter(answer => !correctAnswersForQuestion.includes(answer)).length;

            // Calculăm scorul pentru fiecare întrebare
            let questionScore =
                (10 / correctAnswersForQuestion.length) * correctSelected -
                (10 / correctAnswersForQuestion.length) * incorrectSelected;

            totalScore += Math.max(questionScore, 0);  // Adăugăm scorul întrebării la scorul total
        });

        return totalScore.toFixed(2);  // Returnăm scorul total rotunjit la două zecimale
    }

    // Atunci când utilizatorul apasă butonul de trimitere
    submitButton.addEventListener("click", () => {
        const questions = document.querySelectorAll(".question");
        let allAnswered = true;

        // Verificăm dacă toate întrebările au fost răspunse
        questions.forEach(question => {
            const selectedOptions = question.querySelectorAll(".option.selected");
            if (selectedOptions.length === 0) {
                allAnswered = false;
            }
        });

        // Dacă nu toate întrebările au fost răspunse, afișăm un mesaj de alertă
        if (!allAnswered) {
            alert("Te rugăm să răspunzi la toate întrebările înainte de a trimite!");
        } else {
            // Calculăm și afișăm scorul
            const score = calculateScore();
            scoreDisplay.textContent = `În urma evaluării ai acumulat ${score} din 100!`;
            scoreDisplay.classList.remove("hidden");  // Afișăm scorul
        }
    });
});
