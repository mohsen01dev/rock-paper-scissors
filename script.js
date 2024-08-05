// Define necessary DOM elements
const playerChoiceImage = document.querySelector(".player-choice img");
const cpuChoiceImage = document.querySelector(".cpu-choice img");
const result = document.querySelector(".result h2");
const options = document.querySelectorAll(".option");
const resetBtn = document.querySelector(".reset-btn");
const historyText = document.getElementById("history-text");
const container1 = document.querySelector(".container-1");
const infoAlert = document.querySelector(".info-alert");
const storedHistory = localStorage.getItem("history");
const keyMapping = {
  s: "rock",
  س: "rock",
  ";": "paper",
  ک: "paper",
  r: "scissors",
  ق: "scissors",
};

let waitingMessage;
let playerChoice;
let cpuChoice;
let timer;
let playerScore = 0;
let cpuScore = 0;
let gameIsRunning = false;
let blinking;
let blinkingIsRunning = false;

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

// Start the game
function startGame(e) {
  gameIsRunning = true;

  options.forEach((opt) => opt.classList.remove("active"));
  e.currentTarget.classList.add("active");

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

    gameIsRunning = false;
    if (waitingMessage) waitingMessage.remove();
  }, 3000);
}

// Run startGame function when the player clicks their mouse, if it meets the criteria
function mouseClickStart() {
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      currentTarge;
      if (!gameIsRunning) startGame(e);
      else {
        // Check if the waiting message already exists, and if not, add it
        if (!document.getElementById("waiting-message")) {
          waitingMessage = document.createElement("p");
          waitingMessage.id = "waiting-message";
          container1.insertBefore(waitingMessage, container1.firstChild);

          waitingMessage.textContent = "بازی در حال اجراست، لطفا صبر کنید ...";
        }
      }
    });
  });
}

// Run startGame function when the player presses a valid key on their keyboard, if it meets the criteria
function keyPress(e) {
  if (e.key.toLowerCase() in keyMapping && !gameIsRunning) {
    const choice = keyMapping[e.key.toLowerCase()];
    const option = Array.from(options).find(
      (opt) => opt.querySelector("img").alt === choice
    );
    if (option) startGame({ currentTarget: option });
  } else if (e.key.toLowerCase() in keyMapping && gameIsRunning) {
    // Check if the waiting message already exists, and if not, add it
    if (!document.getElementById("waiting-message")) {
      waitingMessage = document.createElement("p");
      waitingMessage.id = "waiting-message";
      container1.insertBefore(waitingMessage, container1.firstChild);

      waitingMessage.textContent = "بازی در حال اجراست، لطفا صبر کنید ...";
    }
  } else if (!(e.key.toLowerCase() in keyMapping)) {
    if (!blinkingIsRunning) {
      blinkingIsRunning = true;

      let blinkCount = 0;

      blinking = setInterval(() => {
        infoAlert.classList.toggle("blink");
        blinkCount++;

        if (blinkCount >= 6) {
          clearInterval(blinking);
          blinkingIsRunning = false;
        }
      }, 500);
    }
  }
}

function keyDownStart() {
  document.addEventListener("keydown", keyPress);
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

    gameIsRunning = false;

    clearInterval(blinking);
    infoAlert.classList.remove("blink");
    blinkingIsRunning = false;

    if (waitingMessage) waitingMessage.remove();
  });
}

// Run essential functions to start the game
historyUpdate();
mouseClickStart();
keyDownStart();
reset();
