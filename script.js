// Define necessary DOM elements
const playerChoiceImage = document.querySelector(".player-choice img");
const cpuChoiceImage = document.querySelector(".cpu-choice img");
const result = document.querySelector(".result h2");
const options = document.querySelectorAll(".option");
const resetBtn = document.querySelector(".reset-btn");
const historyText = document.getElementById("#history-text");
const container1 = document.querySelector(".container-1");
const storedHistory = localStorage.getItem("history");

let playerChoice;
let cpuChoice;
let timer;
let playerScore = 0;
let cpuScore = 0;

// Get and display history from local storage
function historyUpdate() {
  if (storedHistory) {
    historyText.textContent = storedHistory;
    const previousScores = storedHistory.match(/\d+/g);

    if (previousScores) {
      playerScore = parseInt(previousScores[0]);
      cpuScore = parseInt(previousScores[1]);
    }
  }
}

// Get CPU choice
function getCpuChoice() {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

// Update CPU choice image based on CPU choice
function cpuChoiceImageUpdate(cpuChoice) {
  if (cpuChoice === "rock") cpuChoiceImage.src = "./images/rock.svg";
  else if (cpuChoice === "paper") cpuChoiceImage.src = "./images/paper.svg";
  else cpuChoiceImage.src = "./images/scissors.svg";
}

// Check the winner and update the result text
function checkWinner(playerChoice, cpuChoice) {
  switch (playerChoice) {
    case "rock":
      switch (cpuChoice) {
        case "rock":
          return "مساوی شد 🧐";
        case "paper":
          return "باختی، همم 😞";
        case "scissors":
          return "بُردی، هورا 🎉";
      }
      break;

    case "paper":
      switch (cpuChoice) {
        case "rock":
          return "بُردی، هورا 🎉";
        case "paper":
          return "مساوی شد 🧐";
        case "scissors":
          return "باختی، همم 😞";
      }
      break;

    case "scissors":
      switch (cpuChoice) {
        case "rock":
          return "باختی، همم 😞";
        case "paper":
          return "بُردی، هورا 🎉";
        case "scissors":
          return "مساوی شد 🧐";
      }
      break;
  }
}

// Start game when player chooses an option
function startGame() {
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      options.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");

      playerChoice = e.currentTarget.querySelector("img").alt;
      const playerChoiceImageUpdate = e.currentTarget.querySelector("img").src;

      cpuChoice = getCpuChoice();

      playerChoiceImage.src = cpuChoiceImage.src = "./images/rock.svg";
      result.textContent = "یعنی کی می‌بره؟ 🤔";

      container1.classList.add("animation");

      // Set a timeout to delay calculating the result
      timer = setTimeout(() => {
        container1.classList.remove("animation");

        playerChoiceImage.src = playerChoiceImageUpdate;
        cpuChoiceImageUpdate(cpuChoice);

        checkWinner(playerChoice, cpuChoice);
        result.textContent = checkWinner(playerChoice, cpuChoice);

        if (result.textContent === "بُردی، هورا 🎉") playerScore++;
        else if (result.textContent === "باختی، همم 😞") cpuScore++;

        historyText.textContent = `شما: ${playerScore} - ${cpuScore} :کامپیوتر`;

        localStorage.setItem("history", historyText.textContent);
      }, 3000);
    });
  });
}

// Reset everything when the player clicks the reset button
function reset() {
  resetBtn.addEventListener("click", () => {
    container1.classList.remove("animation");

    clearTimeout(timer);

    playerChoiceImage.src = cpuChoiceImage.src = "./images/rock.svg";
    playerChoice = "";
    cpuChoice = "";

    result.textContent = "آماده‌ای؟ 😎";

    options.forEach((option) => {
      option.classList.remove("active");
    });

    localStorage.clear();
    historyText.textContent = "شما: 0 - 0 :کامپیوتر";
    playerScore = 0;
    cpuScore = 0;
  });
}

// Run essential functions to start the game
historyUpdate();
startGame();
reset();
