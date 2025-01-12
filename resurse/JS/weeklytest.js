document.addEventListener("DOMContentLoaded", () => {
    function checkAuth() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("Această pagină nu poate fi accesată decât dacă sunteți logat. Veți fi redirecționat către pagina de logare.");
            window.location.href = "logare.html"; 
        }
    }

    checkAuth();

    const options = document.querySelectorAll(".option");
    const submitButton = document.getElementById("submitButton");
    const scoreDisplay = document.getElementById("scoreDisplay");

    scoreDisplay.classList.add("hidden");

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

    options.forEach(option => {
        option.addEventListener("click", () => {
            option.classList.toggle("selected");
        });
    });

    function calculateScore() {
        let totalScore = 0;
        const questions = document.querySelectorAll(".question");

        questions.forEach(question => {
            const questionId = question.id;
            const correctAnswersForQuestion = correctAnswers[questionId];
            const selectedOptions = Array.from(question.querySelectorAll(".option.selected")).map(opt =>
                opt.getAttribute("data-answer")
            );

            let correctSelected = selectedOptions.filter(answer => correctAnswersForQuestion.includes(answer)).length;
            let incorrectSelected = selectedOptions.filter(answer => !correctAnswersForQuestion.includes(answer)).length;

            let questionScore =
                (10 / correctAnswersForQuestion.length) * correctSelected -
                (10 / correctAnswersForQuestion.length) * incorrectSelected;

            totalScore += Math.max(questionScore, 0);
        });

        return totalScore.toFixed(2);
    }

    submitButton.addEventListener("click", () => {
        const questions = document.querySelectorAll(".question");
        let allAnswered = true;

        questions.forEach(question => {
            const selectedOptions = question.querySelectorAll(".option.selected");
            if (selectedOptions.length === 0) {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            alert("Te rugăm să răspunzi la toate întrebările înainte de a trimite!");
        } else {
            const score = calculateScore();
            scoreDisplay.textContent = `În urma evaluării ai acumulat ${score} din 100!`;
            scoreDisplay.classList.remove("hidden");
        }
    });
});
