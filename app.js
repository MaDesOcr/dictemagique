let words = [];
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let attemptsText = "Mot,Tentative,Résultat,Date et Heure\n";

const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");
const userInput = document.getElementById("user-input");
const submitButton = document.getElementById("submit-button");
const feedback = document.getElementById("feedback");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./mots.json");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement du fichier mots.json");
    }
    words = await response.json();
    document.getElementById("total-words").textContent = words.length;

    shuffleArray(words);

    startGame();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Impossible de charger la liste de mots.");
  }
});

function startGame() {
  if (words.length === 0) {
    alert("Aucun mot disponible dans la liste.");
    return;
  }
  gameArea.classList.remove("hidden");
  currentWordIndex = 0;
  playWord();
}

function playWord() {
  const currentWord = words[currentWordIndex];
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(currentWord);

  utterance.lang = "fr-FR";
  utterance.rate = 1; // Vitesse normale

  const voices = synth.getVoices();
  const frenchVoice = voices.find((voice) => voice.lang === "fr-FR");
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  synth.speak(utterance);
}

submitButton.addEventListener("click", () => {
  validateWord();
});

document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    const keyValue = key.textContent;

    if (key.id === "delete") {
      userInput.value = userInput.value.slice(0, -1);
    } else if (key.id === "enter") {
      document.getElementById("submit-button").click();
    } else if (key.id === "space") {
      userInput.value += " ";
    } else {
      userInput.value += keyValue;
    }
  });
});

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.getElementById("submit-button").click();
  }
});
const attempts = [];

function validateWord() {
  const userAnswer = userInput.value.trim();
  const currentWord = words[currentWordIndex];
  const currentDate = new Date().toLocaleString(); // Date et heure

  const isCorrect = userAnswer.toLowerCase() === currentWord.toLowerCase();

  const attemptLine = `${currentWord},${userAnswer},${
    isCorrect ? "Correct" : "Incorrect"
  },${currentDate}`;
  attemptsText += attemptLine + "\n";

  if (isCorrect) {
    correctCount++;
    document.getElementById("correct-count").textContent = correctCount;
  } else {
    incorrectCount++;
    document.getElementById("incorrect-count").textContent = incorrectCount;
  }

  if (isCorrect) {
    feedback.textContent = "Bravo ! C’est correct 🎉";
    feedback.style.color = "green";
    currentWordIndex++;
    if (currentWordIndex < words.length) {
      setTimeout(() => {
        feedback.textContent = "";
        userInput.value = "";
        playWord();
      }, 1000);
    } else {
      feedback.textContent = "Félicitations ! Vous avez terminé la dictée 🎊";
    }
  } else {
    feedback.textContent = "Oops ! Réessayez.";
    feedback.style.color = "red";
  }
}

document.getElementById("repeat-button").addEventListener("click", () => {
  playWord();
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function restartGame() {
  currentWordIndex = 0;
  correctCount = 0;
  incorrectCount = 0;

  shuffleArray(words);

  document.getElementById("correct-count").textContent = correctCount;
  document.getElementById("incorrect-count").textContent = incorrectCount;

  feedback.textContent = "";

  playWord();
}

document
  .getElementById("restart-button")
  .addEventListener("click", restartGame);
